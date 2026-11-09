'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Ban,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileText,
  MoreHorizontal,
  Plus,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { PatientIdentity } from '@/components/ui/patient-identity';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { useOtRequests, useTransitionOtRequest } from '@/modules/ot/hooks/use-ot';
import { OT_REQUEST_STATUSES, type OtRequestStatus } from '@/modules/ot/types';
import { OT_REQUEST_STATUS_TONE } from '@/modules/ot/ot-tone';
import {
  OtRequestPriorityBadge,
  OtRequestStatusBadge,
} from '@/modules/ot/components/ot-status-badge';
import {
  OtDateTime,
  OtErrorPanel,
  OtListToolbar,
  OtSearchInput,
  OtStatusFilter,
  OtTableSkeleton,
  countBy,
} from '@/modules/ot/components/ot-list';

type RequestAction = 'submit' | 'review' | 'approve' | 'complete' | 'cancel';

const STATUS_OPTIONS = OT_REQUEST_STATUSES.map((value) => ({
  value,
  tone: OT_REQUEST_STATUS_TONE[value],
}));
const CLOSED: OtRequestStatus[] = ['COMPLETED', 'CANCELLED', 'REJECTED'];
const ACTION_DONE: Record<RequestAction, string> = {
  submit: 'Request submitted.',
  review: 'Request moved to review.',
  approve: 'Request approved.',
  complete: 'Request completed.',
  cancel: 'Request cancelled.',
};

