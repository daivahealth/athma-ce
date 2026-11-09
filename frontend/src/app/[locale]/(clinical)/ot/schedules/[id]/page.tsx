'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { format, isSameDay } from 'date-fns';
import {
  Activity,
  AlertTriangle,
  CalendarClock,
  ClipboardList,
  Clock,
  DoorOpen,
  FileSignature,
  History,
  Syringe,
  Users,
} from 'lucide-react';
import { TONE_TEXT, TONE_WASH } from '@/components/ui/tone-classes';
import { cn } from '@/lib/utils';
import { useOtSchedule, useOtScheduleHistory } from '@/modules/ot/hooks/use-ot';
import { useStaffList } from '@/modules/foundation/hooks/use-staff';
import { otScheduleStatusTone } from '@/modules/ot/ot-tone';
import {
  OtReportStatusBadge,
  OtScheduleStatusBadge,
} from '@/modules/ot/components/ot-status-badge';
import { OtErrorPanel, humanize } from '@/modules/ot/components/ot-list';
import {
  OtDetailHero,
  OtDetailSkeleton,
  OtFact,
  OtLinkRow,
  OtSection,
  OtStatusTimeline,
} from '@/modules/ot/components/ot-detail';
import type { OtScheduleStatus } from '@/modules/ot/types';

function fmt(value?: string | null): string | null {
  if (!value) return null;
  try {
    return format(new Date(value), 'dd MMM yyyy, HH:mm');
  } catch {
    return value;
  }
}

function range(startIso?: string | null, endIso?: string | null) {
  if (!startIso) return null;
  const start = new Date(startIso);
  if (!endIso) return `${format(start, 'dd MMM yyyy, HH:mm')} – in progress`;
  const end = new Date(endIso);
  return `${format(start, 'dd MMM yyyy, HH:mm')} – ${format(end, isSameDay(start, end) ? 'HH:mm' : 'dd MMM, HH:mm')}`;
}

/** The day-of-surgery steps in order, for the progress tracker. */
const FLOW: OtScheduleStatus[] = [
  'PLANNED',
  'CONFIRMED',
  'PATIENT_READY',
  'PATIENT_IN_OT',
  'ANAESTHESIA_STARTED',
  'SURGERY_STARTED',
  'SURGERY_COMPLETED',
  'PATIENT_SHIFTED_TO_RECOVERY',
];

