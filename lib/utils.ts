import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { TriageLevel, TaskStatus, Priority, RiskStatus } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Triage ──────────────────────────────────────────────────
export const triageBadgeClass: Record<TriageLevel, string> = {
  critical: 'badge-critical',
  high:     'badge-high',
  medium:   'badge-medium',
  low:      'badge-low',
};

export const triageColor: Record<TriageLevel, string> = {
  critical: '#EF4444',
  high:     '#F97316',
  medium:   '#F59E0B',
  low:      '#10B981',
};

export const triageLabel: Record<TriageLevel, string> = {
  critical: 'Critical',
  high:     'High',
  medium:   'Medium',
  low:      'Low',
};

// ─── Task Status ─────────────────────────────────────────────
export const statusBadgeClass: Record<TaskStatus, string> = {
  todo:        'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300',
  in_progress: 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
  blocked:     'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400',
  done:        'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-400',
  cancelled:   'bg-gray-100 text-gray-500 border border-gray-200 dark:bg-gray-800 dark:text-gray-500',
};

export const statusLabel: Record<TaskStatus, string> = {
  todo:        'To Do',
  in_progress: 'In Progress',
  blocked:     'Blocked',
  done:        'Done',
  cancelled:   'Cancelled',
};

// ─── Priority ─────────────────────────────────────────────────
export const priorityBadgeClass: Record<Priority, string> = {
  critical: 'badge-critical',
  high:     'badge-high',
  medium:   'badge-medium',
  low:      'badge-low',
};

// ─── Risk ────────────────────────────────────────────────────
export const riskStatusClass: Record<RiskStatus, string> = {
  open:      'badge-high',
  mitigated: 'badge-low',
  accepted:  'badge-medium',
  closed:    'bg-slate-100 text-slate-600 border border-slate-200',
  escalated: 'badge-critical',
};

export function riskHeatColor(score: number): string {
  if (score >= 15) return '#EF4444';
  if (score >= 10) return '#F97316';
  if (score >= 5)  return '#F59E0B';
  return '#10B981';
}

// ─── Format ───────────────────────────────────────────────────
export function formatDate(dateString: string, opts?: Intl.DateTimeFormatOptions): string {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-IN', opts ?? {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

export function formatTime(dateString: string): string {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true
  });
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return '—';
  return `${formatDate(dateString)} ${formatTime(dateString)}`;
}

export function formatWaitTime(minutes: number): string {
  if (minutes === 0) return 'In Progress';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatNumber(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(1)}L`;
  if (n >= 1_000)      return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

// ─── Gradient ─────────────────────────────────────────────────
export const kpiGradients = [
  'kpi-blue', 'kpi-teal', 'kpi-amber', 'kpi-purple',
  'kpi-emerald', 'kpi-red', 'kpi-blue', 'kpi-teal',
];
