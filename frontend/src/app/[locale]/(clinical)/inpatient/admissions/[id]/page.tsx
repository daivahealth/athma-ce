'use client';

import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useAdmission, useUpdateAdmission } from '@/modules/clinical/hooks/use-inpatient';
import { usePatient } from '@/modules/clinical/hooks/use-patients';
import { useBed } from '@/modules/foundation/hooks/use-bed';
import { useWard } from '@/modules/foundation/hooks/use-ward';
import { useStaffMember } from '@/modules/foundation/hooks/use-staff';
import { IsolationType, VitalsFrequency, type UpdateAdmissionInput } from '@/modules/clinical/types/inpatient';
import { ClipboardList, CheckCircle2, Clock, FileCheck } from 'lucide-react';

const updateSchema = z.object({
  attendingPhysicianId: z.string().optional(),
  clinicalAlerts: z.string().optional(),
  isolationType: z.union([z.literal('none'), z.nativeEnum(IsolationType)]).optional(),
  fallRiskScore: z.preprocess(
    (value) => (value === '' || value == null ? undefined : Number(value)),
    z.number().int().min(1).max(5).optional()
  ),
  vitalsFrequency: z.union([z.literal('none'), z.nativeEnum(VitalsFrequency)]).optional(),
  expectedDischargeDate: z.string().optional(),
  dischargeNotes: z.string().optional(),
  insuranceAuthNumber: z.string().optional(),
  estimatedCost: z.preprocess(
    (value) => (value === '' || value == null ? undefined : Number(value)),
    z.number().optional()
  ),
});

type UpdateFormValues = z.infer<typeof updateSchema>;

const asDateTimeLocal = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
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

