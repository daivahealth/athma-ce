'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useAdmission, useUpdateAdmission } from '@/modules/clinical/hooks/use-inpatient';
import { IsolationType, VitalsFrequency, type UpdateAdmissionInput } from '@/modules/clinical/types/inpatient';

const updateSchema = z.object({
  attendingPhysicianId: z.string().optional(),
  primaryNurseId: z.string().optional(),
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

export default function AdmissionDetailPage({ params }: { params: { locale: string; id: string } }) {
  const { toast } = useToast();
  const { data, isLoading } = useAdmission(params.id);
  const updateAdmission = useUpdateAdmission(params.id);

  const { register, control, handleSubmit, reset, formState: { isSubmitting } } = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema),
  });

  useEffect(() => {
    if (!data) return;
    reset({
      attendingPhysicianId: (data as any)?.attendingPhysicianId ?? '',
      primaryNurseId: (data as any)?.primaryNurseId ?? '',
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
      primaryNurseId: values.primaryNurseId?.trim() || undefined,
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
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-base font-semibold">{(data as any)?.status ?? 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Patient ID</p>
                <p className="text-sm font-medium">{(data as any)?.patientId ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Bed</p>
                <p className="text-sm font-medium">{(data as any)?.currentBedId ?? 'N/A'}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Admission not found.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Update Admission</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="attendingPhysicianId">Attending Physician ID</Label>
                <Input id="attendingPhysicianId" {...register('attendingPhysicianId')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryNurseId">Primary Nurse ID</Label>
                <Input id="primaryNurseId" {...register('primaryNurseId')} />
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
