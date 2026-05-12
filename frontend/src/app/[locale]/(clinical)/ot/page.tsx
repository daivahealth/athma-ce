'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowRight, CalendarClock, ClipboardList, FileText, Scissors, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useOtReports, useOtRequests, useOtRooms, useOtSchedules } from '@/modules/ot/hooks/use-ot';
import {
  OtReportStatusBadge,
  OtRequestStatusBadge,
  OtScheduleStatusBadge,
} from '@/modules/ot/components/ot-status-badge';

export default function OtDashboardPage({ params }: { params: { locale: string } }) {
  const { data: requests, isLoading: requestsLoading } = useOtRequests();
  const { data: schedules, isLoading: schedulesLoading } = useOtSchedules();
  const { data: reports, isLoading: reportsLoading } = useOtReports();
  const { data: rooms, isLoading: roomsLoading } = useOtRooms();

  const requestCount = requests?.length ?? 0;
  const activeScheduleCount =
    schedules?.filter((schedule) =>
      [
        'PLANNED',
        'CONFIRMED',
        'PATIENT_READY',
        'PATIENT_IN_OT',
        'ANAESTHESIA_STARTED',
        'SURGERY_STARTED',
      ].includes(schedule.status)
    ).length ?? 0;
  const signedReportsCount = reports?.filter((report) => report.reportStatus === 'SIGNED').length ?? 0;
  const activeRoomsCount = rooms?.filter((room) => room.isActive).length ?? 0;

  const isLoading = requestsLoading || schedulesLoading || reportsLoading || roomsLoading;

  const quickLinks = [
    {
      href: `/${params.locale}/ot/requests`,
      title: 'OT Requests',
      description: 'Capture and progress theatre requests from draft to approval.',
      icon: ClipboardList,
    },
    {
      href: `/${params.locale}/ot/schedules`,
      title: 'OT Schedules',
      description: 'Allocate rooms, surgeons, and timings for approved requests.',
      icon: CalendarClock,
    },
    {
      href: `/${params.locale}/ot/reports`,
      title: 'OT Reports',
      description: 'Create, sign, and amend operative reports with version history.',
      icon: FileText,
    },
    {
      href: `/${params.locale}/ot/rooms`,
      title: 'OT Rooms',
      description: 'Configure active theatre rooms against Foundation spaces.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operating Theatre</h1>
          <p className="text-muted-foreground">
            Manage OT requests, schedules, reports, and room readiness from one workspace.
          </p>
        </div>
        <Button asChild>
          <Link href={`/${params.locale}/ot/requests`}>
            Open OT Requests
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { title: 'Requests', value: requestCount, icon: ClipboardList },
          { title: 'Active schedules', value: activeScheduleCount, icon: CalendarClock },
          { title: 'Signed reports', value: signedReportsCount, icon: FileText },
          { title: 'Active OT rooms', value: activeRoomsCount, icon: Scissors },
        ].map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-semibold tracking-tight">{metric.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Workspace</CardTitle>
            <CardDescription>Navigate the OT workflow by operational area.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {quickLinks.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="rounded-xl border p-4 transition hover:border-primary hover:bg-primary/5"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="font-medium">{item.title}</div>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent OT Requests</CardTitle>
            <CardDescription>Newest entries requiring review, scheduling, or closure.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {requestsLoading ? (
              <>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </>
            ) : requests && requests.length > 0 ? (
              requests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-start justify-between rounded-lg border p-3">
                  <div className="space-y-1">
                    <div className="font-medium">{request.procedureName}</div>
                    <div className="text-xs text-muted-foreground">
                      {request.priority} priority
                      {request.preferredDate
                        ? ` • ${format(new Date(request.preferredDate), 'dd MMM yyyy')}`
                        : ''}
                    </div>
                    <div className="text-xs text-muted-foreground">Request ID: {request.id}</div>
                  </div>
                  <OtRequestStatusBadge status={request.status} />
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                No OT requests found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Schedules</CardTitle>
            <CardDescription>Current theatre plan ordered by scheduled start.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {schedulesLoading ? (
              <>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </>
            ) : schedules && schedules.length > 0 ? (
              schedules.slice(0, 5).map((schedule) => (
                <div key={schedule.id} className="flex items-start justify-between rounded-lg border p-3">
                  <div className="space-y-1">
                    <div className="font-medium">
                      {format(new Date(schedule.scheduledStartTime), 'dd MMM yyyy, HH:mm')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Room: {schedule.otRoomSpaceId}
                    </div>
                    <div className="text-xs text-muted-foreground">Schedule ID: {schedule.id}</div>
                  </div>
                  <OtScheduleStatusBadge status={schedule.status} />
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                No OT schedules found.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Latest operative reports and their signing state.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {reportsLoading ? (
              <>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </>
            ) : reports && reports.length > 0 ? (
              reports.slice(0, 5).map((report) => (
                <div key={report.id} className="flex items-start justify-between rounded-lg border p-3">
                  <div className="space-y-1">
                    <div className="font-medium">{report.reportNumber}</div>
                    <div className="text-xs text-muted-foreground">
                      Created {format(new Date(report.createdAt), 'dd MMM yyyy, HH:mm')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {report.versions?.length ?? 0} version(s)
                    </div>
                  </div>
                  <OtReportStatusBadge status={report.reportStatus} />
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                No OT reports found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
