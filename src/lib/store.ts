'use client';

import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import {
  Notification, Referral, FollowUp, AuditEntry, Patient, Vitals, CareStage,
  ReferralStatus, ReferralTimelineEntry,
} from './demo-data';
import {
  patients as seedPatients,
  referrals as seedReferrals,
  followUps as seedFollowUps,
  auditLog as seedAuditLog,
  notifications as seedNotifications,
} from './demo-data';

export type UserRole = 'patient' | 'health-worker' | 'doctor' | 'facility-staff' | 'admin';
export type Language = 'en' | 'te' | 'hi';

export interface AppUser {
  name: string;
  role: UserRole;
  facility: string;
  workerId?: string;
  mobile?: string;
  abhaId?: string;
  medicalRegNo?: string;
}

export interface RegisteredWorker {
  name: string;
  mobile: string;
  facility: string;
  workerId: string;
  pin: string;
  createdAt: string;
}

export interface RegisteredUser {
  name: string;
  mobile: string;
  role: UserRole;
  facility: string;
  workerId?: string;
  abhaId?: string;
  medicalRegNo?: string;
  specialization?: string;
  pin: string;
  createdAt: string;
}

export interface MedicineStockUpdate {
  facilityId: string;
  medicineName: string;
  requestedAt: string;
  requestedBy: string;
}

export interface AppState {
  currentUser: AppUser;
  isAuthenticated: boolean;
  isOnline: boolean;
  pendingSyncRecords: number;
  language: Language;
  isDemoMode: boolean;
  isPresentationMode: boolean;
  demoJourneyStep: number;
  notifications: Notification[];
  sidebarOpen: boolean;
  // Mutable data for session persistence
  patients: Patient[];
  referrals: Referral[];
  followUps: FollowUp[];
  auditLog: AuditEntry[];
  replenishmentRequests: MedicineStockUpdate[];
}