export default function AdmissionDetailPage({ params }: { params: { locale: string; id: string } }) {
  const { toast } = useToast();
  const { data, isLoading } = useAdmission(params.id);
  const updateAdmission = useUpdateAdmission(params.id);
  const patientId = (data as any)?.patientId as string | undefined;
  const attendingPhysicianId = (data as any)?.attendingPhysicianId as string | undefined;
  const currentWardId = (data as any)?.currentWardId as string | undefined;
  const currentBedId = (data as any)?.currentBedId as string | undefined;

  const patientQuery = usePatient(patientId ?? '');
  const physicianQuery = useStaffMember(attendingPhysicianId);
  const wardQuery = useWard(currentWardId);
  const bedQuery = useBed(currentBedId);

  const patientSummary = useMemo(() => {
    const patient = patientQuery.data as any;
    if (!patient) return patientId ?? 'N/A';
    const name = patient.fullName ?? `${patient.firstName ?? ''} ${patient.lastName ?? ''}`.trim();
    const age = getAge(patient.dateOfBirth);
    const ageLabel = age !== null ? `${age} yrs` : 'Age N/A';
    const genderLabel = patient.gender ? patient.gender : 'Gender N/A';
    return `${name || 'Unknown'} · MRN ${patient.mrn ?? 'N/A'} · ${ageLabel} · ${genderLabel}`;
  }, [patientQuery.data, patientId]);

  const physicianSummary = useMemo(() => {
    const staff = physicianQuery.data as any;
    if (!staff) return attendingPhysicianId ?? 'N/A';
    const name = staff.displayName ?? `${staff.firstName ?? ''} ${staff.lastName ?? ''}`.trim();
    const id = staff.employeeId ? `ID ${staff.employeeId}` : 'ID N/A';
    const type = staff.staffType ? staff.staffType : 'Type N/A';
    return `${name || 'Unknown'} · ${id} · ${type}`;
  }, [physicianQuery.data, attendingPhysicianId]);

  const bedSummary = useMemo(() => {
    const bed = bedQuery.data as any;
    const ward = wardQuery.data as any;
    if (!bed && !ward) return currentBedId ?? 'N/A';
    const wardName = ward?.name ?? 'Unknown Ward';
    const bedNumber = bed?.bedNumber ?? 'Unknown Bed';
    return `${wardName} · ${bedNumber}`;
  }, [bedQuery.data, wardQuery.data, currentBedId]);

  const { register, control, handleSubmit, reset, formState: { isSubmitting } } = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema),
  });

  useEffect(() => {
    if (!data) return;
    reset({
      attendingPhysicianId: (data as any)?.attendingPhysicianId ?? '',
      clinicalAlerts: Array.isArray((data as any)?.clinicalAlerts)
        ? (data as any).clinicalAlerts.join(', ')
        : '',
      isolationType: (data as any)?.isolationType ?? 'none',
      fallRiskScore: (data as any)?.fallRiskScore ?? undefined,
      vitalsFrequency: (data as any)?.vitalsFrequency ?? 'none',
      expectedDischargeDate: asDateTimeLocal((data as any)?.expectedDischargeDate),
      dischargeNotes: (data as any)?.dischargeNotes ?? '',
      insuranceAuthNumber: (data as any)?.insuranceAuthNumber ?? '',
      estimatedCost: (data as any)?.estimatedCost ?? undefined,
    });
  }, [data, reset]);

  const onSubmit = async (values: UpdateFormValues) => {
    const payload: UpdateAdmissionInput = {
      attendingPhysicianId: values.attendingPhysicianId?.trim() || undefined,
      clinicalAlerts: values.clinicalAlerts
        ? values.clinicalAlerts.split(',').map((alert) => alert.trim()).filter(Boolean)
        : undefined,
      isolationType: values.isolationType === 'none' ? undefined : (values.isolationType as IsolationType),
      fallRiskScore: values.fallRiskScore,
      vitalsFrequency:
        values.vitalsFrequency === 'none' ? undefined : (values.vitalsFrequency as VitalsFrequency),
      expectedDischargeDate: values.expectedDischargeDate
        ? new Date(values.expectedDischargeDate).toISOString()
        : undefined,
      dischargeNotes: values.dischargeNotes?.trim() || undefined,
      insuranceAuthNumber: values.insuranceAuthNumber?.trim() || undefined,
      estimatedCost: values.estimatedCost,
    };

    try {
      await updateAdmission.mutateAsync(payload);
      toast({ title: 'Admission updated', description: 'Changes saved successfully.', variant: 'success' });
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Failed to update admission.';
      toast({ title: 'Update failed', description: message, variant: 'destructive' });
    }
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading admission...</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admission Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Admission Number</p>
                <p className="text-base font-semibold">{(data as any)?.admissionNumber ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Admission Status</p>
                <p className="text-base font-semibold">{(data as any)?.admissionStatus ?? 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Discharge Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {(data as any)?.dischargeStatus === 'READY' && (
                    <Badge className="bg-green-500">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Ready for Discharge
                    </Badge>
                  )}
                  {(data as any)?.dischargeStatus === 'INITIATED' && (
                    <Badge variant="secondary">
                      <Clock className="mr-1 h-3 w-3" />
                      Planning Initiated
                    </Badge>
                  )}
                  {(data as any)?.dischargeStatus === 'CONFIRMED' && (
                    <Badge variant="outline">
                      <FileCheck className="mr-1 h-3 w-3" />
                      Discharged
                    </Badge>
                  )}
                  {(data as any)?.dischargeStatus === 'NONE' && (
                    <span className="text-sm">None</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Patient</p>
                <p className="text-sm font-medium">{patientSummary}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Attending Physician</p>
                <p className="text-sm font-medium">{physicianSummary}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Bed</p>
                <p className="text-sm font-medium">{bedSummary}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Admission not found.</p>
          )}
        </CardContent>
      </Card>

      {/* Discharge Planning Section */}
      {data && (data as any)?.admissionStatus !== 'DISCHARGED' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Discharge Planning</CardTitle>
                <CardDescription>Manage discharge checklist and complete patient discharge</CardDescription>
              </div>
              {(data as any)?.dischargeStatus === 'READY' && (
                <Badge className="bg-green-500">
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  Ready for Discharge
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {(data as any)?.dischargeStatus === 'NONE' && (
              <div className="text-center py-6">
                <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground mb-4">
                  Discharge planning not yet initiated. Start the discharge checklist to begin.
                </p>
                <Button asChild>
                  <Link href={`/${params.locale}/inpatient/admissions/${params.id}/discharge`}>
                    <ClipboardList className="mr-2 h-4 w-4" />
                    Start Discharge Planning
                  </Link>
                </Button>
              </div>
            )}

            {(data as any)?.dischargeStatus === 'INITIATED' && (
              <div className="text-center py-6">
                <Clock className="mx-auto h-12 w-12 text-amber-500 mb-3" />
                <p className="text-sm font-medium mb-2">Discharge Planning In Progress</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete the discharge checklist to mark patient ready for discharge.
                </p>
                <Button asChild>
                  <Link href={`/${params.locale}/inpatient/admissions/${params.id}/discharge`}>
                    <ClipboardList className="mr-2 h-4 w-4" />
                    Continue Discharge Checklist
                  </Link>
                </Button>
              </div>
            )}

            {(data as any)?.dischargeStatus === 'READY' && (
              <div className="text-center py-6">
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-3" />
                <p className="text-sm font-medium mb-2">Patient Ready for Discharge</p>
                <p className="text-sm text-muted-foreground mb-4">
                  All discharge requirements completed. Proceed to finalize discharge.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button asChild variant="outline">
                    <Link href={`/${params.locale}/inpatient/admissions/${params.id}/discharge`}>
                      <ClipboardList className="mr-2 h-4 w-4" />
                      Review Checklist
                    </Link>
                  </Button>
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <Link href={`/${params.locale}/inpatient/admissions/${params.id}/discharge`}>
                      <FileCheck className="mr-2 h-4 w-4" />
                      Complete Discharge
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Show discharge summary if already discharged */}
      {data && (data as any)?.admissionStatus === 'DISCHARGED' && (
        <Card>
          <CardHeader>
            <CardTitle>Discharge Summary</CardTitle>
            <CardDescription>Patient has been discharged</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Discharge Date</p>
                <p className="text-base font-medium">
                  {(data as any)?.actualDischargeDate
                    ? new Date((data as any).actualDischargeDate).toLocaleString()
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Discharge Type</p>
                <p className="text-base font-medium capitalize">
                  {(data as any)?.dischargeType?.replace(/_/g, ' ') ?? 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Discharge Destination</p>
                <p className="text-base font-medium capitalize">
                  {(data as any)?.dischargeDestination?.replace(/_/g, ' ') ?? 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Length of Stay</p>
                <p className="text-base font-medium">
                  {(data as any)?.lengthOfStayDays ?? 'N/A'} days
                </p>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/${params.locale}/inpatient/admissions/${params.id}/discharge`}>
                <FileCheck className="mr-2 h-4 w-4" />
                View Full Discharge Details
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Update Admission</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Attending Physician</Label>
                <div className="rounded-md border bg-muted/30 p-3 text-sm">
                  {physicianSummary}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Isolation Type</Label>
                <Controller
                  control={control}
                  name="isolationType"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {Object.values(IsolationType).map((value) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>Vitals Frequency</Label>
                <Controller
                  control={control}
                  name="vitalsFrequency"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {Object.values(VitalsFrequency).map((value) => (
                          <SelectItem key={value} value={value}>
                            {value.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fallRiskScore">Fall Risk Score</Label>
                <Input id="fallRiskScore" type="number" {...register('fallRiskScore')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedDischargeDate">Expected Discharge Date</Label>
                <Input id="expectedDischargeDate" type="datetime-local" {...register('expectedDischargeDate')} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="dischargeNotes">Discharge Notes</Label>
                <Textarea id="dischargeNotes" rows={3} {...register('dischargeNotes')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insuranceAuthNumber">Insurance Auth Number</Label>
                <Input id="insuranceAuthNumber" {...register('insuranceAuthNumber')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedCost">Estimated Cost</Label>
                <Input id="estimatedCost" type="number" {...register('estimatedCost')} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="clinicalAlerts">Clinical Alerts (comma separated)</Label>
                <Textarea id="clinicalAlerts" rows={3} {...register('clinicalAlerts')} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || updateAdmission.isPending}>
                {updateAdmission.isPending ? 'Saving...' : 'Update Admission'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {data && (
        <Card>
          <CardHeader>
            <CardTitle>Raw Payload</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="max-h-[32rem] overflow-auto rounded-md bg-muted/40 p-4 text-xs">
              {JSON.stringify(data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
