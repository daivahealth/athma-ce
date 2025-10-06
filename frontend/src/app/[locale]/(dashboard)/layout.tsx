'use client';

import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { Toaster } from '@/components/ui/toaster';
import { useAuthGuard } from '@/hooks/use-auth-guard';

export default function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale ?? 'en';
  useAuthGuard(locale);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar locale={locale} />
      <div className="flex flex-1 flex-col">
        <Topbar locale={locale} />
        <main className="flex-1 space-y-6 p-6" role="main">
          <div className="grid gap-6" role="region" aria-live="polite">
            {children}
          </div>
        </main>
        <Toaster />
      </div>
    </div>
  );
}
