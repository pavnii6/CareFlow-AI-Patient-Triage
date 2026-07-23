'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatusBadge, PriorityBadge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { cn, formatDate, riskHeatColor } from '@/lib/utils';
import { TASKS, SPRINTS, MILESTONES, RISKS } from '@/data/pmo';
import { Briefcase, Zap, Flag, AlertTriangle, CheckCircle, TrendingUp, Target } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import type { Task } from '@/types';

const TABS = ['Sprint Board', 'Burndown', 'Milestones', 'Risk Register', 'Team Velocity'] as const;
type Tab = typeof TABS[number];

// Burndown data
const BURNDOWN = [
  { day: 'D1', ideal: 52, actual: 52 },
  { day: 'D2', ideal: 48, actual: 50 },
  { day: 'D3', ideal: 44, actual: 47 },
  { day: 'D4', ideal: 40, actual: 44 },
  { day: 'D5', ideal: 36, actual: 42 },
  { day: 'D6', ideal: 32, actual: 38 },
  { day: 'D7', ideal: 28, actual: 35 },
  { day: 'D8', ideal: 24, actual: 30 },
  { day: 'D9', ideal: 20, actual: 28 },
  { day: 'D10', ideal: 14, actual: null },
  { day: 'D11', ideal: 8, actual: null },
  { day: 'D12', ideal: 0, actual: null },
];

const VELOCITY_DATA = SPRINTS.slice(0, 4).map(s => ({
  name: s.name.replace('Sprint ', 'S'),
  completed: s.completedPoints,
  committed: s.totalPoints,
}));

const SPRINT = SPRINTS.find(s => s.status === 'active')!;
const SPRINT_TASKS = TASKS.filter(t => t.sprint === SPRINT?.id);

const KANBAN_COLS: { id: Task['status']; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'blocked', label: 'Blocked' },
  { id: 'done', label: 'Done' },
];

// 5×5 heat map cells
const HEAT_MATRIX = Array.from({ length: 5 }, (_, i) =>
  Array.from({ length: 5 }, (_, j) => {
    const prob = i + 1; const impact = j + 1;
    const score = prob * impact;
    const risks = RISKS.filter(r => r.probability === prob && r.impact === impact);
    return { prob, impact, score, risks };
  })
);

