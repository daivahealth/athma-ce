'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import {
  AlertTriangle,
  CalendarClock,
  CalendarDays,
  ClipboardList,
  Clock,
  DoorOpen,
  Droplet,
  FileSignature,
  History,
  Package,
  Stethoscope,
  Syringe,
  Timer,
  UserRound,
} from 'lucide-react';
import { ToneBadge } from '@/components/ui/tone-badge';
import { TONE_TEXT, TONE_WASH } from '@/components/ui/tone-classes';
import { cn } from '@/lib/utils';
import { useOtRequest, useOtRequestHistory, useOtRooms } from '@/modules/ot/hooks/use-ot';
import { useStaffList } from '@/modules/foundation/hooks/use-staff';
import { otRequestStatusTone } from '@/modules/ot/ot-tone';
import {
  OtReportStatusBadge,
  OtRequestPriorityBadge,
  OtRequestStatusBadge,
  OtScheduleStatusBadge,
} from '@/modules/ot/components/ot-status-badge';
import { OtErrorPanel } from '@/modules/ot/components/ot-list';
import {
  OtDetailHero,
  OtDetailSkeleton,
  OtFact,
  OtLinkRow,
  OtSection,
  OtStatusTimeline,
} from '@/modules/ot/components/ot-detail';

function fmt(value?: string | null): string | null {
  if (!value) return null;
  try {
    return format(new Date(value), 'dd MMM yyyy, HH:mm');
  } catch {
    return value;
  }
}

function fmtDate(value?: string | null): string | null {
  if (!value) return null;
  try {
    return format(new Date(value), 'EEE, dd MMM yyyy');
  } catch {
    return value;
  }
}

function ChipList({ items, empty }: { items?: string[] | null; empty: string }) {
  if (!items?.length) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <ToneBadge key={item} tone="slate" className="px-2.5 py-1 text-xs">
          {item}
        </ToneBadge>
      ))}
    </div>
  );
}

export default function OtRequestDetailPage() {
  const params = useParams();
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

  if (isLoading) return <OtDetailSkeleton />;
  if (error || !request)
    return <OtErrorPanel error={error ?? new Error('OT request not found.')} />;

  const roomName = request.preferredOtRoomSpaceId
    ? (roomMap.get(request.preferredOtRoomSpaceId) ?? 'Room not loaded')
    : null;
  const surgeonName = request.primarySurgeonId
    ? (staffMap.get(request.primarySurgeonId) ?? request.primarySurgeonId)
    : null;
  const subtitle = [request.procedureCode, request.surgeryType].filter(Boolean).join(' · ');

  return (
    <div className="space-y-6 page-transition">
      <OtDetailHero
        backHref={`/${locale}/ot/requests`}
        backLabel="OT Requests"
        kicker="OT request"
        icon={ClipboardList}
        title={request.procedureName}
        subtitle={subtitle || undefined}
        tone={otRequestStatusTone(request.status)}
        badges={
          <>
            <OtRequestStatusBadge status={request.status} />
            <OtRequestPriorityBadge priority={request.priority} />
          </>
        }
        patient={request}
        facts={
          <>
            <OtFact label="Preferred date" icon={CalendarDays}>
              {fmtDate(request.preferredDate)}
            </OtFact>
            <OtFact label="Duration" icon={Timer}>
              {request.expectedDurationMinutes ? `${request.expectedDurationMinutes} min` : null}
            </OtFact>
            <OtFact label="Preferred room" icon={DoorOpen}>
              {roomName}
            </OtFact>
            <OtFact label="Primary surgeon" icon={Stethoscope}>
              {surgeonName}
            </OtFact>
            <OtFact label="Requested" icon={Clock}>
              {fmt(request.requestedAt)}
            </OtFact>
          </>
        }
      />

      {request.status === 'REJECTED' && request.rejectionReason ? (
        <div
          className={cn(
            'flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm',
            TONE_WASH.red,
            TONE_TEXT.red,
          )}
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">Rejected</p>
            <p>{request.rejectionReason}</p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <OtSection title="Clinical details" icon={Stethoscope}>
            <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <OtFact label="Diagnosis" wide>
                {request.diagnosis}
              </OtFact>
              <OtFact label="Anaesthesia planned" icon={Syringe}>
                {request.anaesthesiaTypePlanned}
              </OtFact>
              <OtFact label="Anaesthetist" icon={UserRound}>
                {request.anaesthetistRequired ? 'Required' : 'Not required'}
              </OtFact>
              <OtFact label="Blood" icon={Droplet}>
                {request.bloodRequired ? (
                  <ToneBadge tone="red" withDot>
                    Blood required
                  </ToneBadge>
                ) : (
                  'Not required'
                )}
              </OtFact>
              <OtFact label="Remarks" wide>
                {request.remarks ? (
                  <span className="whitespace-pre-wrap font-normal">{request.remarks}</span>
                ) : null}
              </OtFact>
            </dl>
          </OtSection>

          <OtSection title="Equipment and implants" icon={Package}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Special equipment
                </p>
                <ChipList items={request.specialEquipmentRequired} empty="None requested" />
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Implants
                </p>
                <ChipList items={request.implantsRequired} empty="None requested" />
              </div>
            </div>
          </OtSection>

          <OtSection title="Schedules and reports" icon={CalendarClock}>
            {request.schedules?.length || request.reports?.length ? (
              <div className="space-y-2">
                {(request.schedules ?? []).map((s) => (
                  <OtLinkRow
                    key={s.id}
                    href={`/${locale}/ot/schedules/${s.id}`}
                    icon={CalendarClock}
                    title={fmt(s.scheduledStartTime) ?? 'OT schedule'}
                    meta={s.roomDisplayName || s.room?.space?.name || 'Theatre booking'}
                    badge={<OtScheduleStatusBadge status={s.status} />}
                  />
                ))}
                {(request.reports ?? []).map((r) => (
                  <OtLinkRow
                    key={r.id}
                    href={`/${locale}/ot/reports/${r.id}`}
                    icon={FileSignature}
                    title={r.reportNumber}
                    meta={r.signedAt ? `Signed ${fmt(r.signedAt)}` : `Created ${fmt(r.createdAt)}`}
                    badge={<OtReportStatusBadge status={r.reportStatus} />}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Not scheduled yet.</p>
            )}
          </OtSection>
        </div>

        <OtSection title="Status history" icon={History} className="self-start">
          {history && history.length > 0 ? (
            <OtStatusTimeline
              events={history}
              toneOf={otRequestStatusTone}
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
