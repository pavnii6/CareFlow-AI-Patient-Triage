'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useAuthStore, useUIStore, ROLE_LABELS, ROLE_COLORS } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Settings, Sun, Moon, Bell, Shield, Users, Database, Globe, Save, Check } from 'lucide-react';

const TABS = ['Appearance', 'Notifications', 'Security', 'System'] as const;
type Tab = typeof TABS[number];

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('Appearance');
  const { user } = useAuthStore();
  const { theme, setTheme } = useUIStore();
  const [saved, setSaved] = useState(false);

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account, preferences, and system configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-2">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={cn('nav-item w-full', tab === t && 'active')}>
                {t === 'Appearance' && <Sun className="w-4 h-4 flex-shrink-0" />}
                {t === 'Notifications' && <Bell className="w-4 h-4 flex-shrink-0" />}
                {t === 'Security' && <Shield className="w-4 h-4 flex-shrink-0" />}
                {t === 'System' && <Database className="w-4 h-4 flex-shrink-0" />}
                <span>{t}</span>
              </button>
            ))}
          </Card>

          {/* Profile card */}
          {user && (
            <Card className="mt-4 p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full kpi-blue flex items-center justify-center text-white font-bold text-lg">
                  {user.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full border mt-1 inline-block', ROLE_COLORS[user.role])}>
                    {ROLE_LABELS[user.role]}
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {tab === 'Appearance' && (
            <Card>
              <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-sm font-semibold text-foreground mb-3">Theme</div>
                  <div className="grid grid-cols-3 gap-3">
                    {(['light', 'dark', 'system'] as const).map(t => (
                      <button key={t} onClick={() => { setTheme(t); document.documentElement.classList.toggle('dark', t === 'dark'); }}
                        className={cn(
                          'p-4 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-2',
                          theme === t ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'
                        )}>
                        {t === 'light' && <Sun className="w-6 h-6" />}
                        {t === 'dark' && <Moon className="w-6 h-6" />}
                        {t === 'system' && <Globe className="w-6 h-6" />}
                        <span className="capitalize">{t}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-foreground mb-3">Font Size</div>
                  <div className="flex gap-3">
                    {['Small', 'Medium', 'Large'].map(s => (
                      <button key={s}
                        className={cn(
                          'px-4 py-2 rounded-lg border text-sm font-medium transition-all',
                          s === 'Medium' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'
                        )}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold text-foreground mb-3">Sidebar Density</div>
                  <div className="flex gap-3">
                    {['Compact', 'Default', 'Comfortable'].map(s => (
                      <button key={s}
                        className={cn(
                          'px-4 py-2 rounded-lg border text-sm font-medium transition-all',
                          s === 'Default' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'
                        )}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {tab === 'Notifications' && (
            <Card>
              <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Critical Patient Alerts', desc: 'Immediate notifications for critical triage levels', default: true },
                  { label: 'Machine Maintenance Alerts', desc: 'Scheduled and emergency maintenance notifications', default: true },
                  { label: 'Doctor Availability Changes', desc: 'When doctors go on/off duty unexpectedly', default: true },
                  { label: 'Risk Escalations', desc: 'When project risks are escalated or status changes', default: false },
                  { label: 'Sprint Completion', desc: 'When a sprint is completed or a milestone is reached', default: false },
                  { label: 'System Updates', desc: 'CareFlow platform updates and maintenance windows', default: true },
                  { label: 'Lab Results Ready', desc: 'When diagnostic results are available for review', default: true },
                  { label: 'Scheduled Reports', desc: 'When scheduled reports are generated and ready', default: false },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border">
                    <div>
                      <div className="font-medium text-sm text-foreground">{item.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                      <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {tab === 'Security' && (
            <Card>
              <CardHeader><CardTitle>Security Settings</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold text-sm">
                    <Shield className="w-4 h-4" />
                    Security Status: Strong
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                    AES-256 encryption · TLS 1.3 · 2FA enabled · Last login: Today 08:15 AM
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Two-Factor Authentication', status: 'Enabled', action: 'Manage' },
                    { label: 'Session Timeout', status: '30 minutes', action: 'Change' },
                    { label: 'Login Notifications', status: 'Enabled', action: 'Configure' },
                    { label: 'API Access Tokens', status: '2 active tokens', action: 'Manage' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-4 rounded-xl border border-border">
                      <div>
                        <div className="font-medium text-sm text-foreground">{item.label}</div>
                        <div className="text-xs text-muted-foreground">{item.status}</div>
                      </div>
                      <button className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-accent transition-colors">
                        {item.action}
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {tab === 'System' && (
            <Card>
              <CardHeader><CardTitle>System Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Platform Version', value: 'CareFlow v2.4.1' },
                    { label: 'AI Model', value: 'CareFlow-Triage-v3.2' },
                    { label: 'Environment', value: 'Production' },
                    { label: 'Database', value: 'PostgreSQL 15.4' },
                    { label: 'Uptime', value: '99.97% (30d)' },
                    { label: 'Last Backup', value: 'Today 03:00 AM' },
                    { label: 'Security Patch', value: 'Jul 18, 2024' },
                    { label: 'Support Expiry', value: 'Dec 31, 2025' },
                  ].map(item => (
                    <div key={item.label} className="p-3 rounded-xl bg-muted/50 border border-border">
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                      <div className="text-sm font-semibold text-foreground mt-0.5">{item.value}</div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30">
                  <div className="font-semibold text-blue-900 dark:text-blue-300 text-sm mb-1">Apollo Hospitals Enterprise License</div>
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    Licensed to Apollo Hospitals Group · 500 seats · NABH Certified Module Active · Technical Support: 24/7
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <button
            onClick={save}
            className={cn(
              'mt-4 flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all',
              saved ? 'bg-green-600 hover:bg-green-700' : 'kpi-blue hover:opacity-90'
            )}
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
