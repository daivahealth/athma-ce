'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format, isSameDay } from 'date-fns';
import {
  CalendarClock,
  Eye,
  Filter,
  MoreHorizontal,
  PauseCircle,
  Plus,
  Search,
  StopCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { useOtSchedules, useTransitionOtSchedule } from '@/modules/ot/hooks/use-ot';
import { OT_SCHEDULE_STATUSES, type OtScheduleStatus } from '@/modules/ot/types';
import { OtScheduleStatusBadge } from '@/modules/ot/components/ot-status-badge';
import { useSpecialtyLabel } from '@/modules/foundation/hooks/use-specialties';

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

function humanize(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

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
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const {
    data: schedules,
    isLoading,
    error,
  } = useOtSchedules(
    deferredSearchQuery || statusFilter !== 'all'
      ? {
          ...(deferredSearchQuery ? { search: deferredSearchQuery } : {}),
          ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
        }
      : undefined,
  );
  const orderedSchedules = useMemo(
    () =>
      [...(schedules ?? [])].sort(
        (a, b) =>
          new Date(a.scheduledStartTime).getTime() - new Date(b.scheduledStartTime).getTime(),
      ),
    [schedules],
  );

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

  return (
    <div className="space-y-4">
      <PageHeader
        title="OT Schedules"
        subtitle="Allocate rooms and progress theatre cases through the OT workflow."
        actions={
          <Button onClick={() => router.push(`/${params.locale}/ot/schedules/new`)}>
            <Plus className="mr-2 h-4 w-4" />
            New OT Schedule
          </Button>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                onValueChange={(value) => setStatusFilter(value as 'all' | OtScheduleStatus)}
              >
                <SelectTrigger className="w-full sm:w-[220px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {OT_SCHEDULE_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {humanize(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-muted-foreground">Loading OT schedules...</div>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              {(error as Error).message}
            </div>
          ) : orderedSchedules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CalendarClock className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No OT schedules found</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search criteria.'
                  : 'Create the first schedule for an approved OT request.'}
              </p>
              <Button onClick={() => router.push(`/${params.locale}/ot/schedules/new`)}>
                <Plus className="mr-2 h-4 w-4" />
                Create OT Schedule
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Start Time</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Anaesthesia</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
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
                      .join(' • ');
                  const patient = schedule.patientDisplay;
                  const demographics = [
                    patient?.gender,
                    patient?.age != null ? `${patient.age}y` : null,
                  ]
                    .filter(Boolean)
                    .join(' / ');

                  return (
                    <TableRow
                      key={schedule.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/${params.locale}/ot/schedules/${schedule.id}`)}
                    >
                      <TableCell className="whitespace-nowrap align-top">
                        <div className="font-medium text-primary">
                          {format(new Date(schedule.scheduledStartTime), 'dd MMM yyyy')}
                        </div>
                        <div className="text-sm tabular-nums text-muted-foreground">
                          {timeRange(schedule.scheduledStartTime, schedule.scheduledEndTime)}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[220px] align-top">
                        <div className="truncate font-medium">
                          {schedule.roomDisplayName ||
                            schedule.room?.space?.name ||
                            'Configured OT Room'}
                        </div>
                        {roomDescription && (
                          <div
                            className="truncate text-sm text-muted-foreground"
                            title={roomDescription}
                          >
                            {roomDescription}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="whitespace-nowrap font-medium">
                          {patient?.displayName || 'Unknown patient'}
                        </div>
                        <div className="whitespace-nowrap text-xs text-muted-foreground">
                          {patient?.mrn || 'No MRN'}
                          {demographics && <span className="capitalize"> · {demographics}</span>}
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="flex flex-col items-start gap-1 whitespace-nowrap">
                          <OtScheduleStatusBadge status={schedule.status} />
                          {!schedule.isCurrent && (
                            <span className="text-xs text-muted-foreground">Historical slot</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap align-top">
                        {schedule.anaesthesiaType || (
                          <span className="text-muted-foreground">Not set</span>
                        )}
                      </TableCell>
                      <TableCell className="align-top">
                        <div
                          className="flex items-center justify-end gap-2"
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
                                onClick={() =>
                                  router.push(`/${params.locale}/ot/schedules/${schedule.id}`)
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
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
        </CardContent>
      </Card>
    </div>
  );
}
