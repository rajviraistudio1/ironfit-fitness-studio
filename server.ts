import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  sendLeadNotificationEmail,
  getEmailConfigurationStatus,
  getEmailDispatchLogs,
  LeadEmailPayload,
} from './src/server/emailService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Persistent Local File Storage for Leads
const DATA_DIR = path.resolve(__dirname, 'data');
const LEADS_FILE = path.resolve(DATA_DIR, 'leads.json');
const ENV_FILE = path.resolve(__dirname, '.env');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface StoredLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  fitness_goal: string;
  preferred_workout_time: string;
  message?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Load leads from disk
function loadDiskLeads(): StoredLead[] {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const content = fs.readFileSync(LEADS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('[Error reading leads.json]:', err);
  }
  return [];
}

// Save leads to disk
function saveDiskLeads(leads: StoredLead[]) {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Error saving leads.json]:', err);
  }
}

// Global in-memory cache synchronized with disk
let localLeads: StoredLead[] = loadDiskLeads();

// Supabase Configuration from Environment or Runtime
let currentSupabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
let currentSupabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  '';

let supabaseClient: SupabaseClient | null = null;

function isValidSupabaseUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const clean = url.trim().toLowerCase();
  return clean.startsWith('https://') && !clean.includes('your-project') && clean.includes('.supabase.co');
}

function isValidSupabaseKey(key: string): boolean {
  if (!key || typeof key !== 'string') return false;
  const clean = key.trim();
  return clean.length >= 20 && !clean.includes('your-supabase');
}

function initSupabase(url: string, key: string): boolean {
  if (isValidSupabaseUrl(url) && isValidSupabaseKey(key)) {
    try {
      supabaseClient = createClient(url.trim(), key.trim(), {
        auth: {
          persistSession: false,
        },
        global: {
          fetch: (input, init) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);
            return fetch(input, {
              ...init,
              signal: controller.signal,
            }).finally(() => clearTimeout(timeoutId));
          },
        },
      });
      currentSupabaseUrl = url.trim();
      currentSupabaseKey = key.trim();
      console.log(`[Supabase]: Initialized client for ${currentSupabaseUrl}`);
      return true;
    } catch (err) {
      console.error('[Supabase Init Error]:', err);
      supabaseClient = null;
      return false;
    }
  } else {
    supabaseClient = null;
    return false;
  }
}

// Initialize on startup only if valid credentials provided
if (isValidSupabaseUrl(currentSupabaseUrl) && isValidSupabaseKey(currentSupabaseKey)) {
  initSupabase(currentSupabaseUrl, currentSupabaseKey);
} else {
  supabaseClient = null;
}

// Admin authentication secret
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ironfit2026';
const OWNER_EMAIL = process.env.OWNER_NOTIFICATION_EMAIL || 'owner@ironfitfitness.example';

// Active admin sessions
const ACTIVE_ADMIN_TOKENS = new Set<string>();

