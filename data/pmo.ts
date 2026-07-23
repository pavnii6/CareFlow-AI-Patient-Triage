import type { Task, Sprint, Milestone, Risk, WBSNode, GanttTask } from '@/types';

export const SPRINTS: Sprint[] = [
  { id: 'S001', name: 'Sprint 1 - Foundation', startDate: '2024-06-01', endDate: '2024-06-14', goal: 'Set up core infrastructure and authentication', velocity: 42, capacity: 48, completedPoints: 42, totalPoints: 45, status: 'done' },
  { id: 'S002', name: 'Sprint 2 - Patient Module', startDate: '2024-06-15', endDate: '2024-06-28', goal: 'Complete patient registration and triage workflow', velocity: 38, capacity: 48, completedPoints: 38, totalPoints: 42, status: 'done' },
  { id: 'S003', name: 'Sprint 3 - AI Triage Engine', startDate: '2024-06-29', endDate: '2024-07-12', goal: 'Implement ML triage prediction and diagnostic allocation', velocity: 44, capacity: 50, completedPoints: 44, totalPoints: 50, status: 'done' },
  { id: 'S004', name: 'Sprint 4 - Dashboards', startDate: '2024-07-13', endDate: '2024-07-26', goal: 'Build executive, doctor, and analytics dashboards', velocity: 0, capacity: 52, completedPoints: 28, totalPoints: 52, status: 'active' },
  { id: 'S005', name: 'Sprint 5 - PMO & BA Tools', startDate: '2024-07-27', endDate: '2024-08-09', goal: 'Complete PMO dashboard and BA workspace', velocity: 0, capacity: 48, completedPoints: 0, totalPoints: 48, status: 'planning' },
];

export const TASKS: Task[] = [
  { id: 'T001', title: 'Design system setup with Tailwind + shadcn', assignee: 'Rahul Dev', status: 'done', priority: 'high', sprint: 'S001', storyPoints: 5, dueDate: '2024-06-05', tags: ['frontend', 'design'], createdAt: '2024-06-01', updatedAt: '2024-06-04' },
  { id: 'T002', title: 'Database schema design - Patient & User tables', assignee: 'Priya DBA', status: 'done', priority: 'critical', sprint: 'S001', storyPoints: 8, dueDate: '2024-06-07', tags: ['database', 'backend'], createdAt: '2024-06-01', updatedAt: '2024-06-07' },
  { id: 'T003', title: 'JWT authentication with role-based access', assignee: 'Amit Backend', status: 'done', priority: 'critical', sprint: 'S001', storyPoints: 13, dueDate: '2024-06-10', tags: ['auth', 'security'], createdAt: '2024-06-01', updatedAt: '2024-06-10' },
  { id: 'T004', title: 'Patient registration form with vitals capture', assignee: 'Sneha Frontend', status: 'done', priority: 'high', sprint: 'S002', storyPoints: 8, dueDate: '2024-06-20', tags: ['frontend', 'patients'], createdAt: '2024-06-15', updatedAt: '2024-06-20' },
  { id: 'T005', title: 'AI Triage ML model integration', assignee: 'Vikram ML', status: 'done', priority: 'critical', sprint: 'S003', storyPoints: 21, dueDate: '2024-07-10', tags: ['ai', 'triage'], createdAt: '2024-06-29', updatedAt: '2024-07-10' },
  { id: 'T006', title: 'Diagnostic slot allocation engine', assignee: 'Ravi Backend', status: 'done', priority: 'high', sprint: 'S003', storyPoints: 13, dueDate: '2024-07-12', tags: ['scheduling', 'backend'], createdAt: '2024-06-29', updatedAt: '2024-07-12' },
  { id: 'T007', title: 'Executive dashboard - KPI cards & charts', assignee: 'Sneha Frontend', status: 'in_progress', priority: 'high', sprint: 'S004', storyPoints: 13, dueDate: '2024-07-20', tags: ['dashboard', 'frontend'], createdAt: '2024-07-13', updatedAt: '2024-07-18' },
  { id: 'T008', title: 'Doctor dashboard with patient queue', assignee: 'Rahul Dev', status: 'in_progress', priority: 'high', sprint: 'S004', storyPoints: 8, dueDate: '2024-07-22', tags: ['doctor', 'frontend'], createdAt: '2024-07-13', updatedAt: '2024-07-19' },
  { id: 'T009', title: 'Analytics Power BI style dashboard', assignee: 'Kavya Analytics', status: 'todo', priority: 'medium', sprint: 'S004', storyPoints: 13, dueDate: '2024-07-25', tags: ['analytics', 'charts'], createdAt: '2024-07-13', updatedAt: '2024-07-13' },
  { id: 'T010', title: 'Notification center with real-time alerts', assignee: 'Amit Backend', status: 'blocked', priority: 'high', sprint: 'S004', storyPoints: 8, dueDate: '2024-07-24', dependencies: ['T008'], tags: ['notifications', 'realtime'], createdAt: '2024-07-13', updatedAt: '2024-07-19' },
  { id: 'T011', title: 'PMO Sprint board and velocity tracking', assignee: 'Suman PM', status: 'todo', priority: 'medium', sprint: 'S005', storyPoints: 8, dueDate: '2024-08-02', tags: ['pmo', 'agile'], createdAt: '2024-07-20', updatedAt: '2024-07-20' },
  { id: 'T012', title: 'BA Workspace - BRD & User Stories viewer', assignee: 'Divya BA', status: 'todo', priority: 'medium', sprint: 'S005', storyPoints: 8, dueDate: '2024-08-05', tags: ['ba', 'documentation'], createdAt: '2024-07-20', updatedAt: '2024-07-20' },
  { id: 'T013', title: 'BPMN Process mapping diagrams', assignee: 'Priya BA', status: 'todo', priority: 'low', sprint: 'S005', storyPoints: 5, dueDate: '2024-08-08', tags: ['bpmn', 'process'], createdAt: '2024-07-20', updatedAt: '2024-07-20' },
  { id: 'T014', title: 'PDF/Excel report export functionality', assignee: 'Ravi Backend', status: 'blocked', priority: 'medium', sprint: 'S004', storyPoints: 5, dueDate: '2024-07-26', dependencies: ['T007'], tags: ['reports', 'export'], createdAt: '2024-07-13', updatedAt: '2024-07-17' },
  { id: 'T015', title: 'Risk Register with heat map visualization', assignee: 'Suman PM', status: 'todo', priority: 'medium', sprint: 'S005', storyPoints: 5, dueDate: '2024-08-06', tags: ['risk', 'pmo'], createdAt: '2024-07-20', updatedAt: '2024-07-20' },
];

