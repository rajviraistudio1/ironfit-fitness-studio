import { DashboardMetrics, Lead, LeadFormData, LeadStatus } from '../types';

const API_BASE = '/api';

export interface SubmitLeadResponse {
  success: boolean;
  message: string;
  leadId?: string;
  savedToSupabase?: boolean;
  emailSent?: boolean;
}

export async function submitLead(data: LeadFormData): Promise<SubmitLeadResponse> {
  // Client-side quick validation
  if (!data.name?.trim()) {
    throw new Error('Please enter your full name.');
  }
  if (!data.phone?.trim() || data.phone.trim().length < 8) {
    throw new Error('Please enter a valid phone number.');
  }
  if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    throw new Error('Please enter a valid email address.');
  }
  if (!data.fitness_goal) {
    throw new Error('Please select a fitness goal.');
  }
  if (!data.preferred_workout_time) {
    throw new Error('Please select your preferred workout time.');
  }

  // Honeypot check
  if (data.website_field && data.website_field.length > 0) {
    // Silently succeed for bots
    return {
      success: true,
      message: 'Thanks for your enquiry.',
    };
  }

  try {
    const response = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'We couldn’t submit your enquiry right now. Please try again or contact IronFit directly at +91 90000 12345.');
    }

    return result;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'We couldn’t submit your enquiry right now. Please try again or contact IronFit directly at +91 90000 12345.';
    throw new Error(message);
  }
}

export async function adminLogin(password: string, email: string = 'owner@ironfitfitness.example') {
  const response = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Invalid credentials');
  }

  return data as { token: string; user: { name: string; email: string } };
}

export async function fetchLeads(
  token: string,
  params?: { status?: string; search?: string; fitnessGoal?: string }
): Promise<{ leads: Lead[]; isSupabaseConnected: boolean }> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== 'All') query.set('status', params.status);
  if (params?.search) query.set('search', params.search);
  if (params?.fitnessGoal && params.fitnessGoal !== 'All') query.set('fitnessGoal', params.fitnessGoal);

  const response = await fetch(`${API_BASE}/admin/leads?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch leads');
  }

  return data;
}

export async function updateLeadStatus(
  token: string,
  leadId: string,
  status: LeadStatus
): Promise<Lead> {
  const response = await fetch(`${API_BASE}/admin/leads/${leadId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update lead status');
  }

  return data.lead;
}

export async function fetchMetrics(token: string): Promise<DashboardMetrics> {
  const response = await fetch(`${API_BASE}/admin/metrics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch metrics');
  }

  return data.metrics;
}

export async function checkServerHealth(): Promise<{
  status: string;
  supabaseConfigured: boolean;
  supabaseConnected: boolean;
  localLeadsCount: number;
}> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) return { status: 'offline', supabaseConfigured: false, supabaseConnected: false, localLeadsCount: 0 };
    return await res.json();
  } catch {
    return { status: 'offline', supabaseConfigured: false, supabaseConnected: false, localLeadsCount: 0 };
  }
}

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  isConnected: boolean;
  tableExists: boolean;
  rlsNeedsPolicy?: boolean;
  supabaseUrl: string;
  hasKey: boolean;
  supabaseKeyMasked: string;
  testError: string | null;
  localLeadsCount: number;
  remoteLeadsCount: number;
}

export async function fetchSupabaseStatus(token: string): Promise<SupabaseConfigStatus> {
  const response = await fetch(`${API_BASE}/admin/supabase-config`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch Supabase status');
  }
  return data;
}

export async function saveSupabaseConfig(
  token: string,
  credentials: { url: string; key: string }
): Promise<{ success: boolean; message: string; tableExists: boolean }> {
  const response = await fetch(`${API_BASE}/admin/supabase-config`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to connect to Supabase');
  }
  return data;
}

export async function syncLeadsToSupabase(
  token: string
): Promise<{ success: boolean; message: string; syncedCount: number }> {
  const response = await fetch(`${API_BASE}/admin/supabase-sync`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to sync leads to Supabase');
  }
  return data;
}

export interface EmailDispatchLog {
  id: string;
  timestamp: string;
  leadId: string;
  leadName: string;
  recipient: string;
  provider: 'resend' | 'smtp' | 'console_simulated';
  status: 'delivered' | 'failed' | 'simulated';
  subject: string;
  error?: string;
}

export interface EmailConfigStatus {
  isConfigured: boolean;
  activeProvider: 'resend' | 'smtp' | 'none';
  recipient: string;
  fromEmail: string;
  hasResendKey: boolean;
  hasSmtpConfig: boolean;
  smtpHost: string | null;
  totalDispatched: number;
  recentLogs: EmailDispatchLog[];
}

export async function fetchEmailStatus(token: string): Promise<EmailConfigStatus> {
  const response = await fetch(`${API_BASE}/admin/email-status`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch email status');
  }
  return data;
}

export async function sendTestEmail(
  token: string,
  recipient?: string
): Promise<{ success: boolean; message: string; provider: string }> {
  const response = await fetch(`${API_BASE}/admin/email-test`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ recipient }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to send test email');
  }
  return data;
}

export interface EmailConfigPayload {
  ownerNotificationEmail?: string;
  resendApiKey?: string;
  emailFrom?: string;
  smtpHost?: string;
  smtpPort?: string | number;
  smtpUser?: string;
  smtpPass?: string;
  smtpSecure?: boolean;
}

export async function saveEmailConfig(
  token: string,
  config: EmailConfigPayload
): Promise<{ success: boolean; message: string; status: EmailConfigStatus }> {
  const response = await fetch(`${API_BASE}/admin/email-config`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(config),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to save email configuration');
  }
  return data;
}


