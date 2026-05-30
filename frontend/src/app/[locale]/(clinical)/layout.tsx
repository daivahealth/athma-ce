'use client';

import type { ReactNode} from 'react';
import { Suspense, useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { MobileSidebar } from '@/components/layout/mobile-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { useSidebar } from '@/lib/contexts/sidebar-context';
import { NavigationProgress } from '@/components/layout/navigation-progress';

/**
 * Layout for Clinical domain routes
 * Uses the same dashboard layout structure
 */
export default function ClinicalLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale ?? 'en';
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const isAuthorized = useAuthGuard(locale);

  const handleMobileToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/20">
      {/* Desktop Sidebar */}
      <div className="hidden md:block sticky top-0 h-screen">
        <Sidebar
          locale={locale}
          isCollapsed={isCollapsed}
          onToggle={toggleSidebar}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        locale={locale}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col bg-background/50">
        <Topbar
          locale={locale}
          onSidebarToggle={handleMobileToggle}
        />
        <main className="flex-1 space-y-6 px-6 pb-6 pt-2 bg-slate-50/50 dark:bg-transparent theme-transition">
          <Suspense fallback={null}>
            <NavigationProgress />
          </Suspense>
          {children}
        </main>
        <Toaster />
      </div>
    </div>
  );
}