export const MILESTONES: Milestone[] = [
  { id: 'M001', name: 'Phase 1: Core Infrastructure', dueDate: '2024-06-14', status: 'completed', progress: 100, owner: 'Amit Backend' },
  { id: 'M002', name: 'Phase 2: Patient Workflow Live', dueDate: '2024-06-28', status: 'completed', progress: 100, owner: 'Sneha Frontend' },
  { id: 'M003', name: 'Phase 3: AI Engine Go-Live', dueDate: '2024-07-12', status: 'completed', progress: 100, owner: 'Vikram ML' },
  { id: 'M004', name: 'Phase 4: Dashboards Complete', dueDate: '2024-07-26', status: 'on_track', progress: 62, owner: 'Rahul Dev' },
  { id: 'M005', name: 'Phase 5: PMO & BA Module', dueDate: '2024-08-09', status: 'upcoming', progress: 0, owner: 'Suman PM' },
  { id: 'M006', name: 'UAT & Stakeholder Sign-off', dueDate: '2024-08-23', status: 'upcoming', progress: 0, owner: 'Divya BA' },
  { id: 'M007', name: 'Production Deployment', dueDate: '2024-09-01', status: 'upcoming', progress: 0, owner: 'Amit Backend' },
];

export const RISKS: Risk[] = [
  { id: 'R001', title: 'AI model bias leading to incorrect triage', description: 'Training data may not represent all demographic groups equally, leading to biased triage recommendations.', category: 'Technical', probability: 3, impact: 5, score: 15, owner: 'Vikram ML', mitigation: 'Implement bias detection metrics, diverse training data, and manual override protocol.', contingency: 'Fallback to rule-based triage if AI confidence < 70%', status: 'open', dateIdentified: '2024-06-20', reviewDate: '2024-07-20' },
  { id: 'R002', title: 'HIPAA/PHI compliance violations', description: 'Patient data stored or transmitted without proper encryption may violate healthcare regulations.', category: 'Compliance', probability: 2, impact: 5, score: 10, owner: 'Priya DBA', mitigation: 'AES-256 encryption at rest, TLS 1.3 in transit, quarterly audits.', status: 'mitigated', dateIdentified: '2024-06-01', reviewDate: '2024-08-01' },
  { id: 'R003', title: 'Hospital system integration delays', description: 'Legacy HIS system may not support modern API integration standards.', category: 'Technical', probability: 4, impact: 4, score: 16, owner: 'Amit Backend', mitigation: 'HL7 FHIR adapter development, parallel legacy interface support.', status: 'open', dateIdentified: '2024-06-25', reviewDate: '2024-07-25' },
  { id: 'R004', title: 'Low user adoption by clinical staff', description: 'Doctors and nurses may resist switching from existing workflow tools.', category: 'Organizational', probability: 3, impact: 4, score: 12, owner: 'Suman PM', mitigation: 'Change management program, dedicated training, nursing champion program.', status: 'open', dateIdentified: '2024-07-01', reviewDate: '2024-08-01' },
  { id: 'R005', title: 'Database performance under peak load', description: '500+ concurrent users during peak hours may cause DB slowdown.', category: 'Technical', probability: 3, impact: 3, score: 9, owner: 'Priya DBA', mitigation: 'Database indexing, read replicas, connection pooling.', status: 'mitigated', dateIdentified: '2024-06-15', reviewDate: '2024-07-15' },
  { id: 'R006', title: 'Vendor dependency for ML infrastructure', description: 'Single cloud vendor for AI inference creates availability risk.', category: 'Strategic', probability: 2, impact: 4, score: 8, owner: 'Vikram ML', mitigation: 'Multi-cloud strategy, on-premise fallback model.', status: 'open', dateIdentified: '2024-07-05', reviewDate: '2024-08-05' },
  { id: 'R007', title: 'Scope creep from clinical stakeholders', description: 'Continuous addition of new feature requests may delay delivery.', category: 'Project', probability: 4, impact: 3, score: 12, owner: 'Divya BA', mitigation: 'Strict change control board, formal RFC process, sprint backlog freeze.', status: 'escalated', dateIdentified: '2024-07-10', reviewDate: '2024-07-24' },
  { id: 'R008', title: 'Network downtime affecting real-time triage', description: 'Hospital network interruptions would block AI triage requests.', category: 'Infrastructure', probability: 2, impact: 5, score: 10, owner: 'Amit Backend', mitigation: 'Offline-first mode with local rule-based triage fallback.', status: 'open', dateIdentified: '2024-07-12', reviewDate: '2024-08-12' },
];

