/**
 * CareFlow – Global State Store (Zustand)
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/types';

// ─── Demo users (simulated auth) ─────────────────────────────
export const DEMO_USERS: (User & { password: string })[] = [
  { id: 'U001', name: 'Dr. Rajiv Malhotra', email: 'director@careflow.in', password: 'Director@123', role: 'hospital_director', department: 'Administration', avatar: 'RM' },
  { id: 'U002', name: 'Dr. Priya Sharma', email: 'priya.sharma@careflow.in', password: 'Doctor@123', role: 'doctor', department: 'Cardiology', avatar: 'PS' },
  { id: 'U003', name: 'Nurse Kavita Reddy', email: 'kavita.reddy@careflow.in', password: 'Nurse@123', role: 'triage_nurse', department: 'Emergency', avatar: 'KR' },
  { id: 'U004', name: 'Tech. Sunil Rao', email: 'sunil.rao@careflow.in', password: 'Lab@123', role: 'lab_technician', department: 'Radiology', avatar: 'SR' },
  { id: 'U005', name: 'Admin Pooja Nair', email: 'admin@careflow.in', password: 'Admin@123', role: 'administrator', department: 'IT Operations', avatar: 'PN' },
];

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  login: (email: string, password: string, remember: boolean) => { success: boolean; error?: string };
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      rememberMe: false,

      login: (email, password, remember) => {
        const found = DEMO_USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (!found) return { success: false, error: 'Invalid email or password.' };
        const { password: _pw, ...user } = found;
        set({ user, isAuthenticated: true, rememberMe: remember });
        return { success: true };
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'careflow-auth',
      partialize: (state) => ({
        user: state.rememberMe ? state.user : null,
        isAuthenticated: state.rememberMe ? state.isAuthenticated : false,
        rememberMe: state.rememberMe,
      }),
    }
  )
);

// ─── UI State ────────────────────────────────────────────────
interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      theme: 'light',
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'careflow-ui' }
  )
);

// ─── Role Permissions ─────────────────────────────────────────
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  hospital_director: ['dashboard', 'patients', 'triage', 'diagnostics', 'doctors', 'analytics', 'pmo', 'ba-workspace', 'process-map', 'risk-register', 'wbs', 'gantt', 'notifications', 'reports', 'settings'],
  doctor:            ['dashboard', 'patients', 'triage', 'diagnostics', 'doctors', 'notifications', 'reports'],
  triage_nurse:      ['patients', 'triage', 'diagnostics', 'notifications'],
  lab_technician:    ['diagnostics', 'notifications', 'reports'],
  administrator:     ['dashboard', 'patients', 'analytics', 'notifications', 'reports', 'settings'],
};

export const ROLE_LABELS: Record<UserRole, string> = {
  hospital_director: 'Hospital Director',
  doctor:            'Doctor',
  triage_nurse:      'Triage Nurse',
  lab_technician:    'Lab Technician',
  administrator:     'Administrator',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  hospital_director: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400',
  doctor:            'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
  triage_nurse:      'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400',
  lab_technician:    'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400',
  administrator:     'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300',
};
