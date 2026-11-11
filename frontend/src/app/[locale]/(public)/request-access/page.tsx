'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LegalLinks } from '@/components/legal/legal-shell';
import { getApiErrorMessage } from '@/lib/api/errors';
import { DEMO_APP_URL, siteHref } from '@/lib/config/deployment';
import {
  ACCESS_REQUEST_MODULES,
  ORGANISATION_TYPES,
  submitAccessRequest,
  type AccessRequestInput,
} from '@/modules/access-requests/api';

const EMPTY: AccessRequestInput = {
  organisationName: '',
  organisationType: 'hospital',
  contactName: '',
  email: '',
  phone: '',
  country: 'India',
  modules: [],
  message: '',
  consent: false,
  website: '',
};

/**
 * Public "Request production access" form. Stores the request for the
 * operator (super_admin) to review at /{locale}/access-requests.
 * See docs/features/PUBLIC-LANDING-AND-ACCESS-REQUESTS.md.
 */
export default function RequestAccessPage() {
  const { locale } = useParams() as { locale: string };
  const [form, setForm] = useState<AccessRequestInput>(EMPTY);
  const [facilityCount, setFacilityCount] = useState('');
  const [bedCount, setBedCount] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof AccessRequestInput>(key: K, value: AccessRequestInput[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const toggleModule = (value: string) =>
    set(
      'modules',
      form.modules.includes(value)
        ? form.modules.filter((m) => m !== value)
        : [...form.modules, value],
    );

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!form.consent) {
      setError('Please agree to be contacted about your request.');
      return;
    }
    setState('sending');
    try {
      await submitAccessRequest({
        ...form,
        phone: form.phone?.trim() || undefined,
        message: form.message?.trim() || undefined,
        facilityCount: facilityCount ? Number(facilityCount) : undefined,
        bedCount: bedCount ? Number(bedCount) : undefined,
        website: form.website || undefined,
      } as AccessRequestInput);
      setState('sent');
    } catch (err) {
      setState('idle');
      setError(getApiErrorMessage(err, 'We could not send your request. Please try again.'));
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border/60">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <Link href={`/${locale}`} aria-label="Athma home">
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
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:py-12">
        {state === 'sent' ? (
          <div className="rounded-xl border border-success/40 bg-success/10 p-6 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-success" aria-hidden="true" />
            <h1 className="mt-3 text-xl font-semibold">Thank you, we have your request</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We will contact you at <strong>{form.email}</strong>. Meanwhile, feel free to keep
              exploring the demo.
            </p>
            <Button asChild className="mt-5">
              <Link href={siteHref(DEMO_APP_URL, locale, '/login')}>Explore the demo</Link>
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold tracking-tight">Request production access</h1>
            <p className="mt-2 text-muted-foreground">
              Tell us about your organisation. Hosted Athma is launching in India first; we read
              every request and will get back to you. Fields marked * are required.
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-6" noValidate={false}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="organisationName">Organisation name *</Label>
                  <Input
                    id="organisationName"
                    required
                    minLength={2}
                    maxLength={200}
                    value={form.organisationName}
                    onChange={(e) => set('organisationName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organisationType">Type of organisation *</Label>
                  <select
                    id="organisationType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={form.organisationType}
                    onChange={(e) => set('organisationType', e.target.value)}
                  >
                    {ORGANISATION_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    required
                    minLength={2}
                    maxLength={80}
                    value={form.country}
                    onChange={(e) => set('country', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactName">Your name *</Label>
                  <Input
                    id="contactName"
                    required
                    minLength={2}
                    maxLength={120}
                    autoComplete="name"
                    value={form.contactName}
                    onChange={(e) => set('contactName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Work email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    maxLength={254}
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    maxLength={30}
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="facilityCount">Facilities</Label>
                    <Input
                      id="facilityCount"
                      type="number"
                      min={1}
                      max={10000}
                      inputMode="numeric"
                      value={facilityCount}
                      onChange={(e) => setFacilityCount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bedCount">Beds</Label>
                    <Input
                      id="bedCount"
                      type="number"
                      min={0}
                      max={100000}
                      inputMode="numeric"
                      value={bedCount}
                      onChange={(e) => setBedCount(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <fieldset>
                <legend className="text-sm font-medium">Modules you are interested in</legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {ACCESS_REQUEST_MODULES.map((module) => (
                    <label
                      key={module.value}
                      className="flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-primary"
                        checked={form.modules.includes(module.value)}
                        onChange={() => toggleModule(module.value)}
                      />
                      {module.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="space-y-2">
                <Label htmlFor="message">Anything else we should know?</Label>
                <Textarea
                  id="message"
                  rows={4}
                  maxLength={2000}
                  value={form.message}
                  onChange={(e) => set('message', e.target.value)}
                />
              </div>

              {/* Honeypot: hidden from people and screen readers; bots tend to fill it. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => set('website', e.target.value)}
                />
              </div>

              <label className="flex cursor-pointer items-start gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                  checked={form.consent}
                  onChange={(e) => set('consent', e.target.checked)}
                />
                <span>
                  I agree that Daiva Health may store these details and contact me about this
                  request, as described in the{' '}
                  <Link
                    href={`/${locale}/privacy`}
                    className="font-medium underline underline-offset-2 hover:text-primary"
                  >
                    Privacy Policy
                  </Link>
                  . *
                </span>
              </label>

              {error && <p className="text-sm font-medium text-destructive">{error}</p>}

              <Button type="submit" size="lg" disabled={state === 'sending'}>
                {state === 'sending' && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                )}
                Send request
              </Button>
            </form>
          </>
        )}
      </main>

      <footer className="mx-auto w-full max-w-3xl px-4 py-6">
        <LegalLinks locale={locale} />
      </footer>
    </div>
  );
}
