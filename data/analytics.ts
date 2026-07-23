import type { KPIData, TimeSeriesPoint, DepartmentLoad } from '@/types';

export const KPI_DATA: KPIData[] = [
  { label: "Today's Patients", value: 247, change: 12, trend: 'up', unit: 'patients', target: 280 },
  { label: 'Critical Patients', value: 18, change: -5, trend: 'down', unit: 'patients', target: 15 },
  { label: 'Avg Wait Time', value: '24 min', change: -8, trend: 'down', unit: 'min', target: 20 },
  { label: 'MRI Utilization', value: 87, change: 3, trend: 'up', unit: '%', target: 90 },
  { label: 'Lab Utilization', value: 74, change: -2, trend: 'down', unit: '%', target: 80 },
  { label: 'Emergency Queue', value: 12, change: 4, trend: 'up', unit: 'patients', target: 8 },
  { label: 'Revenue Today', value: '₹28.4L', change: 9, trend: 'up', unit: 'INR', target: 30 },
  { label: 'Predicted Delays', value: 5, change: 2, trend: 'up', unit: 'cases', target: 2 },
];

export const PATIENT_INFLOW: TimeSeriesPoint[] = [
  { date: '00:00', value: 8 }, { date: '02:00', value: 4 }, { date: '04:00', value: 6 },
  { date: '06:00', value: 12 }, { date: '08:00', value: 28 }, { date: '10:00', value: 42 },
  { date: '12:00', value: 38 }, { date: '14:00', value: 35 }, { date: '16:00', value: 31 },
  { date: '18:00', value: 27 }, { date: '20:00', value: 22 }, { date: '22:00', value: 15 },
];

export const WEEKLY_ADMISSIONS: TimeSeriesPoint[] = [
  { date: 'Mon', value: 189 }, { date: 'Tue', value: 224 }, { date: 'Wed', value: 198 },
  { date: 'Thu', value: 241 }, { date: 'Fri', value: 267 }, { date: 'Sat', value: 218 },
  { date: 'Sun', value: 176 },
];

export const MONTHLY_TREND: TimeSeriesPoint[] = [
  { date: 'Jan', value: 5240 }, { date: 'Feb', value: 4980 }, { date: 'Mar', value: 5680 },
  { date: 'Apr', value: 5920 }, { date: 'May', value: 6180 }, { date: 'Jun', value: 5840 },
  { date: 'Jul', value: 6420 },
];

export const DEPARTMENT_LOAD: DepartmentLoad[] = [
  { department: 'Emergency', current: 12, capacity: 20, utilization: 60, waitTime: 8 },
  { department: 'Cardiology', current: 18, capacity: 20, utilization: 90, waitTime: 35 },
  { department: 'Neurology', current: 14, capacity: 18, utilization: 78, waitTime: 28 },
  { department: 'Orthopaedics', current: 10, capacity: 15, utilization: 67, waitTime: 22 },
  { department: 'General Medicine', current: 22, capacity: 30, utilization: 73, waitTime: 45 },
  { department: 'Gastroenterology', current: 8, capacity: 12, utilization: 67, waitTime: 30 },
  { department: 'Gynaecology', current: 9, capacity: 14, utilization: 64, waitTime: 38 },
  { department: 'Pediatrics', current: 11, capacity: 16, utilization: 69, waitTime: 25 },
];

export const MACHINE_UTILIZATION = [
  { name: 'MRI-01', type: 'MRI', utilization: 92, status: 'operational', scheduledToday: 11 },
  { name: 'MRI-02', type: 'MRI', utilization: 81, status: 'operational', scheduledToday: 9 },
  { name: 'CT-01', type: 'CT Scan', utilization: 88, status: 'operational', scheduledToday: 14 },
  { name: 'CT-02', type: 'CT Scan', utilization: 74, status: 'operational', scheduledToday: 10 },
  { name: 'XRAY-01', type: 'X-Ray', utilization: 65, status: 'operational', scheduledToday: 18 },
  { name: 'XRAY-02', type: 'X-Ray', utilization: 58, status: 'operational', scheduledToday: 16 },
  { name: 'USG-01', type: 'Ultrasound', utilization: 70, status: 'operational', scheduledToday: 12 },
  { name: 'LAB-AUTO', type: 'Lab Analyzer', utilization: 95, status: 'operational', scheduledToday: 48 },
];

export const ACUITY_TRENDS = [
  { date: 'Mon', critical: 14, high: 32, medium: 68, low: 75 },
  { date: 'Tue', critical: 18, high: 38, medium: 72, low: 96 },
  { date: 'Wed', critical: 12, high: 29, medium: 58, low: 99 },
  { date: 'Thu', critical: 20, high: 41, medium: 80, low: 100 },
  { date: 'Fri', critical: 22, high: 45, medium: 85, low: 115 },
  { date: 'Sat', critical: 16, high: 36, medium: 70, low: 96 },
  { date: 'Sun', critical: 18, high: 38, medium: 72, low: 48 },
];

export const REVENUE_DATA = [
  { month: 'Jan', inpatient: 142, outpatient: 88, diagnostics: 62, pharmacy: 34 },
  { month: 'Feb', inpatient: 128, outpatient: 82, diagnostics: 58, pharmacy: 31 },
  { month: 'Mar', inpatient: 158, outpatient: 96, diagnostics: 70, pharmacy: 38 },
  { month: 'Apr', inpatient: 162, outpatient: 102, diagnostics: 74, pharmacy: 40 },
  { month: 'May', inpatient: 175, outpatient: 110, diagnostics: 80, pharmacy: 44 },
  { month: 'Jun', inpatient: 168, outpatient: 104, diagnostics: 76, pharmacy: 42 },
  { month: 'Jul', inpatient: 184, outpatient: 118, diagnostics: 86, pharmacy: 48 },
];
