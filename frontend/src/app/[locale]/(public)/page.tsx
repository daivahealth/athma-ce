import { redirect } from 'next/navigation';
import { LandingPage } from '@/components/landing/landing-page';
import { LANDING_PAGE_ENABLED } from '@/lib/config/deployment';

/**
 * `/{locale}`: the public landing page when LANDING_PAGE_ENABLED (the demo),
 * otherwise straight into the app. See docs/features/PUBLIC-LANDING-AND-ACCESS-REQUESTS.md.
 */
export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!LANDING_PAGE_ENABLED) redirect(`/${locale}/dashboard`);
  return <LandingPage locale={locale} />;
}
