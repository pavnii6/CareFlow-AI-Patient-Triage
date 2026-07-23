'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { USER_STORIES, STAKEHOLDERS } from '@/data/ba';
import { BookOpen, Users, CheckSquare, MapPin, Grid, ChevronDown, ChevronUp, Target } from 'lucide-react';
import type { UserStory, Stakeholder } from '@/types';

const TABS = ['User Stories', 'Stakeholder Matrix', 'RTM', 'BRD Overview'] as const;
type Tab = typeof TABS[number];

// Requirement Traceability Matrix data
const RTM_DATA = USER_STORIES.slice(0, 10).map(us => ({
  brdId: us.traceId ?? 'N/A',
  frdId: us.traceId?.replace('FR', 'FRD') ?? 'N/A',
  userStoryId: us.id,
  userStoryTitle: us.title,
  module: us.module,
  status: us.status,
  storyPoints: us.storyPoints,
  testCase: `TC-${us.id.replace('US-', '')}`,
  testStatus: us.status === 'done' ? 'Passed' : us.status === 'in_progress' ? 'In Progress' : 'Pending',
}));

// BRD sections
const BRD_SECTIONS = [
  { id: 'BR-001', title: 'Executive Summary', status: 'approved', pages: 3 },
  { id: 'BR-002', title: 'Business Objectives', status: 'approved', pages: 4 },
  { id: 'BR-003', title: 'Scope of Work', status: 'approved', pages: 5 },
  { id: 'BR-004', title: 'Current State Analysis (As-Is)', status: 'approved', pages: 6 },
  { id: 'BR-005', title: 'Future State Design (To-Be)', status: 'approved', pages: 7 },
  { id: 'BR-006', title: 'Gap Analysis', status: 'approved', pages: 4 },
  { id: 'BR-007', title: 'Functional Requirements', status: 'approved', pages: 12 },
  { id: 'BR-008', title: 'Non-Functional Requirements', status: 'approved', pages: 5 },
  { id: 'BR-009', title: 'Business Rules', status: 'in_review', pages: 8 },
  { id: 'BR-010', title: 'Assumptions & Constraints', status: 'approved', pages: 3 },
  { id: 'BR-011', title: 'Stakeholder Impact Analysis', status: 'approved', pages: 4 },
  { id: 'BR-012', title: 'Cost-Benefit Analysis', status: 'in_review', pages: 6 },
];

const QUADRANT_LABELS: Record<string, string> = {
  'high-high': 'Manage Closely',
  'high-low': 'Keep Satisfied',
  'low-high': 'Keep Informed',
  'low-low': 'Monitor',
};
const QUADRANT_COLORS: Record<string, string> = {
  'high-high': 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/30',
  'high-low': 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-900/30',
  'low-high': 'bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-900/30',
  'low-low': 'bg-slate-50 border-slate-200 dark:bg-slate-800/30 dark:border-slate-700',
};

const ENGAGEMENT_COLORS: Record<string, string> = {
  champion:   'bg-green-100 text-green-700 border-green-200',
  supportive: 'bg-blue-100 text-blue-700 border-blue-200',
  neutral:    'bg-slate-100 text-slate-600 border-slate-200',
  resistant:  'bg-amber-100 text-amber-700 border-amber-200',
  blocker:    'bg-red-100 text-red-700 border-red-200',
};