const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required' });
  }

  const token = authHeader.split(' ')[1];
  if (!ACTIVE_ADMIN_TOKENS.has(token)) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }

  next();
};

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// POST /api/leads - Public Lead Submission
app.post('/api/leads', async (req: Request, res: Response) => {
  try {
    const {
      name,
      phone,
      email,
      fitness_goal,
      preferred_workout_time,
      message,
      website_field,
      form_loaded_at,
    } = req.body;

    // 1. Anti-Spam Honeypot check
    if (website_field && website_field.trim().length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Thanks for your enquiry.',
      });
    }

    // 2. Anti-Spam Timing check (if submitted faster than 400ms, likely a bot)
    if (form_loaded_at && Date.now() - form_loaded_at < 400) {
      return res.status(200).json({
        success: true,
        message: 'Thanks for your enquiry.',
      });
    }

    // 3. Strict Server-Side Input Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({ error: 'Please enter a valid full name.' });
    }

    if (!phone || typeof phone !== 'string' || !/^[0-9+() -]{8,20}$/.test(phone.trim())) {
      return res.status(400).json({ error: 'Please enter a valid phone number.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim()) || email.trim().length > 150) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const validGoals = ['Weight Loss', 'Muscle Gain', 'General Fitness', 'Strength Training', 'Other'];
    if (!fitness_goal || !validGoals.includes(fitness_goal)) {
      return res.status(400).json({ error: 'Please select a valid fitness goal.' });
    }

    const validTimes = ['Morning', 'Afternoon', 'Evening'];
    if (!preferred_workout_time || !validTimes.includes(preferred_workout_time)) {
      return res.status(400).json({ error: 'Please select a valid preferred workout time.' });
    }

    const sanitizedMessage = typeof message === 'string' ? message.slice(0, 1000).trim() : '';

    let generatedId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const leadRecord: StoredLead = {
      id: generatedId,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      fitness_goal,
      preferred_workout_time,
      message: sanitizedMessage,
      status: 'New',
      created_at: now,
      updated_at: now,
    };

    // 4. Save to Persistent Disk Storage immediately
    localLeads.unshift(leadRecord);
    saveDiskLeads(localLeads);

    // 5. If Supabase is connected, also insert into Supabase 'leads' table
    let savedToSupabase = false;
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('leads')
          .insert([
            {
              name: leadRecord.name,
              phone: leadRecord.phone,
              email: leadRecord.email,
              fitness_goal: leadRecord.fitness_goal,
              preferred_workout_time: leadRecord.preferred_workout_time,
              message: leadRecord.message,
              status: leadRecord.status,
              created_at: leadRecord.created_at,
              updated_at: leadRecord.updated_at,
            },
          ]);

        if (error) {
          console.error('[Supabase Insert Error]:', error.message, error.code);
        } else {
          savedToSupabase = true;
          console.log(`[Supabase]: Lead ${leadRecord.name} (${leadRecord.email}) successfully saved to Supabase leads table!`);
        }
      } catch (err) {
        console.error('[Supabase Exception]:', err);
      }
    }

    // 6. Trigger Automatic Owner Email Notification (Async, non-blocking)
    sendLeadNotificationEmail(leadRecord).catch((err) => {
      console.error('[Email Notification Error]:', err);
    });

    return res.status(200).json({
      success: true,
      message:
        'Thanks for your enquiry. The IronFit team will contact you to help you get started with the 30-Day Fitness Challenge.',
      leadId: leadRecord.id,
      savedToSupabase,
    });
  } catch (error) {
    console.error('[Lead Submission Error]:', error);
    return res.status(500).json({
      error:
        'We couldn’t submit your enquiry right now. Please try again or contact IronFit directly at +91 90000 12345.',
    });
  }
});

// POST /api/admin/login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password, email } = req.body;

  if (password === ADMIN_PASSWORD) {
    const token = `ironfit_token_${Math.random().toString(36).substring(2)}${Date.now()}`;
    ACTIVE_ADMIN_TOKENS.add(token);

    return res.json({
      success: true,
      token,
      user: {
        name: 'Kiran Mehta',
        email: email || OWNER_EMAIL,
        role: 'owner',
      },
    });
  }

  return res.status(401).json({ error: 'Invalid password. Please check your owner credentials.' });
});

// GET /api/admin/supabase-config - Check Supabase Connection & Credentials
app.get('/api/admin/supabase-config', verifyAdmin, async (_req: Request, res: Response) => {
  let isConnected = false;
  let tableExists = false;
  let rowCount = 0;
  let testError: string | null = null;
  let rlsNeedsPolicy = false;

  if (supabaseClient) {
    try {
      const { data, error, count } = await supabaseClient
        .from('leads')
        .select('*', { count: 'exact', head: true });

      if (error) {
        testError = error.message;
        // Check if error is relation does not exist
        if (error.code === '42P01' || error.message.includes('relation "public.leads" does not exist')) {
          tableExists = false;
        }
      } else {
        isConnected = true;
        tableExists = true;
        rowCount = count || 0;

        // Test if INSERT is permitted under RLS
        const probeRes = await supabaseClient.from('leads').insert([{
          name: '__probe_check__',
          phone: '+91 00000 00000',
          email: 'probe@example.com',
          fitness_goal: 'General Fitness',
          preferred_workout_time: 'Morning',
          message: 'Probe check',
          status: 'New'
        }]);

        if (probeRes.error && (probeRes.error.code === '42501' || probeRes.error.message.includes('row-level security'))) {
          rlsNeedsPolicy = true;
        } else {
          rlsNeedsPolicy = false;
        }
      }
    } catch (err: unknown) {
      testError = err instanceof Error ? err.message : 'Connection failed';
    }
  }

  res.json({
    isConfigured: Boolean(currentSupabaseUrl && currentSupabaseKey),
    isConnected,
    tableExists,
    rlsNeedsPolicy,
    supabaseUrl: currentSupabaseUrl,
    hasKey: Boolean(currentSupabaseKey),
    supabaseKeyMasked: currentSupabaseKey
      ? `${currentSupabaseKey.slice(0, 10)}...${currentSupabaseKey.slice(-6)}`
      : '',
    testError,
    localLeadsCount: localLeads.length,
    remoteLeadsCount: rowCount,
  });
});

