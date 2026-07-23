'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { GitBranch, ArrowRight, Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react';

type ProcessStep = {
  id: string;
  label: string;
  type: 'start' | 'end' | 'process' | 'decision' | 'delay';
  actor: string;
  time?: string;
  bottleneck?: boolean;
  improved?: boolean;
  tooltip?: string;
};

const ASIS_STEPS: ProcessStep[] = [
  { id: 'A1', label: 'Patient Arrives', type: 'start', actor: 'Patient' },
  { id: 'A2', label: 'Queue for Registration', type: 'delay', actor: 'Patient', time: '25 min', bottleneck: true, tooltip: 'Manual paper forms, avg 25 min wait' },
  { id: 'A3', label: 'Manual Registration', type: 'process', actor: 'Receptionist', time: '10 min' },
  { id: 'A4', label: 'Wait for Triage Nurse', type: 'delay', actor: 'Patient', time: '20 min', bottleneck: true },
  { id: 'A5', label: 'Manual Vital Assessment', type: 'process', actor: 'Triage Nurse', time: '15 min' },
  { id: 'A6', label: 'Nurse Assigns Triage Level', type: 'decision', actor: 'Triage Nurse', time: '5 min', bottleneck: true, tooltip: '23% error rate in manual triage' },
  { id: 'A7', label: 'Phone Call to Radiology', type: 'process', actor: 'Nurse', time: '10 min', bottleneck: true },
  { id: 'A8', label: 'Manual Schedule Check', type: 'process', actor: 'Radiology Staff', time: '8 min' },
  { id: 'A9', label: 'Schedule Slot (if available)', type: 'decision', actor: 'Radiology Staff', time: '5 min' },
  { id: 'A10', label: 'Wait for Diagnostic', type: 'delay', actor: 'Patient', time: '45 min', bottleneck: true },
  { id: 'A11', label: 'Diagnostic Completed', type: 'process', actor: 'Lab Tech', time: '30 min' },
  { id: 'A12', label: 'Wait for Doctor', type: 'delay', actor: 'Patient', time: '35 min', bottleneck: true },
  { id: 'A13', label: 'Doctor Consultation', type: 'process', actor: 'Doctor', time: '20 min' },
  { id: 'A14', label: 'Discharge/Admit Decision', type: 'decision', actor: 'Doctor' },
  { id: 'A15', label: 'Patient Outcome', type: 'end', actor: 'Patient' },
];

const TOBE_STEPS: ProcessStep[] = [
  { id: 'T1', label: 'Patient Arrives / QR Check-in', type: 'start', actor: 'Patient', improved: true },
  { id: 'T2', label: 'Digital Self-Registration', type: 'process', actor: 'Patient + System', time: '3 min', improved: true, tooltip: 'Mobile/kiosk registration, 88% time saving' },
  { id: 'T3', label: 'Auto Vitals Capture', type: 'process', actor: 'IoT Devices', time: '2 min', improved: true },
  { id: 'T4', label: 'AI Triage Engine Analysis', type: 'process', actor: 'CareFlow AI', time: '< 3 sec', improved: true, tooltip: '97.2% accuracy, instant risk scoring' },
  { id: 'T5', label: 'Triage Level Assigned', type: 'decision', actor: 'CareFlow AI + Nurse Review', improved: true },
  { id: 'T6', label: 'Auto Diagnostic Scheduling', type: 'process', actor: 'CareFlow Engine', time: '< 1 sec', improved: true, tooltip: 'Zero scheduling conflicts' },
  { id: 'T7', label: 'Slot Confirmed & Patient Notified', type: 'process', actor: 'System + Patient', time: '1 min', improved: true },
  { id: 'T8', label: 'Diagnostic Completed', type: 'process', actor: 'Lab Tech', time: '25 min', improved: true },
  { id: 'T9', label: 'Results in Doctor Dashboard', type: 'process', actor: 'System', time: '< 30 sec', improved: true },
  { id: 'T10', label: 'Doctor Consultation (Alert)', type: 'process', actor: 'Doctor', time: '15 min', improved: true },
  { id: 'T11', label: 'Discharge/Admit Decision', type: 'decision', actor: 'Doctor' },
  { id: 'T12', label: 'Patient Outcome', type: 'end', actor: 'Patient' },
];

type StepCardProps = { step: ProcessStep; isAsis?: boolean };