const FLOW_LABEL: Partial<Record<OtScheduleStatus, string>> = {
  PATIENT_IN_OT: 'In OT',
  ANAESTHESIA_STARTED: 'Anaesthesia',
  SURGERY_STARTED: 'Surgery',
  SURGERY_COMPLETED: 'Completed',
  PATIENT_SHIFTED_TO_RECOVERY: 'Recovery',
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (
    (parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')
  ).toUpperCase();
}

/** A horizontal stepper across the theatre stages, filled up to the current one. */
function FlowTracker({ status }: { status: OtScheduleStatus }) {
  const index = FLOW.indexOf(status);
  return (
    <ol className="grid grid-cols-4 gap-y-4 sm:grid-cols-8">
      {FLOW.map((step, i) => {
        const done = index >= 0 && i < index;
        const current = i === index;
        return (
          <li key={step} className="relative flex flex-col items-center text-center">
            {i > 0 ? (
              <span
                className={cn(
                  'absolute right-1/2 top-3 h-0.5 w-full -translate-y-1/2',
                  done || current ? 'bg-primary' : 'bg-border',
                )}
                aria-hidden="true"
              />
            ) : null}
            <span
              className={cn(
                'relative z-10 flex size-6 items-center justify-center rounded-full border-2 text-[10px] font-semibold',
                done && 'border-primary bg-primary text-primary-foreground',
                current && 'border-primary bg-background text-primary ring-4 ring-primary/15',
                !done && !current && 'border-border bg-background text-muted-foreground',
              )}
            >
              {i + 1}
            </span>
            <span
              className={cn(
                'mt-1.5 px-1 text-[11px] leading-tight',
                current ? 'font-semibold text-foreground' : 'text-muted-foreground',
              )}
            >
              {FLOW_LABEL[step] ?? humanize(step)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default function OtScheduleDetailPage() {
  const params = useParams();
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
  const staffName = (staffId?: string | null) =>
    staffId ? (staffMap.get(staffId) ?? staffId) : null;

  if (isLoading) return <OtDetailSkeleton />;
  if (error || !schedule)
    return <OtErrorPanel error={error ?? new Error('OT schedule not found.')} />;

  const roomName = schedule.roomDisplayName || schedule.room?.space?.name || 'OT Schedule';
  const roomDescription =
    schedule.roomDisplayDescription ||
    [schedule.room?.space?.spaceNumber].filter(Boolean).join(' · ');
  const offFlow = schedule.status === 'CANCELLED' || schedule.status === 'POSTPONED';

  const team: Array<{ role: string; name: string | null }> = [
    { role: 'Primary surgeon', name: staffName(schedule.primarySurgeonId) },
    ...(schedule.assistantSurgeonIds ?? []).map((sid) => ({
      role: 'Assistant surgeon',
      name: staffName(sid),
    })),
    { role: 'Anaesthetist', name: staffName(schedule.anaesthetistId) },
    { role: 'Scrub nurse', name: staffName(schedule.scrubNurseId) },
    { role: 'Circulating nurse', name: staffName(schedule.circulatingNurseId) },
    { role: 'Technician', name: staffName(schedule.technicianId) },
    ...(schedule.teamMembers ?? []).map((member) => ({
      role: humanize(member.role),
      name: staffName(member.staffId),
    })),
  ];
  // Always show the surgeon and anaesthetist slots; other roles only when someone is assigned.
  // Team members often repeat the named slots, so drop duplicates of the same person in the same role.
  const ALWAYS_SHOWN = ['Primary surgeon', 'Anaesthetist'];
  const seen = new Set<string>();
  const uniqueTeam = team.filter((member) => {
    if (!member.name && !ALWAYS_SHOWN.includes(member.role)) return false;
    const key = `${member.role.toLowerCase()}|${member.name ?? ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div className="space-y-6 page-transition">
      <OtDetailHero
        backHref={`/${locale}/ot/schedules`}
        backLabel="OT Schedules"
        kicker="Theatre booking"
        icon={CalendarClock}
        title={roomName}
        subtitle={roomDescription || undefined}
        tone={otScheduleStatusTone(schedule.status)}
        badges={
          <>
            <OtScheduleStatusBadge status={schedule.status} />
            {!schedule.isCurrent ? (
              <span className="rounded-full border bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                Historical slot
              </span>
            ) : null}
          </>
        }
        patient={schedule}
        facts={
          <>
            <OtFact label="Scheduled" icon={CalendarClock} className="sm:col-span-2">
              {range(schedule.scheduledStartTime, schedule.scheduledEndTime)}
            </OtFact>
            <OtFact label="Actual" icon={Clock} className="sm:col-span-2">
              {range(schedule.actualStartTime, schedule.actualEndTime)}
            </OtFact>
            <OtFact label="Anaesthesia" icon={Syringe}>
              {schedule.anaesthesiaType}
            </OtFact>
            <OtFact label="Room" icon={DoorOpen}>
              {roomName}
            </OtFact>
          </>
        }
      />

      {schedule.postponedReason || schedule.cancelledReason ? (
        <div
          className={cn(
            'flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm',
            schedule.cancelledReason
              ? [TONE_WASH.red, TONE_TEXT.red]
              : [TONE_WASH.amber, TONE_TEXT.amber],
          )}
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">{schedule.cancelledReason ? 'Cancelled' : 'Postponed'}</p>
            <p>{schedule.cancelledReason || schedule.postponedReason}</p>
          </div>
        </div>
      ) : null}

      {!offFlow ? (
        <OtSection title="Day-of-surgery progress" icon={Activity}>
          <FlowTracker status={schedule.status} />
        </OtSection>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <OtSection title="Theatre team" icon={Users}>
            <ul className="grid gap-2 sm:grid-cols-2">
              {uniqueTeam.map((member, index) => (
                <li
                  key={`${member.role}-${index}`}
                  className="flex items-center gap-3 rounded-xl border bg-background px-3.5 py-2.5"
                >
                  <span
                    className={cn(
                      'flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ring-1 ring-inset',
                      member.name
                        ? 'bg-primary/10 text-primary ring-primary/15'
                        : 'bg-muted text-muted-foreground ring-border',
                    )}
                    aria-hidden="true"
                  >
                    {member.name ? initials(member.name) : '?'}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={cn(
                        'truncate text-sm font-medium',
                        !member.name && 'text-muted-foreground',
                      )}
                    >
                      {member.name || 'Not assigned'}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </OtSection>

          <OtSection title="Linked records" icon={FileSignature}>
            <div className="space-y-2">
              <OtLinkRow
                href={`/${locale}/ot/requests/${schedule.otRequestId}`}
                icon={ClipboardList}
                title="OT request"
                meta="Open the original request"
              />
              {(schedule.reports ?? []).map((r) => (
                <OtLinkRow
                  key={r.id}
                  href={`/${locale}/ot/reports/${r.id}`}
                  icon={FileSignature}
                  title={r.reportNumber}
                  meta={r.signedAt ? `Signed ${fmt(r.signedAt)}` : `Created ${fmt(r.createdAt)}`}
                  badge={<OtReportStatusBadge status={r.reportStatus} />}
                />
              ))}
              {!schedule.reports?.length ? (
                <p className="px-1 pt-1 text-xs text-muted-foreground">
                  No operative report written yet.
                </p>
              ) : null}
            </div>
          </OtSection>
        </div>

        <OtSection title="Status history" icon={History} className="self-start">
          {history && history.length > 0 ? (
            <OtStatusTimeline
              events={history}
              toneOf={otScheduleStatusTone}
              formatDate={(iso) => fmt(iso) ?? iso}
            />
          ) : (
            <p className="text-sm text-muted-foreground">No status changes recorded yet.</p>
          )}
        </OtSection>
      </div>
    </div>
  );
}