interface AppContextType {
  // Nested state object (new pattern)
  state: AppState;
  // Flat convenience aliases (backwards-compat pattern used in existing pages)
  currentUser: AppUser;
  isAuthenticated: boolean;
  isOnline: boolean;
  pendingSyncRecords: number;
  language: Language;
  isDemoMode: boolean;
  isPresentationMode: boolean;
  demoJourneyStep: number;
  notifications: Notification[];
  sidebarOpen: boolean;
  // Actions
  setUser: (user: AppUser) => void;
  login: (user: AppUser) => void;
  logout: () => void;
  registerHealthWorker: (details: {
    name: string;
    mobile: string;
    facility: string;
    workerId: string;
    pin: string;
  }) => AppUser;
  getRegisteredWorkers: () => RegisteredWorker[];
  registerUser: (details: {
    name: string;
    mobile: string;
    role: UserRole;
    facility?: string;
    workerId?: string;
    abhaId?: string;
    medicalRegNo?: string;
    specialization?: string;
    pin: string;
  }) => AppUser;
  getRegisteredUsers: () => RegisteredUser[];
  toggleOnline: () => void;
  setLanguage: (lang: Language) => void;
  toggleDemoMode: () => void;
  togglePresentationMode: () => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  resetDemoJourney: () => void;
  markNotificationRead: (id: string) => void;
  addNotification: (notif: Notification) => void;
  toggleSidebar: () => void;
  setPendingSyncRecords: (count: number) => void;
  // Patient actions
  addPatient: (patient: Patient) => void;
  updatePatientVitalsAndStage: (patientId: string, vitals: Vitals, riskLevel: Patient['riskLevel'], careStage: CareStage) => void;
  // Referral actions
  addReferral: (referral: Referral) => void;
  updateReferralStatus: (id: string, status: ReferralStatus, timelineEntry: ReferralTimelineEntry) => void;
  // Follow-up actions
  completeFollowUp: (id: string) => void;
  updateFollowUpStatus: (id: string, status: FollowUp['status']) => void;
  addFollowUp: (followUp: FollowUp) => void;
  // Audit log actions
  addAuditEntry: (entry: AuditEntry) => void;
  // Medicine actions
  addReplenishmentRequest: (req: MedicineStockUpdate) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SESSION_KEY = 'ruralcare_session_v1';
const WORKERS_KEY = 'ruralcare_registered_workers_v1';
const PATIENTS_KEY = 'ruralcare_patients_v1';
const REFERRALS_KEY = 'ruralcare_referrals_v1';
const FOLLOWUPS_KEY = 'ruralcare_followups_v1';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    currentUser: {
      name: 'Asha Lakshmi',
      role: 'health-worker',
      facility: 'PHC A - Rampur',
      workerId: 'HW-98765',
    },
    isAuthenticated: false,
    isOnline: true,
    pendingSyncRecords: 0,
    language: 'en',
    isDemoMode: false,
    isPresentationMode: false,
    demoJourneyStep: 0,
    notifications: seedNotifications,
    sidebarOpen: true,
    patients: seedPatients,
    referrals: seedReferrals,
    followUps: seedFollowUps,
    auditLog: seedAuditLog,
    replenishmentRequests: [],
  });

  // Rehydrate session, patients, referrals & followups from localStorage on client mount
  React.useEffect(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed?.currentUser && parsed?.isAuthenticated) {
          setState((s) => ({
            ...s,
            currentUser: parsed.currentUser,
            isAuthenticated: true,
          }));
        }
      }

      const savedPatients = localStorage.getItem(PATIENTS_KEY);
      if (savedPatients) {
        const parsedPatients = JSON.parse(savedPatients);
        if (Array.isArray(parsedPatients) && parsedPatients.length > 0) {
          setState((s) => ({
            ...s,
            patients: parsedPatients,
          }));
        }
      }

      const savedReferrals = localStorage.getItem(REFERRALS_KEY);
      if (savedReferrals) {
        const parsedReferrals = JSON.parse(savedReferrals);
        if (Array.isArray(parsedReferrals) && parsedReferrals.length > 0) {
          setState((s) => ({
            ...s,
            referrals: parsedReferrals,
          }));
        }
      }

      const savedFollowUps = localStorage.getItem(FOLLOWUPS_KEY);
      if (savedFollowUps) {
        const parsedFollowUps = JSON.parse(savedFollowUps);
        if (Array.isArray(parsedFollowUps) && parsedFollowUps.length > 0) {
          setState((s) => ({
            ...s,
            followUps: parsedFollowUps,
          }));
        }
      }
    } catch {
      // Ignore localStorage errors in SSR
    }
  }, []);

  const login = useCallback((user: AppUser) => {
    setState((s) => ({
      ...s,
      currentUser: user,
      isAuthenticated: true,
    }));
    try {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ currentUser: user, isAuthenticated: true, loggedInAt: new Date().toISOString() })
      );
    } catch {
      // Ignore storage errors
    }
  }, []);

  const logout = useCallback(() => {
    setState((s) => ({
      ...s,
      currentUser: { name: 'Guest', role: 'health-worker', facility: '' },
      isAuthenticated: false,
      isPresentationMode: false,
    }));
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const registerHealthWorker = useCallback(
    (details: { name: string; mobile: string; facility: string; workerId: string; pin: string }) => {
      const newWorker: RegisteredWorker = {
        name: details.name,
        mobile: details.mobile,
        facility: details.facility,
        workerId: details.workerId,
        pin: details.pin,
        createdAt: new Date().toISOString(),
      };

      let existing: RegisteredWorker[] = [];
      try {
        const raw = localStorage.getItem(WORKERS_KEY);
        if (raw) existing = JSON.parse(raw);
      } catch {
        existing = [];
      }

      existing.push(newWorker);
      try {
        localStorage.setItem(WORKERS_KEY, JSON.stringify(existing));
      } catch {
        // Ignore storage errors
      }

      const user: AppUser = {
        name: details.name,
        role: 'health-worker',
        facility: details.facility,
        workerId: details.workerId,
        mobile: details.mobile,
      };

      login(user);
      return user;
    },
    [login]
  );

  const registerUser = useCallback(
    (details: {
      name: string;
      mobile: string;
      role: UserRole;
      facility?: string;
      workerId?: string;
      abhaId?: string;
      medicalRegNo?: string;
      specialization?: string;
      pin: string;
    }) => {
      const newUser: RegisteredUser = {
        name: details.name,
        mobile: details.mobile,
        role: details.role,
        facility: details.facility || 'PHC A - Rampur',
        workerId: details.workerId,
        abhaId: details.abhaId,
        medicalRegNo: details.medicalRegNo,
        specialization: details.specialization,
        pin: details.pin,
        createdAt: new Date().toISOString(),
      };

      let existing: RegisteredUser[] = [];
      try {
        const raw = localStorage.getItem('ruralcare_registered_users_v2');
        if (raw) existing = JSON.parse(raw);
      } catch {
        existing = [];
      }

      existing.push(newUser);
      try {
        localStorage.setItem('ruralcare_registered_users_v2', JSON.stringify(existing));
      } catch {
        // Ignore storage errors
      }

      const user: AppUser = {
        name: details.name,
        role: details.role,
        facility: details.facility || 'PHC A - Rampur',
        workerId: details.workerId,
        mobile: details.mobile,
        abhaId: details.abhaId,
        medicalRegNo: details.medicalRegNo,
      };

      login(user);
      return user;
    },
    [login]
  );

  const getRegisteredWorkers = useCallback((): RegisteredWorker[] => {
    try {
      const raw = localStorage.getItem(WORKERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  const getRegisteredUsers = useCallback((): RegisteredUser[] => {
    try {
      const raw = localStorage.getItem('ruralcare_registered_users_v2');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  const setUser = useCallback((user: AppUser) => setState((s) => ({ ...s, currentUser: user })), []);
  const toggleOnline = useCallback(() => setState((s) => ({ ...s, isOnline: !s.isOnline })), []);
  const setLanguage = useCallback((lang: Language) => setState((s) => ({ ...s, language: lang })), []);
  const toggleDemoMode = useCallback(() => setState((s) => ({ ...s, isDemoMode: !s.isDemoMode })), []);
  const togglePresentationMode = useCallback(() => setState((s) => ({ ...s, isPresentationMode: !s.isPresentationMode })), []);
  const nextDemoStep = useCallback(() => setState((s) => ({ ...s, demoJourneyStep: Math.min(s.demoJourneyStep + 1, 15) })), []);
  const prevDemoStep = useCallback(() => setState((s) => ({ ...s, demoJourneyStep: Math.max(s.demoJourneyStep - 1, 0) })), []);
  const resetDemoJourney = useCallback(() => setState((s) => ({ ...s, demoJourneyStep: 0 })), []);

  const markNotificationRead = useCallback((id: string) =>
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })), []);

  const addNotification = useCallback((notif: Notification) =>
    setState((s) => ({ ...s, notifications: [notif, ...s.notifications].slice(0, 20) })), []);

  const toggleSidebar = useCallback(() => setState((s) => ({ ...s, sidebarOpen: !s.sidebarOpen })), []);
  const setPendingSyncRecords = useCallback((count: number) => setState((s) => ({ ...s, pendingSyncRecords: count })), []);

  // Patient actions
  const addPatient = useCallback((patient: Patient) => {
    setState((s) => {
      const updated = [patient, ...s.patients];
      try {
        localStorage.setItem(PATIENTS_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return { ...s, patients: updated };
    });
  }, []);

  const updatePatientVitalsAndStage = useCallback(
    (patientId: string, vitals: Vitals, riskLevel: Patient['riskLevel'], careStage: CareStage) => {
      setState((s) => {
        const updated = s.patients.map((p) =>
          p.id === patientId
            ? { ...p, vitals, riskLevel, careStage, lastVisit: new Date().toISOString().split('T')[0] }
            : p
        );
        try {
          localStorage.setItem(PATIENTS_KEY, JSON.stringify(updated));
        } catch {
          // Ignore
        }
        return { ...s, patients: updated };
      });
    },
    []
  );

  // Referral actions
  const addReferral = useCallback((referral: Referral) => {
    setState((s) => {
      const updated = [referral, ...s.referrals];
      try {
        localStorage.setItem(REFERRALS_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return { ...s, referrals: updated };
    });
  }, []);

  const updateReferralStatus = useCallback((id: string, status: ReferralStatus, timelineEntry: ReferralTimelineEntry) => {
    setState((s) => {
      const updated = s.referrals.map((r) =>
        r.id === id ? { ...r, status, timeline: [...r.timeline, timelineEntry] } : r
      );
      try {
        localStorage.setItem(REFERRALS_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return { ...s, referrals: updated };
    });
  }, []);

  // Follow-up actions
  const completeFollowUp = useCallback((id: string) => {
    setState((s) => {
      const updated = s.followUps.map((f) => (f.id === id ? { ...f, status: 'completed' as const } : f));
      try {
        localStorage.setItem(FOLLOWUPS_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return { ...s, followUps: updated };
    });
  }, []);

  const updateFollowUpStatus = useCallback((id: string, status: FollowUp['status']) => {
    setState((s) => {
      const updated = s.followUps.map((f) => (f.id === id ? { ...f, status } : f));
      try {
        localStorage.setItem(FOLLOWUPS_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return { ...s, followUps: updated };
    });
  }, []);

  const addFollowUp = useCallback((followUp: FollowUp) => {
    setState((s) => {
      const updated = [followUp, ...s.followUps];
      try {
        localStorage.setItem(FOLLOWUPS_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return { ...s, followUps: updated };
    });
  }, []);

  // Audit actions
  const addAuditEntry = useCallback((entry: AuditEntry) =>
    setState((s) => ({ ...s, auditLog: [entry, ...s.auditLog] })), []);

  // Medicine actions
  const addReplenishmentRequest = useCallback((req: MedicineStockUpdate) =>
    setState((s) => ({ ...s, replenishmentRequests: [req, ...s.replenishmentRequests] })), []);

  const value: AppContextType = useMemo(
    () => ({
      state,
      // Flat aliases for backwards compatibility
      currentUser: state.currentUser,
      isAuthenticated: state.isAuthenticated,
      isOnline: state.isOnline,
      pendingSyncRecords: state.pendingSyncRecords,
      language: state.language,
      isDemoMode: state.isDemoMode,
      isPresentationMode: state.isPresentationMode,
      demoJourneyStep: state.demoJourneyStep,
      notifications: state.notifications,
      sidebarOpen: state.sidebarOpen,
      // Actions
      setUser,
      login,
      logout,
      registerHealthWorker,
      getRegisteredWorkers,
      registerUser,
      getRegisteredUsers,
      toggleOnline,
      setLanguage,
      toggleDemoMode,
      togglePresentationMode,
      nextDemoStep,
      prevDemoStep,
      resetDemoJourney,
      markNotificationRead,
      addNotification,
      toggleSidebar,
      setPendingSyncRecords,
      addPatient,
      updatePatientVitalsAndStage,
      addReferral,
      updateReferralStatus,
      completeFollowUp,
      updateFollowUpStatus,
      addFollowUp,
      addAuditEntry,
      addReplenishmentRequest,
    }),
    [
      state,
      setUser,
      login,
      logout,
      registerHealthWorker,
      getRegisteredWorkers,
      toggleOnline,
      setLanguage,
      toggleDemoMode,
      togglePresentationMode,
      nextDemoStep,
      prevDemoStep,
      resetDemoJourney,
      markNotificationRead,
      addNotification,
      toggleSidebar,
      setPendingSyncRecords,
      addPatient,
      updatePatientVitalsAndStage,
      addReferral,
      updateReferralStatus,
      completeFollowUp,
      updateFollowUpStatus,
      addFollowUp,
      addAuditEntry,
      addReplenishmentRequest,
    ]
  );

  return React.createElement(AppContext.Provider, { value }, children);
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppState must be used within AppProvider');
  return context;
}