function StepCard({ step, isAsis }: StepCardProps) {
  const [showTip, setShowTip] = useState(false);

  const bgColor =
    step.type === 'start' || step.type === 'end' ? 'bg-slate-800 text-white' :
    step.bottleneck ? 'bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-800' :
    step.improved ? 'bg-green-50 dark:bg-green-900/10 border-green-300 dark:border-green-800' :
    'bg-card border-border';

  const Icon =
    step.type === 'start' || step.type === 'end' ? CheckCircle :
    step.type === 'delay' ? Clock :
    step.type === 'decision' ? GitBranch :
    ArrowRight;

  return (
    <div className="relative">
      <div
        className={cn(
          'rounded-xl border p-3 text-sm cursor-default transition-all hover:shadow-card',
          bgColor
        )}
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
      >
        <div className="flex items-start gap-2">
          <div className={cn(
            'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
            step.bottleneck ? 'bg-red-500 text-white' :
            step.improved ? 'bg-green-500 text-white' :
            step.type === 'start' || step.type === 'end' ? 'bg-white/20' :
            'bg-muted'
          )}>
            <Icon className="w-3 h-3" />
          </div>
          <div className="min-w-0">
            <div className={cn(
              'font-medium leading-tight',
              step.bottleneck ? 'text-red-800 dark:text-red-300' :
              step.improved ? 'text-green-800 dark:text-green-300' :
              step.type === 'start' || step.type === 'end' ? 'text-white' : 'text-foreground'
            )}>
              {step.label}
            </div>
            <div className={cn(
              'text-xs mt-0.5',
              step.type === 'start' || step.type === 'end' ? 'text-white/60' : 'text-muted-foreground'
            )}>
              {step.actor}
              {step.time && <span className="ml-1.5 font-semibold text-amber-600 dark:text-amber-400">{step.time}</span>}
            </div>
          </div>
          {(step.bottleneck || step.tooltip) && (
            <Info className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
          )}
        </div>
        {step.bottleneck && (
          <div className="flex items-center gap-1 mt-2 text-[10px] text-red-600 dark:text-red-400 font-medium">
            <AlertTriangle className="w-3 h-3" />
            Bottleneck
          </div>
        )}
      </div>
      {showTip && step.tooltip && (
        <div className="absolute z-20 bottom-full left-0 mb-1 w-52 bg-slate-900 text-white text-xs rounded-lg p-2.5 shadow-xl">
          {step.tooltip}
          <div className="absolute top-full left-4 w-2 h-2 bg-slate-900 rotate-45 -translate-y-1" />
        </div>
      )}
    </div>
  );
}

export default function ProcessMapPage() {
  const [view, setView] = useState<'both' | 'asis' | 'tobe'>('both');

  const asIsTime = ASIS_STEPS.reduce((acc, s) => acc + (s.time ? parseInt(s.time) : 0), 0);
  const toBeTime = TOBE_STEPS.reduce((acc, s) => acc + (s.time ? parseFloat(s.time) : 0), 0);
  const bottlenecks = ASIS_STEPS.filter(s => s.bottleneck).length;
  const improvements = TOBE_STEPS.filter(s => s.improved).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Process Maps</h1>
        <p className="text-muted-foreground text-sm mt-1">BPMN-style As-Is and To-Be patient journey workflows</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'As-Is Total Time', value: `${asIsTime} min`, color: 'text-red-600', sub: 'Current state' },
          { label: 'To-Be Total Time', value: `~${Math.round(toBeTime)} min`, color: 'text-green-600', sub: 'Future state' },
          { label: 'Bottlenecks', value: bottlenecks, color: 'text-amber-600', sub: 'Identified in As-Is' },
          { label: 'Improvements', value: improvements, color: 'text-blue-600', sub: 'Applied in To-Be' },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <div className={cn('text-2xl font-bold', s.color)}>{s.value}</div>
            <div className="text-sm font-medium text-foreground mt-0.5">{s.label}</div>
            <div className="text-xs text-muted-foreground">{s.sub}</div>
          </Card>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit">
        {(['both', 'asis', 'tobe'] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all',
              view === v ? 'bg-card text-foreground shadow-card' : 'text-muted-foreground hover:text-foreground'
            )}>
            {v === 'both' ? 'Side by Side' : v === 'asis' ? 'As-Is (Current)' : 'To-Be (Future)'}
          </button>
        ))}
      </div>

      {/* Process flow */}
      <div className={cn('grid gap-6', view === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1')}>
        {(view === 'both' || view === 'asis') && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>As-Is Process (Current State)</CardTitle>
                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 border border-red-200">{asIsTime} min avg</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {ASIS_STEPS.map((step, i) => (
                  <div key={step.id} className="flex flex-col gap-1">
                    <StepCard step={step} isAsis />
                    {i < ASIS_STEPS.length - 1 && (
                      <div className="flex justify-center">
                        <div className="w-0.5 h-3 bg-border" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {(view === 'both' || view === 'tobe') && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>To-Be Process (Future State)</CardTitle>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">~{Math.round(toBeTime)} min avg</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {TOBE_STEPS.map((step, i) => (
                  <div key={step.id} className="flex flex-col gap-1">
                    <StepCard step={step} />
                    {i < TOBE_STEPS.length - 1 && (
                      <div className="flex justify-center">
                        <div className="w-0.5 h-3 bg-border" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 flex-wrap text-xs">
        {[
          { color: 'bg-red-100 border-red-300', label: 'Bottleneck / Pain Point' },
          { color: 'bg-green-100 border-green-300', label: 'Improvement / Automation' },
          { color: 'bg-card border-border', label: 'Standard Process Step' },
          { color: 'bg-slate-800', label: 'Start / End' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-2">
            <div className={cn('w-4 h-4 rounded border', l.color)} />
            <span className="text-muted-foreground">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