export default function BAWorkspacePage() {
  const [tab, setTab] = useState<Tab>('User Stories');
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Business Analyst Workspace</h1>
        <p className="text-muted-foreground text-sm mt-1">
          BRD, FRD, User Stories, Stakeholder Matrix, and Requirement Traceability
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'User Stories', value: USER_STORIES.length, icon: CheckSquare, color: 'text-blue-600' },
          { label: 'Requirements', value: 48, icon: BookOpen, color: 'text-purple-600' },
          { label: 'Stakeholders', value: STAKEHOLDERS.length, icon: Users, color: 'text-teal-600' },
          { label: 'BRD Pages', value: BRD_SECTIONS.reduce((a, s) => a + s.pages, 0), icon: Target, color: 'text-amber-600' },
        ].map(s => (
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

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit flex-wrap">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab === t ? 'bg-card text-foreground shadow-card' : 'text-muted-foreground hover:text-foreground'
            )}>
            {t}
          </button>
        ))}
      </div>

      {/* User Stories */}
      {tab === 'User Stories' && (
        <div className="space-y-3">
          {USER_STORIES.map(story => (
            <Card key={story.id} className="overflow-hidden">
              <button
                className="w-full p-4 text-left flex items-start gap-4 hover:bg-muted/30 transition-colors"
                onClick={() => setExpanded(expanded === story.id ? null : story.id)}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{story.id}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground text-sm">{story.title}</span>
                    <PriorityBadge priority={story.priority} />
                    <StatusBadge status={story.status} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <span className="font-medium">As a</span> {story.asA} · <span className="font-medium">Module:</span> {story.module} · {story.storyPoints} pts
                  </div>
                </div>
                {expanded === story.id ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />}
              </button>
              {expanded === story.id && (
                <div className="px-4 pb-4 border-t border-border bg-muted/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground mb-1">USER STORY</div>
                        <div className="text-sm text-foreground">
                          <span className="font-medium">As a</span> {story.asA}, <span className="font-medium">I want to</span> {story.iWant}, <span className="font-medium">so that</span> {story.soThat}.
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground mb-2">ACCEPTANCE CRITERIA</div>
                      <ul className="space-y-1.5">
                        {story.acceptanceCriteria.map((ac, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <div className="w-4 h-4 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i+1}</div>
                            <span className="text-foreground">{ac}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Stakeholder Matrix */}
      {tab === 'Stakeholder Matrix' && (
        <div className="space-y-4">
          {/* Quadrant matrix */}
          <Card>
            <CardHeader><CardTitle>Influence / Interest Matrix</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {(['high-high', 'high-low', 'low-high', 'low-low'] as const).map(q => {
                  const [inf, int] = q.split('-') as ['high'|'low', 'high'|'low'];
                  const stakeholders = STAKEHOLDERS.filter(s => s.influence === inf && s.interest === int);
                  return (
                    <div key={q} className={cn('p-4 rounded-xl border', QUADRANT_COLORS[q])}>
                      <div className="font-semibold text-sm text-foreground mb-1">{QUADRANT_LABELS[q]}</div>
                      <div className="text-xs text-muted-foreground mb-3">Influence: {inf} · Interest: {int}</div>
                      <div className="space-y-1.5">
                        {stakeholders.map(s => (
                          <div key={s.id} className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                              {s.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-xs font-medium text-foreground">{s.name.split(' ').slice(0,2).join(' ')}</div>
                              <div className="text-[10px] text-muted-foreground">{s.role.split(' ').slice(0,2).join(' ')}</div>
                            </div>
                          </div>
                        ))}
                        {stakeholders.length === 0 && <div className="text-xs text-muted-foreground italic">No stakeholders</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Full list */}
          <Card>
            <CardHeader><CardTitle>Stakeholder Register</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="cf-table">
                <thead>
                  <tr>
                    <th>Stakeholder</th>
                    <th>Organization</th>
                    <th>Category</th>
                    <th>Influence</th>
                    <th>Interest</th>
                    <th>Engagement</th>
                    <th>Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  {STAKEHOLDERS.map(s => (
                    <tr key={s.id}>
                      <td>
                        <div className="font-medium text-sm text-foreground">{s.name}</div>
                        <div className="text-xs text-muted-foreground">{s.role}</div>
                      </td>
                      <td><span className="text-xs text-muted-foreground">{s.organization}</span></td>
                      <td>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">{s.category}</span>
                      </td>
                      <td>
                        <span className={cn('text-xs font-medium capitalize', s.influence === 'high' ? 'text-red-600' : s.influence === 'medium' ? 'text-amber-600' : 'text-green-600')}>
                          {s.influence}
                        </span>
                      </td>
                      <td>
                        <span className={cn('text-xs font-medium capitalize', s.interest === 'high' ? 'text-blue-600' : s.interest === 'medium' ? 'text-amber-600' : 'text-slate-500')}>
                          {s.interest}
                        </span>
                      </td>
                      <td>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full border capitalize', ENGAGEMENT_COLORS[s.engagementLevel])}>
                          {s.engagementLevel}
                        </span>
                      </td>
                      <td><span className="text-xs text-muted-foreground">{s.contactFrequency}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* RTM */}
      {tab === 'RTM' && (
        <Card>
          <CardHeader><CardTitle>Requirement Traceability Matrix</CardTitle></CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="cf-table min-w-[900px]">
              <thead>
                <tr>
                  <th>BRD Ref</th>
                  <th>FRD Ref</th>
                  <th>User Story</th>
                  <th>Title</th>
                  <th>Module</th>
                  <th>Dev Status</th>
                  <th>Test Case</th>
                  <th>Test Status</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {RTM_DATA.map(r => (
                  <tr key={r.userStoryId}>
                    <td><span className="font-mono text-xs text-blue-600">{r.brdId}</span></td>
                    <td><span className="font-mono text-xs text-purple-600">{r.frdId}</span></td>
                    <td><span className="font-mono text-xs text-muted-foreground">{r.userStoryId}</span></td>
                    <td><span className="text-sm text-foreground">{r.userStoryTitle}</span></td>
                    <td><span className="text-xs text-muted-foreground">{r.module}</span></td>
                    <td><StatusBadge status={r.status} /></td>
                    <td><span className="font-mono text-xs text-muted-foreground">{r.testCase}</span></td>
                    <td>
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full border font-medium',
                        r.testStatus === 'Passed' ? 'bg-green-100 text-green-700 border-green-200' :
                        r.testStatus === 'In Progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      )}>
                        {r.testStatus}
                      </span>
                    </td>
                    <td><span className="text-xs font-semibold text-foreground">{r.storyPoints}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* BRD Overview */}
      {tab === 'BRD Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader><CardTitle>BRD Document Navigator</CardTitle></CardHeader>
              <CardContent className="p-2">
                {BRD_SECTIONS.map(s => (
                  <button
                    key={s.id}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-left"
                    onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                  >
                    <div>
                      <div className="text-sm font-medium text-foreground">{s.title}</div>
                      <div className="text-xs text-muted-foreground">{s.id} · {s.pages} pages</div>
                    </div>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full border ml-2 flex-shrink-0',
                      s.status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200'
                    )}>
                      {s.status}
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Business Requirements Document</CardTitle>
                  <span className="text-xs text-muted-foreground">v2.1 · July 2024 · {BRD_SECTIONS.reduce((a, s) => a + s.pages, 0)} pages</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30">
                  <div className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Executive Summary</div>
                  <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                    CareFlow is an AI-powered clinical operations platform designed to transform patient triage and diagnostic allocation at Apollo Hospitals. The platform addresses critical operational challenges including manual triage inconsistency (avg. error rate: 23%), diagnostic scheduling conflicts (avg. 4.2 conflicts/day), and excessive patient wait times (avg. 67 minutes at peak). CareFlow leverages machine learning for triage risk scoring, intelligent slot allocation, and real-time workflow analytics to reduce average wait times by 40%, improve machine utilization by 18%, and generate ₹2.4Cr in annual operational savings.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Project Sponsor', value: 'Dr. Rajiv Malhotra, Medical Director' },
                    { label: 'Business Analyst', value: 'Divya Srinivasan, Sr. BA' },
                    { label: 'Project Manager', value: 'Suman Kumar, PMO Lead' },
                    { label: 'Target Go-Live', value: 'September 1, 2024' },
                    { label: 'Budget', value: '₹1.8 Crore' },
                    { label: 'ROI Target', value: '133% in Year 1' },
                  ].map(item => (
                    <div key={item.label} className="p-3 rounded-xl bg-muted/50 border border-border">
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                      <div className="text-sm font-medium text-foreground mt-0.5">{item.value}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="text-sm font-semibold text-foreground mb-2">Business Objectives</div>
                  <ul className="space-y-1.5">
                    {[
                      'Reduce patient wait time in emergency triage from 67 min to < 20 min',
                      'Increase diagnostic machine utilization from 64% to > 85%',
                      'Eliminate manual scheduling conflicts through AI-driven allocation',
                      'Provide real-time clinical analytics to senior leadership',
                      'Achieve NABH Level 4 accreditation by Q4 2024',
                      'Generate ₹2.4Cr annual savings through operational efficiency',
                    ].map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <div className="w-5 h-5 rounded-full kpi-blue flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">{i+1}</div>
                        <span className="text-muted-foreground">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
