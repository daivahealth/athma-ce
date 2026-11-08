'use client';

import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { ArrowRightLeft, Boxes, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getApiErrorMessage } from '@/lib/api/errors';
import { cn } from '@/lib/utils';
import { switchWorkspace } from '@/modules/sandboxes/api';
import { useMySandbox } from '@/modules/sandboxes/use-my-sandbox';

/**
 * Topbar control on the public demo: switch between the read-only demo
 * hospital and the user's sandbox, or start creating one. Renders nothing
 * outside demo deployments or for accounts that cannot have a sandbox.
 * See docs/features/SANDBOX-TENANTS.md.
 */
export function WorkspaceSwitcher({ locale, className }: { locale: string; className?: string }) {
  const { data: status } = useMySandbox();
  const toast = useToast();
  const mutation = useMutation({
    mutationFn: (target: 'sandbox' | 'demo') => switchWorkspace(target, locale),
    onError: (error) =>
      toast({ title: 'Could not switch', description: getApiErrorMessage(error, 'Try again.'), variant: 'destructive' }),
  });

  if (!status?.available || !status.eligible) return null;
  const sandbox = status.sandbox;
  const active = sandbox?.status === 'active';
  const classes = cn('hidden h-8 shrink-0 gap-1.5 px-2 text-xs md:inline-flex 2xl:px-3', className);

  if (status.inSandbox || active) {
    const target = status.inSandbox ? 'demo' : 'sandbox';
    const text = status.inSandbox ? 'Demo hospital' : 'My sandbox';
    return (
      <Button
        variant="outline"
        size="sm"
        className={classes}
        disabled={mutation.isPending}
        onClick={() => mutation.mutate(target)}
        title={status.inSandbox ? 'Switch to the read-only demo hospital' : `Switch to ${sandbox?.organisationName ?? 'your sandbox'}`}
        aria-label={status.inSandbox ? 'Switch to the demo hospital' : 'Switch to my sandbox'}
      >
        {mutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowRightLeft className="h-3.5 w-3.5" />}
        <span className="hidden 2xl:inline">{text}</span>
      </Button>
    );
  }

  return (
    <Button asChild variant="outline" size="sm" className={classes}>
      <Link href={`/${locale}/sandbox`} title="Create your own sandbox hospital" aria-label="Create my sandbox">
        <Boxes className="h-3.5 w-3.5" />
        <span className="hidden 2xl:inline">{sandbox?.status === 'provisioning' ? 'Sandbox…' : 'Create sandbox'}</span>
      </Link>
    </Button>
  );
}
