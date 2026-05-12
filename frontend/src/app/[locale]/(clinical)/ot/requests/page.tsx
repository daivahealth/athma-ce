'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Ban, CheckCircle2, FileText, Filter, Plus, Search, Send, ShieldCheck, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
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
import { OtRequestStatusBadge } from '@/modules/ot/components/ot-status-badge';

export default function OtRequestsPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const publishToast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OtRequestStatus>('all');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const { data: requests, isLoading, error } = useOtRequests(
    deferredSearchQuery || statusFilter !== 'all'
      ? {
          ...(deferredSearchQuery ? { search: deferredSearchQuery } : {}),
          ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
        }
      : undefined
  );

  const submitRequest = useTransitionOtRequest('submit');
  const reviewRequest = useTransitionOtRequest('review');
  const approveRequest = useTransitionOtRequest('approve');
  const completeRequest = useTransitionOtRequest('complete');
  const cancelRequest = useTransitionOtRequest('cancel');

  const orderedRequests = useMemo(
    () =>
      [...(requests ?? [])].sort(
        (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
      ),
    [requests]
  );

  const handleAction = async (
    id: string,
    action: 'submit' | 'review' | 'approve' | 'complete' | 'cancel'
  ) => {
    try {
      const executor = {
        submit: submitRequest,
        review: reviewRequest,
        approve: approveRequest,
        complete: completeRequest,
        cancel: cancelRequest,
      }[action];

      await executor.mutateAsync({ id });
      publishToast({
        title: 'OT request updated',
        description: `Request ${action.replace('-', ' ')} completed.`,
      });
    } catch (error) {
      publishToast({
        variant: 'destructive',
        title: 'Workflow action failed',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">OT Requests</h1>
          <p className="text-muted-foreground">
            Manage OT demand from draft through approval, scheduling, and completion.
          </p>
        </div>
        <Button onClick={() => router.push(`/${params.locale}/ot/requests/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          New OT Request
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients by name, MRN, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as 'all' | OtRequestStatus)}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {OT_REQUEST_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-muted-foreground">Loading OT requests...</div>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              {(error as Error).message}
            </div>
          ) : orderedRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No OT requests found</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search criteria.'
                  : 'Create the first theatre request or change the current filter.'}
              </p>
              <Button onClick={() => router.push(`/${params.locale}/ot/requests/new`)}>
                <Plus className="mr-2 h-4 w-4" />
                Create OT Request
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Procedure</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Preferred Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderedRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{request.procedureName}</div>
                        <div className="text-sm text-muted-foreground">
                          {request.procedureCode || request.surgeryType || 'Procedure details pending'}
                        </div>
                        {request.remarks ? (
                          <div className="line-clamp-1 text-sm text-muted-foreground">
                            {request.remarks}
                          </div>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium">
                            {request.patientDisplay?.displayName || 'Unknown patient'}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>MRN: {request.patientDisplay?.mrn || '—'}</span>
                            <span>•</span>
                            <span>
                              {request.patientDisplay?.gender || '—'} /{' '}
                              {request.patientDisplay?.age ?? '—'}y
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{request.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      {request.preferredDate
                        ? format(new Date(request.preferredDate), 'dd MMM yyyy')
                        : 'Not set'}
                    </TableCell>
                    <TableCell>
                      <OtRequestStatusBadge status={request.status} />
                    </TableCell>
                    <TableCell>
                      {format(new Date(request.requestedAt), 'dd MMM yyyy, HH:mm')}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {request.status === 'DRAFT' && (
                          <Button
                            size="sm"
                            onClick={() => handleAction(request.id, 'submit')}
                            disabled={submitRequest.isPending}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Submit
                          </Button>
                        )}
                        {request.status === 'REQUESTED' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction(request.id, 'review')}
                              disabled={reviewRequest.isPending}
                            >
                              <ShieldCheck className="mr-2 h-4 w-4" />
                              Review
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAction(request.id, 'approve')}
                              disabled={approveRequest.isPending}
                            >
                              Approve
                            </Button>
                          </>
                        )}
                        {request.status === 'UNDER_REVIEW' && (
                          <Button
                            size="sm"
                            onClick={() => handleAction(request.id, 'approve')}
                            disabled={approveRequest.isPending}
                          >
                            Approve
                          </Button>
                        )}
                        {request.status === 'SCHEDULED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(request.id, 'complete')}
                            disabled={completeRequest.isPending}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Complete
                          </Button>
                        )}
                        {!['COMPLETED', 'CANCELLED', 'REJECTED'].includes(request.status) && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAction(request.id, 'cancel')}
                            disabled={cancelRequest.isPending}
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
