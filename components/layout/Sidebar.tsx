'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore, useUIStore, ROLE_LABELS, ROLE_COLORS, ROLE_PERMISSIONS } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, Stethoscope, Microscope, UserRound,
  BarChart3, Briefcase, BookOpen, GitBranch, AlertTriangle,
  ListTree, Calendar, Bell, FileText, Settings, Heart,
  ChevronLeft, LogOut, Activity
} from 'lucide-react';

const ALL_NAV = [
  { key: 'dashboard',    href: '/dashboard',    icon: LayoutDashboard, label: 'Executive Dashboard', section: 'Clinical' },
  { key: 'patients',     href: '/patients',     icon: Users,           label: 'Patient Management',  section: 'Clinical' },
  { key: 'triage',       href: '/triage',       icon: Activity,        label: 'AI Triage Engine',    section: 'Clinical' },
  { key: 'diagnostics',  href: '/diagnostics',  icon: Microscope,      label: 'Diagnostic Allocation', section: 'Clinical' },
  { key: 'doctors',      href: '/doctors',      icon: Stethoscope,     label: 'Doctor Dashboard',    section: 'Clinical' },
  { key: 'analytics',    href: '/analytics',    icon: BarChart3,       label: 'Analytics',           section: 'Intelligence' },
  { key: 'pmo',          href: '/pmo',          icon: Briefcase,       label: 'PMO Dashboard',       section: 'Project' },
  { key: 'ba-workspace', href: '/ba-workspace', icon: BookOpen,        label: 'BA Workspace',        section: 'Project' },
  { key: 'process-map',  href: '/process-map',  icon: GitBranch,       label: 'Process Maps',        section: 'Project' },
  { key: 'risk-register',href: '/risk-register',icon: AlertTriangle,   label: 'Risk Register',       section: 'Project' },
  { key: 'wbs',          href: '/wbs',          icon: ListTree,        label: 'WBS',                 section: 'Project' },
  { key: 'gantt',        href: '/gantt',        icon: Calendar,        label: 'Gantt Chart',         section: 'Project' },
  { key: 'notifications',href: '/notifications',icon: Bell,            label: 'Notifications',       section: 'Operations' },
  { key: 'reports',      href: '/reports',      icon: FileText,        label: 'Reports',             section: 'Operations' },
  { key: 'settings',     href: '/settings',     icon: Settings,        label: 'Settings',            section: 'Operations' },
];

const SECTIONS = ['Clinical', 'Intelligence', 'Project', 'Operations'];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const allowed = user ? ROLE_PERMISSIONS[user.role] : [];
  const navItems = ALL_NAV.filter(n => allowed.includes(n.key));

  return (
    <aside className={cn(
      'flex flex-col h-screen bg-[#0A1628] border-r border-white/[0.07] transition-all duration-300 flex-shrink-0',
      sidebarOpen ? 'w-64' : 'w-[68px]'
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/[0.07]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg kpi-blue flex items-center justify-center flex-shrink-0 shadow-glow">
            <Heart className="w-4 h-4 text-white" fill="currentColor" />
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <div className="text-white font-bold text-base tracking-tight truncate">CareFlow</div>
              <div className="text-blue-400/70 text-[10px] font-medium">Enterprise Edition</div>
            </div>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className={cn('text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0', !sidebarOpen && 'mx-auto')}
        >
          <ChevronLeft className={cn('w-4 h-4 transition-transform', !sidebarOpen && 'rotate-180')} />
        </button>
      </div>

      {/* User info */}
      {user && (
        <div className={cn('px-3 py-3 border-b border-white/[0.07]', !sidebarOpen && 'flex justify-center')}>
          <div className={cn('flex items-center gap-3', !sidebarOpen && 'justify-center')}>
            <div className="w-8 h-8 rounded-full kpi-blue flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {(user.avatar ?? user.name.charAt(0))}
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <div className="text-white text-sm font-medium truncate">{user.name}</div>
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded border font-medium', ROLE_COLORS[user.role])}>
                  {ROLE_LABELS[user.role]}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-thin">
        {SECTIONS.map(section => {
          const items = navItems.filter(n => n.section === section);
          if (!items.length) return null;
          return (
            <div key={section} className="mb-2">
              {sidebarOpen && (
                <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
                  {section}
                </div>
              )}
              {items.map(({ href, icon: Icon, label }) => {
                const active = pathname === href || (href !== '/' && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    title={!sidebarOpen ? label : undefined}
                    className={cn(
                      'nav-item',
                      active && 'active',
                      !sidebarOpen && 'justify-center px-2'
                    )}
                  >
                    <Icon className={cn('w-4.5 h-4.5 flex-shrink-0', active ? 'text-primary' : 'text-slate-500')} />
                    {sidebarOpen && <span className="truncate">{label}</span>}
                    {sidebarOpen && active && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Bottom logout */}
      <div className="p-3 border-t border-white/[0.07]">
        <button
          onClick={logout}
          className={cn(
            'nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10',
            !sidebarOpen && 'justify-center px-2'
          )}
          title={!sidebarOpen ? 'Sign out' : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {sidebarOpen && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
