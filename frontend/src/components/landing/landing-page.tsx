import Image from 'next/image';
import Link from 'next/link';
import {
  Activity,
  BarChart3,
  BedDouble,
  CalendarDays,
  ClipboardList,
  FlaskConical,
  Github,
  Globe2,
  IdCard,
  Pill,
  Receipt,
  Ribbon,
  ScanLine,
  ShieldAlert,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LegalLinks } from '@/components/legal/legal-shell';
import {
  DEMO_APP_URL,
  PRODUCTION_APP_URL,
  SOURCE_REPOSITORY_URL,
  siteHref,
} from '@/lib/config/deployment';

const MODULES = [
  {
    icon: CalendarDays,
    title: 'Patient access',
    text: 'Registration, appointments, staff calendars and scheduling.',
  },
  {
    icon: Stethoscope,
    title: 'Clinical records & orders',
    text: 'Encounters, clinical notes and order entry across departments.',
  },
  {
    icon: FlaskConical,
    title: 'Laboratory',
    text: 'Sample collection, results, sign-off and lab operations.',
  },
  {
    icon: ScanLine,
    title: 'Results & imaging',
    text: 'Imaging orders and reports alongside lab results.',
  },
  {
    icon: Activity,
    title: 'Operating theatre',
    text: 'OT requests, schedules and a live theatre board.',
  },
  {
    icon: BedDouble,
    title: 'Inpatient care',
    text: 'Admissions, ward and bed boards, transfers and discharge.',
  },
  { icon: Pill, title: 'Pharmacy', text: 'Prescriptions and dispensing.' },
  {
    icon: Receipt,
    title: 'Billing & revenue cycle',
    text: 'Invoices, receipts, insurance, pre-authorisation and claims.',
  },
  {
    icon: Ribbon,
    title: 'Oncology',
    text: 'Cancer journeys, chemotherapy protocols, day care and population health.',
  },
  { icon: BarChart3, title: 'Analytics', text: 'Operational and clinical dashboards.' },
  {
    icon: IdCard,
    title: 'ABDM ready (India)',
    text: 'ABHA patient identity and ABDM integration.',
  },
  {
    icon: Sparkles,
    title: 'Health AI+',
    text: 'AI-assisted patient summaries and clinical coding suggestions.',
  },
] as const;

/**
 * Public landing page (`/{locale}` when LANDING_PAGE_ENABLED). Served on its own
 * host (LANDING_URL), it sends visitors to the demo app at DEMO_APP_URL and, once
 * it exists, customers to PRODUCTION_APP_URL.
 * See docs/features/PUBLIC-LANDING-AND-ACCESS-REQUESTS.md.
 */
export function LandingPage({ locale }: { locale: string }) {
  const login = siteHref(DEMO_APP_URL, locale, '/login');
  const productionLogin = PRODUCTION_APP_URL ? siteHref(PRODUCTION_APP_URL, locale, '/login') : '';
  const requestAccess = `/${locale}/request-access`;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">

      <header className="border-b border-border/60 bg-background/95">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href={`/${locale}`} aria-label="Athma home" className="shrink-0">
            <Image
              src="/athma-logo.svg"
              alt="Athma"
              width={120}
              height={35}
              className="h-8 w-auto dark:hidden"
              priority
            />
            <Image
              src="/athma-logo-dark.svg"
              alt="Athma"
              width={120}
              height={35}
              className="hidden h-8 w-auto dark:block"
              priority
            />
          </Link>
          <nav aria-label="Main" className="flex items-center gap-1 text-sm sm:gap-3">
            <a
              href="#modules"
              className="hidden rounded px-2 py-1 text-muted-foreground hover:text-foreground sm:inline"
            >
              Modules
            </a>
            <a
              href="#open-source"
              className="hidden rounded px-2 py-1 text-muted-foreground hover:text-foreground sm:inline"
            >
              Open source
            </a>
            <Link
              href={requestAccess}
              className="hidden rounded px-2 py-1 text-muted-foreground hover:text-foreground md:inline"
            >
              Request access
            </Link>
            <Button asChild size="sm">
              <Link href={login}>Sign in</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-4 pb-12 pt-12 md:pt-20">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Github className="h-3.5 w-3.5" aria-hidden="true" />
            Open source · Apache License 2.0
          </p>
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight md:text-5xl">
            A hospital information system you can explore today
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
            Athma brings patient access, clinical care, labs, theatres, wards, pharmacy, billing and
            oncology into one open-source platform. Sign in to a fully working demo hospital and see
            it for yourself.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={login}>Explore the live demo</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={SOURCE_REPOSITORY_URL} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" aria-hidden="true" />
                View on GitHub
              </a>
            </Button>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Sign in with Google to look around a demo hospital, read-only. No setup needed.
          </p>
        </section>

        <section aria-labelledby="demo-notice" className="mx-auto w-full max-w-6xl px-4">
          <div className="flex gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm leading-relaxed md:p-5">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden="true" />
            <div>
              <h2 id="demo-notice" className="font-semibold">
                This is a demonstration, not a live hospital system
              </h2>
              <p className="mt-1 text-muted-foreground">
                Every patient, doctor and record here is fictitious. The demo is not for clinical
                use: do not enter real patient information. Visitors can look at everything but
                cannot change the demo hospital&apos;s data, and the data may be reset at any time.
                For a production system, request access below.
              </p>
            </div>
          </div>
        </section>

        <section
          id="modules"
          aria-labelledby="modules-heading"
          className="mx-auto w-full max-w-6xl scroll-mt-16 px-4 py-14"
        >
          <h2 id="modules-heading" className="text-2xl font-semibold tracking-tight">
            What&apos;s inside
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Every module below is in the demo, working on the same patients and records.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-xl border border-border bg-card p-4">
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="mt-3 font-medium">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-y border-border/60 bg-muted/30">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 md:grid-cols-2">
            <div id="open-source" className="scroll-mt-16">
              <ClipboardList className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="mt-3 text-xl font-semibold tracking-tight">Open source, for anyone</h2>
              <p className="mt-2 text-muted-foreground">
                Athma Community Edition is free and open source under the Apache License 2.0. Read
                the code, run it on your own servers, adapt it to your hospital, and contribute
                back.
              </p>
              <Button asChild variant="outline" className="mt-5">
                <a href={SOURCE_REPOSITORY_URL} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" aria-hidden="true" />
                  daivahealth/athma-ce on GitHub
                </a>
              </Button>
            </div>
            <div id="saas" className="scroll-mt-16">
              <Globe2 className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="mt-3 text-xl font-semibold tracking-tight">
                Hosted Athma, starting in India
              </h2>
              <p className="mt-2 text-muted-foreground">
                We are launching Athma as a hosted service for hospitals and clinics in India first.
                The demo is open to everyone, everywhere. Want Athma in production for your
                organisation? Tell us about it and we&apos;ll be in touch.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <Link href={requestAccess}>Request production access</Link>
                </Button>
                {productionLogin && (
                  <Button asChild variant="outline">
                    <Link href={productionLogin}>Customer sign-in</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row">
        <p>
          © {new Date().getFullYear()} Daiva Health Systems Private Limited. Athma CE is licensed
          under Apache 2.0.
        </p>
        <LegalLinks locale={locale} />
      </footer>
    </div>
  );
}
