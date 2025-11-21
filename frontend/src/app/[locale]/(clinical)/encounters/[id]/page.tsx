'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AxiosError } from 'axios';
import { format } from 'date-fns';
import { ArrowLeft, User, Calendar, FileText, Stethoscope, Shield, Plus } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

import { useEncounter, useUpdateEncounterStatus } from '@/modules/clinical/hooks/use-encounters';
import { EncounterStatus } from '@/modules/clinical/types/encounter';
import { useStaff } from '@/modules/foundation/hooks/use-staff';
import type { StaffMember } from '@/modules/foundation/types/staff';
import { useEncounterCoverages, useCreateEncounterCoverage } from '@/modules/rcm/hooks/use-encounter-coverages';
import type { EncounterCoverage, CreateEncounterCoverageInput } from '@/modules/rcm/types/coverage';
import { CoverageLevel, FinancialClass } from '@/modules/rcm/types/coverage';
import { usePayers } from '@/modules/rcm/hooks/use-payers';
import { PayerStatus } from '@/modules/rcm/types/payer';
import { usePatientPolicies } from '@/modules/rcm/hooks/use-policies';
import { PolicyStatus } from '@/modules/rcm/types/policy';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const STATUS_COLORS: Record<string, string> = {
  planned: 'bg-blue-100 text-blue-800',
  arrived: 'bg-purple-100 text-purple-800',
  triaged: 'bg-yellow-100 text-yellow-800',
  'in-progress': 'bg-green-100 text-green-800',
  finished: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

const buildInitialCoverageForm = () => ({
  payerId: '',
  policyId: '',
  planName: '',
  memberName: '',
  memberId: '',
  networkName: '',
  financialClass: FinancialClass.INSURANCE,
  coverageLevel: CoverageLevel.PRIMARY,
  copayAmount: '',
  coinsurancePct: '',
  deductibleSnapshot: '',
  benefitsSnapshot: '',
});

type CoverageFormState = ReturnType<typeof buildInitialCoverageForm>;

export default function EncounterDetailPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const router = useRouter();
  const toast = useToast();
  const { data: encounter, isLoading } = useEncounter(params.id);
  const { data: encounterCoverages, isLoading: isCoveragesLoading } = useEncounterCoverages(params.id);
  const createCoverageMutation = useCreateEncounterCoverage(params.id);
  const { data: payers } = usePayers({ status: PayerStatus.ACTIVE });
  const { data: patientPolicies } = usePatientPolicies(encounter?.patientId, PolicyStatus.ACTIVE);
  const [isCoverageDialogOpen, setCoverageDialogOpen] = useState(false);
  const [coverageForm, setCoverageForm] = useState<CoverageFormState>(buildInitialCoverageForm());
  const updateStatusMutation = useUpdateEncounterStatus();

  // Fetch staff data to get primary staff name
  const { data: staffData } = useStaff({ status: 'active' });

  const staffList = staffData?.data as StaffMember[] | undefined;
  const primaryStaff = staffList?.find((staff) => staff.id === encounter?.primaryStaffId);
  const primaryStaffName = primaryStaff?.displayName ||
    (primaryStaff ? `${primaryStaff.firstName} ${primaryStaff.lastName}` : 'Unknown Staff');

  const activePolicies = patientPolicies ?? [];
  const availablePayers = payers ?? [];

  const handleCoverageDialogChange = (open: boolean) => {
    if (!open) {
      setCoverageForm(buildInitialCoverageForm());
    }
    setCoverageDialogOpen(open);
  };

  const formatCurrencyValue = (value?: number | null) => {
    if (value === null || value === undefined) return '—';
    const numeric = Number(value);
    return Number.isNaN(numeric) ? String(value) : numeric.toFixed(2);
  };

  const formatPercentage = (value?: number | null) => {
    if (value === null || value === undefined) return '—';
    const numeric = Number(value);
    return Number.isNaN(numeric) ? String(value) : `${numeric}%`;
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: params.id,
        status: newStatus,
      });

      toast({
        title: 'Status Updated',
        description: `Encounter status changed to ${newStatus}`,
      });
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast({
        variant: 'destructive',
        title: 'Error',
        description: axiosError?.response?.data?.message || 'Failed to update status',
      });
    }
  };

  const handlePolicySelect = (value: string) => {
    const matchedPolicy = activePolicies.find((policy) => policy.id === value);
    setCoverageForm((prev) => ({
      ...prev,
      policyId: value,
      payerId: matchedPolicy?.payerId ?? prev.payerId,
      planName: prev.planName || matchedPolicy?.payerName || '',
    }));
  };

  const handleCoverageSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!encounter) return;

    try {
      const toOptional = (value: string) => {
        const trimmed = value.trim();
        return trimmed ? trimmed : undefined;
      };

      const payload: CreateEncounterCoverageInput = {
        encounterId: encounter.id,
        patientId: encounter.patientId,
        financialClass: coverageForm.financialClass,
        coverageLevel: coverageForm.coverageLevel,
        planName: toOptional(coverageForm.planName),
        memberName: toOptional(coverageForm.memberName),
        memberId: toOptional(coverageForm.memberId),
        networkName: toOptional(coverageForm.networkName),
        isActive: true,
      };

      if (coverageForm.payerId) {
        payload.payerId = coverageForm.payerId;
      }
      if (coverageForm.policyId) {
        payload.policyId = coverageForm.policyId;
      }

      const copay = parseFloat(coverageForm.copayAmount);
      if (!Number.isNaN(copay)) {
        payload.copayAmount = copay;
      }
      const coinsurance = parseFloat(coverageForm.coinsurancePct);
      if (!Number.isNaN(coinsurance)) {
        payload.coinsurancePct = coinsurance;
      }

      if (coverageForm.deductibleSnapshot) {
        payload.deductibleSnapshot = JSON.parse(coverageForm.deductibleSnapshot);
      }
      if (coverageForm.benefitsSnapshot) {
        payload.benefitsSnapshot = JSON.parse(coverageForm.benefitsSnapshot);
      }

      await createCoverageMutation.mutateAsync(payload);
      toast({ title: 'Coverage added', description: 'Coverage linked to this encounter.' });
      handleCoverageDialogChange(false);
    } catch (error) {
      if (error instanceof SyntaxError) {
        toast({ variant: 'destructive', title: 'Invalid JSON', description: 'Check snapshot fields for valid JSON.' });
        return;
      }

      const axiosError = error as AxiosError<{ message?: string }>;
      toast({
        variant: 'destructive',
        title: 'Unable to save coverage',
        description: axiosError?.response?.data?.message || 'Please try again.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-muted-foreground">Loading encounter details...</div>
      </div>
    );
  }

  if (!encounter) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center">
        <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold">Encounter not found</h3>
        <Button onClick={() => router.push(`/${params.locale}/encounters`)}>
          Back to Encounters
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const colorClass = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
    return (
      <Badge variant="outline" className={colorClass}>
        {status.replace('-', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/${params.locale}/encounters`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Encounter Details</h1>
          <p className="text-muted-foreground">
            {encounter.patient?.displayName ||
              `${encounter.patient?.title ? encounter.patient.title + '. ' : ''}${encounter.patient?.firstName} ${encounter.patient?.lastName}`}{' '}
            - MRN: {encounter.patient?.mrn}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Encounter #: <span className="font-mono">{encounter.encounterNumber}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/${params.locale}/encounters/${params.id}/triage`)}>
            Triage
          </Button>
          <Select value={encounter.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={EncounterStatus.PLANNED}>Planned</SelectItem>
              <SelectItem value={EncounterStatus.ARRIVED}>Arrived</SelectItem>
              <SelectItem value={EncounterStatus.TRIAGED}>Triaged</SelectItem>
              <SelectItem value={EncounterStatus.IN_PROGRESS}>In Progress</SelectItem>
              <SelectItem value={EncounterStatus.FINISHED}>Finished</SelectItem>
              <SelectItem value={EncounterStatus.CANCELLED}>Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Encounter Information */}
        <Card>
          <CardHeader>
            <CardTitle>Encounter Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Status</div>
              <div className="mt-1">{getStatusBadge(encounter.status)}</div>
            </div>

            <Separator />

            <div>
              <div className="text-sm font-medium text-muted-foreground">Encounter Class</div>
              <div className="mt-1">
                <Badge variant="secondary">{encounter.encounterClass}</Badge>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground">Priority</div>
              <div className="mt-1 capitalize">{encounter.priority}</div>
            </div>

            <Separator />

            <div>
              <div className="text-sm font-medium text-muted-foreground">Start Time</div>
              <div className="mt-1 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                {format(new Date(encounter.startTime), 'PPP p')}
              </div>
            </div>

            {encounter.endTime && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">End Time</div>
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {format(new Date(encounter.endTime), 'PPP p')}
                </div>
              </div>
            )}

            <div>
              <div className="text-sm font-medium text-muted-foreground">Source</div>
              <div className="mt-1 capitalize">{encounter.encounterSource}</div>
            </div>

            <Separator />

            <div>
              <div className="text-sm font-medium text-muted-foreground">Primary Staff</div>
              <div className="mt-1 flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                {primaryStaffName}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Information */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Name</div>
              <div className="mt-1 flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                {encounter.patient?.displayName ||
                  `${encounter.patient?.title ? encounter.patient.title + '. ' : ''}${encounter.patient?.firstName}${encounter.patient?.middleName ? ' ' + encounter.patient.middleName : ''} ${encounter.patient?.lastName}`}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground">MRN</div>
              <div className="mt-1">{encounter.patient?.mrn}</div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground">Date of Birth</div>
              <div className="mt-1">
                {encounter.patient?.dateOfBirth
                  ? format(new Date(encounter.patient.dateOfBirth), 'PPP')
                  : '-'}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground">Gender</div>
              <div className="mt-1 capitalize">{encounter.patient?.gender}</div>
            </div>

            {encounter.patient?.phoneNumber && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Phone</div>
                <div className="mt-1">{encounter.patient.phoneNumber}</div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> Encounter Coverages
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCoverageDialogChange(true)}
              disabled={!encounter?.patientId}
            >
              <Plus className="mr-2 h-4 w-4" /> Add coverage
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {isCoveragesLoading ? (
              <div className="text-muted-foreground">Loading coverages…</div>
            ) : !encounterCoverages || encounterCoverages.length === 0 ? (
              <p className="text-muted-foreground">
                No coverages linked to this encounter. Use “Add coverage” to link an eligible payer or policy.
              </p>
            ) : (
              encounterCoverages.map((coverage: EncounterCoverage) => (
                <div key={coverage.id} className="rounded border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">
                        {coverage.policy?.payerName || coverage.payer?.payerName || coverage.planName || 'Coverage'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Level: {coverage.coverageLevel.replace('_', ' ')} · {coverage.financialClass}
                      </p>
                      {coverage.policy && (
                        <p className="text-xs text-muted-foreground">
                          Policy #{coverage.policy.policyNumber}
                        </p>
                      )}
                    </div>
                    <Badge variant={coverage.isActive ? 'default' : 'secondary'}>
                      {coverage.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    <p>
                      <span className="text-muted-foreground">Policy #:</span>{' '}
                      {coverage.policy?.policyNumber || '—'}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Plan:</span>{' '}
                      {coverage.planName || coverage.payer?.payerName || '—'}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Member:</span>{' '}
                      {coverage.memberName || '—'} {coverage.memberId ? `(${coverage.memberId})` : ''}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Network:</span> {coverage.networkName || '—'}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Copay:</span>{' '}
                      {formatCurrencyValue(coverage.copayAmount)}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Coinsurance:</span>{' '}
                      {formatPercentage(coverage.coinsurancePct)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
      <Dialog open={isCoverageDialogOpen} onOpenChange={handleCoverageDialogChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add encounter coverage</DialogTitle>
            <DialogDescription>
              Link the encounter to payer or policy information so downstream eligibility, prior auth, and claims flows
              stay in sync.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleCoverageSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Policy (optional)</Label>
                <Select
                  value={coverageForm.policyId || undefined}
                  onValueChange={handlePolicySelect}
                  disabled={!activePolicies.length}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={activePolicies.length ? 'Select policy' : 'No active policies'} />
                  </SelectTrigger>
                  <SelectContent>
                    {activePolicies.length === 0 ? (
                      <SelectItem value="__no-policy" disabled>
                        No active policies
                      </SelectItem>
                    ) : (
                      activePolicies.map((policy) => (
                        <SelectItem key={policy.id} value={policy.id}>
                          {policy.payerName} · #{policy.policyNumber}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payer</Label>
                <Select
                  value={coverageForm.payerId || undefined}
                  onValueChange={(value) =>
                    setCoverageForm((prev) => ({
                      ...prev,
                      payerId: value,
                    }))
                  }
                  disabled={!availablePayers.length}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={availablePayers.length ? 'Select payer' : 'No payers defined'} />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePayers.length === 0 ? (
                      <SelectItem value="__no-payer" disabled>
                        No payer records
                      </SelectItem>
                    ) : (
                      availablePayers.map((payer) => (
                        <SelectItem key={payer.id} value={payer.id}>
                          {payer.payerName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Financial class</Label>
                <Select
                  value={coverageForm.financialClass}
                  onValueChange={(value) =>
                    setCoverageForm((prev) => ({
                      ...prev,
                      financialClass: value as FinancialClass,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={FinancialClass.INSURANCE}>Insurance</SelectItem>
                    <SelectItem value={FinancialClass.CORPORATE}>Corporate</SelectItem>
                    <SelectItem value={FinancialClass.TPA}>TPA</SelectItem>
                    <SelectItem value={FinancialClass.GOVERNMENT}>Government</SelectItem>
                    <SelectItem value={FinancialClass.CASH}>Cash / Self Pay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Coverage level</Label>
                <Select
                  value={coverageForm.coverageLevel}
                  onValueChange={(value) =>
                    setCoverageForm((prev) => ({
                      ...prev,
                      coverageLevel: value as CoverageLevel,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CoverageLevel.PRIMARY}>Primary</SelectItem>
                    <SelectItem value={CoverageLevel.SECONDARY}>Secondary</SelectItem>
                    <SelectItem value={CoverageLevel.TERTIARY}>Tertiary</SelectItem>
                    <SelectItem value={CoverageLevel.SELF_PAY}>Self-pay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Plan name</Label>
                <Input
                  value={coverageForm.planName}
                  onChange={(event) =>
                    setCoverageForm((prev) => ({
                      ...prev,
                      planName: event.target.value,
                    }))
                  }
                  placeholder="e.g., Thiqa Comprehensive"
                />
              </div>
              <div className="space-y-2">
                <Label>Network</Label>
                <Input
                  value={coverageForm.networkName}
                  onChange={(event) =>
                    setCoverageForm((prev) => ({
                      ...prev,
                      networkName: event.target.value,
                    }))
                  }
                  placeholder="Tier A"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Member name</Label>
                <Input
                  value={coverageForm.memberName}
                  onChange={(event) =>
                    setCoverageForm((prev) => ({
                      ...prev,
                      memberName: event.target.value,
                    }))
                  }
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Member ID</Label>
                <Input
                  value={coverageForm.memberId}
                  onChange={(event) =>
                    setCoverageForm((prev) => ({
                      ...prev,
                      memberId: event.target.value,
                    }))
                  }
                  placeholder="123456789"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Copay (currency)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={coverageForm.copayAmount}
                  onChange={(event) =>
                    setCoverageForm((prev) => ({
                      ...prev,
                      copayAmount: event.target.value,
                    }))
                  }
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Coinsurance (%)</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={coverageForm.coinsurancePct}
                  onChange={(event) =>
                    setCoverageForm((prev) => ({
                      ...prev,
                      coinsurancePct: event.target.value,
                    }))
                  }
                  placeholder="20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Deductible snapshot (JSON)</Label>
              <Textarea
                rows={3}
                className="font-mono"
                placeholder='{"deductible":"1500","met":"400"}'
                value={coverageForm.deductibleSnapshot}
                onChange={(event) =>
                  setCoverageForm((prev) => ({
                    ...prev,
                    deductibleSnapshot: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Benefits snapshot (JSON)</Label>
              <Textarea
                rows={3}
                className="font-mono"
                placeholder='{"opd":"Covered","pharmacy":"80%"}'
                value={coverageForm.benefitsSnapshot}
                onChange={(event) =>
                  setCoverageForm((prev) => ({
                    ...prev,
                    benefitsSnapshot: event.target.value,
                  }))
                }
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleCoverageDialogChange(false)}
                disabled={createCoverageMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createCoverageMutation.isPending}>
                {createCoverageMutation.isPending ? 'Saving…' : 'Save coverage'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