// POST /api/admin/supabase-config - Update & Test Supabase Credentials
app.post('/api/admin/supabase-config', verifyAdmin, async (req: Request, res: Response) => {
  const { url, key } = req.body;

  if (!url || typeof url !== 'string' || !url.startsWith('https://')) {
    return res.status(400).json({ error: 'Please enter a valid Supabase project URL (e.g. https://xyz.supabase.co)' });
  }

  if (!key || typeof key !== 'string' || key.trim().length < 20) {
    return res.status(400).json({ error: 'Please enter a valid Supabase API Key (Anon public key or Service Role key)' });
  }

  try {
    const testClient = createClient(url.trim(), key.trim(), {
      auth: { persistSession: false },
    });

    // Test query against leads table
    const { data, error, count } = await testClient
      .from('leads')
      .select('*', { count: 'exact', head: true });

    let tableExists = true;
    let message = 'Supabase successfully connected and verified!';

    if (error) {
      if (error.code === '42P01' || error.message.includes('relation "public.leads" does not exist')) {
        tableExists = false;
        message = 'Connected to Supabase project! Note: The "leads" table is not created yet. Please execute schema.sql in Supabase SQL Editor.';
      } else {
        return res.status(400).json({
          error: `Supabase returned error: ${error.message} (${error.code || 'UNKNOWN'})`,
          tableExists: false,
        });
      }
    }

    // Success: Activate client
    supabaseClient = testClient;
    currentSupabaseUrl = url.trim();
    currentSupabaseKey = key.trim();

    // Persist to .env file
    try {
      let envContent = '';
      if (fs.existsSync(ENV_FILE)) {
        envContent = fs.readFileSync(ENV_FILE, 'utf-8');
      }

      const updateEnvVar = (file: string, keyName: string, val: string) => {
        const regex = new RegExp(`^${keyName}=.*$`, 'm');
        if (regex.test(file)) {
          return file.replace(regex, `${keyName}=${val}`);
        } else {
          return `${file.trim()}\n${keyName}=${val}\n`;
        }
      };

      envContent = updateEnvVar(envContent, 'SUPABASE_URL', currentSupabaseUrl);
      envContent = updateEnvVar(envContent, 'SUPABASE_ANON_KEY', currentSupabaseKey);
      envContent = updateEnvVar(envContent, 'VITE_SUPABASE_URL', currentSupabaseUrl);
      envContent = updateEnvVar(envContent, 'VITE_SUPABASE_ANON_KEY', currentSupabaseKey);

      fs.writeFileSync(ENV_FILE, envContent, 'utf-8');
    } catch (e) {
      console.warn('[Could not write to .env]:', e);
    }

    return res.json({
      success: true,
      message,
      tableExists,
      supabaseUrl: currentSupabaseUrl,
      rowCount: count || 0,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to connect to Supabase';
    return res.status(500).json({ error: errorMsg });
  }
});

// POST /api/admin/supabase-sync - Sync Local Leads to Supabase
app.post('/api/admin/supabase-sync', verifyAdmin, async (_req: Request, res: Response) => {
  if (!supabaseClient) {
    return res.status(400).json({ error: 'Supabase is not connected. Please configure credentials first.' });
  }

  if (localLeads.length === 0) {
    return res.json({ success: true, message: 'No local leads to sync.', syncedCount: 0 });
  }

  try {
    let syncedCount = 0;
    for (const lead of localLeads) {
      const { error } = await supabaseClient.from('leads').insert([
        {
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          fitness_goal: lead.fitness_goal,
          preferred_workout_time: lead.preferred_workout_time,
          message: lead.message,
          status: lead.status,
          created_at: lead.created_at,
          updated_at: lead.updated_at,
        },
      ]);
      if (!error) {
        syncedCount++;
      } else {
        console.error('[Supabase Sync Row Error]:', error.message);
      }
    }

    return res.json({
      success: true,
      message: `Successfully synchronized ${syncedCount} of ${localLeads.length} leads to Supabase!`,
      syncedCount,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Sync failed';
    return res.status(500).json({ error: errorMsg });
  }
});

// GET /api/admin/email-status - Check email service configuration & logs
app.get('/api/admin/email-status', verifyAdmin, (_req: Request, res: Response) => {
  const status = getEmailConfigurationStatus();
  res.json(status);
});

// POST /api/admin/email-test - Send a test email to verify credentials
app.post('/api/admin/email-test', verifyAdmin, async (req: Request, res: Response) => {
  const targetEmail = req.body?.recipient || process.env.OWNER_NOTIFICATION_EMAIL || 'owner@ironfitfitness.example';
  
  const testLead: LeadEmailPayload = {
    id: `test_${Date.now()}`,
    name: 'Sample Lead (Verification Test)',
    phone: '+91 90000 12345',
    email: 'sample.lead@example.com',
    fitness_goal: 'Strength Training',
    preferred_workout_time: 'Morning',
    message: 'This is a test notification confirming your email alert integration is live and working!',
    created_at: new Date().toISOString(),
  };

  try {
    const result = await sendLeadNotificationEmail(testLead, targetEmail);
    if (result.success) {
      return res.json({
        success: true,
        message: `Test email successfully dispatched to ${targetEmail} via ${result.provider}!`,
        provider: result.provider,
        messageId: result.messageId,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: result.error || 'Failed to dispatch test email',
        provider: result.provider,
      });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unexpected email error';
    return res.status(500).json({ success: false, error: msg });
  }
});

// POST /api/admin/email-config - Update email notification settings in runtime and .env
app.post('/api/admin/email-config', verifyAdmin, (req: Request, res: Response) => {
  const {
    ownerNotificationEmail,
    resendApiKey,
    emailFrom,
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPass,
    smtpSecure,
  } = req.body;

  if (ownerNotificationEmail && typeof ownerNotificationEmail === 'string') {
    process.env.OWNER_NOTIFICATION_EMAIL = ownerNotificationEmail.trim();
  }
  if (typeof resendApiKey === 'string') {
    process.env.RESEND_API_KEY = resendApiKey.trim();
  }
  if (typeof emailFrom === 'string' && emailFrom.trim()) {
    process.env.EMAIL_FROM = emailFrom.trim();
  }
  if (typeof smtpHost === 'string') {
    process.env.SMTP_HOST = smtpHost.trim();
  }
  if (typeof smtpPort === 'string' || typeof smtpPort === 'number') {
    process.env.SMTP_PORT = String(smtpPort).trim();
  }
  if (typeof smtpUser === 'string') {
    process.env.SMTP_USER = smtpUser.trim();
  }
  if (typeof smtpPass === 'string') {
    process.env.SMTP_PASS = smtpPass.trim();
  }
  if (typeof smtpSecure === 'boolean') {
    process.env.SMTP_SECURE = String(smtpSecure);
  }

  // Persist to .env
  try {
    let envContent = '';
    if (fs.existsSync(ENV_FILE)) {
      envContent = fs.readFileSync(ENV_FILE, 'utf-8');
    }

    const updateEnvVar = (file: string, keyName: string, val: string) => {
      const regex = new RegExp(`^${keyName}=.*$`, 'm');
      if (regex.test(file)) {
        return file.replace(regex, `${keyName}=${val}`);
      } else {
        return file.trim() + `\n${keyName}=${val}\n`;
      }
    };

    if (process.env.OWNER_NOTIFICATION_EMAIL) {
      envContent = updateEnvVar(envContent, 'OWNER_NOTIFICATION_EMAIL', process.env.OWNER_NOTIFICATION_EMAIL);
    }
    if (process.env.RESEND_API_KEY !== undefined) {
      envContent = updateEnvVar(envContent, 'RESEND_API_KEY', process.env.RESEND_API_KEY);
    }
    if (process.env.EMAIL_FROM) {
      envContent = updateEnvVar(envContent, 'EMAIL_FROM', `"${process.env.EMAIL_FROM}"`);
    }
    if (process.env.SMTP_HOST !== undefined) {
      envContent = updateEnvVar(envContent, 'SMTP_HOST', process.env.SMTP_HOST);
    }
    if (process.env.SMTP_PORT) {
      envContent = updateEnvVar(envContent, 'SMTP_PORT', process.env.SMTP_PORT);
    }
    if (process.env.SMTP_USER !== undefined) {
      envContent = updateEnvVar(envContent, 'SMTP_USER', process.env.SMTP_USER);
    }
    if (process.env.SMTP_PASS !== undefined) {
      envContent = updateEnvVar(envContent, 'SMTP_PASS', process.env.SMTP_PASS);
    }

    fs.writeFileSync(ENV_FILE, envContent, 'utf-8');
  } catch (err) {
    console.error('[Error updating .env with email config]:', err);
  }

  const updatedStatus = getEmailConfigurationStatus();
  return res.json({
    success: true,
    message: 'Email configuration updated successfully!',
    status: updatedStatus,
  });
});

// GET /api/admin/leads
app.get('/api/admin/leads', verifyAdmin, async (req: Request, res: Response) => {
  const { status, search, fitnessGoal } = req.query;

  // Always refresh local leads from disk first
  localLeads = loadDiskLeads();

  let allLeads: StoredLead[] = [];
  let isConnected = Boolean(supabaseClient);

  // Try fetching from live Supabase first
  if (supabaseClient) {
    try {
      let query = supabaseClient.from('leads').select('*').order('created_at', { ascending: false });

      if (status && status !== 'All') {
        query = query.eq('status', status);
      }
      if (fitnessGoal && fitnessGoal !== 'All') {
        query = query.eq('fitness_goal', fitnessGoal);
      }

      const { data, error } = await query;
      if (!error && data && Array.isArray(data) && data.length > 0) {
        allLeads = data as StoredLead[];
      }
    } catch {
      // Fallback below
    }
  }

  // Fallback to local storage if Supabase returned 0 leads (e.g. Due to RLS select restrictions or empty table)
  if (allLeads.length === 0) {
    allLeads = [...localLeads];
  } else {
    // Merge any local leads that haven't been synced to Supabase yet
    const remoteIdentifiers = new Set(allLeads.map((l) => `${l.phone}_${l.email}`));
    for (const localLead of localLeads) {
      if (!remoteIdentifiers.has(`${localLead.phone}_${localLead.email}`)) {
        allLeads.push(localLead);
      }
    }
  }

  // Filter in-memory for status, goal, search
  let filtered = allLeads;
  if (status && status !== 'All') {
    filtered = filtered.filter((l) => l.status === status);
  }
  if (fitnessGoal && fitnessGoal !== 'All') {
    filtered = filtered.filter((l) => l.fitness_goal === fitnessGoal);
  }

  if (search && typeof search === 'string' && search.trim().length > 0) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        l.email.toLowerCase().includes(q)
    );
  }

  res.json({
    leads: filtered,
    isSupabaseConnected: isConnected,
  });
});

// PATCH /api/admin/leads/:id/status
app.patch('/api/admin/leads/:id/status', verifyAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['New', 'Contacted', 'Follow-up', 'Converted', 'Closed'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid lead status.' });
  }

  const now = new Date().toISOString();

  // 1. Try updating in Supabase
  let updatedInSupabase = false;
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('leads')
        .update({ status, updated_at: now })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        updatedInSupabase = true;
      }
    } catch (e) {
      console.error('[Supabase Status Update Error]:', e);
    }
  }

  // 2. Always update local disk storage
  const memLead = localLeads.find((l) => l.id === id);
  if (memLead) {
    memLead.status = status;
    memLead.updated_at = now;
    saveDiskLeads(localLeads);
    return res.json({ success: true, lead: memLead, updatedInSupabase });
  }

  return res.json({
    success: true,
    lead: {
      id,
      status,
      updated_at: now,
    },
    updatedInSupabase,
  });
});

