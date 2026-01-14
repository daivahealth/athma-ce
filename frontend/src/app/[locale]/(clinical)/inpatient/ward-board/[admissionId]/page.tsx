'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  User,
  Stethoscope,
  Bed,
  MapPin,
  Pill,
  ClipboardList,
  Activity,
  ArrowRightLeft,
  AlertCircle,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useAdmission, useTransferHistory } from '@/modules/clinical/hooks/use-inpatient';
import { useClinicalOrdersByEncounter, usePrescriptionsByEncounter } from '@/modules/clinical/hooks/use-charting';
import { usePatient } from '@/modules/clinical/hooks/use-patients';
import { useStaffMember } from '@/modules/foundation/hooks/use-staff';
import { useWard } from '@/modules/foundation/hooks/use-ward';
import { useBed } from '@/modules/foundation/hooks/use-bed';

const formatDateTime = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const formatRelativeTime = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const absSeconds = Math.abs(diffSeconds);
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

  if (absSeconds < 60) return rtf.format(diffSeconds, 'second');
  const diffMinutes = Math.round(diffSeconds / 60);
  if (Math.abs(diffMinutes) < 60) return rtf.format(diffMinutes, 'minute');
  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, 'hour');
  const diffDays = Math.round(diffHours / 24);
  if (Math.abs(diffDays) < 7) return rtf.format(diffDays, 'day');
  return rtf.format(Math.round(diffDays / 7), 'week'); // simplified
};

const getAge = (dateOfBirth?: string | null) => {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age;
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getStatusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case 'admitted':
    case 'active':
      return 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-300';
    case 'discharged':
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    case 'critical':
      return 'bg-red-500/15 text-red-700 dark:bg-red-500/25 dark:text-red-300';
    default:
      return 'bg-blue-500/15 text-blue-700 dark:bg-blue-500/25 dark:text-blue-300';
  }
};

