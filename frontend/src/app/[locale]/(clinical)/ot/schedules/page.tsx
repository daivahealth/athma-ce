'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { format, isSameDay } from 'date-fns';
import {
  CalendarClock,
  ChevronRight,
  DoorOpen,
  Eye,
  MoreHorizontal,
  PauseCircle,
  Plus,
  StopCircle,
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
import { cn } from '@/lib/utils';
import { useOtSchedules, useTransitionOtSchedule } from '@/modules/ot/hooks/use-ot';
import { OT_SCHEDULE_STATUSES, type OtScheduleStatus } from '@/modules/ot/types';
import { OT_SCHEDULE_STATUS_TONE } from '@/modules/ot/ot-tone';
import { OtScheduleStatusBadge } from '@/modules/ot/components/ot-status-badge';
import {
  OtDateTime,
  OtErrorPanel,
  OtListToolbar,
  OtSearchInput,
  OtStatusFilter,
  OtTableSkeleton,
  countBy,
} from '@/modules/ot/components/ot-list';
import { useSpecialtyLabel } from '@/modules/foundation/hooks/use-specialties';

const STATUS_OPTIONS = OT_SCHEDULE_STATUSES.map((value) => ({
  value,
  tone: OT_SCHEDULE_STATUS_TONE[value],
}));
/** Statuses where the patient is physically in theatre. */
const IN_THEATRE: OtScheduleStatus[] = ['PATIENT_IN_OT', 'ANAESTHESIA_STARTED', 'SURGERY_STARTED'];

type ScheduleAction =
  | 'confirm'
  | 'patient-ready'
  | 'patient-in-ot'
  | 'anaesthesia-started'
  | 'surgery-started'
  | 'surgery-completed'
  | 'shift-to-recovery'
  | 'postpone'
  | 'cancel';

/** The one forward step each status offers on the list; the row's primary button. */
const NEXT_STEP: Partial<Record<OtScheduleStatus, { action: ScheduleAction; label: string }>> = {
  PLANNED: { action: 'confirm', label: 'Confirm' },
  CONFIRMED: { action: 'patient-ready', label: 'Patient Ready' },
  PATIENT_READY: { action: 'patient-in-ot', label: 'Patient In OT' },
  PATIENT_IN_OT: { action: 'anaesthesia-started', label: 'Anaesthesia Started' },
  ANAESTHESIA_STARTED: { action: 'surgery-started', label: 'Surgery Started' },
  SURGERY_STARTED: { action: 'surgery-completed', label: 'Surgery Completed' },
  SURGERY_COMPLETED: { action: 'shift-to-recovery', label: 'Shift To Recovery' },
};

const ACTION_LABEL: Record<ScheduleAction, string> = {
  ...Object.fromEntries(Object.values(NEXT_STEP).map((step) => [step!.action, step!.label])),
  postpone: 'Postpone',
  cancel: 'Cancel',
} as Record<ScheduleAction, string>;

const POSTPONABLE: OtScheduleStatus[] = ['PLANNED', 'CONFIRMED', 'PATIENT_READY'];
const NOT_CANCELLABLE: OtScheduleStatus[] = [
  'CANCELLED',
  'POSTPONED',
  'PATIENT_SHIFTED_TO_RECOVERY',
];

/** "13:00 – 16:05", adding the end date only when the case runs past midnight. */
function timeRange(startIso: string, endIso: string) {
  const start = new Date(startIso);
  const end = new Date(endIso);
  return isSameDay(start, end)
    ? `${format(start, 'HH:mm')} – ${format(end, 'HH:mm')}`
    : `${format(start, 'HH:mm')} – ${format(end, 'dd MMM, HH:mm')}`;
}

export default function OtSchedulesPage() {
  const params = useParams() as { locale: string };
  const specialtyLabel = useSpecialtyLabel();
  const router = useRouter();
  const publishToast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OtScheduleStatus>('all');
  const deferredSearchQuery = useDeferredValue(searchQuery.trim());

  // Status is filtered here rather than on the server so each chip can show its count.
  const {
    data: schedules,
    isLoading,
    error,
  } = useOtSchedules(deferredSearchQuery ? { search: deferredSearchQuery } : undefined);
  const allSchedules = useMemo(
    () =>
      [...(schedules ?? [])].sort(
        (a, b) =>
          new Date(a.scheduledStartTime).getTime() - new Date(b.scheduledStartTime).getTime(),
      ),
    [schedules],
  );
  const counts = useMemo(() => countBy(allSchedules, (s) => s.status), [allSchedules]);
  const orderedSchedules = useMemo(
    () =>
      statusFilter === 'all' ? allSchedules : allSchedules.filter((s) => s.status === statusFilter),
    [allSchedules, statusFilter],
  );
  const inTheatre = IN_THEATRE.reduce((sum, status) => sum + (counts[status] ?? 0), 0);
  const filtered = Boolean(deferredSearchQuery) || statusFilter !== 'all';

  const confirmSchedule = useTransitionOtSchedule('confirm');
  const patientReady = useTransitionOtSchedule('patient-ready');
  const patientInOt = useTransitionOtSchedule('patient-in-ot');
  const anaesthesiaStarted = useTransitionOtSchedule('anaesthesia-started');
  const surgeryStarted = useTransitionOtSchedule('surgery-started');
  const surgeryCompleted = useTransitionOtSchedule('surgery-completed');
  const shiftToRecovery = useTransitionOtSchedule('shift-to-recovery');
  const postponeSchedule = useTransitionOtSchedule('postpone');
  const cancelSchedule = useTransitionOtSchedule('cancel');

  const isMutating = [
    confirmSchedule,
    patientReady,
    patientInOt,
    anaesthesiaStarted,
    surgeryStarted,
    surgeryCompleted,
    shiftToRecovery,
    postponeSchedule,
    cancelSchedule,
  ].some((mutation) => mutation.isPending);

  const runAction = async (scheduleId: string, action: ScheduleAction) => {
    try {
      const executor = {
        confirm: confirmSchedule,
        'patient-ready': patientReady,
        'patient-in-ot': patientInOt,
        'anaesthesia-started': anaesthesiaStarted,
        'surgery-started': surgeryStarted,
        'surgery-completed': surgeryCompleted,
        'shift-to-recovery': shiftToRecovery,
        postpone: postponeSchedule,
        cancel: cancelSchedule,
      }[action];

      await executor.mutateAsync({ id: scheduleId });
      publishToast({
        title: 'OT schedule updated',
        description: `${ACTION_LABEL[action]} done.`,
      });
    } catch (error) {
      publishToast({
        variant: 'destructive',
        title: 'Workflow action failed',
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const scheduleHref = (id: string) => `/${params.locale}/ot/schedules/${id}`;
  const newHref = `/${params.locale}/ot/schedules/new`;

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        icon={CalendarClock}
        title="OT Schedules"
        subtitle="Book rooms and step each theatre case through the day-of-surgery workflow."
        actions={
          <Button asChild>
            <Link href={newHref}>
              <Plus className="mr-2 h-4 w-4" />
              New OT Schedule
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
                {inTheatre > 0 ? (
                  <span className="font-medium text-orange-700 dark:text-orange-300">
                    {inTheatre} in theatre now
                  </span>
                ) : (
                  <span>No case in theatre</span>
                )}
                {' · '}
                {orderedSchedules.length} of {allSchedules.length} shown
              </span>
            ) : null
          }
          filters={
            <OtStatusFilter
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={setStatusFilter}
              counts={counts}
              total={allSchedules.length}
              hideEmpty
            />
          }
        />

        {isLoading ? (
          <OtTableSkeleton />
        ) : error ? (
          <OtErrorPanel error={error} className="m-5" />
        ) : orderedSchedules.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title={filtered ? 'No schedules match' : 'No OT schedules yet'}
            description={
              filtered
                ? 'Try another name or MRN, or pick a different status.'
                : 'Book the first theatre slot for an approved OT request.'
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
                    Create OT Schedule
                  </Link>
                </Button>
              )
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="whitespace-nowrap pl-5">When</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5 text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderedSchedules.map((schedule) => {
                const nextStep = NEXT_STEP[schedule.status];
                const canPostpone = POSTPONABLE.includes(schedule.status);
                const canCancel = !NOT_CANCELLABLE.includes(schedule.status);
                const roomDescription =
                  schedule.roomDisplayDescription ||
                  [schedule.room?.space?.spaceNumber, specialtyLabel(schedule.room?.specialty)]
                    .filter(Boolean)
                    .join(' · ');
                const start = new Date(schedule.scheduledStartTime);

                return (
                  <TableRow
                    key={schedule.id}
                    className={cn('cursor-pointer', !schedule.isCurrent && 'opacity-70')}
                    onClick={() => router.push(scheduleHref(schedule.id))}
                  >
                    <TableCell className="py-4 pl-5">
                      <div className="flex items-center gap-3">
                        <div className="flex w-11 shrink-0 flex-col items-center rounded-lg border bg-muted/40 py-1 leading-none">
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-primary">
                            {format(start, 'MMM')}
                          </span>
                          <span className="mt-0.5 text-base font-semibold tabular-nums text-foreground">
                            {format(start, 'dd')}
                          </span>
                        </div>
                        <OtDateTime
                          date={format(start, 'EEEE, yyyy')}
                          time={timeRange(schedule.scheduledStartTime, schedule.scheduledEndTime)}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <PatientIdentity source={schedule} />
                    </TableCell>
                    <TableCell className="max-w-[240px] py-4">
                      <div className="flex items-start gap-2">
                        <DoorOpen className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">
                            {schedule.roomDisplayName ||
                              schedule.room?.space?.name ||
                              'Configured OT Room'}
                          </div>
                          <div
                            className="truncate text-xs text-muted-foreground"
                            title={roomDescription}
                          >
                            {[roomDescription, schedule.anaesthesiaType]
                              .filter(Boolean)
                              .join(' · ') || 'Anaesthesia not set'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col items-start gap-1 whitespace-nowrap">
                        <OtScheduleStatusBadge status={schedule.status} />
                        {!schedule.isCurrent && (
                          <span className="text-xs text-muted-foreground">Historical slot</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 pr-5">
                      <div
                        className="flex items-center justify-end gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {nextStep && (
                          <Button
                            size="sm"
                            className="whitespace-nowrap"
                            onClick={() => runAction(schedule.id, nextStep.action)}
                            disabled={isMutating}
                          >
                            {nextStep.label}
                            <ChevronRight className="ml-1 h-3.5 w-3.5" />
                          </Button>
                        )}
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
                            <DropdownMenuItem
                              onClick={() => router.push(scheduleHref(schedule.id))}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View schedule
                            </DropdownMenuItem>
                            {canPostpone && (
                              <DropdownMenuItem
                                disabled={isMutating}
                                onClick={() => runAction(schedule.id, 'postpone')}
                              >
                                <PauseCircle className="mr-2 h-4 w-4" />
                                Postpone
                              </DropdownMenuItem>
                            )}
                            {canCancel && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  disabled={isMutating}
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => runAction(schedule.id, 'cancel')}
                                >
                                  <StopCircle className="mr-2 h-4 w-4" />
                                  Cancel
                                </DropdownMenuItem>
                              </>
                            )}
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
