"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Lock, Eye, EyeOff, Activity, Shield, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function ResetPasswordPage() {
  const t = useTranslations('ResetPassword');
  const router = useRouter();
  const { token } = useParams();

  const [password, setPassword]           = useState('');
  const [confirmPassword, setConfirm]     = useState('');
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [done, setDone]                   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const res  = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setDone(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F0E] flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="card-primary w-full max-w-md p-8 relative z-10 animate-in slide-in-from-bottom-4 duration-500">

        {!done ? (
          <>
            <div className="mb-8">
              <div className="w-12 h-12 bg-[#1ED760]/10 border border-[#1ED760]/20 rounded-xl flex items-center justify-center mb-4">
                <Shield className="text-[#1ED760]" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">{t('title')}</h1>
              <p className="text-slate-400 text-sm font-medium">{t('description')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <PasswordField
                label={t('newPassword')}
                value={password}
                onChange={setPassword}
                show={showPassword}
                toggle={() => setShowPassword(s => !s)}
                placeholder={t('placeholder')}
              />
              <PasswordField
                label={t('confirmNewPassword')}
                value={confirmPassword}
                onChange={setConfirm}
                show={showConfirm}
                toggle={() => setShowConfirm(s => !s)}
                placeholder={t('placeholder')}
              />

              {error && (
                <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl font-semibold">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !password || !confirmPassword}
                className="btn-primary w-full py-4 mt-4 disabled:opacity-50"
              >
                {loading ? <Activity size={20} className="animate-spin" /> : t('resetBtn')}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-[#1ED760]/10 border border-[#1ED760]/20 text-[#1ED760] rounded-xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{t('successTitle')}</h2>
            <p className="text-slate-400 text-sm font-medium mb-8">{t('successMsg')}</p>
            <button
              onClick={() => router.push('/')}
              className="btn-primary w-full py-4"
            >
              {t('goToLogin')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange, show, toggle, placeholder }) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{label}</label>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
        <input
          type={show ? 'text' : 'password'} required
          value={value} onChange={e => onChange(e.target.value)}
          className="input-premium !pl-12 !pr-12"
          placeholder={placeholder}
        />
        <button type="button" onClick={toggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
