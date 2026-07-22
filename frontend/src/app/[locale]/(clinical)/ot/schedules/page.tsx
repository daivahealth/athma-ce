'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { CalendarClock, Eye, Filter, PauseCircle, Plus, Search, StopCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

export default function OtSchedulesPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const publishToast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OtScheduleStatus>('all');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const { data: schedules, isLoading, error } = useOtSchedules(
    deferredSearchQuery || statusFilter !== 'all'
      ? {
          ...(deferredSearchQuery ? { search: deferredSearchQuery } : {}),
          ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
        }
      : undefined
  );
  const orderedSchedules = useMemo(
    () =>
      [...(schedules ?? [])].sort(
        (a, b) =>
          new Date(a.scheduledStartTime).getTime() - new Date(b.scheduledStartTime).getTime()
      ),
    [schedules]
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

  const runAction = async (
    scheduleId: string,
    action:
      | 'confirm'
      | 'patient-ready'
      | 'patient-in-ot'
      | 'anaesthesia-started'
      | 'surgery-started'
      | 'surgery-completed'
      | 'shift-to-recovery'
      | 'postpone'
      | 'cancel'
  ) => {
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
        description: `${action} completed.`,
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
          <h1 className="text-3xl font-bold tracking-tight">OT Schedules</h1>
          <p className="text-muted-foreground">
            Allocate rooms and progress theatre cases through the OT workflow.
          </p>
        </div>
        <Button onClick={() => router.push(`/${params.locale}/ot/schedules/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          New OT Schedule
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
                onValueChange={(value) => setStatusFilter(value as 'all' | OtScheduleStatus)}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {OT_SCHEDULE_STATUSES.map((status) => (
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
                  <TableHead>Start Time</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Anaesthesia</TableHead>
                  <TableHead>Current</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderedSchedules.map((schedule) => (
                  <TableRow
                    key={schedule.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/${params.locale}/ot/schedules/${schedule.id}`)}
                  >
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-primary hover:underline">
                          {format(new Date(schedule.scheduledStartTime), 'dd MMM yyyy, HH:mm')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Ends {format(new Date(schedule.scheduledEndTime), 'dd MMM yyyy, HH:mm')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {schedule.roomDisplayName || schedule.room?.space?.name || 'Configured OT Room'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {schedule.roomDisplayDescription ||
                          (schedule.room?.space?.spaceNumber || schedule.room?.specialty
                            ? [
                                schedule.room?.space?.spaceNumber,
                                schedule.room?.specialty,
                              ]
                                .filter(Boolean)
                                .join(' • ')
                            : 'Room details unavailable')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium">
                            {schedule.patientDisplay?.displayName || 'Unknown patient'}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>MRN: {schedule.patientDisplay?.mrn || '—'}</span>
                            <span>•</span>
                            <span>
                              {schedule.patientDisplay?.gender || '—'} /{' '}
                              {schedule.patientDisplay?.age ?? '—'}y
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <OtScheduleStatusBadge status={schedule.status} />
                    </TableCell>
                    <TableCell>{schedule.anaesthesiaType || 'Not set'}</TableCell>
                    <TableCell>{schedule.isCurrent ? 'Current' : 'Historical'}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/${params.locale}/ot/schedules/${schedule.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        {schedule.status === 'PLANNED' && (
                          <Button
                            size="sm"
                            onClick={() => runAction(schedule.id, 'confirm')}
                            disabled={confirmSchedule.isPending}
                          >
                            <CalendarClock className="mr-2 h-4 w-4" />
                            Confirm
                          </Button>
                        )}
                        {schedule.status === 'CONFIRMED' && (
                          <Button
                            size="sm"
                            onClick={() => runAction(schedule.id, 'patient-ready')}
                            disabled={patientReady.isPending}
                          >
                            Patient Ready
                          </Button>
                        )}
                        {schedule.status === 'PATIENT_READY' && (
                          <Button
                            size="sm"
                            onClick={() => runAction(schedule.id, 'patient-in-ot')}
                            disabled={patientInOt.isPending}
                          >
                            Patient In OT
                          </Button>
                        )}
                        {schedule.status === 'PATIENT_IN_OT' && (
                          <Button
                            size="sm"
                            onClick={() => runAction(schedule.id, 'anaesthesia-started')}
                            disabled={anaesthesiaStarted.isPending}
                          >
                            Anaesthesia Started
                          </Button>
                        )}
                        {schedule.status === 'ANAESTHESIA_STARTED' && (
                          <Button
                            size="sm"
                            onClick={() => runAction(schedule.id, 'surgery-started')}
                            disabled={surgeryStarted.isPending}
                          >
                            Surgery Started
                          </Button>
                        )}
                        {schedule.status === 'SURGERY_STARTED' && (
                          <Button
                            size="sm"
                            onClick={() => runAction(schedule.id, 'surgery-completed')}
                            disabled={surgeryCompleted.isPending}
                          >
                            Surgery Completed
                          </Button>
                        )}
                        {schedule.status === 'SURGERY_COMPLETED' && (
                          <Button
                            size="sm"
                            onClick={() => runAction(schedule.id, 'shift-to-recovery')}
                            disabled={shiftToRecovery.isPending}
                          >
                            Shift To Recovery
                          </Button>
                        )}
                        {['PLANNED', 'CONFIRMED', 'PATIENT_READY'].includes(schedule.status) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => runAction(schedule.id, 'postpone')}
                            disabled={postponeSchedule.isPending}
                          >
                            <PauseCircle className="mr-2 h-4 w-4" />
                            Postpone
                          </Button>
                        )}
                        {!['CANCELLED', 'POSTPONED', 'PATIENT_SHIFTED_TO_RECOVERY'].includes(
                          schedule.status
                        ) && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => runAction(schedule.id, 'cancel')}
                            disabled={cancelSchedule.isPending}
                          >
                            <StopCircle className="mr-2 h-4 w-4" />
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
