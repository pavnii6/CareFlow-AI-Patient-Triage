'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/lib/utils';
import { GANTT_TASKS } from '@/data/pmo';
import { Flag, Milestone } from 'lucide-react';

const PHASES = ['Planning', 'Design', 'Development', 'Testing', 'Deployment'];
const PHASE_COLORS: Record<string, string> = {
  Planning:   'bg-purple-500',
  Design:     'bg-blue-500',
  Development:'bg-teal-500',
  Testing:    'bg-amber-500',
  Deployment: 'bg-green-500',
};

// Project start/end
const PROJECT_START = new Date('2024-06-01');
const PROJECT_END   = new Date('2024-09-05');
const TOTAL_DAYS    = Math.ceil((PROJECT_END.getTime() - PROJECT_START.getTime()) / 86400000);

function dayOffset(dateStr: string) {
  return Math.max(0, Math.ceil((new Date(dateStr).getTime() - PROJECT_START.getTime()) / 86400000));
}
function taskWidth(start: string, end: string) {
  const s = dayOffset(start);
  const e = dayOffset(end);
  return Math.max(1, e - s);
}

// Generate week headers
const weeks: { label: string; offset: number }[] = [];
let d = new Date(PROJECT_START);
while (d <= PROJECT_END) {
  weeks.push({ label: `${d.toLocaleDateString('en-GB', { day:'2-digit', month:'short' })}`, offset: dayOffset(d.toISOString()) });
  d = new Date(d.getTime() + 7 * 86400000);
}

export default function GanttPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gantt Chart</h1>
        <p className="text-muted-foreground text-sm mt-1">Interactive project timeline with critical path and milestone tracking</p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 flex-wrap">
        {PHASES.map(p => (
          <div key={p} className="flex items-center gap-2">
            <div className={cn('w-3 h-3 rounded-sm', PHASE_COLORS[p])} />
            <span className="text-xs text-muted-foreground">{p}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm border-2 border-red-500 bg-red-100" />
          <span className="text-xs text-muted-foreground">Critical Path</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rotate-45 bg-purple-600" />
          <span className="text-xs text-muted-foreground">Milestone</span>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <div style={{ minWidth: 900 }}>
            {/* Week header */}
            <div className="flex border-b border-border">
              <div className="w-64 flex-shrink-0 px-4 py-2 text-xs font-semibold text-muted-foreground bg-muted/50 border-r border-border">Task</div>
              <div className="flex-1 relative bg-muted/20">
                <div className="flex h-full">
                  {weeks.map((w, i) => (
                    <div key={i}
                      className="text-[10px] text-muted-foreground py-2 px-1 border-r border-border/50 flex-shrink-0"
                      style={{ width: `${(7 / TOTAL_DAYS) * 100}%`, minWidth: 60 }}
                    >
                      {w.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Phase groups */}
            {PHASES.map(phase => {
              const tasks = GANTT_TASKS.filter(t => t.phase === phase);
              if (!tasks.length) return null;
              return (
                <div key={phase}>
                  <div className="flex border-b border-border bg-muted/30">
                    <div className="w-64 flex-shrink-0 px-4 py-1.5 border-r border-border">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-2 h-2 rounded-sm', PHASE_COLORS[phase])} />
                        <span className="text-xs font-bold text-foreground">{phase}</span>
                      </div>
                    </div>
                    <div className="flex-1" />
                  </div>

                  {tasks.map(task => {
                    const left = (dayOffset(task.start) / TOTAL_DAYS) * 100;
                    const width = (taskWidth(task.start, task.end) / TOTAL_DAYS) * 100;
                    return (
                      <div key={task.id} className="flex border-b border-border/50 hover:bg-muted/20 transition-colors" style={{ height: 44 }}>
                        <div className="w-64 flex-shrink-0 px-4 flex items-center border-r border-border">
                          <div className="min-w-0">
                            <div className={cn(
                              'text-xs font-medium truncate',
                              task.isCritical ? 'text-red-600 dark:text-red-400' : 'text-foreground'
                            )}>
                              {task.isMilestone && <span className="mr-1">◆</span>}
                              {task.name}
                            </div>
                            {task.assignee && (
                              <div className="text-[10px] text-muted-foreground">{task.assignee}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 relative">
                          <div
                            className="absolute top-2 h-7 rounded-md flex items-center px-2 overflow-hidden cursor-pointer"
                            style={{
                              left: `${left}%`,
                              width: `${Math.max(width, 1)}%`,
                              minWidth: task.isMilestone ? 12 : 24,
                            }}
                          >
                            {task.isMilestone ? (
                              <div className="w-4 h-4 rotate-45 mx-auto"
                                style={{ backgroundColor: PHASE_COLORS[phase] }} />
                            ) : (
                              <div className={cn(
                                'w-full h-full rounded-md relative overflow-hidden',
                                task.isCritical ? 'ring-2 ring-red-400 ring-offset-0' : '',
                              )} style={{ backgroundColor: PHASE_COLORS[phase] + '33' }}>
                                <div
                                  className="h-full rounded-l-md transition-all"
                                  style={{
                                    width: `${task.progress}%`,
                                    backgroundColor: PHASE_COLORS[phase].replace('bg-', '').includes('-')
                                      ? undefined : PHASE_COLORS[phase],
                                    background: task.isCritical ? '#EF444466' : PHASE_COLORS[phase].replace('bg-', '')
                                  }}
                                />
                                <span className="absolute inset-0 flex items-center px-1.5 text-[10px] font-medium text-foreground">
                                  {task.progress > 20 ? `${task.progress}%` : ''}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Summary table */}
      <Card>
        <CardHeader><CardTitle>Task Summary</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="cf-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Phase</th>
                <th>Start</th>
                <th>End</th>
                <th>Progress</th>
                <th>Assignee</th>
                <th>Flags</th>
              </tr>
            </thead>
            <tbody>
              {GANTT_TASKS.map(t => (
                <tr key={t.id}>
                  <td>
                    <span className={cn('text-sm font-medium', t.isCritical ? 'text-red-600 dark:text-red-400' : 'text-foreground')}>
                      {t.isMilestone && '◆ '}{t.name}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <div className={cn('w-2 h-2 rounded-sm', PHASE_COLORS[t.phase])} />
                      <span className="text-xs text-muted-foreground">{t.phase}</span>
                    </div>
                  </td>
                  <td><span className="text-xs text-muted-foreground">{t.start}</span></td>
                  <td><span className="text-xs text-muted-foreground">{t.end}</span></td>
                  <td>
                    <div className="flex items-center gap-2 min-w-[80px]">
                      <Progress value={t.progress} size="sm" className="w-16" />
                      <span className="text-xs text-muted-foreground">{t.progress}%</span>
                    </div>
                  </td>
                  <td><span className="text-xs text-muted-foreground">{t.assignee ?? '—'}</span></td>
                  <td>
                    <div className="flex gap-1">
                      {t.isCritical && <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Critical</span>}
                      {t.isMilestone && <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Milestone</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
