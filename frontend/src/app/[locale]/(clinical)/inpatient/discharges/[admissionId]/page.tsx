'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Clock, FileCheck, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  useAdmission,
  useApproveDischarge,
  useCancelDischarge,
  useDischargeTransaction,
  useExecuteDischarge,
  useInitiateDischarge,
  useMarkDischargeReady,
} from '@/modules/clinical/hooks/use-inpatient';
import { DischargeDestination, DischargeType, DischargeTransactionStatus } from '@/modules/clinical/types/inpatient';

const formatDateTime = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const statusTone = (status?: string) => {
  const normalized = status?.toUpperCase() ?? 'NONE';
  if (normalized === 'READY') {
    return { label: 'Ready', className: 'bg-emerald-500 text-white' };
  }
  if (normalized === 'APPROVED') {
    return { label: 'Approved', className: 'bg-sky-500 text-white' };
  }
  if (normalized === 'EXECUTED' || normalized === 'CONFIRMED') {
    return { label: 'Discharged', className: 'bg-slate-900 text-white' };
  }
  if (normalized === 'CANCELLED') {
    return { label: 'Cancelled', className: 'bg-rose-500 text-white' };
  }
  if (normalized === 'PLANNING' || normalized === 'INITIATED') {
    return { label: 'Planning', className: 'bg-amber-500 text-white' };
  }
  return { label: 'Not started', className: 'bg-slate-200 text-slate-700' };
};

