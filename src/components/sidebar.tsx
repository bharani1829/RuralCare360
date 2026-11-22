'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Video,
  ArrowRightLeft,
  Building2,
  Microscope,
  Pill,
  CalendarCheck,
  AlertTriangle,
  BarChart3,
  Settings,
  Settings2,
  Menu,
  Zap,
  Presentation,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppState, UserRole } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', roles: ['health-worker', 'doctor', 'facility-staff', 'admin'] },
  { icon: Users, label: 'Patients', href: '/patients', roles: ['health-worker', 'doctor', 'facility-staff', 'admin'] },
  { icon: Stethoscope, label: 'Digital Triage', href: '/triage', roles: ['health-worker', 'doctor', 'admin'] },
  { icon: Video, label: 'Teleconsultation', href: '/teleconsultation', roles: ['doctor', 'admin'] },
  { icon: ArrowRightLeft, label: 'Referrals', href: '/referrals', roles: ['health-worker', 'doctor', 'facility-staff', 'admin'] },
  { icon: Building2, label: 'Facilities', href: '/facilities', roles: ['facility-staff', 'doctor', 'admin'] },
  { icon: Microscope, label: 'Diagnostics', href: '/diagnostics', roles: ['doctor', 'facility-staff', 'admin'] },
  { icon: Pill, label: 'Medicines', href: '/medicines', roles: ['facility-staff', 'doctor', 'admin'] },
  { icon: CalendarCheck, label: 'Follow-ups', href: '/followups', roles: ['health-worker', 'doctor', 'admin'] },
  { icon: AlertTriangle, label: 'Emergency', href: '/emergency', roles: ['health-worker', 'doctor', 'admin'] },
  { icon: BarChart3, label: 'Reports', href: '/reports', roles: ['doctor', 'facility-staff', 'admin'] },
  { icon: Settings, label: 'Admin', href: '/admin', roles: ['admin'] },
  { icon: Settings2, label: 'Settings', href: '/settings', roles: ['health-worker', 'doctor', 'facility-staff', 'admin'] },
];

const translationKeys: Record<string, string> = {
  '/dashboard': 'nav.dashboard',
  '/patients': 'nav.patients',
  '/triage': 'nav.triage',
  '/teleconsultation': 'nav.teleconsultation',
  '/referrals': 'nav.referrals',
  '/facilities': 'nav.facilities',
  '/diagnostics': 'nav.diagnostics',
  '/medicines': 'nav.medicines',
  '/followups': 'nav.followups',
  '/emergency': 'nav.emergency',
  '/reports': 'nav.reports',
  '/admin': 'nav.admin',
  '/settings': 'nav.settings',
};

const roleLabels: Record<UserRole, { label: string; badgeClass: string }> = {
  'patient': { label: 'Patient', badgeClass: 'bg-teal-100 text-teal-800' },
  'health-worker': { label: 'Health Worker', badgeClass: 'bg-emerald-100 text-emerald-800' },
  'doctor': { label: 'Doctor', badgeClass: 'bg-blue-100 text-blue-800' },
  'facility-staff': { label: 'Facility Staff', badgeClass: 'bg-purple-100 text-purple-800' },
  'admin': { label: 'Administrator', badgeClass: 'bg-amber-100 text-amber-800' },
};

function SidebarNav({
  pathname,
  state,
  toggleDemoMode,
  togglePresentationMode,
}: {
  pathname: string;
  state: ReturnType<typeof useAppState>['state'];
  toggleDemoMode: () => void;
  togglePresentationMode: () => void;
}) {
  const router = useRouter();
  const { logout } = useAppState();
  const { t } = useTranslation();

  const userRole = state.currentUser.role || 'health-worker';
  const roleInfo = roleLabels[userRole] || roleLabels['health-worker'];

  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole));

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Logo */}
      <div className="border-b px-4 py-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm">
            RC
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900">RuralCare 360</h1>
            <p className="text-xs text-gray-500">From first contact to care</p>
          </div>
        </Link>
      </div>

      {/* User Role Card */}
      <div className="bg-gray-50 border-b px-3 py-3">
        <div className="flex items-center gap-2 mb-1">
          <UserCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-bold text-gray-900 truncate">
            {state.currentUser.name}
          </span>
        </div>
        <div className="flex items-center justify-between gap-1">
          <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', roleInfo.badgeClass)}>
            {roleInfo.label}
          </span>
          <span className="text-[10px] text-gray-500 truncate max-w-[90px]">
            {state.currentUser.facility}
          </span>
        </div>
      </div>

      {/* Role-filtered Nav Items */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{t(translationKeys[item.href] || item.label)}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom toggles & Logout */}
      <div className="border-t space-y-2 p-2">
        <Button
          variant={state.isDemoMode ? 'default' : 'outline'}
          size="sm"
          onClick={toggleDemoMode}
          className="w-full justify-start gap-2 text-xs"
        >
          <Zap className="h-4 w-4" />
          Demo Mode
        </Button>
        <Button
          variant={state.isPresentationMode ? 'default' : 'outline'}
          size="sm"
          onClick={togglePresentationMode}
          className="w-full justify-start gap-2 text-xs"
        >
          <Presentation className="h-4 w-4" />
          Presentation Mode
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { state, toggleDemoMode, togglePresentationMode } = useAppState();

  const navProps = { pathname, state, toggleDemoMode, togglePresentationMode };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:w-60 md:block md:border-r">
        <SidebarNav {...navProps} />
      </div>

      {/* Mobile Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0">
          <SidebarNav {...navProps} />
        </SheetContent>
      </Sheet>
    </>
  );
}

