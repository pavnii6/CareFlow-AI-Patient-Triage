'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { cn, formatTime } from '@/lib/utils';
import { MACHINE_UTILIZATION } from '@/data/analytics';
import { PATIENTS } from '@/data/patients';
import { Microscope, Clock, CheckCircle, AlertTriangle, Calendar, ChevronRight } from 'lucide-react';

// Generate schedule slots
const generateSlots = () => {
  const slots = [];
  const types = ['MRI', 'CT Scan', 'X-Ray', 'Blood Test', 'Ultrasound', 'ECG'];
  const patients = PATIENTS.slice(0, 8);
  const base = new Date('2024-07-20T08:00:00');
  let t = new Date(base);
  for (let i = 0; i < 16; i++) {
    const p = patients[i % patients.length];
    const type = types[i % types.length];
    const duration = type === 'MRI' ? 45 : type === 'CT Scan' ? 30 : type === 'Blood Test' ? 15 : 20;
    const status = t < new Date('2024-07-20T11:00:00') ? 'completed' :
      t < new Date('2024-07-20T12:00:00') ? 'in_progress' : 'scheduled';
    slots.push({
      id: `SL${String(i+1).padStart(3,'0')}`, type, patient: p.name, patientId: p.id,
      start: new Date(t).toISOString(), duration,
      end: new Date(t.getTime() + duration * 60000).toISOString(),
      status, machine: `${type.replace(' ','-').toUpperCase()}-0${(i % 2)+1}`,
      department: p.department ?? 'General',
    });
    t = new Date(t.getTime() + (duration + 5) * 60000);
  }
  return slots;
};

const SLOTS = generateSlots();

const HOURS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];
const MACHINES = ['MRI-01','MRI-02','CT-01','CT-02','XRAY-01','XRAY-02','USG-01'];

const STATUS_COLORS: Record<string, string> = {
  completed:   'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400',
  in_progress: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400',
  scheduled:   'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300',
  cancelled:   'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400',
};

export default function DiagnosticsPage() {
  const [view, setView] = useState<'timeline' | 'list'>('timeline');

  const stats = [
    { label: 'Scheduled Today', value: 64, icon: Calendar, color: 'text-blue-600' },
    { label: 'Completed', value: 38, icon: CheckCircle, color: 'text-green-600' },
    { label: 'In Progress', value: 6, icon: Clock, color: 'text-amber-600' },
    { label: 'Pending', value: 20, icon: AlertTriangle, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Diagnostic Allocation Engine</h1>
          <p className="text-muted-foreground text-sm mt-1">AI-optimised scheduling for radiology, lab, and specialist consultations</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('timeline')}
            className={cn('px-3 py-2 rounded-lg text-sm font-medium transition-colors', view === 'timeline' ? 'kpi-blue text-white' : 'bg-muted text-muted-foreground hover:bg-accent')}
          >
            Timeline
          </button>
          <button
            onClick={() => setView('list')}
            className={cn('px-3 py-2 rounded-lg text-sm font-medium transition-colors', view === 'list' ? 'kpi-blue text-white' : 'bg-muted text-muted-foreground hover:bg-accent')}
          >
            List View
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl bg-muted flex items-center justify-center', s.color)}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Machine utilization */}
      <Card>
        <CardHeader><CardTitle>Machine Status & Utilization</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {MACHINE_UTILIZATION.map(m => (
              <div key={m.name} className="p-4 rounded-xl bg-muted/40 border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold text-sm text-foreground">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.type}</div>
                  </div>
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full font-medium border',
                    m.status === 'operational' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
                  )}>
                    {m.status}
                  </span>
                </div>
                <Progress value={m.utilization} size="sm" showLabel
                  color={m.utilization >= 90 ? 'bg-red-500' : m.utilization >= 75 ? 'bg-amber-500' : 'bg-blue-500'}
                />
                <div className="text-xs text-muted-foreground mt-2">{m.scheduledToday} scheduled today</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schedule */}
      {view === 'timeline' ? (
        <Card>
          <CardHeader><CardTitle>Today&apos;s Schedule Timeline</CardTitle></CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Time header */}
              <div className="grid border-b border-border" style={{ gridTemplateColumns: '100px repeat(9, 1fr)' }}>
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted/50">Machine</div>
                {HOURS.slice(0, 9).map(h => (
                  <div key={h} className="px-2 py-2 text-xs font-medium text-muted-foreground text-center bg-muted/50 border-l border-border">{h}</div>
                ))}
              </div>
              {/* Machine rows */}
              {MACHINES.map(machine => {
                const mSlots = SLOTS.filter(s => s.machine === machine || (machine.startsWith('XRAY') && s.type === 'X-Ray') || (machine.startsWith('MRI') && s.type === 'MRI') || (machine.startsWith('CT') && s.type === 'CT Scan') || (machine.startsWith('USG') && s.type === 'Ultrasound'));
                return (
                  <div key={machine} className="grid border-b border-border hover:bg-muted/20 transition-colors" style={{ gridTemplateColumns: '100px repeat(9, 1fr)', minHeight: 56 }}>
                    <div className="px-3 py-2 flex items-center text-xs font-semibold text-foreground border-r border-border">
                      {machine}
                    </div>
                    <div className="col-span-9 relative px-1 py-1">
                      {mSlots.slice(0, 3).map((s, i) => (
                        <div key={s.id}
                          className={cn(
                            'absolute top-1 h-10 rounded-lg flex items-center px-2 text-xs font-medium border overflow-hidden',
                            STATUS_COLORS[s.status]
                          )}
                          style={{ left: `${i * 33}%`, width: '32%' }}
                          title={`${s.patient} — ${s.type}`}
                        >
                          <div className="truncate">
                            <div className="font-semibold truncate">{s.patient.split(' ')[0]}</div>
                            <div className="opacity-70 truncate">{s.type}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader><CardTitle>Scheduled Appointments</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="cf-table">
              <thead>
                <tr>
                  <th>Slot ID</th>
                  <th>Patient</th>
                  <th>Diagnostic Type</th>
                  <th>Machine</th>
                  <th>Time</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody>
                {SLOTS.map(s => (
                  <tr key={s.id}>
                    <td><span className="font-mono text-xs text-muted-foreground">{s.id}</span></td>
                    <td>
                      <div className="font-medium text-sm text-foreground">{s.patient}</div>
                    </td>
                    <td><span className="text-sm">{s.type}</span></td>
                    <td><span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">{s.machine}</span></td>
                    <td><span className="text-xs text-muted-foreground">{formatTime(s.start)}</span></td>
                    <td><span className="text-xs">{s.duration} min</span></td>
                    <td>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium border', STATUS_COLORS[s.status])}>
                        {s.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td><span className="text-xs text-muted-foreground">{s.department}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
