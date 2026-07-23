import type { Notification } from '@/types';

export const NOTIFICATIONS: Notification[] = [
  { id: 'N001', type: 'critical', title: 'Critical Patient Alert', message: 'Patient Vijay Krishnamurthy (P009) — FAST positive. Stroke protocol activated. CT ordered.', timestamp: '2024-07-20T12:02:00', read: false, category: 'patient', actionUrl: '/patients/P009' },
  { id: 'N002', type: 'critical', title: 'Cardiac Emergency', message: 'Patient Rajesh Kumar (P001) — ECG shows ST elevation. Cath lab team alerted.', timestamp: '2024-07-20T08:20:00', read: false, category: 'patient', actionUrl: '/patients/P001' },
  { id: 'N003', type: 'warning', title: 'MRI-01 Maintenance Due', message: 'MRI machine MRI-01 is due for scheduled maintenance in 48 hours. 11 scans scheduled.', timestamp: '2024-07-20T07:00:00', read: false, category: 'machine' },
  { id: 'N004', type: 'warning', title: 'Emergency Queue Overload', message: 'Emergency queue has 12 patients. Capacity threshold (10) exceeded. Consider diversion.', timestamp: '2024-07-20T11:45:00', read: true, category: 'patient' },
  { id: 'N005', type: 'info', title: 'Dr. Deepa Menon Off Duty', message: 'Dr. Deepa Menon (Gynaecology) is off duty today. 2 patients need reassignment.', timestamp: '2024-07-20T08:00:00', read: true, category: 'doctor' },
  { id: 'N006', type: 'warning', title: 'Risk Escalation: Scope Creep', message: 'Risk R007 escalated to HIGH. 4 new change requests received this week without approval.', timestamp: '2024-07-19T16:30:00', read: true, category: 'risk' },
  { id: 'N007', type: 'success', title: 'Sprint 3 Completed', message: 'Sprint 3 completed with 44/50 story points. AI Triage Engine is now live.', timestamp: '2024-07-12T18:00:00', read: true, category: 'system' },
  { id: 'N008', type: 'info', title: 'Lab Results Ready', message: '18 lab results processed and ready for review by assigned doctors.', timestamp: '2024-07-20T11:00:00', read: false, category: 'patient' },
  { id: 'N009', type: 'warning', title: 'CT-01 Queue Backup', message: 'CT-01 has 6 scans queued with estimated 2-hour delay. Consider CT-02 reallocation.', timestamp: '2024-07-20T10:30:00', read: false, category: 'machine' },
  { id: 'N010', type: 'success', title: 'System Update Applied', message: 'CareFlow v2.4.1 successfully deployed. AI model updated to v3.2.', timestamp: '2024-07-19T02:00:00', read: true, category: 'system' },
];