export default function OtRequestsPage() {
  const params = useParams() as { locale: string };
  const router = useRouter();
  const publishToast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OtRequestStatus>('all');
  const deferredSearchQuery = useDeferredValue(searchQuery.trim());

  // Status is filtered here rather than on the server so each chip can show its count.
  const {
    data: requests,
    isLoading,
    error,
  } = useOtRequests(deferredSearchQuery ? { search: deferredSearchQuery } : undefined);

  const submitRequest = useTransitionOtRequest('submit');
  const reviewRequest = useTransitionOtRequest('review');
  const approveRequest = useTransitionOtRequest('approve');
  const completeRequest = useTransitionOtRequest('complete');
  const cancelRequest = useTransitionOtRequest('cancel');
  const executors = {
    submit: submitRequest,
    review: reviewRequest,
    approve: approveRequest,
    complete: completeRequest,
    cancel: cancelRequest,
  };
  const isMutating = Object.values(executors).some((m) => m.isPending);

  const allRequests = useMemo(
    () =>
      [...(requests ?? [])].sort(
        (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime(),
      ),
    [requests],
  );
  const counts = useMemo(() => countBy(allRequests, (r) => r.status), [allRequests]);
  const visibleRequests = useMemo(
    () =>
      statusFilter === 'all' ? allRequests : allRequests.filter((r) => r.status === statusFilter),
    [allRequests, statusFilter],
  );
  const awaitingDecision = (counts.REQUESTED ?? 0) + (counts.UNDER_REVIEW ?? 0);
  const readyToSchedule = counts.APPROVED ?? 0;

  const handleAction = async (id: string, action: RequestAction) => {
    try {
      await executors[action].mutateAsync({ id });
      publishToast({ title: 'OT request updated', description: ACTION_DONE[action] });
    } catch (error) {
      publishToast({
        variant: 'destructive',
        title: 'Workflow action failed',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const requestHref = (id: string) => `/${params.locale}/ot/requests/${id}`;
  const newHref = `/${params.locale}/ot/requests/new`;
  const filtered = Boolean(deferredSearchQuery) || statusFilter !== 'all';

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        icon={ClipboardList}
        title="OT Requests"
        subtitle="Theatre demand from draft through approval, scheduling and completion."
        actions={
          <Button asChild>
            <Link href={newHref}>
              <Plus className="mr-2 h-4 w-4" />
              New OT Request
            </Link>
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <OtListToolbar
          search={<OtSearchInput value={searchQuery} onChange={setSearchQuery} />}
          summary={
            !isLoading && !error ? (
              <span>
                {awaitingDecision > 0 ? (
                  <span className="font-medium text-amber-700 dark:text-amber-300">
                    {awaitingDecision} awaiting approval
                  </span>
                ) : (
                  <span>None awaiting approval</span>
                )}
                {readyToSchedule > 0 ? (
                  <>
                    {' · '}
                    <span className="font-medium text-emerald-700 dark:text-emerald-300">
                      {readyToSchedule} ready to schedule
                    </span>
                  </>
                ) : null}
                {' · '}
                {visibleRequests.length} of {allRequests.length} shown
              </span>
            ) : null
          }
          filters={
            <OtStatusFilter
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={setStatusFilter}
              counts={counts}
              total={allRequests.length}
            />
          }
        />

        {isLoading ? (
          <OtTableSkeleton />
        ) : error ? (
          <OtErrorPanel error={error} className="m-5" />
        ) : visibleRequests.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={filtered ? 'No requests match' : 'No OT requests yet'}
            description={
              filtered
                ? 'Try another name or MRN, or pick a different status.'
                : 'Raise the first theatre request for a patient’s operation.'
            }
            action={
              filtered ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                >
                  Clear filters
                </Button>
              ) : (
                <Button asChild size="sm">
                  <Link href={newHref}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create OT Request
                  </Link>
                </Button>
              )
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Procedure</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead className="whitespace-nowrap">Preferred date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5 text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleRequests.map((request) => {
                const detail = [request.procedureCode, request.surgeryType]
                  .filter(Boolean)
                  .join(' · ');
                const primary: { action: RequestAction; label: string; icon: typeof Send } | null =
                  request.status === 'DRAFT'
                    ? { action: 'submit', label: 'Submit', icon: Send }
                    : request.status === 'REQUESTED' || request.status === 'UNDER_REVIEW'
                      ? { action: 'approve', label: 'Approve', icon: CheckCircle2 }
                      : request.status === 'SCHEDULED'
                        ? { action: 'complete', label: 'Complete', icon: CheckCircle2 }
                        : null;
                return (
                  <TableRow
                    key={request.id}
                    className="cursor-pointer"
                    onClick={() => router.push(requestHref(request.id))}
                  >
                    <TableCell className="max-w-[340px] py-4 pl-5">
                      <div className="flex items-center gap-2">
                        <Link
                          href={requestHref(request.id)}
                          className="truncate text-sm font-semibold text-foreground hover:text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                          title={request.procedureName}
                        >
                          {request.procedureName}
                        </Link>
                        <OtRequestPriorityBadge priority={request.priority} />
                      </div>
                      <div
                        className="mt-0.5 truncate text-xs text-muted-foreground"
                        title={request.remarks ?? undefined}
                      >
                        {[detail, request.remarks].filter(Boolean).join(' — ') ||
                          'Procedure details pending'}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <PatientIdentity source={request} />
                    </TableCell>
                    <TableCell className="py-4">
                      {request.preferredDate ? (
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          <OtDateTime
                            date={format(new Date(request.preferredDate), 'dd MMM yyyy')}
                          />
                        </div>
                      ) : (
                        <OtDateTime date="Not set" muted />
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col items-start gap-1">
                        <OtRequestStatusBadge status={request.status} />
                        <span
                          className="whitespace-nowrap text-xs text-muted-foreground"
                          title={format(new Date(request.requestedAt), 'dd MMM yyyy, HH:mm')}
                        >
                          Requested{' '}
                          {formatDistanceToNow(new Date(request.requestedAt), { addSuffix: true })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 pr-5">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {primary ? (
                          <Button
                            size="sm"
                            variant={primary.action === 'complete' ? 'outline' : 'default'}
                            onClick={() => handleAction(request.id, primary.action)}
                            disabled={isMutating}
                          >
                            <primary.icon className="mr-1.5 h-3.5 w-3.5" />
                            {primary.label}
                          </Button>
                        ) : null}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              aria-label="More actions"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem onClick={() => router.push(requestHref(request.id))}>
                              <Eye className="mr-2 h-4 w-4" />
                              View request
                            </DropdownMenuItem>
                            {request.status === 'REQUESTED' ? (
                              <DropdownMenuItem
                                disabled={isMutating}
                                onClick={() => handleAction(request.id, 'review')}
                              >
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                Send for review
                              </DropdownMenuItem>
                            ) : null}
                            {!CLOSED.includes(request.status) ? (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  disabled={isMutating}
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleAction(request.id, 'cancel')}
                                >
                                  <Ban className="mr-2 h-4 w-4" />
                                  Cancel request
                                </DropdownMenuItem>
                              </>
                            ) : null}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