// GET /api/admin/metrics
app.get('/api/admin/metrics', verifyAdmin, async (_req: Request, res: Response) => {
  localLeads = loadDiskLeads();
  let allLeads: StoredLead[] = [];

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('leads').select('status');
      if (!error && data && Array.isArray(data) && data.length > 0) {
        allLeads = data as StoredLead[];
      }
    } catch {
      // Fallback below
    }
  }

  if (allLeads.length === 0) {
    allLeads = [...localLeads];
  }

  const metrics = {
    totalLeads: allLeads.length,
    newLeads: allLeads.filter((l) => l.status === 'New').length,
    contactedLeads: allLeads.filter((l) => l.status === 'Contacted').length,
    followUpLeads: allLeads.filter((l) => l.status === 'Follow-up').length,
    convertedLeads: allLeads.filter((l) => l.status === 'Converted').length,
    closedLeads: allLeads.filter((l) => l.status === 'Closed').length,
  };

  res.json({ metrics });
});

// GET /api/health
app.get('/api/health', (_req: Request, res: Response) => {
  const emailStatus = getEmailConfigurationStatus();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    supabaseConfigured: Boolean(currentSupabaseUrl && currentSupabaseKey),
    supabaseConnected: Boolean(supabaseClient),
    localLeadsCount: localLeads.length,
    emailConfigured: emailStatus.isConfigured,
    emailProvider: emailStatus.activeProvider,
    emailRecipient: emailStatus.recipient,
  });
});

// -------------------------------------------------------------
// VITE DEV SERVER OR STATIC PRODUCTION SERVING
// -------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`IronFit Fitness Studio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
