'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/store';
import { useTranslation, Language } from '@/lib/i18n';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Phone,
  Send,
  Building2,
  Beaker,
  Pill,
  RotateCw,
  AlertTriangle,
  FileText,
  Settings,
  Menu,
  X,
  Bell,
  Wifi,
  User,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { isRouteAllowed, ROLE_PERMISSIONS } from '@/lib/permissions';

const navItems = [
  { id: 'dashboard', label: 'dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'patients', icon: Users },
  { id: 'triage', label: 'triage', icon: Stethoscope },
  { id: 'teleconsultation', label: 'teleconsultation', icon: Phone },
  { id: 'referrals', label: 'referrals', icon: Send },
  { id: 'facilities', label: 'facilities', icon: Building2 },
  { id: 'diagnostics', label: 'diagnostics', icon: Beaker },
  { id: 'medicines', label: 'medicines', icon: Pill },
  { id: 'followups', label: 'followups', icon: RotateCw },
  { id: 'emergency', label: 'emergency', icon: AlertTriangle },
  { id: 'reports', label: 'reports', icon: FileText },
  { id: 'admin', label: 'admin', icon: Settings },
  { id: 'settings', label: 'settings', icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { state, toggleSidebar, toggleOnline, setLanguage, togglePresentationMode, setUser } = useAppState();
  const { t, language, languages } = useTranslation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('dashboard');

  const visibleNavItems = navItems.filter((item) => {
    const route = item.id === 'dashboard' ? '/dashboard' : `/${item.id}`;
    return isRouteAllowed(state.currentUser.role, route);
  });

  const handleLogout = () => {
    setUser({ name: 'Guest', role: 'health-worker', facility: '' });
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          state.sidebarOpen ? 'w-64' : 'w-0'
        } bg-sidebar border-r border-sidebar-border transition-all duration-300 overflow-hidden flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center text-sm font-bold">
              RC
            </div>
            <div className="hidden lg:block">
              <div className="text-sm font-bold text-sidebar-foreground">RuralCare 360</div>
              <div className="text-xs text-sidebar-foreground/60">Care Coordination</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.id;
            return (
              <Link
                key={item.id}
                href={`/${item.id}`}
                onClick={() => setCurrentPath(item.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{t(`nav.${item.label}`)}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-3 border-t border-sidebar-border text-xs text-sidebar-foreground/60">
          <div className="font-medium text-sidebar-foreground">{state.currentUser.name}</div>
          <div>{state.currentUser.facility}</div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="border-b border-border bg-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              {state.sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{t('topbar.currentFacility')}:</span>
              <span className="font-medium">{state.currentUser.facility}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Network Status */}
            <button
              onClick={toggleOnline}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                state.isOnline
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-orange-50 text-orange-700 border border-orange-200'
              }`}
            >
              <Wifi className="w-4 h-4" />
              <span className="hidden sm:inline">{state.isOnline ? t('common.online') : t('common.offline')}</span>
              {!state.isOnline && state.pendingSyncRecords > 0 && (
                <span className="text-xs bg-orange-200 px-2 py-1 rounded">
                  {state.pendingSyncRecords} {t('common.syncingRecordsPending')}
                </span>
              )}
            </button>

            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="px-2 py-2 border border-border rounded text-sm bg-background"
            >
              {Object.entries(languages).map(([code, label]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell className="w-5 h-5" />
                {state.notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Button>
            </div>

            {/* Presentation Mode */}
            <Button
              variant="outline"
              size="sm"
              onClick={togglePresentationMode}
              className="hidden sm:flex"
            >
              {state.isPresentationMode ? 'Exit' : 'Present'}
            </Button>

            {/* Profile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled className="opacity-100 font-semibold text-emerald-700">
                  <span className="text-xs">{state.currentUser.name} ({state.currentUser.role})</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')} className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Profile & Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
