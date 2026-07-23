'use client';
import { useState } from 'react';
import { PATIENTS } from '@/data/patients';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { TriageBadge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { cn, formatDateTime, formatWaitTime } from '@/lib/utils';
import {
  Search, Filter, Plus, ChevronDown, Eye, Activity,
  Users, AlertTriangle, Clock, CheckCircle, Heart, Thermometer
} from 'lucide-react';
import type { Patient, TriageLevel, PatientStatus } from '@/types';

const STATUS_LABELS: Record<PatientStatus, string> = {
  waiting: 'Waiting', in_triage: 'In Triage', in_diagnostics: 'In Diagnostics',
  with_doctor: 'With Doctor', admitted: 'Admitted', discharged: 'Discharged', transferred: 'Transferred'
};

const STATUS_COLORS: Record<PatientStatus, string> = {
  waiting: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  in_triage: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  in_diagnostics: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  with_doctor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  admitted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  discharged: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  transferred: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

const SUMMARY = [
  { label: 'Total Today', value: PATIENTS.length, icon: Users, color: 'text-blue-600' },
  { label: 'Critical', value: PATIENTS.filter(p => p.triageLevel === 'critical').length, icon: AlertTriangle, color: 'text-red-600' },
  { label: 'Waiting', value: PATIENTS.filter(p => p.status === 'waiting').length, icon: Clock, color: 'text-amber-600' },
  { label: 'Discharged', value: PATIENTS.filter(p => p.status === 'discharged').length, icon: CheckCircle, color: 'text-green-600' },
];

export default function PatientsPage() {
  const [search, setSearch] = useState('');
  const [triageFilter, setTriageFilter] = useState<TriageLevel | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<PatientStatus | 'all'>('all');
  const [selected, setSelected] = useState<Patient | null>(null);

  const filtered = PATIENTS.filter(p => {
    const matchSearch = search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.mrn.toLowerCase().includes(search.toLowerCase()) ||
      p.department?.toLowerCase().includes(search.toLowerCase());
    const matchTriage = triageFilter === 'all' || p.triageLevel === triageFilter;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchTriage && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patient Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Register, track, and manage patient flow across all departments</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl kpi-blue text-white text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          Register Patient
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {SUMMARY.map(s => (
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Main table */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name, MRN, department..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-muted rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              {/* Triage filter */}
              <select
                value={triageFilter}
                onChange={e => setTriageFilter(e.target.value as any)}
                className="px-3 py-2 text-sm bg-muted rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
              >
                <option value="all">All Levels</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 text-sm bg-muted rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
              >
                <option value="all">All Status</option>
                {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="cf-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Vitals</th>
                    <th>Triage</th>
                    <th>Status</th>
                    <th>Department</th>
                    <th>Wait</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr
                      key={p.id}
                      className={cn('cursor-pointer', selected?.id === p.id && 'bg-primary/5')}
                      onClick={() => setSelected(p === selected ? null : p)}
                    >
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0',
                            p.triageLevel === 'critical' ? 'bg-red-500' :
                            p.triageLevel === 'high' ? 'bg-orange-500' :
                            p.triageLevel === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                          )}>
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-foreground text-sm">{p.name}</div>
                            <div className="text-xs text-muted-foreground">{p.mrn} · {p.age}y {p.gender[0]}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-xs space-y-0.5">
                          <div className="text-muted-foreground">BP: <span className="text-foreground font-medium">{p.vitals.bloodPressure}</span></div>
                          <div className="text-muted-foreground">HR: <span className={cn('font-medium', p.vitals.heartRate > 100 ? 'text-red-600' : 'text-foreground')}>{p.vitals.heartRate} bpm</span></div>
                          <div className="text-muted-foreground">SpO₂: <span className={cn('font-medium', p.vitals.oxygenSaturation < 95 ? 'text-red-600' : 'text-foreground')}>{p.vitals.oxygenSaturation}%</span></div>
                        </div>
                      </td>
                      <td>
                        <TriageBadge level={p.triageLevel} />
                        <div className="text-xs text-muted-foreground mt-1">Score: {p.triageScore}</div>
                      </td>
                      <td>
                        <span className={cn('text-xs px-2 py-1 rounded-full font-medium', STATUS_COLORS[p.status])}>
                          {STATUS_LABELS[p.status]}
                        </span>
                      </td>
                      <td>
                        <div className="text-sm text-foreground">{p.department ?? '—'}</div>
                        <div className="text-xs text-muted-foreground">{p.assignedDoctor?.replace('Dr. ', '') ?? '—'}</div>
                      </td>
                      <td>
                        <span className={cn(
                          'text-xs font-medium',
                          p.estimatedWaitTime === 0 ? 'text-green-600' :
                          p.estimatedWaitTime <= 15 ? 'text-red-600' :
                          p.estimatedWaitTime <= 30 ? 'text-amber-600' : 'text-muted-foreground'
                        )}>
                          {formatWaitTime(p.estimatedWaitTime)}
                        </span>
                      </td>
                      <td>
                        <Eye className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-border text-xs text-muted-foreground">
              Showing {filtered.length} of {PATIENTS.length} patients
            </div>
          </CardContent>
        </Card>

        {/* Patient detail panel */}
        <div>
          {selected ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-bold',
                    selected.triageLevel === 'critical' ? 'bg-red-500' :
                    selected.triageLevel === 'high' ? 'bg-orange-500' : 'kpi-blue'
                  )}>
                    {selected.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle>{selected.name}</CardTitle>
                    <div className="text-xs text-muted-foreground">{selected.mrn}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <TriageBadge level={selected.triageLevel} />
                  <span className={cn('text-xs px-2 py-1 rounded-full font-medium', STATUS_COLORS[selected.status])}>
                    {STATUS_LABELS[selected.status]}
                  </span>
                </div>

                {/* Demographics */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ['Age', `${selected.age} years`],
                    ['Gender', selected.gender],
                    ['Blood Group', selected.bloodGroup ?? '—'],
                    ['Admitted', formatDateTime(selected.admissionDate).split(',')[0] ?? '—'],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <div className="text-muted-foreground text-xs">{label}</div>
                      <div className="font-medium text-foreground">{val}</div>
                    </div>
                  ))}
                </div>

                {/* Vitals */}
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Vitals</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Blood Pressure', value: selected.vitals.bloodPressure, unit: 'mmHg', alert: false },
                      { label: 'Heart Rate', value: `${selected.vitals.heartRate}`, unit: 'bpm', alert: selected.vitals.heartRate > 100 },
                      { label: 'Temperature', value: `${selected.vitals.temperature}`, unit: '°C', alert: selected.vitals.temperature > 38 },
                      { label: 'SpO₂', value: `${selected.vitals.oxygenSaturation}`, unit: '%', alert: selected.vitals.oxygenSaturation < 95 },
                    ].map(v => (
                      <div key={v.label} className={cn(
                        'p-2.5 rounded-lg',
                        v.alert ? 'bg-red-50 dark:bg-red-900/10' : 'bg-muted/50'
                      )}>
                        <div className="text-[10px] text-muted-foreground">{v.label}</div>
                        <div className={cn('font-bold text-sm', v.alert ? 'text-red-600' : 'text-foreground')}>
                          {v.value} <span className="font-normal text-xs text-muted-foreground">{v.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Symptoms */}
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Symptoms</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.symptoms.map(s => (
                      <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Score */}
                <div className="p-3 rounded-xl bg-muted/50 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-muted-foreground">AI Risk Score</span>
                    <span className="text-xs text-muted-foreground">{selected.confidenceScore}% confidence</span>
                  </div>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-2xl font-bold text-foreground">{selected.triageScore}</span>
                    <span className="text-sm text-muted-foreground mb-0.5">/100</span>
                  </div>
                  <Progress value={selected.triageScore} size="sm"
                    color={selected.triageLevel === 'critical' ? 'bg-red-500' : selected.triageLevel === 'high' ? 'bg-orange-500' : 'bg-amber-500'}
                  />
                </div>

                {/* Recommended diagnostics */}
                {selected.recommendedDiagnostics && selected.recommendedDiagnostics.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Recommended Diagnostics</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.recommendedDiagnostics.map(d => (
                        <span key={d} className="text-xs px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                          {d.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selected.notes && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30">
                    <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">Clinical Notes</div>
                    <p className="text-xs text-amber-800 dark:text-amber-300">{selected.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <div className="text-sm font-medium text-foreground">Select a patient</div>
              <div className="text-xs text-muted-foreground mt-1">Click any row to view full patient details</div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
