import { ReactNode } from 'react'
import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/topbar'
import { DemoJourneyBar } from '@/components/demo-journey-bar'
import { PresentationOverlay } from '@/components/presentation-overlay'
import { AuthGuard } from '@/components/auth-guard'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar - hidden on mobile */}
        <div className="hidden w-64 flex-shrink-0 md:flex">
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 mt-16">
            {children}
          </main>
          <DemoJourneyBar />
        </div>

        <PresentationOverlay />
      </div>
    </AuthGuard>
  )
}
