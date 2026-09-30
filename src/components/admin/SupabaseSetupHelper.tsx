import React, { useState, useEffect } from 'react';
import {
  Database,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  KeyRound,
  RefreshCw,
  UploadCloud,
  AlertCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import {
  fetchSupabaseStatus,
  saveSupabaseConfig,
  syncLeadsToSupabase,
  SupabaseConfigStatus,
} from '../../lib/api';

interface SupabaseSetupHelperProps {
  token: string;
  onConfigUpdated: () => void;
}

export const SupabaseSetupHelper: React.FC<SupabaseSetupHelperProps> = ({
  token,
  onConfigUpdated,
}) => {
  const [status, setStatus] = useState<SupabaseConfigStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [showSql, setShowSql] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form states
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [actionMessage, setActionMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const res = await fetchSupabaseStatus(token);
      setStatus(res);
      if (res.supabaseUrl) {
        setSupabaseUrl(res.supabaseUrl);
      }
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, [token]);

  const handleSaveConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionMessage(null);

    if (!supabaseUrl.trim().startsWith('https://')) {
      setActionMessage({
        type: 'error',
        text: 'Please enter a valid Supabase URL starting with https:// (e.g. https://your-project.supabase.co)',
      });
      return;
    }

    if (!supabaseKey.trim()) {
      setActionMessage({
        type: 'error',
        text: 'Please enter your Supabase API Key (Anon public key or Service Role key).',
      });
      return;
    }

    try {
      setTestingConnection(true);
      const res = await saveSupabaseConfig(token, {
        url: supabaseUrl.trim(),
        key: supabaseKey.trim(),
      });

      setActionMessage({
        type: 'success',
        text: res.message,
      });

      await loadStatus();
      onConfigUpdated();
      setSupabaseKey('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect to Supabase';
      setActionMessage({
        type: 'error',
        text: msg,
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSyncLeads = async () => {
    try {
      setSyncing(true);
      setActionMessage(null);
      const res = await syncLeadsToSupabase(token);
      setActionMessage({
        type: 'success',
        text: res.message,
      });
      await loadStatus();
      onConfigUpdated();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sync failed';
      setActionMessage({
        type: 'error',
        text: msg,
      });
    } finally {
      setSyncing(false);
    }
  };

  const sqlSchema = `-- ====================================================================
-- IronFit Fitness Studio — Supabase Database Migration & RLS Security
-- Table: leads
-- ====================================================================

-- 1. Create leads table
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  fitness_goal text not null,
  preferred_workout_time text not null,
  message text,
  status text not null default 'New',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. Create index for speedy lookups
create index if not exists idx_leads_created_at on public.leads (created_at desc);
create index if not exists idx_leads_status on public.leads (status);

-- 3. Enable Row Level Security (RLS)
alter table public.leads enable row level security;

-- 4. Public visitors can insert their 30-Day Challenge enquiries
drop policy if exists "Allow public lead submissions" on public.leads;
create policy "Allow public lead submissions"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- 5. Allow reading leads for dashboard display
drop policy if exists "Allow viewing leads" on public.leads;
create policy "Allow viewing leads"
  on public.leads
  for select
  to anon, authenticated
  using (true);

-- 6. Allow updating lead status
drop policy if exists "Allow updating leads" on public.leads;
create policy "Allow updating leads"
  on public.leads
  for update
  to anon, authenticated
  using (true)
  with check (true);
`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isConnected = status?.isConnected;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-8 shadow-xl">
      {/* Top Banner Row */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-center shrink-0">
            <Database className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-heading text-lg sm:text-xl font-bold text-white">
                Supabase Backend Database
              </h3>
              <span
                className={`text-xs px-2.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1 ${
                  isConnected
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}
              >
                {isConnected ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Connected to Live Supabase</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Local Persistent Storage Active</span>
                  </>
                )}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-400 mt-1 leading-relaxed">
              {isConnected
                ? `Active PostgreSQL connection: ${status.supabaseUrl}. Leads are securely saved to the 'leads' table with RLS enabled.`
                : 'Every enquiry is currently backed up permanently to local storage (data/leads.json). Connect your Supabase project below to save directly to the cloud.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <button
            type="button"
            onClick={() => setShowConfigForm(!showConfigForm)}
            className="text-xs font-semibold px-3.5 py-2 rounded bg-neutral-950 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5 text-red-500" />
            <span>{showConfigForm ? 'Close Connection Settings' : isConnected ? 'Change Credentials' : 'Connect Supabase'}</span>
          </button>

          {isConnected && (
            <button
              type="button"
              disabled={syncing}
              onClick={handleSyncLeads}
              className="text-xs font-semibold px-3.5 py-2 rounded bg-red-600/90 hover:bg-red-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              title="Push any local leads into your live Supabase database"
            >
              <UploadCloud className={`w-3.5 h-3.5 ${syncing ? 'animate-bounce' : ''}`} />
              <span>{syncing ? 'Syncing...' : 'Sync Local Leads'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowSql(!showSql)}
            className="text-xs font-semibold px-3.5 py-2 rounded bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showSql ? 'Hide SQL' : 'SQL Schema'}</span>
          </button>

          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold px-3 py-2 rounded bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 flex items-center gap-1.5 transition-colors"
          >
            <span>Supabase Console</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* RLS Policy Notice Banner */}
      {status?.rlsNeedsPolicy && (
        <div className="mt-4 p-4 rounded-lg bg-amber-950/80 border border-amber-800 text-amber-200">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white mb-1">
                Final Step: Enable Insert Permission in Supabase RLS
              </h4>
              <p className="text-xs text-amber-200 leading-relaxed mb-3">
                Your Supabase project and the <code className="bg-amber-900/60 px-1 py-0.5 rounded text-white font-mono">leads</code> table are connected. However, PostgreSQL Row-Level Security (RLS) is currently preventing the <code className="font-mono text-white">anon</code> key from writing new rows.
                Run this single policy in your{' '}
                <a
                  href={
                    status?.supabaseUrl
                      ? `https://supabase.com/dashboard/project/${status.supabaseUrl.replace('https://', '').split('.')[0]}/sql`
                      : 'https://supabase.com/dashboard'
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="underline font-bold text-white hover:text-amber-100"
                >
                  Supabase SQL Editor
                </a>{' '}
                to allow public form submissions to save:
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <code className="text-xs font-mono bg-black/60 p-2.5 rounded border border-amber-900/60 text-emerald-300 overflow-x-auto flex-1">
                  create policy "Allow public lead submissions" on public.leads for insert to anon, authenticated with check (true);
                </code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      'create policy "Allow public lead submissions" on public.leads for insert to anon, authenticated with check (true);'
                    );
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="shrink-0 text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white px-3.5 py-2.5 rounded transition-colors cursor-pointer text-center"
                >
                  {copied ? 'Copied SQL!' : 'Copy SQL Fix'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Notice / Feedback message */}
      {actionMessage && (
        <div
          role="alert"
          className={`mt-4 p-3.5 rounded text-xs sm:text-sm flex items-start gap-2.5 ${
            actionMessage.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-200'
              : 'bg-red-950/80 border border-red-800 text-red-200'
          }`}
        >
          {actionMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          )}
          <p>{actionMessage.text}</p>
        </div>
      )}

      {/* Supabase Connection Setup Form */}
      {showConfigForm && (
        <div className="mt-6 pt-6 border-t border-neutral-800 animate-fadeIn">
          <div className="max-w-2xl bg-neutral-950 p-6 rounded-lg border border-neutral-800">
            <h4 className="font-heading text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-500" />
              <span>Connect Supabase Project Credentials</span>
            </h4>
            <p className="text-xs text-neutral-400 mb-5">
              Obtain your project URL and Anon / Service Role key from your{' '}
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:underline"
              >
                Supabase Dashboard → Project Settings → API
              </a>
              .
            </p>

            <form onSubmit={handleSaveConnection} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-neutral-300 mb-1.5">
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://your-project-id.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs uppercase font-bold text-neutral-300">
                    Supabase API Key
                  </label>
                  {status?.hasKey && (
                    <span className="text-[11px] text-neutral-500">
                      Currently using: <code className="text-neutral-400">{status.supabaseKeyMasked}</code>
                    </span>
                  )}
                </div>
                <input
                  type="password"
                  required
                  placeholder="your-anon-or-service-role-key"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={testingConnection}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-neutral-800 text-white font-bold text-xs py-2.5 px-5 rounded transition-all cursor-pointer"
                >
                  {testingConnection ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying & Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Test & Save Connection</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowConfigForm(false)}
                  className="text-xs text-neutral-400 hover:text-white px-3 py-2 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SQL Migration Script Dropdown */}
      {showSql && (
        <div className="mt-6 pt-6 border-t border-neutral-800 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 text-xs text-neutral-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Copy and paste this into Supabase SQL Editor to initialize the table and security rules:</span>
            </div>
            <button
              onClick={copySql}
              className="text-xs inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy SQL Schema'}</span>
            </button>
          </div>
          <pre className="bg-neutral-950 p-4 rounded text-neutral-300 text-xs font-mono overflow-x-auto border border-neutral-800 max-h-64 leading-relaxed">
            {sqlSchema}
          </pre>
        </div>
      )}
    </div>
  );
};
