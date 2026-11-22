'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppState } from '@/lib/store';
import { isRouteAllowed, ROLE_PERMISSIONS } from '@/lib/permissions';
import { ShieldAlert, ArrowLeft, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, logout } = useAppState();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (!isMounted) return;

    // Check if user is authenticated
    if (!state.isAuthenticated) {
      router.replace('/login');
    }
  }, [state.isAuthenticated, isMounted, router]);

  // Don't render SSR content before rehydration check
  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-emerald-700 font-semibold">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          <span>Verifying session credentials...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, return null while redirecting
  if (!state.isAuthenticated) {
    return null;
  }

  // Check role-based route permissions
  const role = state.currentUser.role;
  const isAllowed = isRouteAllowed(role, pathname);

  if (!isAllowed) {
    const roleInfo = ROLE_PERMISSIONS[role];
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 mb-6 shadow-sm">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied (403)</h1>
        <p className="max-w-md text-gray-600 mb-6 text-sm">
          Your active role (<span className="font-semibold text-gray-900">{roleInfo?.label || role}</span>) does not have authorization to access <code className="bg-gray-100 px-2 py-0.5 rounded text-red-600 font-mono">{pathname}</code>.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="gap-2 text-xs"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </Button>
          <Button
            onClick={() => router.push('/dashboard')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs"
          >
            <Home className="h-4 w-4" /> Go to Dashboard
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              logout();
              router.replace('/login');
            }}
            className="gap-2 text-xs text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" /> Sign In as Different Role
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
