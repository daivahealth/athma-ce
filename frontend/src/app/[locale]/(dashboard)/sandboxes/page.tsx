'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Boxes } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getApiErrorMessage } from '@/lib/api/errors';
import { getSession } from '@/lib/api/client';
import { decodeAccessToken } from '@/lib/auth/tokens';
import { cn } from '@/lib/utils';
import {
  adminDeleteSandbox,
  adminExtendSandbox,
  daysLeft,
  listSandboxes,
  ORGANISATION_TYPES,
  PLATFORM_SANDBOX_MANAGE,
  type AdminSandbox,
  type SandboxStatus,
} from '@/modules/sandboxes/api';

const STATUSES: SandboxStatus[] = ['active', 'provisioning', 'failed', 'expired', 'deleting', 'deleted'];

const STATUS_TONE: Record<SandboxStatus, string> = {
  active: 'bg-success/15 text-success',
  provisioning: 'bg-info/15 text-info',
  failed: 'bg-destructive/15 text-destructive',
  expired: 'bg-warning/15 text-warning',
  deleting: 'bg-warning/15 text-warning',
  deleted: 'bg-muted text-muted-foreground',
};

const typeLabel = (value: string) => ORGANISATION_TYPES.find((type) => type.value === value)?.label ?? value;

function SandboxRow({ sandbox, canManage }: { sandbox: AdminSandbox; canManage: boolean }) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const onSuccess = (title: string) => () => {
    void queryClient.invalidateQueries({ queryKey: ['sandboxes', 'all'] });
    toast({ title, variant: 'success' });
  };
  const onError = (title: string) => (error: unknown) =>
    toast({ title, description: getApiErrorMessage(error, 'Try again.'), variant: 'destructive' });
  const extend = useMutation({ mutationFn: () => adminExtendSandbox(sandbox.id), onSuccess: onSuccess('Sandbox extended'), onError: onError('Extend failed') });
  const remove = useMutation({ mutationFn: () => adminDeleteSandbox(sandbox.id), onSuccess: onSuccess('Sandbox deletion started'), onError: onError('Delete failed') });
  const left = daysLeft(sandbox.expiresAt);

  return (
    <Card>
      <CardContent className="flex flex-wrap items-start justify-between gap-3 p-4">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium">{sandbox.organisationName}</h3>
            <span className={cn('rounded px-1.5 py-0.5 text-xs font-medium', STATUS_TONE[sandbox.status])}>{sandbox.status}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {typeLabel(sandbox.organisationType)} · {sandbox.ownerName ?? 'Unknown'}
            {sandbox.ownerEmail && (
              <>
                {' '}
                (<a href={`mailto:${sandbox.ownerEmail}`} className="underline underline-offset-2">{sandbox.ownerEmail}</a>)
              </>
            )}{' '}
            via {sandbox.ownerProvider}
          </p>
          <p className="text-xs text-muted-foreground">
            Created {format(new Date(sandbox.createdAt), 'd MMM yyyy HH:mm')}
            {sandbox.status === 'active' && sandbox.expiresAt && ` · ${left} days left`}
            {sandbox.lastSwitchAt && ` · last opened ${format(new Date(sandbox.lastSwitchAt), 'd MMM HH:mm')}`}
            {sandbox.deletedAt && ` · deleted ${format(new Date(sandbox.deletedAt), 'd MMM yyyy')}`}
          </p>
          {sandbox.modules.length > 0 && <p className="text-xs text-muted-foreground">Modules: {sandbox.modules.join(', ')}</p>}
          {sandbox.error && <p className="text-xs text-destructive">{sandbox.error}</p>}
        </div>
        {canManage && sandbox.status === 'active' && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => extend.mutate()} disabled={extend.isPending}>
              Extend
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive"
              disabled={remove.isPending}
              onClick={() => {
                if (window.confirm(`Delete ${sandbox.organisationName} and all its data? This cannot be undone.`)) remove.mutate();
              }}
            >
              Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** Platform admins: every sandbox on this instance. Needs platform.sandbox.read. */
export default function SandboxesAdminPage() {
  const [filter, setFilter] = useState<SandboxStatus | 'all'>('active');
  const { data, isLoading, isError, error } = useQuery({ queryKey: ['sandboxes', 'all'], queryFn: listSandboxes });
  const canManage = !!decodeAccessToken(getSession().accessToken)?.permissions?.includes(PLATFORM_SANDBOX_MANAGE);
  const rows = (data?.data ?? []).filter((row) => filter === 'all' || row.status === filter);
  const live = (data?.counts.active ?? 0) + (data?.counts.provisioning ?? 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      <PageHeader
        title="Sandboxes"
        subtitle={data ? `${live} of ${data.limits.maxActive} in use · deleted after ${data.limits.lifetimeDays} days` : 'Sandbox hospitals created by demo visitors'}
        icon={Boxes}
      />
      <div className="flex flex-wrap gap-2">
        {(['all', ...STATUSES] as const).map((status) => (
          <Button key={status} size="sm" variant={filter === status ? 'default' : 'outline'} onClick={() => setFilter(status)}>
            {status === 'all' ? 'All' : status}
            {status !== 'all' && data && ` (${data.counts[status] ?? 0})`}
          </Button>
        ))}
      </div>
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {isError && <p className="text-sm text-destructive">{getApiErrorMessage(error, 'Could not load sandboxes.')}</p>}
      {data && rows.length === 0 && <p className="text-sm text-muted-foreground">No sandboxes here.</p>}
      <div className="space-y-3">
        {rows.map((sandbox) => (
          <SandboxRow key={sandbox.id} sandbox={sandbox} canManage={canManage} />
        ))}
      </div>
    </div>
  );
}
