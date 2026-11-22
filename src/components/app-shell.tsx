'use client';

import React from 'react';
import { TopBar } from '@/components/topbar';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <div className="pt-16 md:ml-60 min-h-[calc(100vh-64px)]">
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