export default function DischargeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const admissionId = typeof params?.admissionId === 'string' ? params.admissionId : '';

  const { data: admission, isLoading } = useAdmission(admissionId);
  const dischargeQuery = useDischargeTransaction(admissionId);
  const initiateMutation = useInitiateDischarge(admissionId);
  const readyMutation = useMarkDischargeReady(admissionId);
  const approveMutation = useApproveDischarge(admissionId);
  const executeMutation = useExecuteDischarge(admissionId);
  const cancelMutation = useCancelDischarge(admissionId);

  const discharge = dischargeQuery.data as any;
  const dischargeStatus = discharge?.status ?? 'NONE';
  const tone = statusTone(dischargeStatus);

  const patientName = admission?.patient?.firstName
    ? `${admission.patient.firstName} ${admission.patient.lastName ?? ''}`.trim()
    : 'Unknown Patient';
  const patientMrn = admission?.patient?.mrn ?? 'N/A';

  const [targetDischargeDate, setTargetDischargeDate] = useState('');
  const [targetDischargeTime, setTargetDischargeTime] = useState('');
  const [approvalRequired, setApprovalRequired] = useState(false);
  const [internalNotes, setInternalNotes] = useState('');
  const [readyRemarks, setReadyRemarks] = useState('');
  const [approvalRemarks, setApprovalRemarks] = useState('');
  const [dischargeType, setDischargeType] = useState<DischargeType>(DischargeType.ROUTINE);
  const [dischargeDestination, setDischargeDestination] = useState<DischargeDestination>(DischargeDestination.HOME);
  const [dischargeSummaryId, setDischargeSummaryId] = useState('');
  const [followUpInstructions, setFollowUpInstructions] = useState('');
  const [cancellationReason, setCancellationReason] = useState('');

  const resetInitiateForm = () => {
    setTargetDischargeDate('');
    setTargetDischargeTime('');
    setApprovalRequired(false);
    setInternalNotes('');
  };

  const handleInitiate = async () => {
    try {
      await initiateMutation.mutateAsync({
        targetDischargeDate: targetDischargeDate || undefined,
        targetDischargeTime: targetDischargeTime || undefined,
        approvalRequired,
        internalNotes: internalNotes.trim() || undefined,
      });
      toast({ title: 'Discharge initiated', description: 'Discharge planning has started.', variant: 'success' });
      resetInitiateForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to initiate discharge.';
      toast({ title: 'Discharge failed', description: message, variant: 'destructive' });
    }
  };

  const handleReady = async () => {
    try {
      await readyMutation.mutateAsync({ readyRemarks: readyRemarks.trim() || undefined });
      toast({ title: 'Marked ready', description: 'Discharge marked as ready.', variant: 'success' });
      setReadyRemarks('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to mark ready.';
      toast({ title: 'Update failed', description: message, variant: 'destructive' });
    }
  };

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync({ approvalRemarks: approvalRemarks.trim() || undefined });
      toast({ title: 'Discharge approved', description: 'Approval recorded.', variant: 'success' });
      setApprovalRemarks('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to approve discharge.';
      toast({ title: 'Approval failed', description: message, variant: 'destructive' });
    }
  };

  const handleExecute = async () => {
    try {
      await executeMutation.mutateAsync({
        dischargeType,
        dischargeDestination,
        dischargeSummaryId: dischargeSummaryId.trim() || undefined,
        followUpInstructions: followUpInstructions.trim() || undefined,
      });
      toast({ title: 'Discharge executed', description: 'Patient discharged successfully.', variant: 'success' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to execute discharge.';
      toast({ title: 'Execution failed', description: message, variant: 'destructive' });
    }
  };

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync({ cancellationReason: cancellationReason.trim() });
      toast({ title: 'Discharge cancelled', description: 'Discharge planning has been cancelled.', variant: 'success' });
      setCancellationReason('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to cancel discharge.';
      toast({ title: 'Cancellation failed', description: message, variant: 'destructive' });
    }
  };

  const canInitiate = !dischargeQuery.data;
  const canMarkReady = dischargeStatus === DischargeTransactionStatus.PLANNING;
  const canApprove = dischargeStatus === DischargeTransactionStatus.READY && discharge?.approvalRequired;
  const canExecute =
    dischargeStatus === DischargeTransactionStatus.READY || dischargeStatus === DischargeTransactionStatus.APPROVED;
  const canCancel = dischargeStatus !== DischargeTransactionStatus.EXECUTED && dischargeStatus !== 'CONFIRMED';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/${params.locale}/inpatient/discharges`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Discharge Overview</h1>
            <p className="text-sm text-muted-foreground">Admission {admission?.admissionNumber ?? admissionId}</p>
          </div>
        </div>
        <Badge className={tone.className}>{tone.label}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient & Admission</CardTitle>
              <CardDescription>Key details for the discharge workflow.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Patient</p>
                <p className="font-medium">{patientName}</p>
                <p className="text-xs text-muted-foreground">MRN: {patientMrn}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Admission Status</p>
                <p className="font-medium">{admission?.status ?? '—'}</p>
                <p className="text-xs text-muted-foreground">Admitted {formatDateTime(admission?.admissionDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Discharge Status</p>
                <p className="font-medium">{dischargeStatus}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approval Required</p>
                <p className="font-medium">{discharge?.approvalRequired ? 'Yes' : 'No'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Discharge Timeline</CardTitle>
              <CardDescription>Progress milestones for this discharge.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Clock className="mt-1 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Initiated</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(discharge?.initiatedAt)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Ready</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(discharge?.readyAt)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileCheck className="mt-1 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Approved</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(discharge?.approvedAt)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="mt-1 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Executed / Cancelled</p>
                  <p className="text-xs text-muted-foreground">
                    {discharge?.executedAt
                      ? formatDateTime(discharge.executedAt)
                      : formatDateTime(discharge?.cancelledAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Initiate Discharge</CardTitle>
              <CardDescription>Start discharge planning when ready.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="init-date">Target date</Label>
                  <Input
                    id="init-date"
                    type="date"
                    value={targetDischargeDate}
                    onChange={(event) => setTargetDischargeDate(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="init-time">Target time</Label>
                  <Input
                    id="init-time"
                    type="time"
                    value={targetDischargeTime}
                    onChange={(event) => setTargetDischargeTime(event.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  {approvalRequired ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-slate-400" />
                  )}
                  Approval required
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setApprovalRequired((prev) => !prev)}
                >
                  {approvalRequired ? 'Required' : 'Not required'}
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="init-notes">Internal notes</Label>
                <Textarea
                  id="init-notes"
                  rows={3}
                  value={internalNotes}
                  onChange={(event) => setInternalNotes(event.target.value)}
                />
              </div>
              <Button
                type="button"
                className="w-full"
                onClick={handleInitiate}
                disabled={!canInitiate || initiateMutation.isPending}
              >
                {initiateMutation.isPending ? 'Starting...' : 'Start Planning'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mark Ready</CardTitle>
              <CardDescription>Confirm discharge checklist completion.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Ready remarks (optional)"
                value={readyRemarks}
                onChange={(event) => setReadyRemarks(event.target.value)}
                rows={3}
              />
              <Button type="button" className="w-full" onClick={handleReady} disabled={!canMarkReady}>
                Mark Ready
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Approve Discharge</CardTitle>
              <CardDescription>Capture approval remarks (if required).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Approval remarks (optional)"
                value={approvalRemarks}
                onChange={(event) => setApprovalRemarks(event.target.value)}
                rows={3}
              />
              <Button type="button" className="w-full" onClick={handleApprove} disabled={!canApprove}>
                Approve
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Execute Discharge</CardTitle>
              <CardDescription>Finalize discharge details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Discharge type *</Label>
                <Select value={dischargeType} onValueChange={(value) => setDischargeType(value as DischargeType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select discharge type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(DischargeType).map((value) => (
                      <SelectItem key={value} value={value}>
                        {value.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Discharge destination *</Label>
                <Select
                  value={dischargeDestination}
                  onValueChange={(value) => setDischargeDestination(value as DischargeDestination)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(DischargeDestination).map((value) => (
                      <SelectItem key={value} value={value}>
                        {value.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary-id">Discharge summary ID</Label>
                <Input
                  id="summary-id"
                  value={dischargeSummaryId}
                  onChange={(event) => setDischargeSummaryId(event.target.value)}
                  placeholder="note-uuid"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="follow-up">Follow-up instructions</Label>
                <Textarea
                  id="follow-up"
                  rows={3}
                  value={followUpInstructions}
                  onChange={(event) => setFollowUpInstructions(event.target.value)}
                />
              </div>
              <Button type="button" className="w-full" onClick={handleExecute} disabled={!canExecute}>
                Execute Discharge
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cancel Discharge</CardTitle>
              <CardDescription>Cancel discharge planning when needed.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Cancellation reason"
                value={cancellationReason}
                onChange={(event) => setCancellationReason(event.target.value)}
                rows={3}
              />
              <Button
                type="button"
                variant="destructive"
                className="w-full"
                onClick={handleCancel}
                disabled={!canCancel || cancellationReason.trim().length === 0}
              >
                Cancel Discharge
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading admission...</p>}
    </div>
  );
}
