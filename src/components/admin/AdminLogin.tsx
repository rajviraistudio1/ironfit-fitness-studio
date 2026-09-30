import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { adminLogin } from '../../lib/api';

interface AdminLoginProps {
  onSuccess: (token: string, user: { name: string; email: string }) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToSite }) => {
  const [email, setEmail] = useState('owner@ironfitfitness.example');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError('Please enter your owner password.');
      return;
    }

    setLoading(true);
    try {
      const res = await adminLogin(password, email);
      onSuccess(res.token, res.user);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <span className="font-heading text-4xl font-bold tracking-wider text-white">
            IRON<span className="text-red-600">FIT</span>
          </span>
          <p className="text-sm uppercase tracking-widest text-neutral-400 font-bold mt-1">
            Studio Owner Portal
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-neutral-900 border border-neutral-800 rounded p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-800">
            <div className="w-10 h-10 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-center text-red-500">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-white">
                Owner Authentication
              </h2>
              <p className="text-xs text-neutral-400">
                Kiran Mehta — Lead Management System
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-neutral-300 mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded pl-10 pr-4 py-3 text-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs uppercase tracking-wider font-bold text-neutral-300">
                  Password
                </label>
                <span className="text-[11px] text-neutral-500">
                  Default: <code className="text-neutral-400 font-mono">ironfit2026</code>
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Enter owner password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded pl-10 pr-4 py-3 text-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 placeholder-neutral-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-neutral-800 text-white font-bold py-3 px-4 rounded transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-neutral-800 text-center">
            <button
              type="button"
              onClick={onBackToSite}
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              ← Return to IronFit Landing Page
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
