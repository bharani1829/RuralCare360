'use client';

import { useRouter } from 'next/navigation';
import { Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useAppState, UserRole } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';
import { OfflineIndicator } from '@/components/offline-indicator';
import { LanguageSelector } from '@/components/language-selector';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sidebar } from './sidebar';

export function TopBar() {
  const router = useRouter();
  const { state, toggleOnline, logout } = useAppState();
  const { t } = useTranslation();

  const roleDisplayNames: Record<UserRole, string> = {
    'patient': t('Patient / Citizen'),
    'health-worker': t('Health Worker (ASHA)'),
    'doctor': t('Doctor / Specialist'),
    'facility-staff': t('Facility Staff'),
    'admin': t('Administrator'),
  };

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <div className="fixed top-0 right-0 left-0 md:left-60 z-30 border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left */}
        <div className="flex items-center gap-4 flex-1 md:hidden">
          <Sidebar />
        </div>

        <div className="hidden md:block">
          <h2 className="font-semibold text-gray-900">{state.currentUser.facility}</h2>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Offline Indicator */}
          <OfflineIndicator
            isOnline={state.isOnline}
            pendingRecords={state.pendingSyncRecords}
            onToggle={toggleOnline}
          />

          {/* Language Selector */}
          <LanguageSelector />

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {state.notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="px-2 py-2">
                <h4 className="font-semibold text-sm text-gray-900 mb-2">{t('Notifications')}</h4>
                {state.notifications.slice(0, 5).map((notif) => (
                  <div
                    key={notif.id}
                    className="rounded px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    {t(notif.title)}
                  </div>
                ))}
                {state.notifications.length === 0 && (
                  <p className="text-sm text-gray-500 py-2">{t('common.noData')}</p>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{state.currentUser.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled className="opacity-100 font-semibold text-emerald-700">
                <span className="text-xs">{roleDisplayNames[state.currentUser.role] || state.currentUser.role}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')} className="cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                {t('topbar.settings')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
                <LogOut className="h-4 w-4 mr-2" />
                {t('topbar.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
