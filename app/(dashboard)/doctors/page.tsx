'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { TriageBadge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/lib/utils';
import { DOCTORS } from '@/data/doctors';
import { PATIENTS } from '@/data/patients';
import { Stethoscope, Star, Users, Clock, CheckCircle, Filter } from 'lucide-react';
import type { Doctor } from '@/types';

const AVAIL_COLORS: Record<string, string> = {
  available: 'bg-green-500',
  busy: 'bg-amber-500',
  off_duty: 'bg-slate-400',
};
const AVAIL_LABELS: Record<string, string> = {
  available: 'Available',
  busy: 'Busy',
  off_duty: 'Off Duty',
};

export default function DoctorsPage() {
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [filter, setFilter] = useState<'all' | 'available' | 'busy'>('all');

  const filtered = DOCTORS.filter(d => filter === 'all' || d.availability === filter);
  const assignedPatients = selected
    ? PATIENTS.filter(p => p.assignedDoctor === selected.name)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Doctor Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage clinical assignments and patient priority queues</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'available', 'busy'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize',
                filter === f ? 'kpi-blue text-white' : 'bg-muted text-muted-foreground hover:bg-accent'
              )}>
              {f === 'all' ? 'All Doctors' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {[
          { label: 'Total', value: DOCTORS.length, color: 'text-blue-600' },
          { label: 'Available', value: DOCTORS.filter(d => d.availability === 'available').length, color: 'text-green-600' },
          { label: 'Busy', value: DOCTORS.filter(d => d.availability === 'busy').length, color: 'text-amber-600' },
          { label: 'Off Duty', value: DOCTORS.filter(d => d.availability === 'off_duty').length, color: 'text-slate-500' },
          { label: 'Avg Rating', value: (DOCTORS.reduce((a, d) => a + d.rating, 0) / DOCTORS.length).toFixed(1), color: 'text-purple-600' },
          { label: 'Consultations', value: DOCTORS.reduce((a, d) => a + d.consultations, 0), color: 'text-teal-600' },
        ].map(s => (
          <Card key={s.label} className="p-4 text-center">
            <div className={cn('text-2xl font-bold', s.color)}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doctor grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(doctor => (
            <Card
              key={doctor.id}
              hover
              className={cn('cursor-pointer', selected?.id === doctor.id && 'ring-2 ring-primary')}
              onClick={() => setSelected(doctor === selected ? null : doctor)}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl kpi-blue flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {doctor.name.split(' ').slice(1).map(n => n[0]).join('').slice(0,2)}
                    </div>
                    <span className={cn(
                      'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card',
                      AVAIL_COLORS[doctor.availability]
                    )} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground truncate">{doctor.name}</div>
                    <div className="text-sm text-muted-foreground">{doctor.specialization}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-medium text-foreground">{doctor.rating}</span>
                      <span className="text-xs text-muted-foreground">· {doctor.yearsExperience}y exp</span>
                    </div>
                  </div>
                  <span className={cn(
                    'ml-auto text-xs px-2 py-1 rounded-full border font-medium flex-shrink-0',
                    doctor.availability === 'available' ? 'bg-green-100 text-green-700 border-green-200' :
                    doctor.availability === 'busy' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                    'bg-slate-100 text-slate-600 border-slate-200'
                  )}>
                    {AVAIL_LABELS[doctor.availability]}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Patient load</span>
                    <span className="font-medium text-foreground">{doctor.currentPatients}/{doctor.maxPatients}</span>
                  </div>
                  <Progress
                    value={doctor.currentPatients}
                    max={doctor.maxPatients}
                    size="sm"
                    color={doctor.currentPatients >= doctor.maxPatients ? 'bg-red-500' : doctor.currentPatients >= doctor.maxPatients * 0.7 ? 'bg-amber-500' : 'bg-green-500'}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{doctor.consultations} consultations today</span>
                    <span>{doctor.department}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Doctor detail */}
        <div>
          {selected ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl kpi-blue flex items-center justify-center text-white font-bold text-xl">
                    {selected.name.split(' ').slice(1).map(n => n[0]).join('').slice(0,2)}
                  </div>
                  <div>
                    <CardTitle>{selected.name}</CardTitle>
                    <div className="text-sm text-muted-foreground">{selected.specialization}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-semibold">{selected.rating}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ['Department', selected.department],
                    ['Experience', `${selected.yearsExperience} years`],
                    ['Today\'s Consults', selected.consultations],
                    ['Status', AVAIL_LABELS[selected.availability]],
                  ].map(([l, v]) => (
                    <div key={l}>
                      <div className="text-xs text-muted-foreground">{l}</div>
                      <div className="font-medium text-foreground">{v}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground font-medium">Current Load</span>
                    <span className="font-semibold">{selected.currentPatients}/{selected.maxPatients}</span>
                  </div>
                  <Progress value={selected.currentPatients} max={selected.maxPatients} size="md"
                    color={selected.currentPatients >= selected.maxPatients ? 'bg-red-500' : 'bg-blue-500'}
                    showLabel />
                </div>

                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Assigned Patients ({assignedPatients.length})
                  </div>
                  {assignedPatients.length > 0 ? (
                    <div className="space-y-2">
                      {assignedPatients.map(p => (
                        <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/50 border border-border">
                          <div className={cn(
                            'w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0',
                            p.triageLevel === 'critical' ? 'bg-red-500' :
                            p.triageLevel === 'high' ? 'bg-orange-500' : 'kpi-teal'
                          )}>
                            {p.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">{p.name}</div>
                            <div className="text-xs text-muted-foreground">{p.age}y · {p.department}</div>
                          </div>
                          <TriageBadge level={p.triageLevel} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-4">No patients currently assigned</div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <Stethoscope className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <div className="text-sm font-medium text-foreground">Select a doctor</div>
              <div className="text-xs text-muted-foreground mt-1">Click any doctor card to view details and assigned patients</div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
