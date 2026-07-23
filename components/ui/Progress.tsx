import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  trackClass?: string;
  barClass?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  color?: string;
}

export function Progress({
  value,
  max = 100,
  className,
  trackClass,
  barClass,
  size = 'md',
  showLabel,
  color,
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const heights: Record<string, string> = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  function defaultColor(p: number) {
    if (p >= 90) return 'bg-red-500';
    if (p >= 70) return 'bg-amber-500';
    if (p >= 40) return 'bg-blue-500';
    return 'bg-green-500';
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('flex-1 rounded-full bg-muted overflow-hidden', heights[size], trackClass)}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            color ?? defaultColor(pct),
            barClass
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-muted-foreground w-9 text-right">{Math.round(pct)}%</span>
      )}
    </div>
  );
}
