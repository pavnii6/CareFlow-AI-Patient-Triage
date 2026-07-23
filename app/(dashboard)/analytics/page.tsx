'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import {
  DEPARTMENT_LOAD, MACHINE_UTILIZATION, MONTHLY_TREND, WEEKLY_ADMISSIONS,
  REVENUE_DATA, ACUITY_TRENDS, PATIENT_INFLOW
} from '@/data/analytics';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp, Minus, BarChart3, Activity, DollarSign, Clock } from 'lucide-react';

const SUMMARY_KPIS = [
  { label: 'Wait Time Reduction', value: '-38%', change: -38, icon: TrendingDown, desc: 'vs. pre-deployment baseline', color: 'kpi-emerald' },
  { label: 'Machine Utilization', value: '82%', change: 12, icon: Activity, desc: 'Avg. across all diagnostic machines', color: 'kpi-blue' },
  { label: 'Cost Savings (MTD)', value: '₹18.4L', change: 22, icon: DollarSign, desc: 'vs. manual triage process', color: 'kpi-purple' },
  { label: 'Bottlenecks Resolved', value: '14/17', change: 5, icon: BarChart3, desc: 'Workflow optimization wins this sprint', color: 'kpi-teal' },
];

const DEPT_RADAR = DEPARTMENT_LOAD.map(d => ({
  dept: d.department.slice(0, 6), utilization: d.utilization, waitTime: d.waitTime
}));

const WAIT_TREND = [
  { week: 'W1', emergency: 48, cardiology: 62, neurology: 54, general: 72 },
  { week: 'W2', emergency: 44, cardiology: 58, neurology: 51, general: 68 },
  { week: 'W3', emergency: 38, cardiology: 52, neurology: 46, general: 63 },
  { week: 'W4', emergency: 32, cardiology: 45, neurology: 40, general: 58 },
  { week: 'W5', emergency: 28, cardiology: 40, neurology: 36, general: 54 },
  { week: 'W6', emergency: 24, cardiology: 35, neurology: 32, general: 49 },
  { week: 'W7', emergency: 20, cardiology: 30, neurology: 28, general: 45 },
];

const COST_SAVINGS = [
  { category: 'Staff Overtime', before: 42, after: 28 },
  { category: 'Diagnostic Waste', before: 38, after: 18 },
  { category: 'Re-admissions', before: 24, after: 14 },
  { category: 'Avg LOS', before: 4.8, after: 3.2 },
  { category: 'Bed Occupancy Cost', before: 31, after: 22 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics & Intelligence</h1>
          <p className="text-muted-foreground text-sm mt-1">Power BI-style clinical and operational insights dashboard</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <select className="px-3 py-1.5 rounded-lg bg-muted border-0 text-muted-foreground text-sm focus:outline-none">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>YTD</option>
          </select>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {SUMMARY_KPIS.map(k => (
          <div key={k.label} className={cn('rounded-2xl p-5 text-white relative overflow-hidden', k.color)}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <k.icon className="w-6 h-6 mb-3 text-white/80" />
              <div className="text-3xl font-bold mb-1">{k.value}</div>
              <div className="text-white/70 text-xs">{k.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Wait time reduction */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Wait Time Reduction (mins)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={WAIT_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Legend iconType="circle" iconSize={8} />
                <Line type="monotone" dataKey="emergency" stroke="#EF4444" strokeWidth={2} dot={false} name="Emergency" />
                <Line type="monotone" dataKey="cardiology" stroke="#0D6EFD" strokeWidth={2} dot={false} name="Cardiology" />
                <Line type="monotone" dataKey="neurology" stroke="#8B5CF6" strokeWidth={2} dot={false} name="Neurology" />
                <Line type="monotone" dataKey="general" stroke="#10B981" strokeWidth={2} dot={false} name="General" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly admissions */}
        <Card>
          <CardHeader><CardTitle>Monthly Admission Trends</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={MONTHLY_TREND}>
                <defs>
                  <linearGradient id="admGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D6EFD" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0D6EFD" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Area type="monotone" dataKey="value" fill="url(#admGrad)" stroke="none" />
                <Line type="monotone" dataKey="value" stroke="#0D6EFD" strokeWidth={2.5} dot={{ fill: '#0D6EFD', r: 4 }} name="Admissions" />
                <ReferenceLine y={5500} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: 'Target', position: 'right', fontSize: 10 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cost comparison */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Cost Savings — Before vs After CareFlow</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={COST_SAVINGS} barSize={18} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="category" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Legend iconType="circle" iconSize={8} />
                <Bar dataKey="before" fill="#EF4444" radius={[4,4,0,0]} name="Before" fillOpacity={0.7} />
                <Bar dataKey="after" fill="#10B981" radius={[4,4,0,0]} name="After" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Dept radar */}
        <Card>
          <CardHeader><CardTitle>Dept. Utilization Radar</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={DEPT_RADAR}>
                <PolarGrid />
                <PolarAngleAxis dataKey="dept" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis tick={{ fontSize: 9 }} domain={[0, 100]} />
                <Radar name="Utilization %" dataKey="utilization" stroke="#0D6EFD" fill="#0D6EFD" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 3 - Department comparison */}
      <Card>
        <CardHeader><CardTitle>Department Performance Comparison</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {DEPARTMENT_LOAD.map(d => (
              <div key={d.department} className="grid grid-cols-12 gap-4 items-center">
                <span className="col-span-3 text-sm text-muted-foreground truncate">{d.department}</span>
                <div className="col-span-4">
                  <div className="text-xs text-muted-foreground mb-1">Utilization</div>
                  <Progress value={d.utilization} size="sm" showLabel
                    color={d.utilization >= 85 ? 'bg-red-500' : d.utilization >= 70 ? 'bg-amber-500' : 'bg-blue-500'}
                  />
                </div>
                <div className="col-span-3 text-center">
                  <div className="text-xs text-muted-foreground">Current / Capacity</div>
                  <div className="font-semibold text-foreground text-sm">{d.current}/{d.capacity}</div>
                </div>
                <div className="col-span-2 text-right">
                  <div className="text-xs text-muted-foreground">Wait Time</div>
                  <div className={cn(
                    'font-semibold text-sm',
                    d.waitTime > 40 ? 'text-red-600' : d.waitTime > 25 ? 'text-amber-600' : 'text-green-600'
                  )}>
                    {d.waitTime} min
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue */}
      <Card>
        <CardHeader><CardTitle>Revenue Breakdown — YTD (₹ Lakhs)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={REVENUE_DATA} barSize={14} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} formatter={(v) => [`₹${v}L`, '']} />
              <Legend iconType="circle" iconSize={8} />
              <Bar dataKey="inpatient" fill="#0D6EFD" radius={[4,4,0,0]} name="Inpatient" />
              <Bar dataKey="outpatient" fill="#10B981" radius={[4,4,0,0]} name="Outpatient" />
              <Bar dataKey="diagnostics" fill="#F59E0B" radius={[4,4,0,0]} name="Diagnostics" />
              <Bar dataKey="pharmacy" fill="#8B5CF6" radius={[4,4,0,0]} name="Pharmacy" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
