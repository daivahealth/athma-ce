'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  User,
  Users,
  Stethoscope,
  MapPin,
  Pill,
  ClipboardList,
  Activity,
  ArrowRightLeft,
  AlertCircle,
  CheckCircle2,
  FileText,
  UserPlus,
  X,
  FileCheck,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getSession } from '@/lib/api/client';
import { decodeAccessToken } from '@/lib/auth/tokens';
import {
  useAdmission,
  useMultiWardBedBoard,
  useTransferHistory,
  useTransferPatient,
} from '@/modules/clinical/hooks/use-inpatient';
import { useClinicalOrdersByEncounter, usePrescriptionsByEncounter } from '@/modules/clinical/hooks/use-charting';
import { usePatient } from '@/modules/clinical/hooks/use-patients';
import { useBedBrowser } from '@/modules/clinical/hooks/use-bed-browser';
import { useStaffMember, useStaffList } from '@/modules/foundation/hooks/use-staff';
import { useWard } from '@/modules/foundation/hooks/use-ward';
import { useBed } from '@/modules/foundation/hooks/use-bed';
import { WardOrdersDialog, WardPrescriptionDialog } from '@/modules/clinical/components/inpatient';
import {
  useCareChannelByAdmission,
  useCareChannelMembers,
  useCareChannelTimeline,
  useAddCareChannelMember,
  useRemoveCareChannelMember,
  usePostCareChannelMessage,
  useSyncCareChannelMembers,
} from '@/modules/clinical/hooks/use-care-channel';
import type { ChannelMessage, MessagePriority, MessageType } from '@/modules/clinical/types/care-channel';
import { useAdmissionChecklists } from '@/modules/clinical/hooks/use-checklists';
import { TransferType } from '@/modules/clinical/types/inpatient';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isUuid = (value?: string) => typeof value === 'string' && uuidPattern.test(value);

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
  return rtf.format(Math.round(diffDays / 7), 'week');
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
    .map((part) => part[0])
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

const getOccupancyFilter = (occupancy?: string) => {
  const normalized = occupancy?.toLowerCase();
  if (normalized === 'available' || normalized === 'empty') {
    return 'available';
  }
  if (normalized === 'cleaning') {
    return 'cleaning';
  }
  if (normalized === 'maintenance') {
    return 'maintenance';
  }
  return 'occupied';
};

const CARE_TEAM_ROLES = [
  { value: 'ATTENDING_PHYSICIAN', label: 'Attending Physician' },
  { value: 'RESIDENT_PHYSICIAN', label: 'Resident Physician' },
  { value: 'CONSULTING_PHYSICIAN', label: 'Consulting Physician' },
  { value: 'PRIMARY_NURSE', label: 'Primary Nurse' },
  { value: 'CHARGE_NURSE', label: 'Charge Nurse' },
  { value: 'STAFF_NURSE', label: 'Staff Nurse' },
  { value: 'PHARMACIST', label: 'Pharmacist' },
  { value: 'CASE_MANAGER', label: 'Case Manager' },
  { value: 'RESPIRATORY_THERAPIST', label: 'Respiratory Therapist' },
  { value: 'PHYSICAL_THERAPIST', label: 'Physical Therapist' },
  { value: 'DIETITIAN', label: 'Dietitian' },
  { value: 'OTHER', label: 'Other' },
];

