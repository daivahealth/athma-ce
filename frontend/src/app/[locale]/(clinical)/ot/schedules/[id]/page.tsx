'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, FileSignature, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOtSchedule, useOtScheduleHistory } from '@/modules/ot/hooks/use-ot';
import { useStaffList } from '@/modules/foundation/hooks/use-staff';
import { OtScheduleStatusBadge, OtReportStatusBadge } from '@/modules/ot/components/ot-status-badge';

function fmt(value?: string | null): string {
  if (!value) return '—';
  try {
    return format(new Date(value), 'dd MMM yyyy, HH:mm');
  } catch {
    return value;
  }
}

function humanizeRole(role: string): string {
  return role
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function OtScheduleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || 'en';
  const id = params.id as string;

  const { data: schedule, isLoading, error } = useOtSchedule(id);
  const { data: history } = useOtScheduleHistory(id);
  const { data: staff } = useStaffList();

  const staffMap = React.useMemo(() => {
    const m = new Map<string, string>();
    (staff ?? []).forEach((s) => m.set(s.id, s.displayName || `${s.firstName} ${s.lastName}`));
    return m;
  }, [staff]);

  const staffName = (staffId?: string | null) => (staffId ? staffMap.get(staffId) ?? staffId : null);
  const roomName = schedule?.roomDisplayName || schedule?.room?.space?.name || null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/${locale}/ot/schedules`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">Loading OT schedule...</div>
      ) : error || !schedule ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {error instanceof Error ? error.message : 'OT schedule not found.'}
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    {roomName || 'OT Schedule'}
                    <OtScheduleStatusBadge status={schedule.status} />
                  </CardTitle>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="font-medium text-foreground">
                      {schedule.patientDisplay?.displayName || 'Unknown patient'}
                    </span>
                    <span>
                      MRN: {schedule.patientDisplay?.mrn || '—'} · {schedule.patientDisplay?.gender || '—'} /{' '}
                      {schedule.patientDisplay?.age ?? '—'}y
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Scheduled Start</p>
                <p className="font-medium">{fmt(schedule.scheduledStartTime)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Scheduled End</p>
                <p className="font-medium">{fmt(schedule.scheduledEndTime)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Actual Start</p>
                <p className="font-medium">{fmt(schedule.actualStartTime)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Actual End</p>
                <p className="font-medium">{fmt(schedule.actualEndTime)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Primary Surgeon</p>
                <p className="font-medium">{staffName(schedule.primarySurgeonId) || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Anaesthetist</p>
                <p className="font-medium">{staffName(schedule.anaesthetistId) || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Scrub Nurse</p>
                <p className="font-medium">{staffName(schedule.scrubNurseId) || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Circulating Nurse</p>
                <p className="font-medium">{staffName(schedule.circulatingNurseId) || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Technician</p>
                <p className="font-medium">{staffName(schedule.technicianId) || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Anaesthesia Type</p>
                <p className="font-medium">{schedule.anaesthesiaType || '—'}</p>
              </div>
              {schedule.assistantSurgeonIds?.length ? (
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Assistant Surgeons</p>
                  <p className="font-medium">
                    {schedule.assistantSurgeonIds.map((sid) => staffName(sid) || sid).join(', ')}
                  </p>
                </div>
              ) : null}
              {schedule.postponedReason ? (
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Postponed Reason</p>
                  <p className="font-medium text-amber-600 dark:text-amber-400">{schedule.postponedReason}</p>
                </div>
              ) : null}
              {schedule.cancelledReason ? (
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Cancelled Reason</p>
                  <p className="font-medium text-destructive">{schedule.cancelledReason}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {schedule.teamMembers && schedule.teamMembers.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4" /> Team Members
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {schedule.teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-card/60 p-2.5 text-sm"
                  >
                    <span className="font-medium">{staffName(member.staffId) || member.staffId}</span>
                    <span className="text-xs text-muted-foreground">{humanizeRole(member.role)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {schedule.reports && schedule.reports.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">OT Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {schedule.reports.map((r) => (
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
