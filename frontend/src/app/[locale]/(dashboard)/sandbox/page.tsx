'use client';

import { useState, type FormEvent } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowRightLeft, Boxes, CalendarPlus, Loader2, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { getApiErrorMessage } from '@/lib/api/errors';
import {
  createSandbox,
  daysLeft,
  deleteSandbox,
  extendSandbox,
  MY_SANDBOX_QUERY_KEY,
  ORGANISATION_TYPES,
  SANDBOX_DEFAULT_MODULES,
  SANDBOX_MODULES,
  switchWorkspace,
  type Sandbox,
  type SandboxModule,
  type SandboxOrganisationType,
  type SandboxStatusResponse,
} from '@/modules/sandboxes/api';
import { useMySandbox } from '@/modules/sandboxes/use-my-sandbox';

const label = (list: ReadonlyArray<{ value: string; label: string }>, value: string) =>
  list.find((item) => item.value === value)?.label ?? value;

function CreateForm({ status, locale }: { status: SandboxStatusResponse; locale: string }) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [organisationName, setOrganisationName] = useState('');
  const [organisationType, setOrganisationType] = useState<SandboxOrganisationType>('hospital');
  const [modules, setModules] = useState<SandboxModule[]>(SANDBOX_DEFAULT_MODULES.hospital);
  const [acknowledged, setAcknowledged] = useState(false);

  const mutation = useMutation({
    mutationFn: createSandbox,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: MY_SANDBOX_QUERY_KEY }),
    onError: (error) =>
      toast({
        title: 'Could not create your sandbox',
        description: getApiErrorMessage(error, 'Try again in a moment.'),
        variant: 'destructive',
      }),
  });

  const chooseType = (type: SandboxOrganisationType) => {
    setOrganisationType(type);
    setModules(SANDBOX_DEFAULT_MODULES[type]);
  };
  const toggle = (module: SandboxModule) =>
    setModules((current) => (current.includes(module) ? current.filter((m) => m !== module) : [...current, module]));

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    mutation.mutate({ organisationName: organisationName.trim(), organisationType, modules, acknowledged });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold">Create your sandbox</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A private copy of the demo hospital&apos;s setup (facilities, staff, catalogues, price lists) with no
          patients. You are its administrator: register patients, book appointments, place orders and bill. It is
          deleted after {status.limits.lifetimeDays} days; you can extend it once.
        </p>
        {status.sandbox?.failed && (
          <p className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
            Setting up your last sandbox failed. Please try again; if it fails again, let us know through{' '}
            <Link href={`/${locale}/request-access`} className="underline underline-offset-2">
              the contact form
            </Link>
            .
          </p>
        )}
        <form onSubmit={onSubmit} className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="organisationName">Organisation name *</Label>
              <Input
                id="organisationName"
                required
                minLength={2}
                maxLength={120}
                value={organisationName}
                onChange={(e) => setOrganisationName(e.target.value)}
                placeholder="e.g. Asha Cancer Centre"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organisationType">Type of organisation *</Label>
              <select
                id="organisationType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={organisationType}
                onChange={(e) => chooseType(e.target.value as SandboxOrganisationType)}
              >
                {ORGANISATION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <fieldset>
            <legend className="text-sm font-medium">Modules</legend>
            <p className="mt-1 text-xs text-muted-foreground">
              Outpatient care (registration, appointments, encounters, orders) and billing are always included.
              Preselected for your type of organisation; you can switch modules on later under Configurations.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {SANDBOX_MODULES.map((module) => (
                <label key={module.value} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-primary"
                    checked={modules.includes(module.value)}
                    onChange={() => toggle(module.value)}
                  />
                  {module.label}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="flex cursor-pointer items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-primary"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
            />
            <span>
              I understand this sandbox is for trying Athma, is deleted after {status.limits.lifetimeDays} days, and
              must not contain real patient data.
            </span>
          </label>

          <Button type="submit" disabled={!acknowledged || organisationName.trim().length < 2 || mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create my sandbox
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Provisioning({ sandbox }: { sandbox: Sandbox }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-6">
        <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
        <div>
          <h2 className="font-semibold">Setting up {sandbox.organisationName}…</h2>
          <p className="text-sm text-muted-foreground">This usually takes less than a minute. You can stay on this page.</p>
        </div>
      </CardContent>
    </Card>
  );
}

function Active({ status, locale }: { status: SandboxStatusResponse; locale: string }) {
  const sandbox = status.sandbox!;
  const queryClient = useQueryClient();
  const toast = useToast();
  const left = daysLeft(sandbox.expiresAt);
  const refresh = () => void queryClient.invalidateQueries({ queryKey: MY_SANDBOX_QUERY_KEY });
  const fail = (title: string) => (error: unknown) =>
    toast({ title, description: getApiErrorMessage(error, 'Try again.'), variant: 'destructive' });

  const switchMutation = useMutation({
    mutationFn: () => switchWorkspace(status.inSandbox ? 'demo' : 'sandbox', locale),
    onError: fail('Could not switch'),
  });
  const extendMutation = useMutation({
    mutationFn: extendSandbox,
    onSuccess: () => {
      refresh();
      toast({ title: 'Sandbox extended', description: `It now runs ${status.limits.extensionDays} days longer.`, variant: 'success' });
    },
    onError: fail('Could not extend'),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteSandbox,
    onSuccess: async () => {
      // A session inside the deleted sandbox no longer works: go back to the demo.
      if (status.inSandbox) await switchWorkspace('demo', locale).catch(() => window.location.assign(`/${locale}/login`));
      else refresh();
    },
    onError: fail('Could not delete'),
  });

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{sandbox.organisationName}</h2>
            <p className="text-sm text-muted-foreground">
              {label(ORGANISATION_TYPES, sandbox.organisationType)} · created {format(new Date(sandbox.createdAt), 'd MMM yyyy')}
            </p>
          </div>
          {sandbox.expiresAt && (
            <p className="rounded-md bg-warning/15 px-3 py-1.5 text-sm">
              {left === 0 ? 'Deleted today' : `${left} day${left === 1 ? '' : 's'} left`} · until{' '}
              {format(new Date(sandbox.expiresAt), 'd MMM yyyy')}
            </p>
          )}
        </div>
        <div>
          <p className="text-sm font-medium">Modules</p>
          <p className="text-sm text-muted-foreground">
            Outpatient care, billing
            {sandbox.modules.length > 0 && `, ${sandbox.modules.map((m) => label(SANDBOX_MODULES, m).split(' (')[0]).join(', ')}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => switchMutation.mutate()} disabled={switchMutation.isPending}>
            {switchMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRightLeft className="mr-2 h-4 w-4" />}
            {status.inSandbox ? 'Back to the demo hospital' : 'Open my sandbox'}
          </Button>
          {sandbox.canExtend && (
            <Button variant="outline" onClick={() => extendMutation.mutate()} disabled={extendMutation.isPending}>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Extend by {status.limits.extensionDays} days
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive" disabled={deleteMutation.isPending}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete sandbox
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {sandbox.organisationName}?</AlertDialogTitle>
                <AlertDialogDescription>
                  Everything in this sandbox, including patients and bills you entered, is removed and cannot be
                  recovered. You can create a new sandbox afterwards.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep it</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteMutation.mutate()}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="font-semibold">{title}</h2>
        <div className="mt-1 text-sm text-muted-foreground">{children}</div>
      </CardContent>
    </Card>
  );
}

export default function SandboxPage() {
  const params = useParams<{ locale: string }>();
  const locale = params.locale ?? 'en';
  const { data: status, isLoading, isError } = useMySandbox();

  let body: React.ReactNode;
  if (isLoading) {
    body = <Notice title="Loading…">Checking your sandbox.</Notice>;
  } else if (isError || !status) {
    body = <Notice title="Sandboxes are not available">Sandboxes are offered on the public demo only.</Notice>;
  } else if (!status.available) {
    body = (
      <Notice title="Sandboxes are not available right now">
        Please try again later, or{' '}
        <Link href={`/${locale}/request-access`} className="underline underline-offset-2">
          request production access
        </Link>
        .
      </Notice>
    );
  } else if (!status.eligible) {
    body = (
      <Notice title="Sign in with Google, Microsoft or GitHub">
        Sandboxes belong to a personal account. Sign out, then sign in with Google, Microsoft or GitHub to create one.
      </Notice>
    );
  } else if (status.sandbox?.status === 'provisioning') {
    body = <Provisioning sandbox={status.sandbox} />;
  } else if (status.sandbox?.status === 'active') {
    body = <Active status={status} locale={locale} />;
  } else {
    body = <CreateForm status={status} locale={locale} />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-6">
      <PageHeader
        title="My sandbox"
        subtitle="Your own hospital on the Athma demo, to try every workflow with your own data."
        icon={Boxes}
      />
      {body}
    </div>
  );
}