export default function WardBoardAdmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const admissionId = typeof params?.admissionId === 'string' ? params.admissionId : '';
  const [messageBody, setMessageBody] = useState('');
  const [messagePriority, setMessagePriority] = useState<MessagePriority>('NORMAL');
  const [showMemberHistory, setShowMemberHistory] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isMedsOpen, setIsMedsOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [transferTargetBedId, setTransferTargetBedId] = useState('');
  const [transferReason, setTransferReason] = useState('');
  const [transferNotes, setTransferNotes] = useState('');
  const [transferType, setTransferType] = useState<TransferType>(TransferType.CLINICAL_NEED);
  const toast = useToast();

  const session = getSession();
  const claims = decodeAccessToken(session.accessToken);
  const userId = claims?.userId ?? session.user?.userId ?? '';

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
  const checklistsQuery = useAdmissionChecklists(admissionId);
  const channelQuery = useCareChannelByAdmission(admissionId);
  const channel = channelQuery.data;
  const membersQuery = useCareChannelMembers(channel?.id ?? '', showMemberHistory);
  const timelineQuery = useCareChannelTimeline(
    channel?.id ?? '',
    { limit: 50, offset: 0 },
    { refetchInterval: 10000 }
  );
  const postMessageMutation = usePostCareChannelMessage(channel?.id ?? '');
  const syncMembersMutation = useSyncCareChannelMembers(channel?.id ?? '');
  const addMemberMutation = useAddCareChannelMember(channel?.id ?? '');
  const removeMemberMutation = useRemoveCareChannelMember(channel?.id ?? '');
  const staffListQuery = useStaffList();
  const multiBoardQuery = useMultiWardBedBoard({ includeEmptyWards: true });
  const bedBrowserQuery = useBedBrowser({});
  const transferMutation = useTransferPatient(admissionId);

  const patient = patientQuery.data as any;
  const patientName =
    (patient?.fullName ?? `${patient?.firstName ?? ''} ${patient?.lastName ?? ''}`.trim()) ||
    'Unknown Patient';
  const patientAge = getAge(patient?.dateOfBirth);
  const patientGender = patient?.gender ?? 'Unknown';

  const physicianName = physicianQuery.data
    ? physicianQuery.data.displayName ??
    `${physicianQuery.data.firstName ?? ''} ${physicianQuery.data.lastName ?? ''}`.trim()
    : 'Unknown Physician';

  const wardName = wardQuery.data?.name ?? 'Unknown Ward';
  const bedNumber = bedQuery.data?.bedNumber ?? 'Unknown Bed';
  const availableBeds = useMemo(
    () =>
      (multiBoardQuery.data?.wards ?? []).flatMap((ward) =>
        ward.beds
          .filter((bed) => getOccupancyFilter(bed.occupancy) === 'available')
          .map((bed) => ({
            bedId: bed.bed?.id ?? '',
            bedCode: bed.bed?.code ?? 'Bed',
            spaceName: bed.bed?.spaceName ?? '',
            wardId: ward.ward.id ?? '',
            wardName: ward.ward.name ?? 'Ward',
          }))
      ),
    [multiBoardQuery.data?.wards]
  );
  const selectedTargetBed = availableBeds.find((bed) => bed.bedId === transferTargetBedId);
  const wardNameById = useMemo(() => {
    const map = new Map<string, string>();
    (multiBoardQuery.data?.wards ?? []).forEach((ward) => {
      if (ward.ward.id && ward.ward.name) {
        map.set(ward.ward.id, ward.ward.name);
      }
      ward.beds.forEach((bed) => {
        const wardId = ward.ward.id;
        if (wardId && ward.ward.name) {
          map.set(wardId, ward.ward.name);
        }
      });
    });
    return map;
  }, [multiBoardQuery.data?.wards]);
  const bedCodeById = useMemo(() => {
    const map = new Map<string, string>();
    (multiBoardQuery.data?.wards ?? []).forEach((ward) => {
      ward.beds.forEach((bed) => {
        const bedId = bed.bed?.id;
        const bedCode = bed.bed?.code;
        if (bedId && bedCode) {
          map.set(bedId, bedCode);
        }
      });
    });
    bedBrowserQuery.data?.beds?.forEach((bed) => {
      if (bed.bedId && bed.bedNumber && !map.has(bed.bedId)) {
        map.set(bed.bedId, bed.bedNumber);
      }
    });
    return map;
  }, [multiBoardQuery.data?.wards, bedBrowserQuery.data?.beds]);

  const formatTransferMessage = (message: ChannelMessage) => {
    const payload = message.payloadJson ?? {};
    const fromWardId = payload['fromWardId'] as string | undefined;
    const toWardId = payload['toWardId'] as string | undefined;
    const fromBedId = payload['fromBedId'] as string | undefined;
    const toBedId = payload['toBedId'] as string | undefined;
    const fromWardName = (fromWardId && wardNameById.get(fromWardId)) || fromWardId;
    const toWardName = (toWardId && wardNameById.get(toWardId)) || toWardId;
    const fromBedCode = (fromBedId && bedCodeById.get(fromBedId)) || fromBedId;
    const toBedCode = (toBedId && bedCodeById.get(toBedId)) || toBedId;

    if (fromWardId || toWardId || fromBedId || toBedId) {
      const fromLabel = [fromWardName, fromBedCode].filter(Boolean).join(' ');
      const toLabel = [toWardName, toBedCode].filter(Boolean).join(' ');
      return `Patient transferred from ${fromLabel || 'current ward'} to ${toLabel || 'new ward'}.`;
    }

    let bodyText = message.bodyText || 'System event logged.';
    wardNameById.forEach((name, id) => {
      bodyText = bodyText.replace(new RegExp(id, 'g'), name);
    });
    bedCodeById.forEach((code, id) => {
      bodyText = bodyText.replace(new RegExp(id, 'g'), code);
    });
    return bodyText;
  };

  const memberByStaffId = useMemo(() => {
    const map = new Map<string, string>();
    (membersQuery.data ?? []).forEach((member) => {
      const name =
        member.staff?.displayName ??
        [member.staff?.firstName, member.staff?.lastName].filter(Boolean).join(' ');
      if (member.staffId) {
        map.set(member.staffId, name || member.staffId);
      }
    });
    return map;
  }, [membersQuery.data]);

  const handleSendMessage = async () => {
    if (!channel?.id || !messageBody.trim()) {
      return;
    }
    await postMessageMutation.mutateAsync({
      bodyText: messageBody.trim(),
      priority: messagePriority,
    });
    setMessageBody('');
    setMessagePriority('NORMAL');
  };

  const postActionMessage = async (message: string) => {
    if (!channel?.id || channel.status !== 'ACTIVE' || !message.trim()) {
      return;
    }
    await postMessageMutation.mutateAsync({
      bodyText: message.trim(),
      priority: 'NORMAL',
    });
  };

  const resetTransferState = () => {
    setTransferTargetBedId('');
    setTransferReason('');
    setTransferNotes('');
    setTransferType(TransferType.CLINICAL_NEED);
  };

  const handleOpenMeds = () => {
    if (!encounterId || !patientId) {
      toast({
        title: 'Cannot open Meds',
        description: 'No encounter or patient is linked to this admission.',
        variant: 'destructive',
      });
      return;
    }
    const prescriberId = attendingPhysicianId ?? userId;
    if (!isUuid(prescriberId)) {
      toast({
        title: 'Cannot open Meds',
        description: 'Prescriber identity is missing or invalid.',
        variant: 'destructive',
      });
      return;
    }
    setIsMedsOpen(true);
  };

  const handleOpenOrders = () => {
    if (!encounterId || !patientId) {
      toast({
        title: 'Cannot open Orders',
        description: 'No encounter or patient is linked to this admission.',
        variant: 'destructive',
      });
      return;
    }
    const ordererId = attendingPhysicianId ?? userId;
    if (!isUuid(ordererId)) {
      toast({
        title: 'Cannot open Orders',
        description: 'Orderer identity is missing or invalid.',
        variant: 'destructive',
      });
      return;
    }
    setIsOrdersOpen(true);
  };

  const handleOpenTransfer = () => {
    if (!admissionId) {
      toast({
        title: 'Cannot open Transfer',
        description: 'No admission is linked to this record.',
        variant: 'destructive',
      });
      return;
    }
    setIsTransferOpen(true);
  };

  const handleTransferSubmit = async () => {
    if (!selectedTargetBed?.wardId || !selectedTargetBed?.bedId) {
      toast({
        title: 'Select a destination bed',
        description: 'Choose an available bed to transfer the patient.',
        variant: 'destructive',
      });
      return;
    }
    if (!transferReason.trim()) {
      toast({
        title: 'Transfer reason required',
        description: 'Add a short reason to proceed.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await transferMutation.mutateAsync({
        toWardId: selectedTargetBed.wardId,
        toBedId: selectedTargetBed.bedId,
        transferReason: transferReason.trim(),
        transferType,
        notes: transferNotes.trim() || undefined,
      });
      toast({ title: 'Transfer completed', description: 'Patient moved successfully.', variant: 'success' });
      await postActionMessage(
        `Transfer completed: ${wardName} ${bedNumber} → ${selectedTargetBed.wardName} ${selectedTargetBed.bedCode}. Reason: ${transferReason.trim()}.`
      );
      resetTransferState();
      setIsTransferOpen(false);
    } catch (err) {
      toast({
        title: 'Transfer failed',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleAddMember = async () => {
    if (!selectedStaffId || !selectedRole) {
      return;
    }
    await addMemberMutation.mutateAsync({
      staffId: selectedStaffId,
      memberRole: selectedRole,
    });
    setSelectedStaffId('');
    setSelectedRole('');
  };

  const handleRemoveMember = async (memberId: string) => {
    await removeMemberMutation.mutateAsync({ memberId });
  };

  const messageTone = (type?: MessageType, isSystem?: boolean) => {
    if (isSystem || type === 'SYSTEM') {
      return {
        wrapper:
          'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200',
        marker: 'bg-slate-400',
      };
    }
    if (type === 'CLINICAL_EVENT') {
      return {
        wrapper:
          'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-100',
        marker: 'bg-amber-500',
      };
    }
    return {
      wrapper: 'border-border/50 bg-background text-foreground',
      marker: 'bg-sky-500',
    };
  };

  const priorityTone: Record<MessagePriority, string> = {
    NORMAL: 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300',
    HIGH: 'border-amber-200 text-amber-700 dark:border-amber-700/60 dark:text-amber-300',
    URGENT: 'border-rose-200 text-rose-700 dark:border-rose-700/60 dark:text-rose-300',
  };

  return (
    <div className="space-y-6">
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
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Inpatient Channel
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`px-3 py-1 text-sm font-medium capitalize ${getStatusColor(
              admissionData?.admissionStatus
            )} border-0`}
          >
            {admissionData?.admissionStatus ?? 'Unknown Status'}
          </Badge>
          <Badge
            variant="outline"
            className="border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
          >
            Acuity: {admissionData?.acuity ?? 'N/A'}
          </Badge>
          {admissionData?.dischargeStatus && admissionData.dischargeStatus !== 'NONE' && (
            <>
              {admissionData.dischargeStatus === 'READY' && (
                <Badge className="bg-green-500 px-3 py-1 text-sm font-medium">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Ready for Discharge
                </Badge>
              )}
              {admissionData.dischargeStatus === 'INITIATED' && (
                <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                  <Clock className="mr-1 h-3 w-3" />
                  Planning Initiated
                </Badge>
              )}
              {admissionData.dischargeStatus === 'CONFIRMED' && (
                <Badge variant="outline" className="px-3 py-1 text-sm font-medium">
                  <FileCheck className="mr-1 h-3 w-3" />
                  Discharged
                </Badge>
              )}
            </>
          )}
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
        <>
          <Card className="relative overflow-hidden border-indigo-200/50 shadow-md transition-all hover:shadow-lg dark:border-indigo-800/50 bg-gradient-to-br from-indigo-500/10 via-background to-blue-500/10 dark:from-indigo-500/20 dark:via-background dark:to-blue-500/20">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-400/10" />
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-400/10" />
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
            <CardContent className="grid gap-6 p-6 sm:grid-cols-2 md:grid-cols-4">
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
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Discharge Status</p>
                <div className="flex items-center gap-2">
                  {admissionData?.dischargeStatus === 'READY' ? (
                    <>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-green-700 dark:text-green-300">Ready</p>
                        <p className="text-sm text-muted-foreground">For discharge</p>
                      </div>
                    </>
                  ) : admissionData?.dischargeStatus === 'INITIATED' ? (
                    <>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                        <ClipboardList className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-700 dark:text-blue-300">Planning</p>
                        <p className="text-sm text-muted-foreground">In progress</p>
                      </div>
                    </>
                  ) : admissionData?.dischargeStatus === 'CONFIRMED' ? (
                    <>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        <FileCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Discharged</p>
                        <p className="text-sm text-muted-foreground">Complete</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div className="text-sm">
                        {admissionData?.expectedDischargeDate ? (
                          <>
                            <p className="font-medium">
                              {formatDateTime(admissionData?.expectedDischargeDate).split(',')[0]}
                            </p>
                            <p className="text-muted-foreground">
                              {formatRelativeTime(admissionData?.expectedDischargeDate)}
                            </p>
                          </>
                        ) : (
                          <p className="text-muted-foreground italic">Not planned</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-8 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-8">
              <Card className="flex h-full flex-col border-slate-200 shadow-sm dark:border-slate-800">
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Activity className="h-5 w-5 text-emerald-500" />
                      Care Channel
                    </CardTitle>
                    <CardDescription>Care team messages and clinical events.</CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="uppercase tracking-wide">
                      {channel?.status ?? 'UNKNOWN'}
                    </Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Users className="h-4 w-4" />
                          Team
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Care Team Members</DialogTitle>
                          <DialogDescription>
                            Manage staff members assigned to this care channel.
                          </DialogDescription>
                        </DialogHeader>

                        {/* Add Member Form */}
                        <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                          <div className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4 text-emerald-500" />
                            <p className="text-sm font-semibold">Add Team Member</p>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-3">
                            <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                              <SelectTrigger className="bg-white dark:bg-slate-950">
                                <SelectValue placeholder="Select staff" />
                              </SelectTrigger>
                              <SelectContent>
                                {staffListQuery.data?.map((staff: any) => {
                                  const staffName =
                                    staff.displayName ??
                                    [staff.firstName, staff.lastName].filter(Boolean).join(' ') ??
                                    staff.id;
                                  return (
                                    <SelectItem key={staff.id} value={staff.id}>
                                      {staffName}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <Select value={selectedRole} onValueChange={setSelectedRole}>
                              <SelectTrigger className="bg-white dark:bg-slate-950">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                {CARE_TEAM_ROLES.map((role) => (
                                  <SelectItem key={role.value} value={role.value}>
                                    {role.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              onClick={handleAddMember}
                              disabled={
                                !selectedStaffId || !selectedRole || addMemberMutation.isPending
                              }
                              size="sm"
                              className="gap-2"
                            >
                              <UserPlus className="h-4 w-4" />
                              {addMemberMutation.isPending ? 'Adding...' : 'Add'}
                            </Button>
                          </div>
                        </div>

                        {/* Members List */}
                        <div>
                          {membersQuery.isLoading && (
                            <p className="text-sm text-muted-foreground">Loading members...</p>
                          )}
                          {!membersQuery.isLoading && (membersQuery.data?.length ?? 0) === 0 && (
                            <p className="text-sm text-muted-foreground">No members found.</p>
                          )}
                          <ScrollArea className="h-[300px] pr-4">
                            <div className="space-y-2">
                              {membersQuery.data?.map((member) => {
                                const name =
                                  member.staff?.displayName ??
                                  [member.staff?.firstName, member.staff?.lastName].filter(Boolean).join(' ') ??
                                  member.staffId;
                                const isActive = !member.removedAt;
                                return (
                                  <div
                                    key={member.id}
                                    className={`group rounded-xl border px-3 py-2 text-sm transition-colors ${isActive
                                      ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950'
                                      : 'border-slate-100 bg-slate-50 opacity-60 dark:border-slate-800 dark:bg-slate-900'
                                      }`}
                                  >
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">{name}</span>
                                        <Badge variant="secondary" className="uppercase text-[10px]">
                                          {member.memberRole.replace(/_/g, ' ')}
                                        </Badge>
                                      </div>
                                      {isActive && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleRemoveMember(member.id)}
                                          disabled={removeMemberMutation.isPending}
                                          className="h-7 gap-1 px-2 opacity-0 transition-opacity group-hover:opacity-100"
                                        >
                                          <X className="h-3 w-3" />
                                          Remove
                                        </Button>
                                      )}
                                    </div>
                                    {member.removedAt && (
                                      <p className="mt-1 text-xs text-muted-foreground">
                                        Removed {formatRelativeTime(member.removedAt)}
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </ScrollArea>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => syncMembersMutation.mutateAsync()}
                      disabled={!channel?.id || syncMembersMutation.isPending}
                    >
                      {syncMembersMutation.isPending ? 'Syncing...' : 'Sync'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  {!channel && !channelQuery.isLoading && (
                    <p className="text-sm text-muted-foreground">No care channel found for this admission.</p>
                  )}
                  {channelQuery.isLoading && (
                    <p className="text-sm text-muted-foreground">Loading care channel...</p>
                  )}
                  {channel && (
                    <div className="flex flex-col gap-6">
                      <div className="flex-1 space-y-4">
                        <ScrollArea className="h-[500px] pr-4">
                          <div className="space-y-3">
                            {timelineQuery.isLoading && (
                              <p className="text-sm text-muted-foreground">Loading timeline...</p>
                            )}
                            {!timelineQuery.isLoading &&
                              (!timelineQuery.data?.data || timelineQuery.data.data.length === 0) && (
                                <p className="text-sm text-muted-foreground">No messages yet.</p>
                              )}
                            {timelineQuery.data?.data?.map((message) => {
                              const authorLabel =
                                message.author?.displayName ??
                                [message.author?.firstName, message.author?.lastName].filter(Boolean).join(' ') ??
                                (message.authorStaffId ? memberByStaffId.get(message.authorStaffId) : null) ??
                                'Care Team';
                              const subtypeLabel = message.messageSubtype
                                ? message.messageSubtype.replace(/_/g, ' ')
                                : null;
                              const isSelf = Boolean(
                                message.authorStaffId &&
                                admissionData?.attendingPhysicianId &&
                                message.authorStaffId === admissionData.attendingPhysicianId
                              );
                              const tone = messageTone(message.messageType, message.isSystemMessage);
                              const isTransferMessage =
                                message.isSystemMessage &&
                                (message.messageSubtype?.toLowerCase().includes('transfer') ||
                                  message.bodyText?.toLowerCase().includes('transferred'));
                              const messageBody = isTransferMessage
                                ? formatTransferMessage(message)
                                : message.bodyText || 'System event logged.';
                              return (
                                <div key={message.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                                  <div
                                    className={`relative w-full max-w-[520px] overflow-hidden rounded-xl border px-4 py-3 text-sm ${tone.wrapper
                                      } ${isSelf ? 'bg-sky-50/70 dark:bg-sky-950/30' : ''}`}
                                  >
                                    <span
                                      className={`absolute top-0 h-full w-1 ${tone.marker} ${isSelf ? 'right-0' : 'left-0'
                                        }`}
                                    />
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-semibold">{authorLabel}</span>
                                        <Badge variant="secondary" className="uppercase text-[10px]">
                                          {message.messageType}
                                        </Badge>
                                        {message.priority && message.messageType === 'TEXT' && (
                                          <Badge
                                            variant="outline"
                                            className={`uppercase text-[10px] ${priorityTone[message.priority]}`}
                                          >
                                            {message.priority}
                                          </Badge>
                                        )}
                                        {subtypeLabel && (
                                          <span className="text-xs text-muted-foreground capitalize">
                                            {subtypeLabel}
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-xs text-muted-foreground">
                                        {formatRelativeTime(message.createdAt)}
                                      </span>
                                    </div>
                                    <p className="mt-2 text-sm">
                                      {message.deletedAt ? 'Message deleted.' : messageBody}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </ScrollArea>

                        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                          <p className="text-sm font-semibold">Send message</p>
                          <div className="mt-3 space-y-3">
                            <Textarea
                              value={messageBody}
                              onChange={(event) => setMessageBody(event.target.value)}
                              placeholder="Type an update or note for the care team..."
                              rows={3}
                              disabled={channel.status !== 'ACTIVE'}
                            />
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <Select
                                value={messagePriority}
                                onValueChange={(value) => setMessagePriority(value as MessagePriority)}
                                disabled={channel.status !== 'ACTIVE'}
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="NORMAL">Normal</SelectItem>
                                  <SelectItem value="HIGH">High</SelectItem>
                                  <SelectItem value="URGENT">Urgent</SelectItem>
                                </SelectContent>
                              </Select>
                              <div className="flex flex-wrap items-center gap-2 md:ml-auto">
                                <Button
                                  type="button"
                                  variant="secondary"
                                  className="rounded-full"
                                  onClick={handleOpenMeds}
                                  disabled={!encounterId || !patientId}
                                >
                                  Meds
                                </Button>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  className="rounded-full"
                                  onClick={handleOpenOrders}
                                  disabled={!encounterId || !patientId}
                                >
                                  Orders
                                </Button>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  className="rounded-full"
                                  onClick={handleOpenTransfer}
                                  disabled={!admissionId}
                                >
                                  Transfer
                                </Button>
                                <Button
                                  type="button"
                                  onClick={handleSendMessage}
                                  disabled={
                                    channel.status !== 'ACTIVE' ||
                                    postMessageMutation.isPending ||
                                    !messageBody.trim() ||
                                    !admissionData?.attendingPhysicianId
                                  }
                                >
                                  {postMessageMutation.isPending ? 'Sending...' : 'Send'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8 lg:col-span-4">
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
                      {[1, 2].map((i) => (
                        <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
                      ))}
                    </div>
                  ) : prescriptionsQuery.data?.length === 0 ? (
                    <div className="flex h-32 flex-col items-center justify-center text-center text-muted-foreground">
                      <CheckCircle2 className="mb-2 h-8 w-8 text-emerald-500/30" />
                      <p className="text-sm">No active prescriptions</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-3">
                        {prescriptionsQuery.data?.map((prescription: any) => (
                          <div
                            key={prescription.id}
                            className="group relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition-all hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-800/80"
                          >
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <p className="font-semibold text-slate-900 dark:text-slate-100">
                                  {prescription.drugName}
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                  <span className="font-medium text-slate-700 dark:text-slate-300">
                                    {prescription.dosage}
                                  </span>
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

              <Card className="border-slate-200 shadow-sm dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ClipboardList className="h-5 w-5 text-slate-500" />
                    Checklists
                  </CardTitle>
                  <CardDescription>Track checklist progress for this admission.</CardDescription>
                </CardHeader>
                <CardContent>
                  {checklistsQuery.isLoading && (
                    <p className="text-sm text-muted-foreground">Loading checklists...</p>
                  )}
                  {!checklistsQuery.isLoading && (checklistsQuery.data?.length ?? 0) === 0 && (
                    <p className="text-sm text-muted-foreground">No checklists found.</p>
                  )}
                  <div className="space-y-3">
                    {checklistsQuery.data?.map((instance) => (
                      <div
                        key={instance.id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-950"
                      >
                        <div>
                          <p className="font-medium">{instance.template?.name ?? 'Checklist'}</p>
                          <p className="text-xs text-muted-foreground">
                            {instance.template?.category ?? 'Category'} · {instance.completionPercent}% complete
                          </p>
                          {instance.dueAt && (
                            <p className="text-xs text-muted-foreground">
                              Due {formatRelativeTime(instance.dueAt)}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="uppercase text-[10px]">
                            {instance.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/${params.locale}/inpatient/checklists/${instance.id}`)}
                          >
                            Open
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </>
      )}

      {encounterId && patientId && (attendingPhysicianId ?? userId) && (
        <>
          <WardPrescriptionDialog
            open={isMedsOpen}
            onOpenChange={setIsMedsOpen}
            encounterId={encounterId}
            patientId={patientId}
            patientName={patientName}
            prescribedBy={attendingPhysicianId ?? userId}
            onPrescriptionAdded={postActionMessage}
          />
          <WardOrdersDialog
            open={isOrdersOpen}
            onOpenChange={setIsOrdersOpen}
            encounterId={encounterId}
            patientId={patientId}
            patientName={patientName}
            orderedBy={attendingPhysicianId ?? userId}
            onOrderAdded={postActionMessage}
          />
        </>
      )}

      <Dialog
        open={isTransferOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsTransferOpen(false);
            resetTransferState();
          } else {
            setIsTransferOpen(true);
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transfer Patient</DialogTitle>
            <DialogDescription>Move this patient to another available bed.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Transfer From</p>
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{wardName}</p>
                <p className="text-sm text-muted-foreground">{bedNumber}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Transfer To</p>
                <Select value={transferTargetBedId} onValueChange={setTransferTargetBedId}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select destination bed" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBeds.length === 0 && (
                      <SelectItem value="none" disabled>
                        No available beds
                      </SelectItem>
                    )}
                    {availableBeds.map((bed) => (
                      <SelectItem key={bed.bedId} value={bed.bedId}>
                        {bed.wardName} · {bed.bedCode}
                        {bed.spaceName ? ` · ${bed.spaceName}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="transfer-type">Transfer Type *</Label>
                <Select
                  value={transferType}
                  onValueChange={(value) => setTransferType(value as TransferType)}
                >
                  <SelectTrigger id="transfer-type">
                    <SelectValue placeholder="Select transfer type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(TransferType).map((value) => (
                      <SelectItem key={value} value={value}>
                        {value.replace(/_/g, ' ').toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transfer-reason">Transfer Reason *</Label>
                <Textarea
                  id="transfer-reason"
                  value={transferReason}
                  onChange={(event) => setTransferReason(event.target.value)}
                  placeholder="Add a short reason"
                  rows={2}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transfer-notes">Notes</Label>
              <Textarea
                id="transfer-notes"
                value={transferNotes}
                onChange={(event) => setTransferNotes(event.target.value)}
                placeholder="Optional notes"
                rows={3}
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsTransferOpen(false);
                  resetTransferState();
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleTransferSubmit}
                disabled={transferMutation.isPending}
              >
                {transferMutation.isPending ? 'Transferring...' : 'Transfer Patient'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
