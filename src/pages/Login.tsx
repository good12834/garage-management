/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldAlert, LogIn, Lock, Mail, CheckCircle2, ChevronRight } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (userEmail: string) => void;
  targetPath?: string;
  onCancel?: () => void;
}

export function LoginPage({ onLoginSuccess, targetPath, onCancel }: LoginPageProps) {
  const [email, setEmail] = useState('manager@gearbox.com');
  const [password, setPassword] = useState('garage2026');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Dynamic visual timer
    setTimeout(() => {
      // Allow general demo credentials
      if (email.trim().toLowerCase() === 'manager@gearbox.com' && password === 'garage2026') {
        onLoginSuccess(email.trim());
      } else if (email.trim() && password.length >= 4) {
        // Fallback for easy custom login
        onLoginSuccess(email.trim());
      } else {
        setError('Invalid credentials. Please use the pre-filled credentials or enter a valid email and 4+ character password.');
        setIsSubmitting(false);
      }
    }, 750);
  };

  return (
    <div className="max-w-md mx-auto my-12 p-1 border-2 border-[#1A1A1A] bg-white shadow-[6px_6px_0px_rgba(26,26,26,0.15)] overflow-hidden">
      {/* Editorial Header accent */}
      <div className="bg-[#1A1A1A] text-[#F9F7F2] p-6 text-center select-none">
        <span className="text-[9px] uppercase tracking-[0.25em] font-mono text-[#A13D2D] font-bold block mb-1">
          SECURE ENTRANCE PORTAL
        </span>
        <h2 className="text-2xl font-serif italic text-white font-normal">
          Workspace Verification
        </h2>
        <p className="text-[10px] text-zinc-400 font-sans uppercase tracking-[0.1em] mt-1.5 leading-snug">
          Required for Ledger DB access
        </p>
      </div>

      <div className="p-8 space-y-6">
        <div className="flex items-start gap-3.5 p-3.5 bg-[#F9F7F2] border border-[#1A1A1A]/10 text-zinc-700">
          <ShieldAlert size={18} className="text-[#A13D2D] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
              Area Gated // Access Control
            </h4>
            <p className="text-[11px] leading-relaxed text-zinc-650">
              The dashboard, customer registries, vehicle specs, and active financial invoices are restricted of public view. Sign in with standard operator clearance below.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A1A1A] block">
              Clearance ID (Email)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-zinc-400">
                <Mail size={14} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@gearbox.com"
                className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border-2 border-[#1A1A1A] font-sans text-xs focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A1A1A] block">
              Passkey
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-zinc-400">
                <Lock size={14} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border-2 border-[#1A1A1A] font-sans text-xs focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="text-[11px] text-[#A13D2D] font-mono bg-red-50 p-2.5 border border-[#A13D2D]/20 leading-relaxed">
              * {error}
            </div>
          )}

          <div className="pt-2 flex gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-3 border-2 border-[#1A1A1A] hover:bg-zinc-100 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer select-none"
              >
                Go Back
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#1A1A1A] hover:bg-[#A13D2D] disabled:bg-zinc-600 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[2px_2px_0px_rgba(26,26,26,0.15)]"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Confirm Clearance'}</span>
              {!isSubmitting && <LogIn size={13} className="shrink-0" />}
            </button>
          </div>
        </form>

        {/* Demo Credentials Visual Cue */}
        <div className="border-[#1A1A1A] border-t-2 pt-4 bg-zinc-50/50 -mx-8 -mb-8 px-8 pb-5 space-y-2">
          <div className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-widest text-zinc-500">
            <CheckCircle2 size={12} className="text-emerald-600" />
            <span>Developer / Operator Credentials</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-[10px] font-mono text-zinc-650 bg-white p-3 border border-zinc-200">
            <div>
              <span className="text-zinc-400 block uppercase text-[8px] tracking-wider">Email ID</span>
              <code className="text-[#A13D2D] font-bold">manager@gearbox.com</code>
            </div>
            <div>
              <span className="text-zinc-400 block uppercase text-[8px] tracking-wider">Passkey</span>
              <code className="text-[#1A1A1A] font-bold">garage2026</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
