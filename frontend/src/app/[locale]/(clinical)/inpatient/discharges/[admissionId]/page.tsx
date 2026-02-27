'use client';

import { useEffect, useState } from 'react';
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
import {
  DischargeTransactionDestination,
  DischargeTransactionStatus,
  DischargeTransactionType,
} from '@/modules/clinical/types/inpatient';

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

const toOptionLabel = (value: string) =>
  value
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ');

export default function DischargeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const admissionId = typeof params?.admissionId === 'string' ? params.admissionId : '';

  const { data: admissionData, isLoading } = useAdmission(admissionId);
  const admission = admissionData as any;
  const dischargeQuery = useDischargeTransaction(admissionId);
  const discharge = dischargeQuery.data as any;
  const dischargeId = discharge?.id;

  const initiateMutation = useInitiateDischarge(admissionId);
  const readyMutation = useMarkDischargeReady(dischargeId ?? '');
  const approveMutation = useApproveDischarge(dischargeId ?? '');
  const executeMutation = useExecuteDischarge(dischargeId ?? '');
  const cancelMutation = useCancelDischarge(dischargeId ?? '');
  const dischargeStatus = discharge?.status ?? 'NONE';
  const tone = statusTone(dischargeStatus);
  const normalizedDischargeStatus = dischargeStatus?.toUpperCase?.() ?? 'NONE';

  // currentStepIndex represents the number of completed steps
  const currentStepIndex = (() => {
    if (['EXECUTED', 'CONFIRMED'].includes(normalizedDischargeStatus)) return 4; // All steps complete
    if (normalizedDischargeStatus === 'APPROVED') return 3; // Steps 0, 1, 2 complete
    if (normalizedDischargeStatus === 'READY') return 2; // Steps 0, 1 complete
    if (['PLANNING', 'INITIATED'].includes(normalizedDischargeStatus)) return 1; // Step 0 complete
    return 0; // No steps complete
  })();
  const nextStepIndex = (() => {
    if (normalizedDischargeStatus === 'NONE') return 0;
    if (['PLANNING', 'INITIATED'].includes(normalizedDischargeStatus)) return 1;
    if (normalizedDischargeStatus === 'READY') {
      return discharge?.approvalRequired ? 2 : 3;
    }
    if (normalizedDischargeStatus === 'APPROVED') return 3;
    if (['EXECUTED', 'CONFIRMED'].includes(normalizedDischargeStatus)) return 3;
    return 0;
  })();
  const stepperSteps = [
    { key: 'initiate', label: 'Initiate' },
    { key: 'ready', label: 'Mark Ready' },
    { key: 'approve', label: 'Approve' },
    { key: 'execute', label: 'Execute' },
  ];
  const [activeStep, setActiveStep] = useState(nextStepIndex);

  useEffect(() => {
    setActiveStep(nextStepIndex);
  }, [nextStepIndex]);

  // Use patientDisplay from admission data (no separate API call needed)
  const patientDisplay = (admission as any)?.patientDisplay;
  const patientName = patientDisplay?.displayName ?? 'Unknown Patient';
  const patientMrn = patientDisplay?.mrn ?? 'N/A';

  // Calculate Length of Stay
  const lengthOfStay = (() => {
    if (!admission?.admissionDate) return null;
    const admissionDate = new Date(admission.admissionDate);
    const endDate = discharge?.actualDischargeDate
      ? new Date(discharge.actualDischargeDate)
      : new Date();
    const diffTime = Math.abs(endDate.getTime() - admissionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  })();

  const [targetDischargeDate, setTargetDischargeDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [targetDischargeTime, setTargetDischargeTime] = useState('');
  const [approvalRequired, setApprovalRequired] = useState(false);
  const [internalNotes, setInternalNotes] = useState('');
  const [readyRemarks, setReadyRemarks] = useState('');
  const [approvalRemarks, setApprovalRemarks] = useState('');
  const [dischargeType, setDischargeType] = useState<DischargeTransactionType>(
    DischargeTransactionType.ROUTINE
  );
  const [dischargeDestination, setDischargeDestination] = useState<DischargeTransactionDestination>(
    DischargeTransactionDestination.HOME
  );
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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/${params.locale}/inpatient/discharge-summaries/${admissionId}`)}
          >
            Discharge Summary
          </Button>
          <Badge className={tone.className}>{tone.label}</Badge>
        </div>
      </div>

      <Card className="relative overflow-hidden border-indigo-200/50 shadow-md transition-all hover:shadow-lg dark:border-indigo-800/50 bg-gradient-to-br from-indigo-500/10 via-background to-blue-500/10 dark:from-indigo-500/20 dark:via-background dark:to-blue-500/20">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-400/10" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-400/10" />
        <CardContent className="pt-6 relative">
          <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Patient</p>
              <p className="text-xl font-semibold">{patientName}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span>MRN: {patientMrn}</span>
                {patientDisplay?.age && <span>Age: {patientDisplay.age}</span>}
                {patientDisplay?.gender && <span>Gender: {patientDisplay.gender}</span>}
              </div>
            </div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Admission</p>
                <p className="text-sm font-medium">{admission?.admissionNumber ?? admissionId}</p>
                <p className="text-xs text-muted-foreground">Admitted {formatDateTime(admission?.admissionDate)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Discharge Status</p>
                <Badge className={tone.className}>{tone.label}</Badge>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Approval Required</p>
                <p className="text-sm font-medium">{discharge?.approvalRequired ? 'Yes' : 'No'}</p>
              </div>
              {lengthOfStay !== null && (
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Length of Stay</p>
                  <p className="text-sm font-medium">
                    {lengthOfStay} {lengthOfStay === 1 ? 'day' : 'days'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {stepperSteps.map((step, index) => {
                  // Step 2 (Approve) is skipped if approval is not required
                  const isSkipped = index === 2 && !discharge?.approvalRequired;
                  const isCompleted = !isSkipped && index < currentStepIndex;
                  const isActive = !isSkipped && index === activeStep && normalizedDischargeStatus !== 'NONE';
                  const statusLabel = isSkipped ? 'Skipped' : isCompleted ? 'Completed' : isActive ? 'Active' : 'Upcoming';
                  const circleClass = isCompleted
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : isActive
                      ? 'border-sky-500 bg-sky-500 text-white'
                      : 'border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-slate-900';
                  const lineClass = isCompleted ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-slate-800';

                  return (
                    <div key={step.key} className="flex flex-1 items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold ${circleClass}`}
                      >
                        {index + 1}
                      </div>
                      <div className="min-w-[120px]">
                        <p className="text-sm font-semibold">{step.label}</p>
                        <p className="text-xs text-muted-foreground">{statusLabel}</p>
                      </div>
                      {index < stepperSteps.length - 1 && (
                        <div className={`ml-auto hidden h-px flex-1 sm:block ${lineClass}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {activeStep === 0 && (
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
                <div className="flex items-center justify-between gap-2">
                  <Button type="button" variant="ghost" disabled>
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handleInitiate}
                    disabled={!canInitiate || initiateMutation.isPending}
                  >
                    {initiateMutation.isPending ? 'Starting...' : 'Start Planning'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeStep === 1 && (
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
                <div className="flex items-center justify-between gap-2">
                  <Button type="button" variant="ghost" onClick={() => setActiveStep(0)}>
                    Back
                  </Button>
                  <Button type="button" onClick={handleReady} disabled={!canMarkReady}>
                    Mark Ready
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeStep === 2 && (
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
                <div className="flex items-center justify-between gap-2">
                  <Button type="button" variant="ghost" onClick={() => setActiveStep(1)}>
                    Back
                  </Button>
                  <Button type="button" onClick={handleApprove} disabled={!canApprove}>
                    Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Execute Discharge</CardTitle>
                <CardDescription>Finalize discharge details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Discharge type *</Label>
                  <Select
                    value={dischargeType}
                    onValueChange={(value) => setDischargeType(value as DischargeTransactionType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select discharge type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(DischargeTransactionType).map((value) => (
                        <SelectItem key={value} value={value}>
                          {toOptionLabel(value)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Discharge destination *</Label>
                  <Select
                    value={dischargeDestination}
                    onValueChange={(value) =>
                      setDischargeDestination(value as DischargeTransactionDestination)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(DischargeTransactionDestination).map((value) => (
                        <SelectItem key={value} value={value}>
                          {toOptionLabel(value)}
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
                <div className="flex items-center justify-between gap-2">
                  <Button type="button" variant="ghost" onClick={() => setActiveStep(2)}>
                    Back
                  </Button>
                  <Button type="button" onClick={handleExecute} disabled={!canExecute}>
                    Execute Discharge
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

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

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Discharge Timeline</CardTitle>
              <CardDescription>Progress milestones for this discharge.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <p className="text-xs text-muted-foreground">{formatDateTime(discharge?.readyMarkedAt)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileCheck className="mt-1 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Approved</p>
                  <p className="text-xs text-muted-foreground">
                    {!discharge?.approvalRequired
                      ? 'Skipped (approval not required)'
                      : formatDateTime(discharge?.approvedAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="mt-1 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Executed / Cancelled</p>
                  <p className="text-xs text-muted-foreground">
                    {discharge?.actualDischargeDate
                      ? formatDateTime(discharge.actualDischargeDate)
                      : formatDateTime(discharge?.cancelledAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading admission...</p>}
    </div>
  );
}
