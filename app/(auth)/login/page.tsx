'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, DEMO_USERS, ROLE_LABELS } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  Eye, EyeOff, Heart, Activity, Lock, Mail, ChevronDown, LogIn,
  Shield, Zap, BarChart3, Users, AlertTriangle
} from 'lucide-react';

// ─── Demo credential cards ───────────────────────────────────
const DEMO_CREDS = DEMO_USERS.map(u => ({
  name: u.name, email: u.email, password: u.password,
  role: u.role, label: ROLE_LABELS[u.role]
}));

const FEATURES = [
  { icon: Zap, text: 'AI-Powered Triage', sub: 'ML risk scoring in < 3s' },
  { icon: BarChart3, text: 'Executive Analytics', sub: 'Real-time Power BI dashboards' },
  { icon: Shield, text: 'HIPAA Compliant', sub: 'AES-256 encryption & RBAC' },
  { icon: Users, text: 'Role-Based Access', sub: '5 clinical roles supported' },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 900)); // simulate network
    const result = login(email, password, remember);
    setLoading(false);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error ?? 'Login failed.');
    }
  }

  function fillDemo(cred: typeof DEMO_CREDS[0]) {
    setEmail(cred.email);
    setPassword(cred.password);
    setShowDemo(false);
    setError('');
  }

  return (
    <div className="min-h-screen flex bg-[#0A1628]">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[55%] flex-col justify-between p-12 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] rounded-full bg-teal-600/8 blur-3xl" />
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
          />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl kpi-blue flex items-center justify-center shadow-glow">
            <Heart className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <div>
            <span className="text-white font-bold text-xl tracking-tight">CareFlow</span>
            <div className="text-blue-400 text-xs font-medium">by HealthTech Systems</div>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-blue-400 text-xs font-medium">Enterprise Clinical Intelligence Platform</span>
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              AI-Powered Patient Triage &amp;<br/>
              <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                Diagnostic Allocation
              </span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Reduce wait times by 40%, optimise machine utilisation, and improve patient outcomes with intelligent clinical workflows.
            </p>
          </div>

          {/* Feature list */}
          <div className="grid grid-cols-2 gap-4">
            {FEATURES.map(({ icon: Icon, text, sub }) => (
              <div key={text} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-white text-sm font-medium">{text}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-8">
            {[
              { val: '247', label: 'Patients Today' },
              { val: '97%', label: 'AI Accuracy' },
              { val: '24 min', label: 'Avg Wait Time' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-white">{s.val}</div>
                <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-4 text-slate-600 text-xs">
          <span>© 2024 CareFlow Health Technologies</span>
          <span>•</span>
          <span>NABH Certified</span>
          <span>•</span>
          <span>ISO 27001</span>
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#0D1B2E] lg:bg-[#0A1628]">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg kpi-blue flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <span className="text-white font-bold text-lg">CareFlow</span>
          </div>

          {/* Card */}
          <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
              <p className="text-slate-400 text-sm">Sign in to your clinical workspace</p>
            </div>

            {/* Demo credentials picker */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setShowDemo(!showDemo)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/15 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Use demo credentials
                </span>
                <ChevronDown className={cn('w-4 h-4 transition-transform', showDemo && 'rotate-180')} />
              </button>

              {showDemo && (
                <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                  {DEMO_CREDS.map(cred => (
                    <button
                      key={cred.email}
                      type="button"
                      onClick={() => fillDemo(cred)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-left"
                    >
                      <div>
                        <div className="text-white text-sm font-medium">{cred.name}</div>
                        <div className="text-slate-500 text-xs mt-0.5">{cred.email}</div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {cred.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="doctor@careflow.in"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-11 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/50"
                  />
                  <span className="text-slate-400 text-sm">Remember me</span>
                </label>
                <button type="button" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
                  Forgot password?
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 kpi-blue rounded-xl text-white font-semibold text-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Sign In to CareFlow
                  </>
                )}
              </button>
            </form>

            {/* Security note */}
            <div className="mt-6 flex items-center justify-center gap-2 text-slate-600 text-xs">
              <Shield className="w-3.5 h-3.5" />
              <span>256-bit encrypted • HIPAA compliant • SOC 2 Type II</span>
            </div>
          </div>

          <p className="text-center text-slate-600 text-xs mt-6">
            CareFlow v2.4.1 — Apollo Hospitals Enterprise Edition
          </p>
        </div>
      </div>
    </div>
  );
}
