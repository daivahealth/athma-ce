import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { LandingPage } from '@/components/landing/landing-page';
import { LANDING_PAGE_ENABLED, LANDING_URL, siteHref } from '@/lib/config/deployment';

/**
 * `/{locale}`: the public landing page when LANDING_PAGE_ENABLED (the demo),
 * otherwise straight into the app. When the landing page has its own host
 * (LANDING_URL), any other host sends `/{locale}` there, so the home page lives
 * at one address. See docs/features/PUBLIC-LANDING-AND-ACCESS-REQUESTS.md.
 */
export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!LANDING_PAGE_ENABLED) redirect(`/${locale}/dashboard`);
  if (LANDING_URL) {
    const host = (await headers()).get('host');
    if (host && host !== new URL(LANDING_URL).host) redirect(siteHref(LANDING_URL, locale));
  }
  return <LandingPage locale={locale} />;
}
