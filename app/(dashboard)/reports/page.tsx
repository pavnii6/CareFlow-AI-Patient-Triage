'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { FileText, Download, BarChart3, Users, Activity, Calendar, Filter, FileDown } from 'lucide-react';

const REPORTS = [
  {
    id: 'R001', name: 'Daily Patient Summary', description: 'Comprehensive daily report of all patient admissions, discharges, and triage outcomes.',
    category: 'Clinical', format: ['PDF', 'Excel'], size: '2.4 MB', generated: '2024-07-20 06:00',
    icon: Users, color: 'text-blue-600',
  },
  {
    id: 'R002', name: 'Weekly Triage Analytics', description: 'AI triage accuracy, average risk scores, and outcome correlation analysis.',
    category: 'Analytics', format: ['PDF', 'Excel', 'CSV'], size: '5.1 MB', generated: '2024-07-19 18:00',
    icon: Activity, color: 'text-teal-600',
  },
  {
    id: 'R003', name: 'Machine Utilization Report', description: 'MRI, CT, X-Ray, and Lab machine scheduling efficiency and downtime analysis.',
    category: 'Operations', format: ['PDF', 'Excel'], size: '1.8 MB', generated: '2024-07-19 20:00',
    icon: BarChart3, color: 'text-purple-600',
  },
  {
    id: 'R004', name: 'Department Wait Time Analysis', description: 'Comparative wait time analysis across all departments with bottleneck identification.',
    category: 'Analytics', format: ['PDF', 'CSV'], size: '3.2 MB', generated: '2024-07-18 22:00',
    icon: Calendar, color: 'text-amber-600',
  },
  {
    id: 'R005', name: 'Monthly Revenue Report', description: 'Revenue breakdown by inpatient, outpatient, diagnostics, and pharmacy with trend analysis.',
    category: 'Finance', format: ['PDF', 'Excel'], size: '4.7 MB', generated: '2024-07-01 08:00',
    icon: BarChart3, color: 'text-green-600',
  },
  {
    id: 'R006', name: 'PMO Sprint Report', description: 'Sprint velocity, burndown, task completion, and milestone tracking report.',
    category: 'PMO', format: ['PDF', 'Excel'], size: '2.1 MB', generated: '2024-07-13 09:00',
    icon: FileText, color: 'text-indigo-600',
  },
  {
    id: 'R007', name: 'Risk Register Export', description: 'Complete risk register with heat map, mitigation status, and owner accountability.',
    category: 'PMO', format: ['PDF', 'Excel', 'CSV'], size: '1.2 MB', generated: '2024-07-20 00:00',
    icon: FileText, color: 'text-red-600',
  },
  {
    id: 'R008', name: 'Stakeholder Communication Report', description: 'Stakeholder engagement log, communication history, and issue escalation summary.',
    category: 'BA', format: ['PDF'], size: '0.9 MB', generated: '2024-07-15 10:00',
    icon: Users, color: 'text-orange-600',
  },
];

const FORMAT_COLORS: Record<string, string> = {
  PDF:   'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400',
  Excel: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400',
  CSV:   'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300',
};

const CATEGORIES = ['All', 'Clinical', 'Analytics', 'Operations', 'Finance', 'PMO', 'BA'];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Exports</h1>
          <p className="text-muted-foreground text-sm mt-1">Generate and download reports in PDF, Excel, and CSV formats</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl kpi-blue text-white text-sm font-medium hover:opacity-90 transition-opacity">
          <FileDown className="w-4 h-4" />
          Generate Custom Report
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Available Reports', value: REPORTS.length, color: 'text-blue-600' },
          { label: 'Generated Today', value: 3, color: 'text-green-600' },
          { label: 'Scheduled Reports', value: 5, color: 'text-amber-600' },
          { label: 'Total Downloads', value: 142, color: 'text-purple-600' },
        ].map(s => (
          <Card key={s.label} className="p-4 text-center">
            <div className={cn('text-2xl font-bold', s.color)}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button key={cat}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            {cat}
          </button>
        ))}
      </div>

      {/* Report cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPORTS.map(report => (
          <Card key={report.id} hover className="p-5">
            <div className="flex items-start gap-4">
              <div className={cn('w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0', report.color)}>
                <report.icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-foreground">{report.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      <span className="px-2 py-0.5 rounded-full bg-muted mr-2">{report.category}</span>
                      {report.size} · {report.generated}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{report.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-1.5">
                    {report.format.map(f => (
                      <span key={f} className={cn('text-xs px-2 py-0.5 rounded-full border font-medium', FORMAT_COLORS[f])}>
                        {f}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {report.format.map(f => (
                      <button key={f}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        title={`Download ${f}`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
