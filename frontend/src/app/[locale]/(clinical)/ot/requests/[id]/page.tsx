'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, Clock, FileSignature, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useOtRequest,
  useOtRequestHistory,
  useOtRooms,
} from '@/modules/ot/hooks/use-ot';
import { useStaffList } from '@/modules/foundation/hooks/use-staff';
import { OtRequestStatusBadge, OtScheduleStatusBadge, OtReportStatusBadge } from '@/modules/ot/components/ot-status-badge';

function fmt(value?: string | null): string {
  if (!value) return '—';
  try {
    return format(new Date(value), 'dd MMM yyyy, HH:mm');
  } catch {
    return value;
  }
}

function fmtDate(value?: string | null): string {
  if (!value) return '—';
  try {
    return format(new Date(value), 'dd MMM yyyy');
  } catch {
    return value;
  }
}

export default function OtRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || 'en';
  const id = params.id as string;

  const { data: request, isLoading, error } = useOtRequest(id);
  const { data: history } = useOtRequestHistory(id);
  const { data: rooms } = useOtRooms();
  const { data: staff } = useStaffList();

  const roomMap = React.useMemo(() => {
    const m = new Map<string, string>();
    (rooms ?? []).forEach((r) => {
      if (r.space?.name) m.set(r.spaceId, r.space.name);
    });
    return m;
  }, [rooms]);

  const staffMap = React.useMemo(() => {
    const m = new Map<string, string>();
    (staff ?? []).forEach((s) => m.set(s.id, s.displayName || `${s.firstName} ${s.lastName}`));
    return m;
  }, [staff]);

  const roomName = request?.preferredOtRoomSpaceId
    ? roomMap.get(request.preferredOtRoomSpaceId) ?? request.preferredOtRoomSpaceId
    : null;
  const surgeonName = request?.primarySurgeonId
    ? staffMap.get(request.primarySurgeonId) ?? request.primarySurgeonId
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/${locale}/ot/requests`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">Loading OT request...</div>
      ) : error || !request ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {error instanceof Error ? error.message : 'OT request not found.'}
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    {request.procedureName}
                    <OtRequestStatusBadge status={request.status} />
                  </CardTitle>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="font-medium text-foreground">
                      {request.patientDisplay?.displayName || 'Unknown patient'}
                    </span>
                    <span>
                      MRN: {request.patientDisplay?.mrn || '—'} · {request.patientDisplay?.gender || '—'} /{' '}
                      {request.patientDisplay?.age ?? '—'}y
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Priority</p>
                <p className="font-medium capitalize">{request.priority?.toLowerCase() ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Surgery Type</p>
                <p className="font-medium">{request.surgeryType || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Procedure Code</p>
                <p className="font-medium">{request.procedureCode || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Expected Duration</p>
                <p className="font-medium">
                  {request.expectedDurationMinutes ? `${request.expectedDurationMinutes} minutes` : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Preferred Date</p>
                <p className="font-medium">{fmtDate(request.preferredDate)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Preferred Room</p>
                <p className="font-medium">{roomName || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Primary Surgeon</p>
                <p className="font-medium">{surgeonName || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Anaesthesia</p>
                <p className="font-medium">
                  {request.anaesthesiaTypePlanned || '—'}
                  {request.anaesthetistRequired ? ' · Anaesthetist required' : ''}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Blood Required</p>
                <p className="font-medium">{request.bloodRequired ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Requested At</p>
                <p className="font-medium">{fmt(request.requestedAt)}</p>
              </div>
              {request.diagnosis ? (
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Diagnosis</p>
                  <p className="font-medium">{request.diagnosis}</p>
                </div>
              ) : null}
              {request.remarks ? (
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Remarks</p>
                  <p className="font-medium">{request.remarks}</p>
                </div>
              ) : null}
              {request.specialEquipmentRequired?.length ? (
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Special Equipment</p>
                  <p className="font-medium">{request.specialEquipmentRequired.join(', ')}</p>
                </div>
              ) : null}
              {request.implantsRequired?.length ? (
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Implants</p>
                  <p className="font-medium">{request.implantsRequired.join(', ')}</p>
                </div>
              ) : null}
              {request.status === 'REJECTED' && request.rejectionReason ? (
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Rejection Reason</p>
                  <p className="font-medium text-destructive">{request.rejectionReason}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {request.schedules && request.schedules.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">OT Schedules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {request.schedules.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => router.push(`/${locale}/ot/schedules/${s.id}`)}
                    className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-card/60 p-2.5 text-left text-sm hover:bg-accent/40"
                  >
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {fmt(s.scheduledStartTime)}
                    </span>
                    <OtScheduleStatusBadge status={s.status} />
                  </button>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {request.reports && request.reports.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">OT Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {request.reports.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => router.push(`/${locale}/ot/reports/${r.id}`)}
                    className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-card/60 p-2.5 text-left text-sm hover:bg-accent/40"
                  >
                    <span className="flex items-center gap-2">
                      <FileSignature className="h-4 w-4 text-muted-foreground" />
                      {r.reportNumber}
                    </span>
                    <OtReportStatusBadge status={r.reportStatus} />
                  </button>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {history && history.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[...history]
                  .sort((a, b) => b.changedAt.localeCompare(a.changedAt))
                  .map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between rounded-lg border border-border/60 bg-card/60 p-2.5 text-sm"
                    >
                      <span>
                        {event.fromStatus ? `${event.fromStatus} → ` : ''}
                        {event.toStatus}
                      </span>
                      <span className="text-xs text-muted-foreground">{fmt(event.changedAt)}</span>
                    </div>
                  ))}
              </CardContent>
            </Card>
          ) : null}
        </>
      )}
    </div>
  );
}
