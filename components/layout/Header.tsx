'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore, useUIStore } from '@/lib/store';
import { NOTIFICATIONS } from '@/data/notifications';
import { cn, formatTime } from '@/lib/utils';
import {
  Bell, Sun, Moon, Search, ChevronRight, Heart
} from 'lucide-react';

// Breadcrumb map
const LABELS: Record<string, string> = {
  dashboard:     'Executive Dashboard',
  patients:      'Patient Management',
  triage:        'AI Triage Engine',
  diagnostics:   'Diagnostic Allocation',
  doctors:       'Doctor Dashboard',
  analytics:     'Analytics',
  pmo:           'PMO Dashboard',
  'ba-workspace': 'BA Workspace',
  'process-map': 'Process Maps',
  'risk-register': 'Risk Register',
  wbs:           'WBS',
  gantt:         'Gantt Chart',
  notifications: 'Notifications',
  reports:       'Reports',
  settings:      'Settings',
};

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { theme, setTheme } = useUIStore();

  const segments = pathname.split('/').filter(Boolean);
  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  }

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-background/80 backdrop-blur-md border-b border-border flex-shrink-0 sticky top-0 z-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        <Link href="/dashboard" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
          <Heart className="w-3.5 h-3.5 text-primary" fill="currentColor" />
          <span>CareFlow</span>
        </Link>
        {segments.map((seg, i) => (
          <span key={seg} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <span className={cn(
              i === segments.length - 1 ? 'text-foreground font-medium' : 'text-muted-foreground'
            )}>
              {LABELS[seg] ?? seg}
            </span>
          </span>
        ))}
      </nav>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-sm hover:bg-accent transition-colors">
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded border border-border bg-background">⌘K</kbd>
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <Link
          href="/notifications"
          className="relative w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white rounded-full bg-red-500">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Link>

        {/* Avatar */}
        {user && (
          <div className="flex items-center gap-2.5 pl-2 border-l border-border ml-1">
            <div className="w-8 h-8 rounded-full kpi-blue flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user.avatar ?? user.name.charAt(0)}
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-foreground leading-tight">{user.name.split(' ').slice(0,2).join(' ')}</div>
              <div className="text-xs text-muted-foreground">{user.department}</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
