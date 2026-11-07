import type { ReactNode } from 'react';
import { EnvironmentBanner } from '@/components/layout/environment-banner';
import { LegalHeader, LegalFooter } from '@/components/legal/legal-shell';

// Public pages (no auth guard): reachable from the login screen and the app shell.
export default async function LegalLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale = 'en' } = await params;
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <EnvironmentBanner locale={locale} />
      <LegalHeader locale={locale} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:py-12">{children}</main>
      <LegalFooter locale={locale} />
    </div>
  );
}