export default function PMOPage() {
  const [tab, setTab] = useState<Tab>('Sprint Board');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">PMO Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Project governance, sprint tracking, milestones, and risk management</p>
      </div>

      {/* Sprint health banner */}
      <div className="rounded-2xl kpi-blue text-white p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-lg">{SPRINT.name}</div>
          <div className="text-white/70 text-sm">{SPRINT.goal}</div>
        </div>
        <div className="flex gap-6">
          {[
            { label: 'Progress', value: `${SPRINT.completedPoints}/${SPRINT.totalPoints} pts` },
            { label: 'Ends', value: formatDate(SPRINT.endDate) },
            { label: 'Velocity', value: `${Math.round(SPRINT.completedPoints / 8)} pts/day` },
          ].map(s => (
            <div key={s.label} className="text-right">
              <div className="text-white/60 text-xs">{s.label}</div>
              <div className="font-bold">{s.value}</div>
            </div>
          ))}
        </div>
        <div className="w-full sm:w-32">
          <div className="text-white/60 text-xs mb-1">{Math.round((SPRINT.completedPoints / SPRINT.totalPoints) * 100)}% Complete</div>
          <div className="h-2 bg-white/20 rounded-full">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${(SPRINT.completedPoints / SPRINT.totalPoints) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab === t ? 'bg-card text-foreground shadow-card' : 'text-muted-foreground hover:text-foreground'
            )}>
            {t}
          </button>
        ))}
      </div>

      {/* Sprint Board */}
      {tab === 'Sprint Board' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {KANBAN_COLS.map(col => {
            const tasks = SPRINT_TASKS.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-sm font-semibold text-muted-foreground">{col.label}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{tasks.length}</span>
                </div>
                <div className="space-y-2 min-h-[200px]">
                  {tasks.map(task => (
                    <div key={task.id} className="p-3 rounded-xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-mono text-[10px] text-muted-foreground">{task.id}</span>
                        <PriorityBadge priority={task.priority} />
                      </div>
                      <div className="text-sm font-medium text-foreground mb-2 leading-snug">{task.title}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{task.assignee.split(' ')[0]}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium">
                          {task.storyPoints} pts
                        </span>
                      </div>
                      {task.dependencies && task.dependencies.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {task.dependencies.map(d => (
                            <span key={d} className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                              Dep: {d}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Burndown */}
      {tab === 'Burndown' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle>Sprint Burndown — {SPRINT.name}</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={BURNDOWN}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  <Legend iconType="circle" iconSize={8} />
                  <Line type="monotone" dataKey="ideal" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Ideal Burndown" />
                  <Line type="monotone" dataKey="actual" stroke="#0D6EFD" strokeWidth={2.5} dot={{ r: 3, fill: '#0D6EFD' }} connectNulls={false} name="Actual" />
                  <ReferenceLine y={0} stroke="#10B981" strokeDasharray="3 3" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Team Velocity History</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={VELOCITY_DATA} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  <Legend iconType="circle" iconSize={8} />
                  <Bar dataKey="committed" fill="#CBD5E1" radius={[4,4,0,0]} name="Committed" />
                  <Bar dataKey="completed" fill="#0D6EFD" radius={[4,4,0,0]} name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Milestones */}
      {tab === 'Milestones' && (
        <Card>
          <CardHeader><CardTitle>Project Milestones</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MILESTONES.map((m, i) => (
                <div key={m.id} className="flex items-start gap-4">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                    m.status === 'completed' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' :
                    m.status === 'on_track' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' :
                    m.status === 'at_risk' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' :
                    m.status === 'delayed' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                    'bg-muted text-muted-foreground'
                  )}>
                    {m.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <Flag className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-semibold text-foreground">{m.name}</div>
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full border font-medium',
                        m.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                        m.status === 'on_track' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        m.status === 'at_risk' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        m.status === 'delayed' ? 'bg-red-100 text-red-700 border-red-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      )}>
                        {m.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                      <span>Due: {formatDate(m.dueDate)}</span>
                      <span>Owner: {m.owner}</span>
                    </div>
                    <Progress value={m.progress} size="sm" showLabel
                      color={m.status === 'completed' ? 'bg-green-500' : m.status === 'delayed' ? 'bg-red-500' : 'bg-blue-500'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Register */}
      {tab === 'Risk Register' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Heat map */}
          <Card>
            <CardHeader><CardTitle>Risk Heat Map</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex gap-1 mb-1 ml-6">
                  {[1,2,3,4,5].map(i => <div key={i} className="flex-1 text-center text-[10px] text-muted-foreground">{i}</div>)}
                </div>
                <div className="text-[10px] text-muted-foreground text-center mb-1">Impact →</div>
                {[5,4,3,2,1].map(prob => (
                  <div key={prob} className="flex items-center gap-1">
                    <div className="text-[10px] text-muted-foreground w-5 text-center">{prob}</div>
                    {[1,2,3,4,5].map(impact => {
                      const cell = HEAT_MATRIX[prob-1][impact-1];
                      return (
                        <div key={impact}
                          className="flex-1 aspect-square rounded-lg flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ backgroundColor: riskHeatColor(cell.score) }}
                          title={cell.risks.map(r => r.title).join(', ') || `Score: ${cell.score}`}
                        >
                          {cell.risks.length > 0 ? cell.risks.length : ''}
                        </div>
                      );
                    })}
                  </div>
                ))}
                <div className="text-[10px] text-muted-foreground text-right mt-1">← Probability</div>
                <div className="flex gap-3 mt-3 flex-wrap">
                  {[{ color: '#EF4444', label: 'Critical (≥15)' }, { color: '#F97316', label: 'High (10-14)' }, { color: '#F59E0B', label: 'Medium (5-9)' }, { color: '#10B981', label: 'Low (<5)' }].map(l => (
                    <div key={l.label} className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: l.color }} />
                      <span className="text-[10px] text-muted-foreground">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk list */}
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Risk Register</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="cf-table">
                <thead>
                  <tr>
                    <th>Risk</th>
                    <th>Category</th>
                    <th>Score</th>
                    <th>Owner</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {RISKS.sort((a, b) => b.score - a.score).map(r => (
                    <tr key={r.id}>
                      <td>
                        <div className="font-medium text-sm text-foreground">{r.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{r.mitigation}</div>
                      </td>
                      <td><span className="text-xs text-muted-foreground">{r.category}</span></td>
                      <td>
                        <span className="font-bold text-sm" style={{ color: riskHeatColor(r.score) }}>{r.score}</span>
                        <div className="text-[10px] text-muted-foreground">{r.probability}×{r.impact}</div>
                      </td>
                      <td><span className="text-xs text-muted-foreground">{r.owner}</span></td>
                      <td>
                        <span className={cn(
                          'text-xs px-2 py-0.5 rounded-full font-medium border',
                          r.status === 'open' ? 'badge-high' :
                          r.status === 'mitigated' ? 'badge-low' :
                          r.status === 'escalated' ? 'badge-critical' :
                          'bg-slate-100 text-slate-600 border-slate-200'
                        )}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Team Velocity */}
      {tab === 'Team Velocity' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle>Sprint Velocity</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={VELOCITY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                  <Legend />
                  <Bar dataKey="committed" fill="#CBD5E1" radius={[4,4,0,0]} name="Committed" />
                  <Bar dataKey="completed" fill="#10B981" radius={[4,4,0,0]} name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Task summary */}
          <Card>
            <CardHeader><CardTitle>Task Distribution</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: 'Done', count: TASKS.filter(t => t.status === 'done').length, color: 'bg-green-500' },
                  { label: 'In Progress', count: TASKS.filter(t => t.status === 'in_progress').length, color: 'bg-blue-500' },
                  { label: 'To Do', count: TASKS.filter(t => t.status === 'todo').length, color: 'bg-slate-400' },
                  { label: 'Blocked', count: TASKS.filter(t => t.status === 'blocked').length, color: 'bg-red-500' },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-3">
                    <div className={cn('w-2 h-2 rounded-full', s.color)} />
                    <span className="text-sm text-muted-foreground flex-1">{s.label}</span>
                    <span className="font-semibold text-foreground">{s.count}</span>
                    <div className="w-24">
                      <Progress value={s.count} max={TASKS.length} size="sm" color={s.color} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { label: 'Total Story Points', value: TASKS.reduce((a, t) => a + (t.storyPoints ?? 0), 0) },
                  { label: 'Completed Points', value: TASKS.filter(t => t.status === 'done').reduce((a, t) => a + (t.storyPoints ?? 0), 0) },
                  { label: 'Blocked Items', value: TASKS.filter(t => t.status === 'blocked').length },
                  { label: 'Active Sprints', value: SPRINTS.filter(s => s.status === 'active').length },
                ].map(m => (
                  <div key={m.label} className="p-3 rounded-xl bg-muted/50 border border-border text-center">
                    <div className="text-xl font-bold text-foreground">{m.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