export const WBS_DATA: WBSNode[] = [
  {
    id: 'WBS-1', title: 'CareFlow Platform', level: 0, progress: 58, status: 'in_progress', owner: 'Suman PM',
    children: [
      {
        id: 'WBS-1.1', title: '1. Project Management', level: 1, progress: 75, status: 'in_progress', owner: 'Suman PM',
        children: [
          { id: 'WBS-1.1.1', title: '1.1 Project Charter', level: 2, progress: 100, status: 'done', owner: 'Suman PM', duration: '3d' },
          { id: 'WBS-1.1.2', title: '1.2 Stakeholder Analysis', level: 2, progress: 100, status: 'done', owner: 'Divya BA', duration: '2d' },
          { id: 'WBS-1.1.3', title: '1.3 Risk Register', level: 2, progress: 80, status: 'in_progress', owner: 'Suman PM', duration: '5d' },
          { id: 'WBS-1.1.4', title: '1.4 Project Schedule', level: 2, progress: 90, status: 'in_progress', owner: 'Suman PM', duration: '2d' },
        ]
      },
      {
        id: 'WBS-1.2', title: '2. Requirements & Analysis', level: 1, progress: 90, status: 'in_progress', owner: 'Divya BA',
        children: [
          { id: 'WBS-1.2.1', title: '2.1 BRD Documentation', level: 2, progress: 100, status: 'done', owner: 'Divya BA', duration: '5d' },
          { id: 'WBS-1.2.2', title: '2.2 FRD Documentation', level: 2, progress: 100, status: 'done', owner: 'Priya BA', duration: '4d' },
          { id: 'WBS-1.2.3', title: '2.3 User Story Mapping', level: 2, progress: 95, status: 'in_progress', owner: 'Divya BA', duration: '3d' },
          { id: 'WBS-1.2.4', title: '2.4 Process Mapping (BPMN)', level: 2, progress: 70, status: 'in_progress', owner: 'Priya BA', duration: '4d' },
        ]
      },
      {
        id: 'WBS-1.3', title: '3. System Design', level: 1, progress: 100, status: 'done', owner: 'Amit Backend',
        children: [
          { id: 'WBS-1.3.1', title: '3.1 Architecture Design', level: 2, progress: 100, status: 'done', owner: 'Amit Backend', duration: '4d' },
          { id: 'WBS-1.3.2', title: '3.2 Database Schema', level: 2, progress: 100, status: 'done', owner: 'Priya DBA', duration: '3d' },
          { id: 'WBS-1.3.3', title: '3.3 API Design', level: 2, progress: 100, status: 'done', owner: 'Amit Backend', duration: '3d' },
          { id: 'WBS-1.3.4', title: '3.4 UI/UX Wireframes', level: 2, progress: 100, status: 'done', owner: 'Sneha Frontend', duration: '5d' },
        ]
      },
      {
        id: 'WBS-1.4', title: '4. Development', level: 1, progress: 60, status: 'in_progress', owner: 'Rahul Dev',
        children: [
          { id: 'WBS-1.4.1', title: '4.1 Authentication & RBAC', level: 2, progress: 100, status: 'done', owner: 'Amit Backend', duration: '5d' },
          { id: 'WBS-1.4.2', title: '4.2 Patient Registration', level: 2, progress: 100, status: 'done', owner: 'Sneha Frontend', duration: '6d' },
          { id: 'WBS-1.4.3', title: '4.3 AI Triage Engine', level: 2, progress: 100, status: 'done', owner: 'Vikram ML', duration: '10d' },
          { id: 'WBS-1.4.4', title: '4.4 Diagnostic Allocation', level: 2, progress: 100, status: 'done', owner: 'Ravi Backend', duration: '7d' },
          { id: 'WBS-1.4.5', title: '4.5 Executive Dashboard', level: 2, progress: 80, status: 'in_progress', owner: 'Sneha Frontend', duration: '6d' },
          { id: 'WBS-1.4.6', title: '4.6 Doctor Dashboard', level: 2, progress: 70, status: 'in_progress', owner: 'Rahul Dev', duration: '5d' },
          { id: 'WBS-1.4.7', title: '4.7 PMO Module', level: 2, progress: 20, status: 'in_progress', owner: 'Suman PM', duration: '8d' },
          { id: 'WBS-1.4.8', title: '4.8 BA Workspace', level: 2, progress: 10, status: 'in_progress', owner: 'Divya BA', duration: '7d' },
          { id: 'WBS-1.4.9', title: '4.9 Analytics Dashboard', level: 2, progress: 30, status: 'in_progress', owner: 'Kavya Analytics', duration: '6d' },
          { id: 'WBS-1.4.10', title: '4.10 Reports & Export', level: 2, progress: 0, status: 'todo', owner: 'Ravi Backend', duration: '4d' },
        ]
      },
      {
        id: 'WBS-1.5', title: '5. Testing & QA', level: 1, progress: 40, status: 'in_progress', owner: 'Kavya QA',
        children: [
          { id: 'WBS-1.5.1', title: '5.1 Unit Testing', level: 2, progress: 70, status: 'in_progress', owner: 'Rahul Dev', duration: '5d' },
          { id: 'WBS-1.5.2', title: '5.2 Integration Testing', level: 2, progress: 40, status: 'in_progress', owner: 'Kavya QA', duration: '5d' },
          { id: 'WBS-1.5.3', title: '5.3 UAT', level: 2, progress: 0, status: 'todo', owner: 'Hospital Users', duration: '10d' },
          { id: 'WBS-1.5.4', title: '5.4 Performance Testing', level: 2, progress: 20, status: 'in_progress', owner: 'Priya DBA', duration: '4d' },
        ]
      },
      {
        id: 'WBS-1.6', title: '6. Deployment', level: 1, progress: 10, status: 'in_progress', owner: 'Amit Backend',
        children: [
          { id: 'WBS-1.6.1', title: '6.1 CI/CD Pipeline', level: 2, progress: 60, status: 'in_progress', owner: 'Amit Backend', duration: '3d' },
          { id: 'WBS-1.6.2', title: '6.2 Staging Deployment', level: 2, progress: 0, status: 'todo', owner: 'Amit Backend', duration: '2d' },
          { id: 'WBS-1.6.3', title: '6.3 Production Go-Live', level: 2, progress: 0, status: 'todo', owner: 'Suman PM', duration: '1d' },
        ]
      },
    ]
  }
];

