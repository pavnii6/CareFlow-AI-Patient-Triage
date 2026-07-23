'use client';
import KPICard from '@/components/dashboard/KPICard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { TriageBadge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { KPI_DATA, PATIENT_INFLOW, DEPARTMENT_LOAD, ACUITY_TRENDS, MACHINE_UTILIZATION, WEEKLY_ADMISSIONS, REVENUE_DATA } from '@/data/analytics';
import { PATIENTS } from '@/data/patients';
import { DOCTORS } from '@/data/doctors';
import { cn, formatDateTime, formatWaitTime } from '@/lib/utils';
import {
  Users, AlertTriangle, Clock, Activity, Microscope, Stethoscope,
  TrendingUp, DollarSign, AlertOctagon, CheckCircle, Circle
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';

const KPI_ICONS = [Users, AlertTriangle, Clock, Microscope, Activity, AlertOctagon, DollarSign, TrendingUp];

const COLORS = ['#0D6EFD', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#0F9D9B', '#F97316', '#EC4899'];

const ACUITY_COLORS: Record<string, string> = {
  critical: '#EF4444', high: '#F97316', medium: '#F59E0B', low: '#10B981'
};

const criticalPatients = PATIENTS.filter(p => p.triageLevel === 'critical').slice(0, 4);
const availableDoctors = DOCTORS.filter(d => d.availability !== 'off_duty');

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Executive Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Apollo Hospitals — Real-time clinical operations overview</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-muted-foreground">Live · Updated just now</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {KPI_DATA.map((kpi, i) => (
          <KPICard key={kpi.label} data={kpi} index={i} icon={KPI_ICONS[i]} />
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Patient inflow */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Patient Inflow — Today</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={PATIENT_INFLOW}>
                <defs>
                  <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D6EFD" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0D6EFD" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="value" stroke="#0D6EFD" strokeWidth={2.5} fill="url(#inflowGrad)" name="Patients" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Acuity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Acuity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={[
                  { name: 'Critical', value: 18 }, { name: 'High', value: 38 },
                  { name: 'Medium', value: 85 }, { name: 'Low', value: 106 }
                ]} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {['#EF4444','#F97316','#F59E0B','#10B981'].map((c, i) => <Cell key={i} fill={c} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" iconSize={8} formatter={(val) => <span style={{fontSize:11}}>{val}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly acuity trends */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Acuity Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ACUITY_TRENDS} barSize={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Legend iconType="circle" iconSize={8} />
                {Object.entries(ACUITY_COLORS).map(([key, color]) => (
                  <Bar key={key} dataKey={key} fill={color} radius={[4,4,0,0]} name={key.charAt(0).toUpperCase()+key.slice(1)} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue (₹ Lakhs)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={REVENUE_DATA} barSize={10}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Legend iconType="circle" iconSize={8} />
                <Bar dataKey="inpatient" stackId="a" fill="#0D6EFD" radius={[0,0,0,0]} name="Inpatient" />
                <Bar dataKey="outpatient" stackId="a" fill="#10B981" name="Outpatient" />
                <Bar dataKey="diagnostics" stackId="a" fill="#F59E0B" name="Diagnostics" />
                <Bar dataKey="pharmacy" stackId="a" fill="#8B5CF6" radius={[4,4,0,0]} name="Pharmacy" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Critical patients */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <CardTitle>Critical Patients</CardTitle>
              <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-medium border border-red-200 dark:border-red-800">
                {criticalPatients.length} CRITICAL
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalPatients.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 critical-pulse">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {p.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm text-foreground truncate">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.department} · {p.age}y</div>
                  </div>
                  <div className="ml-auto text-right flex-shrink-0">
                    <div className="text-xs font-bold text-red-600">{p.triageScore}</div>
                    <div className="text-[10px] text-muted-foreground">score</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department load */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Department Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {DEPARTMENT_LOAD.map(dept => (
                <div key={dept.department} className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground w-40 truncate">{dept.department}</span>
                  <div className="flex-1">
                    <Progress
                      value={dept.utilization}
                      size="sm"
                      showLabel
                      color={dept.utilization >= 85 ? 'bg-red-500' : dept.utilization >= 70 ? 'bg-amber-500' : 'bg-blue-500'}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-16 text-right">{dept.waitTime} min wait</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Machine Utilization */}
      <Card>
        <CardHeader>
          <CardTitle>Diagnostic Machine Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {MACHINE_UTILIZATION.map(m => (
              <div key={m.name} className="p-4 rounded-xl bg-muted/40 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">{m.name}</span>
                  <span className={cn(
                    'w-2 h-2 rounded-full',
                    m.status === 'operational' ? 'bg-green-500' : 'bg-red-500'
                  )} />
                </div>
                <div className="text-xs text-muted-foreground mb-3">{m.type}</div>
                <Progress value={m.utilization} size="sm" showLabel />
                <div className="text-[10px] text-muted-foreground mt-2">{m.scheduledToday} scheduled today</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Doctor availability */}
      <Card>
        <CardHeader>
          <CardTitle>Doctor Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {availableDoctors.map(d => (
              <div key={d.id} className="p-3 rounded-xl border border-border bg-card text-center">
                <div className="relative inline-block mb-2">
                  <div className="w-10 h-10 rounded-full kpi-blue flex items-center justify-center text-white text-sm font-bold mx-auto">
                    {d.name.split(' ').slice(1).map(n => n[0]).join('')}
                  </div>
                  <span className={cn(
                    'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card',
                    d.availability === 'available' ? 'bg-green-500' :
                    d.availability === 'busy' ? 'bg-amber-500' : 'bg-slate-400'
                  )} />
                </div>
                <div className="text-xs font-medium text-foreground truncate">{d.name.replace('Dr. ', '')}</div>
                <div className="text-[10px] text-muted-foreground truncate">{d.specialization}</div>
                <div className="text-[10px] mt-1 font-medium text-muted-foreground">{d.currentPatients}/{d.maxPatients}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
