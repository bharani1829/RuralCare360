import { UserRole } from './store';

export interface RolePermissions {
  role: UserRole;
  label: string;
  badgeClass: string;
  allowedRoutes: string[];
  features: {
    canStartTriage: boolean;
    canTeleconsult: boolean;
    canCreateReferral: boolean;
    canManageFacilities: boolean;
    canManageDiagnostics: boolean;
    canManageMedicines: boolean;
    canRecordFollowUp: boolean;
    canAccessEmergency: boolean;
    canAccessReports: boolean;
    canAccessAdmin: boolean;
  };
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  'patient': {
    role: 'patient',
    label: 'Patient / Citizen',
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-300',
    allowedRoutes: [
      '/dashboard',
      '/patients',
      '/referrals',
      '/followups',
      '/teleconsultation',
      '/settings',
    ],
    features: {
      canStartTriage: false,
      canTeleconsult: true,
      canCreateReferral: false,
      canManageFacilities: false,
      canManageDiagnostics: false,
      canManageMedicines: false,
      canRecordFollowUp: false,
      canAccessEmergency: true,
      canAccessReports: false,
      canAccessAdmin: false,
    },
  },
  'health-worker': {
    role: 'health-worker',
    label: 'Health Worker (ASHA / ANM)',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    allowedRoutes: [
      '/dashboard',
      '/patients',
      '/triage',
      '/referrals',
      '/followups',
      '/emergency',
      '/offline',
      '/settings',
    ],
    features: {
      canStartTriage: true,
      canTeleconsult: false,
      canCreateReferral: true,
      canManageFacilities: false,
      canManageDiagnostics: false,
      canManageMedicines: false,
      canRecordFollowUp: true,
      canAccessEmergency: true,
      canAccessReports: false,
      canAccessAdmin: false,
    },
  },
  'doctor': {
    role: 'doctor',
    label: 'Doctor / Specialist',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    allowedRoutes: [
      '/dashboard',
      '/patients',
      '/triage',
      '/teleconsultation',
      '/referrals',
      '/facilities',
      '/diagnostics',
      '/medicines',
      '/followups',
      '/emergency',
      '/reports',
      '/settings',
    ],
    features: {
      canStartTriage: true,
      canTeleconsult: true,
      canCreateReferral: true,
      canManageFacilities: true,
      canManageDiagnostics: true,
      canManageMedicines: true,
      canRecordFollowUp: true,
      canAccessEmergency: true,
      canAccessReports: true,
      canAccessAdmin: false,
    },
  },
  'facility-staff': {
    role: 'facility-staff',
    label: 'Facility Staff (Hospital / Lab)',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
    allowedRoutes: [
      '/dashboard',
      '/patients',
      '/referrals',
      '/facilities',
      '/diagnostics',
      '/medicines',
      '/reports',
      '/settings',
    ],
    features: {
      canStartTriage: false,
      canTeleconsult: false,
      canCreateReferral: false, // Facility staff receive & acknowledge, don't create new outbound referrals
      canManageFacilities: true,
      canManageDiagnostics: true,
      canManageMedicines: true,
      canRecordFollowUp: false,
      canAccessEmergency: false,
      canAccessReports: true,
      canAccessAdmin: false,
    },
  },
  'admin': {
    role: 'admin',
    label: 'Administrator (Program Officer)',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    allowedRoutes: [
      '/dashboard',
      '/patients',
      '/triage',
      '/teleconsultation',
      '/referrals',
      '/facilities',
      '/diagnostics',
      '/medicines',
      '/followups',
      '/emergency',
      '/reports',
      '/admin',
      '/audit',
      '/closed-loop',
      '/offline',
      '/settings',
    ],
    features: {
      canStartTriage: true,
      canTeleconsult: true,
      canCreateReferral: true,
      canManageFacilities: true,
      canManageDiagnostics: true,
      canManageMedicines: true,
      canRecordFollowUp: true,
      canAccessEmergency: true,
      canAccessReports: true,
      canAccessAdmin: true,
    },
  },
};

export function isRouteAllowed(role: UserRole, pathname: string): boolean {
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;

  // Root or dashboard is default
  if (pathname === '/' || pathname === '/dashboard') return true;

  return perms.allowedRoutes.some((route) => {
    if (route === pathname) return true;
    if (pathname.startsWith(route + '/')) return true;
    return false;
  });
}