export const GANTT_TASKS: GanttTask[] = [
  { id: 'G001', name: 'Project Kickoff', start: '2024-06-01', end: '2024-06-03', progress: 100, phase: 'Planning', isMilestone: true },
  { id: 'G002', name: 'Requirements Gathering', start: '2024-06-01', end: '2024-06-14', progress: 100, phase: 'Planning', assignee: 'Divya BA' },
  { id: 'G003', name: 'System Architecture Design', start: '2024-06-05', end: '2024-06-12', progress: 100, phase: 'Design', assignee: 'Amit Backend' },
  { id: 'G004', name: 'Database Schema & ERD', start: '2024-06-10', end: '2024-06-14', progress: 100, phase: 'Design', assignee: 'Priya DBA' },
  { id: 'G005', name: 'UI/UX Design System', start: '2024-06-12', end: '2024-06-21', progress: 100, phase: 'Design', assignee: 'Sneha Frontend' },
  { id: 'G006', name: 'Auth & RBAC Module', start: '2024-06-15', end: '2024-06-21', progress: 100, phase: 'Development', assignee: 'Amit Backend', isCritical: true },
  { id: 'G007', name: 'Patient Registration Module', start: '2024-06-22', end: '2024-06-28', progress: 100, phase: 'Development', assignee: 'Sneha Frontend', isCritical: true },
  { id: 'G008', name: 'AI Triage Engine', start: '2024-06-29', end: '2024-07-10', progress: 100, phase: 'Development', assignee: 'Vikram ML', isCritical: true },
  { id: 'G009', name: 'Diagnostic Scheduler', start: '2024-07-01', end: '2024-07-12', progress: 100, phase: 'Development', assignee: 'Ravi Backend', isCritical: true },
  { id: 'G010', name: 'Executive Dashboard', start: '2024-07-13', end: '2024-07-22', progress: 75, phase: 'Development', assignee: 'Sneha Frontend' },
  { id: 'G011', name: 'Doctor Dashboard', start: '2024-07-15', end: '2024-07-24', progress: 60, phase: 'Development', assignee: 'Rahul Dev' },
  { id: 'G012', name: 'Analytics Module', start: '2024-07-18', end: '2024-07-26', progress: 30, phase: 'Development', assignee: 'Kavya Analytics' },
  { id: 'G013', name: 'PMO & BA Workspace', start: '2024-07-22', end: '2024-08-05', progress: 10, phase: 'Development', assignee: 'Suman PM' },
  { id: 'G014', name: 'Notifications System', start: '2024-07-24', end: '2024-07-30', progress: 0, phase: 'Development', assignee: 'Amit Backend' },
  { id: 'G015', name: 'Reports & Exports', start: '2024-07-28', end: '2024-08-02', progress: 0, phase: 'Development', assignee: 'Ravi Backend' },
  { id: 'G016', name: 'Integration Testing', start: '2024-08-05', end: '2024-08-15', progress: 0, phase: 'Testing', assignee: 'Kavya QA', isCritical: true },
  { id: 'G017', name: 'UAT with Hospital Staff', start: '2024-08-16', end: '2024-08-25', progress: 0, phase: 'Testing', assignee: 'Hospital Users' },
  { id: 'G018', name: 'Performance & Security Audit', start: '2024-08-20', end: '2024-08-28', progress: 0, phase: 'Testing', assignee: 'Priya DBA' },
  { id: 'G019', name: 'Production Deployment', start: '2024-09-01', end: '2024-09-01', progress: 0, phase: 'Deployment', isMilestone: true, isCritical: true },
];
