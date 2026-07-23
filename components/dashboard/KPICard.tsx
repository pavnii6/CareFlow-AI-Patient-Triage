'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn, kpiGradients } from '@/lib/utils';
import type { KPIData } from '@/types';

interface KPICardProps {
  data: KPIData;
  index: number;
  icon: React.ElementType;
}

// Simple animated counter
function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = 0;
    const end = value;
    const duration = 1200;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOut
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + eased * (end - start)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);

  return <>{display}</>;
}

export default function KPICard({ data, index, icon: Icon }: KPICardProps) {
  const isNumeric = typeof data.value === 'number';

  const TrendIcon =
    data.trend === 'up' ? TrendingUp :
    data.trend === 'down' ? TrendingDown : Minus;

  // For revenue/string values, we just display them directly
  const displayValue = isNumeric ? null : data.value;

  // Context: lower wait time = good (down trend = green)
  const isNegativeMetric = data.label.includes('Wait') || data.label.includes('Delay') || data.label.includes('Critical') || data.label.includes('Queue');
  const changeIsGood = isNegativeMetric ? data.change < 0 : data.change > 0;

  return (
    <div
      className={cn(
        'relative rounded-2xl p-5 text-white overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-200',
        kpiGradients[index % kpiGradients.length]
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <span className="text-white/80 text-sm font-medium">{data.label}</span>
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Icon className="w-4.5 h-4.5 text-white" />
          </div>
        </div>

        {/* Value */}
        <div className="mb-3">
          <span className="text-3xl font-bold tracking-tight">
            {isNumeric
              ? <AnimatedCounter value={data.value as number} />
              : displayValue
            }
            {data.unit === '%' && isNumeric && <span className="text-xl font-semibold opacity-80">%</span>}
          </span>
          {data.unit && data.unit !== '%' && isNumeric && (
            <span className="text-white/60 text-sm ml-1.5">{data.unit}</span>
          )}
        </div>

        {/* Change indicator */}
        <div className="flex items-center gap-1.5">
          <div className={cn(
            'flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-md',
            changeIsGood ? 'bg-white/20 text-white' : 'bg-white/10 text-white/70'
          )}>
            <TrendIcon className="w-3 h-3" />
            <span>{Math.abs(data.change)}%</span>
          </div>
          <span className="text-white/60 text-xs">vs yesterday</span>
        </div>

        {/* Target bar */}
        {data.target && typeof data.value === 'number' && (
          <div className="mt-3">
            <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/70 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (data.value / data.target) * 100)}%` }}
              />
            </div>
            <div className="text-white/50 text-[10px] mt-1">
              {data.value}/{data.target} target
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
