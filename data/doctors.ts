import type { Doctor } from '@/types';

export const DOCTORS: Doctor[] = [
  { id: 'D001', name: 'Dr. Priya Sharma', specialization: 'Cardiology', department: 'Cardiology', availability: 'busy', currentPatients: 4, maxPatients: 6, rating: 4.9, yearsExperience: 18, consultations: 12 },
  { id: 'D002', name: 'Dr. Arjun Mehta', specialization: 'Neurology', department: 'Neurology', availability: 'busy', currentPatients: 3, maxPatients: 5, rating: 4.8, yearsExperience: 14, consultations: 9 },
  { id: 'D003', name: 'Dr. Kavitha Nair', specialization: 'Gastroenterology', department: 'Gastroenterology', availability: 'available', currentPatients: 2, maxPatients: 6, rating: 4.7, yearsExperience: 11, consultations: 7 },
  { id: 'D004', name: 'Dr. Suresh Babu', specialization: 'General Medicine', department: 'General Medicine', availability: 'available', currentPatients: 5, maxPatients: 8, rating: 4.6, yearsExperience: 20, consultations: 18 },
  { id: 'D005', name: 'Dr. Neha Gupta', specialization: 'Rheumatology', department: 'Rheumatology', availability: 'available', currentPatients: 1, maxPatients: 5, rating: 4.8, yearsExperience: 9, consultations: 5 },
  { id: 'D006', name: 'Dr. Raman Pillai', specialization: 'Infectious Disease', department: 'Infectious Disease', availability: 'busy', currentPatients: 4, maxPatients: 6, rating: 4.7, yearsExperience: 15, consultations: 11 },
  { id: 'D007', name: 'Dr. Deepa Menon', specialization: 'Gynaecology', department: 'Gynaecology', availability: 'off_duty', currentPatients: 0, maxPatients: 5, rating: 4.9, yearsExperience: 16, consultations: 0 },
  { id: 'D008', name: 'Dr. Vivek Joshi', specialization: 'Orthopaedics', department: 'Orthopaedics', availability: 'busy', currentPatients: 3, maxPatients: 5, rating: 4.7, yearsExperience: 12, consultations: 8 },
  { id: 'D009', name: 'Dr. Anand Krishnan', specialization: 'Pulmonology', department: 'Pulmonology', availability: 'available', currentPatients: 2, maxPatients: 6, rating: 4.8, yearsExperience: 13, consultations: 6 },
  { id: 'D010', name: 'Dr. Sita Ramesh', specialization: 'Endocrinology', department: 'Endocrinology', availability: 'available', currentPatients: 1, maxPatients: 5, rating: 4.6, yearsExperience: 10, consultations: 4 },
  { id: 'D011', name: 'Dr. Rahul Verma', specialization: 'Emergency Medicine', department: 'Emergency', availability: 'busy', currentPatients: 6, maxPatients: 8, rating: 4.9, yearsExperience: 8, consultations: 22 },
  { id: 'D012', name: 'Dr. Anjali Patel', specialization: 'Pediatrics', department: 'Pediatrics', availability: 'available', currentPatients: 2, maxPatients: 6, rating: 4.8, yearsExperience: 11, consultations: 9 },
];
