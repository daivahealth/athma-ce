'use client';

import { ReactNode, useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { MobileSidebar } from '@/components/layout/mobile-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { useSidebar } from '@/lib/contexts/sidebar-context';

export default function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale ?? 'en';
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  useAuthGuard(locale);

  const handleMobileToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/20">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
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
      
      <div className="flex flex-1 flex-col bg-background">
        <Topbar 
          locale={locale} 
          onSidebarToggle={handleMobileToggle}
        />
        <main className="flex-1 space-y-6 p-6 bg-background theme-transition">
          {children}
        </main>
        <Toaster />
      </div>
    </div>
  );
}