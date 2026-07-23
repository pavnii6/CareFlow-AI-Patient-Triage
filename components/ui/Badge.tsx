import { cn } from '@/lib/utils';
import type { TriageLevel, TaskStatus, Priority } from '@/types';
import { triageBadgeClass, triageLabel, statusBadgeClass, statusLabel, priorityBadgeClass } from '@/lib/utils';

interface BadgeProps {
  className?: string;
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'secondary';
}

export function Badge({ className, children, variant = 'default' }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      variant === 'default' && 'bg-primary/10 text-primary border-primary/20',
      variant === 'outline' && 'bg-transparent border-border text-muted-foreground',
      variant === 'secondary' && 'bg-secondary text-secondary-foreground border-transparent',
      className
    )}>
      {children}
    </span>
  );
}

export function TriageBadge({ level }: { level: TriageLevel }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border',
      triageBadgeClass[level]
    )}>
      <span className={cn(
        'w-1.5 h-1.5 rounded-full',
        level === 'critical' && 'bg-red-500 animate-pulse',
        level === 'high' && 'bg-orange-500',
        level === 'medium' && 'bg-amber-500',
        level === 'low' && 'bg-green-500',
      )} />
      {triageLabel[level]}
    </span>
  );
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      statusBadgeClass[status]
    )}>
      {statusLabel[status]}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
      priorityBadgeClass[priority]
    )}>
      <span className={cn(
        'w-1.5 h-1.5 rounded-full',
        priority === 'critical' && 'bg-red-500',
        priority === 'high' && 'bg-orange-500',
        priority === 'medium' && 'bg-amber-500',
        priority === 'low' && 'bg-green-500',
      )} />
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}
