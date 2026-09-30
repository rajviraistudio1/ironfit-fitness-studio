import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Settings,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  EmailConfigStatus,
  fetchEmailStatus,
  sendTestEmail,
  saveEmailConfig,
  EmailConfigPayload,
} from '../../lib/api';

interface EmailNotificationManagerProps {
  token: string;
}

export const EmailNotificationManager: React.FC<EmailNotificationManagerProps> = ({
  token,
}) => {
  const [status, setStatus] = useState<EmailConfigStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'resend' | 'smtp'>('resend');

  // Form states
  const [recipient, setRecipient] = useState('');
  const [resendApiKey, setResendApiKey] = useState('');
  const [emailFrom, setEmailFrom] = useState('');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpSecure, setSmtpSecure] = useState(false);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const loadStatus = async () => {
    try {
      setLoading(true);
      const data = await fetchEmailStatus(token);
      setStatus(data);
      setRecipient(data.recipient || 'owner@ironfitfitness.example');
      setEmailFrom(data.fromEmail || 'IronFit Studio <onboarding@resend.dev>');
    } catch (err: unknown) {
      console.error('Failed to load email status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, [token]);

  const handleTestEmail = async () => {
    try {
      setTesting(true);
      setFeedback(null);
      const res = await sendTestEmail(token, recipient);
      setFeedback({
        type: 'success',
        message: res.message || `Test email sent to ${recipient}!`,
      });
      await loadStatus();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send test email';
      setFeedback({
        type: 'error',
        message: msg,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setFeedback(null);

      const payload: EmailConfigPayload = {
        ownerNotificationEmail: recipient.trim(),
        emailFrom: emailFrom.trim(),
      };

      if (activeTab === 'resend') {
        payload.resendApiKey = resendApiKey.trim();
      } else {
        payload.smtpHost = smtpHost.trim();
        payload.smtpPort = smtpPort;
        payload.smtpUser = smtpUser.trim();
        payload.smtpPass = smtpPass.trim();
        payload.smtpSecure = smtpSecure;
      }

      const res = await saveEmailConfig(token, payload);
      setFeedback({
        type: 'success',
        message: res.message || 'Email settings saved successfully!',
      });
      setStatus(res.status);
      setResendApiKey('');
      setSmtpPass('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save email settings';
      setFeedback({
        type: 'error',
        message: msg,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 mb-8 shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Side: Status & Overview */}
        <div className="flex items-start sm:items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              status?.isConfigured
                ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-400'
                : 'bg-amber-950/80 border border-amber-800 text-amber-400'
            }`}
          >
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-heading text-lg font-bold text-white tracking-wide">
                Owner Email Notifications
              </h3>
              {status?.isConfigured ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>
                    Live ({status.activeProvider === 'resend' ? 'Resend API' : 'SMTP'})
                  </span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-800">
                  <AlertCircle className="w-3 h-3" />
                  <span>Setup Needed for Inbox Delivery</span>
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Recipient:{' '}
              <strong className="text-neutral-200">
                {status?.recipient || recipient || 'owner@ironfitfitness.example'}
              </strong>{' '}
              • Receives instantaneous lead alerts for every valid form enquiry.
            </p>
          </div>
        </div>

        {/* Right Side: Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleTestEmail}
            disabled={testing}
            className="text-xs font-semibold px-3 py-2 rounded bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {testing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5 text-red-500" />
            )}
            <span>{testing ? 'Sending...' : 'Send Test Alert'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs font-semibold px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Configure Email Provider</span>
            {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`mt-4 p-3.5 rounded text-xs sm:text-sm flex items-start gap-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-200'
              : 'bg-red-950/80 border border-red-800 text-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          )}
          <p>{feedback.message}</p>
        </div>
      )}

      {/* Collapsible Email Setup Drawer */}
      {isOpen && (
        <div className="mt-5 pt-5 border-t border-neutral-800 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Config Form */}
            <div className="lg:col-span-2 bg-neutral-950 p-5 rounded-lg border border-neutral-800">
              <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('resend')}
                    className={`text-xs font-bold px-3 py-1.5 rounded transition-colors ${
                      activeTab === 'resend'
                        ? 'bg-red-600 text-white'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Option 1: Resend API (Recommended)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('smtp')}
                    className={`text-xs font-bold px-3 py-1.5 rounded transition-colors ${
                      activeTab === 'smtp'
                        ? 'bg-red-600 text-white'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Option 2: SMTP / Gmail
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-neutral-300 mb-1">
                    Gym Owner Notification Email (Recipient)
                  </label>
                  <input
                    type="email"
                    required
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="owner@yourgym.com or your personal email"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                  />
                  <span className="text-[11px] text-neutral-500 mt-1 block">
                    All new lead notifications from the 30-Day Challenge will be sent to this email.
                  </span>
                </div>

                {activeTab === 'resend' ? (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs uppercase font-bold text-neutral-300">
                          Resend API Key
                        </label>
                        <a
                          href="https://resend.com/api-keys"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-red-400 hover:underline flex items-center gap-1"
                        >
                          <span>Get Free API Key</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                      <input
                        type="password"
                        value={resendApiKey}
                        onChange={(e) => setResendApiKey(e.target.value)}
                        placeholder={
                          status?.hasResendKey
                            ? '•••••••••••••••••••••••• (Leave blank to keep current)'
                            : 're_123456789...'
                        }
                        className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 font-mono"
                      />
                      <span className="text-[11px] text-neutral-500 mt-1 block">
                        Resend free tier offers 3,000 emails/month with zero credit card required.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-bold text-neutral-300 mb-1">
                        Sender From Email
                      </label>
                      <input
                        type="text"
                        value={emailFrom}
                        onChange={(e) => setEmailFrom(e.target.value)}
                        placeholder="IronFit Studio <onboarding@resend.dev>"
                        className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 text-xs font-mono"
                      />
                      <span className="text-[11px] text-neutral-500 mt-1 block">
                        Use <code className="text-neutral-300">onboarding@resend.dev</code> for instant testing, or your verified domain.
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs uppercase font-bold text-neutral-300 mb-1">
                          SMTP Host
                        </label>
                        <input
                          type="text"
                          value={smtpHost}
                          onChange={(e) => setSmtpHost(e.target.value)}
                          placeholder="smtp.gmail.com"
                          className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase font-bold text-neutral-300 mb-1">
                          Port
                        </label>
                        <input
                          type="text"
                          value={smtpPort}
                          onChange={(e) => setSmtpPort(e.target.value)}
                          placeholder="587"
                          className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs uppercase font-bold text-neutral-300 mb-1">
                          SMTP Username / Email
                        </label>
                        <input
                          type="text"
                          value={smtpUser}
                          onChange={(e) => setSmtpUser(e.target.value)}
                          placeholder="your.gym@gmail.com"
                          className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase font-bold text-neutral-300 mb-1">
                          SMTP Password / App Password
                        </label>
                        <input
                          type="password"
                          value={smtpPass}
                          onChange={(e) => setSmtpPass(e.target.value)}
                          placeholder="16-character Google App Password"
                          className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="smtpSecure"
                        checked={smtpSecure}
                        onChange={(e) => setSmtpSecure(e.target.checked)}
                        className="rounded border-neutral-700 bg-neutral-900 text-red-600 focus:ring-red-500"
                      />
                      <label htmlFor="smtpSecure" className="text-xs text-neutral-300 cursor-pointer">
                        Use SSL/TLS (usually for port 465)
                      </label>
                    </div>
                  </>
                )}

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={saving}
                    className="text-xs font-bold px-4 py-2.5 rounded bg-red-600 hover:bg-red-500 text-white flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    <span>{saving ? 'Saving...' : 'Save Email Settings'}</span>
                  </button>
                  <span className="text-[11px] text-neutral-500">
                    Saved to private server environment
                  </span>
                </div>
              </form>
            </div>

            {/* Column 2: Recent Email Dispatches & Instructions */}
            <div className="bg-neutral-950 p-5 rounded-lg border border-neutral-800 flex flex-col justify-between">
              <div>
                <h4 className="text-xs uppercase font-bold text-neutral-300 mb-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-red-500" />
                  <span>Recent Lead Email Dispatches</span>
                </h4>

                {status?.recentLogs && status.recentLogs.length > 0 ? (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {status.recentLogs.slice(-4).reverse().map((log) => (
                      <div
                        key={log.id}
                        className="p-2.5 rounded bg-neutral-900 border border-neutral-800 text-xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-white truncate max-w-[120px]">
                            {log.leadName}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                              log.status === 'delivered'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : log.status === 'simulated'
                                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                : 'bg-red-950 text-red-400 border border-red-800'
                            }`}
                          >
                            {log.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-400 flex items-center justify-between">
                          <span>Via {log.provider}</span>
                          <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded bg-neutral-900/60 border border-neutral-800 text-center">
                    <Sparkles className="w-5 h-5 text-neutral-500 mx-auto mb-1.5" />
                    <p className="text-xs text-neutral-400">
                      No notifications dispatched yet. Submit an enquiry to test.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800">
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  💡 <strong>Tip</strong>: For Gmail SMTP, enable 2-Step Verification in Google Account and generate a 16-character <strong>App Password</strong>. Or use Resend for 1-minute setup.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
