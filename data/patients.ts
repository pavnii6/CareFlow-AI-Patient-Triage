import type { Patient } from '@/types';

export const PATIENTS: Patient[] = [
  {
    id: 'P001', mrn: 'MRN-2024-001', name: 'Rajesh Kumar', age: 58, gender: 'Male',
    dob: '1966-03-14', phone: '+91-9876543210', bloodGroup: 'B+',
    allergies: ['Penicillin'], symptoms: ['Chest Pain', 'Shortness of Breath', 'Dizziness'],
    vitals: { bloodPressure: '160/100', heartRate: 108, temperature: 37.8, oxygenSaturation: 92, respiratoryRate: 22 },
    triageLevel: 'critical', triageScore: 94, confidenceScore: 97,
    status: 'in_diagnostics', department: 'Cardiology', assignedDoctor: 'Dr. Priya Sharma',
    admissionDate: '2024-07-20T08:15:00', estimatedWaitTime: 5,
    recommendedDiagnostics: ['ECG', 'CT_Scan', 'Blood_Test'], notes: 'Suspected STEMI. Rush to Cath lab.',
    insuranceId: 'INS-TPA-00123'
  },
  {
    id: 'P002', mrn: 'MRN-2024-002', name: 'Anita Singh', age: 42, gender: 'Female',
    dob: '1982-07-22', phone: '+91-9123456789', bloodGroup: 'O+',
    allergies: [], symptoms: ['Severe Headache', 'Nausea', 'Blurred Vision'],
    vitals: { bloodPressure: '180/115', heartRate: 95, temperature: 37.2, oxygenSaturation: 97, respiratoryRate: 18 },
    triageLevel: 'high', triageScore: 78, confidenceScore: 91,
    status: 'with_doctor', department: 'Neurology', assignedDoctor: 'Dr. Arjun Mehta',
    admissionDate: '2024-07-20T09:00:00', estimatedWaitTime: 15,
    recommendedDiagnostics: ['MRI', 'Blood_Test'], notes: 'Hypertensive emergency. Monitor closely.',
    insuranceId: 'INS-AXA-00234'
  },
  {
    id: 'P003', mrn: 'MRN-2024-003', name: 'Mohammed Al-Rashid', age: 35, gender: 'Male',
    dob: '1989-11-05', phone: '+91-9988776655', bloodGroup: 'A+',
    allergies: ['Sulfa'], symptoms: ['Abdominal Pain', 'Vomiting', 'Fever'],
    vitals: { bloodPressure: '122/78', heartRate: 88, temperature: 38.9, oxygenSaturation: 98, respiratoryRate: 17 },
    triageLevel: 'medium', triageScore: 55, confidenceScore: 85,
    status: 'waiting', department: 'Gastroenterology', assignedDoctor: 'Dr. Kavitha Nair',
    admissionDate: '2024-07-20T09:45:00', estimatedWaitTime: 35,
    recommendedDiagnostics: ['Ultrasound', 'Blood_Test'],
    insuranceId: 'INS-STAR-00345'
  },
  {
    id: 'P004', mrn: 'MRN-2024-004', name: 'Priya Venkataraman', age: 28, gender: 'Female',
    dob: '1996-04-18', phone: '+91-9871234567', bloodGroup: 'AB-',
    allergies: ['Latex'], symptoms: ['Mild Cough', 'Runny Nose', 'Fatigue'],
    vitals: { bloodPressure: '112/72', heartRate: 76, temperature: 37.1, oxygenSaturation: 99, respiratoryRate: 15 },
    triageLevel: 'low', triageScore: 22, confidenceScore: 94,
    status: 'waiting', department: 'General Medicine', assignedDoctor: 'Dr. Suresh Babu',
    admissionDate: '2024-07-20T10:15:00', estimatedWaitTime: 60,
    recommendedDiagnostics: ['Blood_Test']
  },
  {
    id: 'P005', mrn: 'MRN-2024-005', name: 'David Thomas', age: 67, gender: 'Male',
    dob: '1957-09-30', phone: '+91-9900112233', bloodGroup: 'O-',
    allergies: ['Aspirin'], symptoms: ['Breathlessness', 'Leg Swelling', 'Fatigue'],
    vitals: { bloodPressure: '145/90', heartRate: 102, temperature: 37.5, oxygenSaturation: 93, respiratoryRate: 24 },
    triageLevel: 'critical', triageScore: 91, confidenceScore: 96,
    status: 'admitted', department: 'Cardiology', assignedDoctor: 'Dr. Priya Sharma',
    admissionDate: '2024-07-20T07:30:00', estimatedWaitTime: 0,
    recommendedDiagnostics: ['ECG', 'X_Ray', 'Blood_Test'], notes: 'Acute heart failure. ICU bed allocated.',
    insuranceId: 'INS-NIVA-00456'
  },
  {
    id: 'P006', mrn: 'MRN-2024-006', name: 'Sunita Rao', age: 45, gender: 'Female',
    dob: '1979-12-01', phone: '+91-9765432109', bloodGroup: 'B-',
    allergies: [], symptoms: ['Joint Pain', 'Morning Stiffness', 'Swelling in Hands'],
    vitals: { bloodPressure: '118/76', heartRate: 72, temperature: 36.8, oxygenSaturation: 98, respiratoryRate: 16 },
    triageLevel: 'medium', triageScore: 44, confidenceScore: 88,
    status: 'waiting', department: 'Rheumatology', assignedDoctor: 'Dr. Neha Gupta',
    admissionDate: '2024-07-20T10:45:00', estimatedWaitTime: 45,
    recommendedDiagnostics: ['X_Ray', 'Blood_Test']
  },
  {
    id: 'P007', mrn: 'MRN-2024-007', name: 'Aryan Kapoor', age: 19, gender: 'Male',
    dob: '2005-06-15', phone: '+91-9654321098', bloodGroup: 'A-',
    allergies: [], symptoms: ['High Fever', 'Rash', 'Muscle Aches'],
    vitals: { bloodPressure: '108/68', heartRate: 110, temperature: 39.8, oxygenSaturation: 96, respiratoryRate: 20 },
    triageLevel: 'high', triageScore: 71, confidenceScore: 89,
    status: 'in_triage', department: 'Infectious Disease', assignedDoctor: 'Dr. Raman Pillai',
    admissionDate: '2024-07-20T11:00:00', estimatedWaitTime: 20,
    recommendedDiagnostics: ['Blood_Test'], notes: 'Possible dengue. Run NS1 antigen test.'
  },
  {
    id: 'P008', mrn: 'MRN-2024-008', name: 'Meera Patel', age: 52, gender: 'Female',
    dob: '1972-02-28', phone: '+91-9543210987', bloodGroup: 'O+',
    allergies: ['Morphine'], symptoms: ['Chest Tightness', 'Palpitations'],
    vitals: { bloodPressure: '138/88', heartRate: 118, temperature: 37.0, oxygenSaturation: 95, respiratoryRate: 19 },
    triageLevel: 'high', triageScore: 76, confidenceScore: 93,
    status: 'in_diagnostics', department: 'Cardiology', assignedDoctor: 'Dr. Priya Sharma',
    admissionDate: '2024-07-20T11:30:00', estimatedWaitTime: 10,
    recommendedDiagnostics: ['ECG', 'Blood_Test']
  },
  {
    id: 'P009', mrn: 'MRN-2024-009', name: 'Vijay Krishnamurthy', age: 63, gender: 'Male',
    dob: '1961-08-20', phone: '+91-9432109876', bloodGroup: 'AB+',
    allergies: ['NSAIDs'], symptoms: ['Confusion', 'Slurred Speech', 'Arm Weakness'],
    vitals: { bloodPressure: '195/120', heartRate: 85, temperature: 37.3, oxygenSaturation: 94, respiratoryRate: 17 },
    triageLevel: 'critical', triageScore: 96, confidenceScore: 98,
    status: 'in_diagnostics', department: 'Neurology', assignedDoctor: 'Dr. Arjun Mehta',
    admissionDate: '2024-07-20T12:00:00', estimatedWaitTime: 2,
    recommendedDiagnostics: ['CT_Scan', 'MRI', 'Blood_Test'], notes: 'FAST positive. Stroke protocol activated.',
    insuranceId: 'INS-HDFC-00567'
  },
  {
    id: 'P010', mrn: 'MRN-2024-010', name: 'Fatima Al-Zahrawi', age: 38, gender: 'Female',
    dob: '1986-05-10', phone: '+91-9321098765', bloodGroup: 'B+',
    allergies: [], symptoms: ['Pelvic Pain', 'Irregular Bleeding'],
    vitals: { bloodPressure: '120/80', heartRate: 82, temperature: 36.9, oxygenSaturation: 99, respiratoryRate: 15 },
    triageLevel: 'medium', triageScore: 48, confidenceScore: 82,
    status: 'waiting', department: 'Gynaecology', assignedDoctor: 'Dr. Deepa Menon',
    admissionDate: '2024-07-20T12:30:00', estimatedWaitTime: 40,
    recommendedDiagnostics: ['Ultrasound', 'Blood_Test']
  },
  {
    id: 'P011', mrn: 'MRN-2024-011', name: 'Samuel George', age: 75, gender: 'Male',
    dob: '1949-01-15', phone: '+91-9210987654', bloodGroup: 'A+',
    allergies: ['Warfarin'], symptoms: ['Fall Injury', 'Hip Pain', 'Unable to Walk'],
    vitals: { bloodPressure: '130/84', heartRate: 78, temperature: 37.0, oxygenSaturation: 97, respiratoryRate: 16 },
    triageLevel: 'high', triageScore: 68, confidenceScore: 91,
    status: 'in_diagnostics', department: 'Orthopaedics', assignedDoctor: 'Dr. Vivek Joshi',
    admissionDate: '2024-07-20T13:00:00', estimatedWaitTime: 15,
    recommendedDiagnostics: ['X_Ray'], notes: 'Suspected hip fracture. Ortho on call.'
  },
  {
    id: 'P012', mrn: 'MRN-2024-012', name: 'Lakshmi Devi', age: 50, gender: 'Female',
    dob: '1974-09-25', phone: '+91-9109876543', bloodGroup: 'O+',
    allergies: [], symptoms: ['Extreme Thirst', 'Frequent Urination', 'Fatigue'],
    vitals: { bloodPressure: '125/82', heartRate: 88, temperature: 36.7, oxygenSaturation: 98, respiratoryRate: 15 },
    triageLevel: 'medium', triageScore: 50, confidenceScore: 87,
    status: 'waiting', department: 'Endocrinology', assignedDoctor: 'Dr. Suresh Babu',
    admissionDate: '2024-07-20T13:30:00', estimatedWaitTime: 50,
    recommendedDiagnostics: ['Blood_Test'], notes: 'Suspected DKA. Check blood glucose urgently.',
    insuranceId: 'INS-CARE-00678'
  },
];
