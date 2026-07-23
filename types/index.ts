// ============================================================
// CareFlow – Core Type Definitions
// ============================================================

export type UserRole =
  | 'hospital_director'
  | 'doctor'
  | 'triage_nurse'
  | 'lab_technician'
  | 'administrator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
  lastLogin?: string;
}

// ─── Patient ────────────────────────────────────────────────
export type TriageLevel = 'critical' | 'high' | 'medium' | 'low';
export type PatientStatus =
  | 'waiting'
  | 'in_triage'
  | 'in_diagnostics'
  | 'with_doctor'
  | 'admitted'
  | 'discharged'
  | 'transferred';

export interface Vitals {
  bloodPressure: string;   // e.g. "120/80"
  heartRate: number;       // bpm
  temperature: number;     // °C
  oxygenSaturation: number; // %
  respiratoryRate: number; // breaths/min
  weight?: number;         // kg
  height?: number;         // cm
}

export interface Patient {
  id: string;
  mrn: string;              // Medical Record Number
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  phone: string;
  email?: string;
  address?: string;
  bloodGroup?: string;
  allergies?: string[];
  symptoms: string[];
  vitals: Vitals;
  triageLevel: TriageLevel;
  triageScore: number;       // 0–100
  confidenceScore: number;   // 0–100
  status: PatientStatus;
  department?: string;
  assignedDoctor?: string;
  admissionDate: string;
  estimatedWaitTime: number; // minutes
  recommendedDiagnostics?: string[];
  notes?: string;
  insuranceId?: string;
}

// ─── AI Triage ───────────────────────────────────────────────
export interface TriageFeatureContribution {
  feature: string;
  value: string | number;
  contribution: number; // −1 to +1
  direction: 'risk_up' | 'risk_down' | 'neutral';
}

export interface TriagePrediction {
  patientId: string;
  triageLevel: TriageLevel;
  riskScore: number;
  confidencePercent: number;
  recommendedDepartment: string;
  recommendedDiagnostics: string[];
  predictedWaitTime: number;
  featureContributions: TriageFeatureContribution[];
  modelVersion: string;
  generatedAt: string;
}

// ─── Diagnostics ─────────────────────────────────────────────
export type DiagnosticType = 'MRI' | 'CT_Scan' | 'X_Ray' | 'Blood_Test' | 'Ultrasound' | 'ECG' | 'Specialist_Consultation';
export type SlotStatus = 'available' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface DiagnosticSlot {
  id: string;
  type: DiagnosticType;
  machine?: string;
  startTime: string;
  endTime: string;
  patientId?: string;
  patientName?: string;
  status: SlotStatus;
  department: string;
  technicianId?: string;
}

export interface DiagnosticMachine {
  id: string;
  name: string;
  type: DiagnosticType;
  department: string;
  utilization: number;       // % today
  status: 'operational' | 'maintenance' | 'offline';
  nextAvailable?: string;
  scheduledCount: number;
}

// ─── Doctor ──────────────────────────────────────────────────
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  department: string;
  availability: 'available' | 'busy' | 'off_duty';
  currentPatients: number;
  maxPatients: number;
  rating: number;
  yearsExperience: number;
  avatar?: string;
  consultations: number;    // today
}

// ─── PMO ─────────────────────────────────────────────────────
export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done' | 'cancelled';
export type Priority = 'critical' | 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignee: string;
  status: TaskStatus;
  priority: Priority;
  sprint?: string;
  storyPoints?: number;
  dueDate?: string;
  dependencies?: string[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  goal: string;
  velocity: number;
  capacity: number;
  completedPoints: number;
  totalPoints: number;
  status: 'planning' | 'active' | 'review' | 'done';
}

export interface Milestone {
  id: string;
  name: string;
  dueDate: string;
  status: 'upcoming' | 'on_track' | 'at_risk' | 'delayed' | 'completed';
  progress: number;
  owner: string;
}

// ─── Risk ────────────────────────────────────────────────────
export type RiskStatus = 'open' | 'mitigated' | 'accepted' | 'closed' | 'escalated';

export interface Risk {
  id: string;
  title: string;
  description: string;
  category: string;
  probability: 1 | 2 | 3 | 4 | 5;  // 1=Very Low, 5=Very High
  impact: 1 | 2 | 3 | 4 | 5;
  score: number; // probability × impact
  owner: string;
  mitigation: string;
  contingency?: string;
  status: RiskStatus;
  dateIdentified: string;
  reviewDate: string;
}

// ─── BA Workspace ────────────────────────────────────────────
export interface UserStory {
  id: string;
  title: string;
  asA: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: string[];
  priority: Priority;
  storyPoints: number;
  status: TaskStatus;
  sprint?: string;
  module: string;
  traceId?: string;   // RTM link
}

export interface Requirement {
  id: string;
  title: string;
  type: 'functional' | 'non_functional' | 'business' | 'technical';
  description: string;
  priority: Priority;
  source: string;
  status: 'draft' | 'approved' | 'implemented' | 'tested' | 'closed';
  linkedUserStories?: string[];
  testCases?: string[];
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  organization: string;
  influence: 'high' | 'medium' | 'low';
  interest: 'high' | 'medium' | 'low';
  category: 'sponsor' | 'user' | 'technical' | 'regulatory' | 'vendor';
  engagementLevel: 'champion' | 'supportive' | 'neutral' | 'resistant' | 'blocker';
  contactFrequency: string;
}

// ─── Notifications ───────────────────────────────────────────
export type NotificationType = 'critical' | 'warning' | 'info' | 'success';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: 'patient' | 'machine' | 'doctor' | 'system' | 'risk';
  actionUrl?: string;
}

// ─── Analytics ───────────────────────────────────────────────
export interface KPIData {
  label: string;
  value: number | string;
  change: number;       // % change vs yesterday
  trend: 'up' | 'down' | 'stable';
  unit?: string;
  target?: number;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  category?: string;
}

export interface DepartmentLoad {
  department: string;
  current: number;
  capacity: number;
  utilization: number;
  waitTime: number;
}

// ─── WBS ──────────────────────────────────────────────────────
export interface WBSNode {
  id: string;
  title: string;
  level: number;
  progress: number;
  status: TaskStatus;
  owner?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  children?: WBSNode[];
}

// ─── Gantt ────────────────────────────────────────────────────
export interface GanttTask {
  id: string;
  name: string;
  start: string;
  end: string;
  progress: number;
  dependencies?: string[];
  isMilestone?: boolean;
  isCritical?: boolean;
  assignee?: string;
  phase: string;
}
