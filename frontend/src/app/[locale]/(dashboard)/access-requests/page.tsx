'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Inbox } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { getApiErrorMessage } from '@/lib/api/errors';
import { cn } from '@/lib/utils';
import {
  ACCESS_REQUEST_MODULES,
  ACCESS_REQUEST_STATUSES,
  ORGANISATION_TYPES,
  listAccessRequests,
  updateAccessRequest,
  type AccessRequest,
  type AccessRequestStatus,
} from '@/modules/access-requests/api';

const STATUS_TONE: Record<AccessRequestStatus, string> = {
  new: 'bg-info/15 text-info',
  contacted: 'bg-warning/15 text-warning',
  approved: 'bg-success/15 text-success',
  declined: 'bg-muted text-muted-foreground',
};

const label = (list: ReadonlyArray<{ value: string; label: string }>, value: string) =>
  list.find((item) => item.value === value)?.label ?? value;

function RequestCard({ request }: { request: AccessRequest }) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [notes, setNotes] = useState(request.adminNotes ?? '');
  const mutation = useMutation({
    mutationFn: (update: { status?: AccessRequestStatus; adminNotes?: string }) =>
      updateAccessRequest(request.id, update),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['access-requests'] });
      toast({ title: 'Access request updated', variant: 'success' });
    },
    onError: (error) =>
      toast({
        title: 'Update failed',
        description: getApiErrorMessage(error, 'Try again.'),
        variant: 'destructive',
      }),
  });

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="font-medium">{request.organisationName}</h3>
            <p className="text-sm text-muted-foreground">
              {label(ORGANISATION_TYPES, request.organisationType)} · {request.country}
              {request.facilityCount ? ` · ${request.facilityCount} facilities` : ''}
              {request.bedCount ? ` · ${request.bedCount} beds` : ''}
            </p>
          </div>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-medium capitalize',
              STATUS_TONE[request.status],
            )}
          >
            {request.status}
          </span>
        </div>
        <p className="text-sm">
          <span className="font-medium">{request.contactName}</span> ·{' '}
          <a
            href={`mailto:${request.email}`}
            className="text-primary underline-offset-2 hover:underline"
          >
            {request.email}
          </a>
          {request.phone ? ` · ${request.phone}` : ''}
        </p>
        {request.modules.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Interested in: {request.modules.map((m) => label(ACCESS_REQUEST_MODULES, m)).join(', ')}
          </p>
        )}
        {request.message && (
          <p className="whitespace-pre-line rounded-md bg-muted/50 p-3 text-sm">
            {request.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Received {format(new Date(request.createdAt), 'dd MMM yyyy, HH:mm')}
        </p>
        <div className="space-y-2">
          <Textarea
            aria-label={`Notes for ${request.organisationName}`}
            placeholder="Internal notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {ACCESS_REQUEST_STATUSES.filter((s) => s !== request.status).map((status) => (
              <Button
                key={status}
                size="sm"
                variant={status === 'approved' ? 'default' : 'outline'}
                disabled={mutation.isPending}
                onClick={() => mutation.mutate({ status, adminNotes: notes })}
                className="capitalize"
              >
                Mark {status}
              </Button>
            ))}
            {notes !== (request.adminNotes ?? '') && (
              <Button
                size="sm"
                variant="ghost"
                disabled={mutation.isPending}
                onClick={() => mutation.mutate({ adminNotes: notes })}
              >
                Save notes
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Production access requests from the public site (platform admins only).
 * See docs/features/PUBLIC-LANDING-AND-ACCESS-REQUESTS.md.
 */
export default function AccessRequestsPage() {
  const [status, setStatus] = useState<AccessRequestStatus | undefined>('new');
  const { data, isLoading, error } = useQuery({
    queryKey: ['access-requests', status ?? 'all'],
    queryFn: () => listAccessRequests(status),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Access requests"
        subtitle="Requests for production access submitted from the public site"
        icon={Inbox}
      />
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
        {[undefined, ...ACCESS_REQUEST_STATUSES].map((value) => {
          const count = value ? data?.counts?.[value] : undefined;
          return (
            <Button
              key={value ?? 'all'}
              role="tab"
              aria-selected={status === value}
              size="sm"
              variant={status === value ? 'default' : 'outline'}
              onClick={() => setStatus(value)}
              className="capitalize"
            >
              {value ?? 'All'}
              {count !== undefined ? ` (${count})` : ''}
            </Button>
          );
        })}
      </div>
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {error && (
        <p className="text-sm text-destructive">
          {getApiErrorMessage(error, 'Could not load access requests.')}
        </p>
      )}
      {data && data.data.length === 0 && (
        <p className="text-sm text-muted-foreground">No requests here yet.</p>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        {data?.data.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>
    </div>
  );
}