export default function WardBoardAdmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const admissionId = typeof params?.admissionId === 'string' ? params.admissionId : '';

  const { data: admission, isLoading } = useAdmission(admissionId);
  const admissionData = admission as any;
  const patientId = admissionData?.patientId as string | undefined;
  const encounterId = admissionData?.encounterId as string | undefined;
  const attendingPhysicianId = admissionData?.attendingPhysicianId as string | undefined;
  const currentWardId = admissionData?.currentWardId as string | undefined;
  const currentBedId = admissionData?.currentBedId as string | undefined;

  const patientQuery = usePatient(patientId ?? '');
  const physicianQuery = useStaffMember(attendingPhysicianId);
  const wardQuery = useWard(currentWardId);
  const bedQuery = useBed(currentBedId);
  const prescriptionsQuery = usePrescriptionsByEncounter(encounterId ?? '');
  const ordersQuery = useClinicalOrdersByEncounter(encounterId ?? '');
  const transferHistoryQuery = useTransferHistory(admissionId, { enabled: Boolean(admissionId) });

  const patient = patientQuery.data as any;
  const patientName = (patient?.fullName ?? `${patient?.firstName ?? ''} ${patient?.lastName ?? ''}`.trim()) || 'Unknown Patient';
  const patientAge = getAge(patient?.dateOfBirth);
  const patientGender = patient?.gender ?? 'Unknown';

  const physicianName = physicianQuery.data ?
    (physicianQuery.data.displayName ?? `${physicianQuery.data.firstName ?? ''} ${physicianQuery.data.lastName ?? ''}`.trim())
    : 'Unknown Physician';

  const wardName = wardQuery.data?.name ?? 'Unknown Ward';
  const bedNumber = bedQuery.data?.bedNumber ?? 'Unknown Bed';

  return (
    <div className="mx-auto w-full max-w-7xl animate-in fade-in duration-500 space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Inpatient</span>
              <span>/</span>
              <span>Ward Board</span>
              <span>/</span>
              <span className="font-medium text-foreground">Details</span>
            </div>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Inpatient Overview
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`px-3 py-1 text-sm font-medium capitalize ${getStatusColor(admissionData?.admissionStatus)} border-0`}>
            {admissionData?.admissionStatus ?? 'Unknown Status'}
          </Badge>
          <Badge variant="outline" className="border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
            Acuity: {admissionData?.acuity ?? 'N/A'}
          </Badge>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/20">
          <div className="text-center">
            <div className="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto"></div>
            <p className="text-sm text-muted-foreground">Loading details...</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main Content - Left Column */}
          <div className="space-y-8 lg:col-span-8">

            {/* Patient & Admission Card */}
            <Card className="border-slate-200 shadow-sm dark:border-slate-800">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <Avatar className="h-16 w-16 border-2 border-white shadow-sm dark:border-slate-950">
                      <AvatarFallback className="bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300 text-xl font-bold">
                        {getInitials(patientName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl font-bold">{patientName}</CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-2 text-sm">
                        <User className="h-3.5 w-3.5" />
                        <span>{patientAge !== null ? `${patientAge} years` : 'Age N/A'}</span>
                        <span>•</span>
                        <span className="capitalize">{patientGender}</span>
                        <span>•</span>
                        <span>MRN: {patient?.mrn ?? 'N/A'}</span>
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Location</p>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{wardName}</p>
                      <p className="text-sm text-muted-foreground">{bedNumber}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Provider</p>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                      <Stethoscope className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{physicianName}</p>
                      <p className="text-sm text-muted-foreground">Attending Physician</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Admission Date</p>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400">
                      <CalendarDays className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{formatDateTime(admissionData?.admittedAt).split(',')[0]}</p>
                      <p className="text-sm text-muted-foreground">{formatDateTime(admissionData?.admittedAt).split(',')[1]}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Est. Discharge</p>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="text-sm">
                      {admissionData?.expectedDischargeDate ? (
                        <>
                          <p className="font-medium">{formatDateTime(admissionData?.expectedDischargeDate).split(',')[0]}</p>
                          <p className="text-muted-foreground">{formatRelativeTime(admissionData?.expectedDischargeDate)}</p>
                        </>
                      ) : (
                        <p className="text-muted-foreground italic">Not set</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Prescriptions */}
              <Card className="flex flex-col border-slate-200 shadow-sm dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Pill className="h-5 w-5 text-indigo-500" />
                    Active Medications
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  {!encounterId ? (
                    <div className="flex h-32 flex-col items-center justify-center text-center text-muted-foreground">
                      <AlertCircle className="mb-2 h-8 w-8 opacity-20" />
                      <p className="text-sm">No clinical encounter linked</p>
                    </div>
                  ) : prescriptionsQuery.isLoading ? (
                    <div className="space-y-3">
                      {[1, 2].map(i => <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />)}
                    </div>
                  ) : prescriptionsQuery.data?.length === 0 ? (
                    <div className="flex h-32 flex-col items-center justify-center text-center text-muted-foreground">
                      <CheckCircle2 className="mb-2 h-8 w-8 text-emerald-500/30" />
                      <p className="text-sm">No active prescriptions</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-3">
                        {prescriptionsQuery.data?.map((prescription: any) => (
                          <div key={prescription.id} className="group relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition-all hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800/80">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <p className="font-semibold text-slate-900 dark:text-slate-100">{prescription.drugName}</p>
                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                  <span className="font-medium text-slate-700 dark:text-slate-300">{prescription.dosage}</span>
                                  <span>•</span>
                                  <span>{prescription.route}</span>
                                  <span>•</span>
                                  <span>{prescription.frequency}</span>
                                </div>
                              </div>
                              <Badge variant="secondary" className="text-[10px] uppercase tracking-wider opacity-70">
                                {prescription.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>

              {/* Orders */}
              <Card className="flex flex-col border-slate-200 shadow-sm dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ClipboardList className="h-5 w-5 text-amber-500" />
                    Clinical Orders
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  {!encounterId ? (
                    <div className="flex h-32 flex-col items-center justify-center text-center text-muted-foreground">
                      <AlertCircle className="mb-2 h-8 w-8 opacity-20" />
                      <p className="text-sm">No clinical encounter linked</p>
                    </div>
                  ) : ordersQuery.isLoading ? (
                    <div className="space-y-3">
                      {[1, 2].map(i => <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />)}
                    </div>
                  ) : ordersQuery.data?.length === 0 ? (
                    <div className="flex h-32 flex-col items-center justify-center text-center text-muted-foreground">
                      <FileText className="mb-2 h-8 w-8 opacity-20" />
                      <p className="text-sm">No orders placed</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-3">
                        {ordersQuery.data?.map((order: any) => (
                          <div key={order.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition-all hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-medium text-slate-900 dark:text-slate-100">{order.orderName}</p>
                                <p className="text-xs text-muted-foreground capitalize">{order.orderType}</p>
                              </div>
                              {order.priority === 'urgent' || order.priority === 'stat' ? (
                                <Badge variant="destructive" className="h-5 px-1.5 text-[10px] uppercase">{order.priority}</Badge>
                              ) : (
                                <Badge variant="secondary" className="h-5 px-1.5 text-[10px] uppercase">{order.priority}</Badge>
                              )}
                            </div>
                            {(order.clinicalIndication || order.specialInstructions) && (
                              <div className="mt-2 rounded-lg bg-background p-2 text-xs text-muted-foreground">
                                {order.clinicalIndication && <p>Indication: {order.clinicalIndication}</p>}
                                {order.specialInstructions && <p className="mt-0.5">Note: {order.specialInstructions}</p>}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-8 lg:col-span-4">
            <Card className="h-full border-slate-200 shadow-sm dark:border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5 text-sky-500" />
                  Transfer History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {transferHistoryQuery.isLoading ? (
                  <p className="text-sm text-muted-foreground">Loading history...</p>
                ) : !transferHistoryQuery.data || transferHistoryQuery.data.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                    <Activity className="mb-2 h-8 w-8 opacity-20" />
                    <p className="text-sm">No transfer history</p>
                  </div>
                ) : (
                  <div className="relative pl-4 border-l border-slate-200 dark:border-slate-800 space-y-8 my-2">
                    {transferHistoryQuery.data.map((entry, index) => (
                      <div key={entry.id} className="relative">
                        <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-white bg-slate-300 dark:border-slate-950 dark:bg-slate-700"></div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {entry.transferType ? (
                              <span className="capitalize">{entry.transferType.toLowerCase().replace('_', ' ')}</span>
                            ) : 'Transfer'}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatRelativeTime(entry.assignedAt)}</p>

                          <div className="mt-2 rounded-lg border border-slate-100 bg-slate-50 p-2 text-xs dark:border-slate-800 dark:bg-slate-900">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="block text-[10px] uppercase text-muted-foreground">Ward</span>
                                <span className="font-medium">{entry.wardId}</span>
                              </div>
                              <div>
                                <span className="block text-[10px] uppercase text-muted-foreground">Bed</span>
                                <span className="font-medium">{entry.bedId}</span>
                              </div>
                            </div>
                            {entry.transferReason && (
                              <div className="mt-2 border-t border-slate-200 pt-2 dark:border-slate-800">
                                <span className="block text-[10px] uppercase text-muted-foreground">Reason</span>
                                <span className="italic">{entry.transferReason}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
