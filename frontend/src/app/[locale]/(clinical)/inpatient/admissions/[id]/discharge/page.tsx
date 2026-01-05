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
import {
  useDischargeChecklist,
  useDischargePatient,
  useUpdateDischargeChecklist,
} from '@/modules/clinical/hooks/use-inpatient';
import {
  DischargeDestination,
  DischargeType,
  type DischargePatientInput,
  type UpdateDischargeChecklistInput,
} from '@/modules/clinical/types/inpatient';

const checklistSchema = z.object({
  clinicalSummaryCompleted: z.boolean().optional(),
  dischargeMedicationsOrdered: z.boolean().optional(),
  followUpAppointmentBooked: z.boolean().optional(),
  patientEducationProvided: z.boolean().optional(),
  billingCleared: z.boolean().optional(),
  transportArranged: z.boolean().optional(),
  medicalRecordsFinalized: z.boolean().optional(),
  readyForDischarge: z.boolean().optional(),
  notes: z.string().optional(),
});

type ChecklistFormValues = z.infer<typeof checklistSchema>;

const dischargeSchema = z.object({
  actualDischargeDate: z.string().min(1, 'Discharge date is required'),
  dischargeType: z.nativeEnum(DischargeType),
  dischargeDestination: z.nativeEnum(DischargeDestination),
  dischargeNotes: z.string().optional(),
});

type DischargeFormValues = z.infer<typeof dischargeSchema>;

const defaultDateTime = () => {
  const now = new Date();
  const iso = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
  return iso.slice(0, 16);
};

export default function DischargePage({ params }: { params: { locale: string; id: string } }) {
  const { toast } = useToast();
  const { data, isLoading } = useDischargeChecklist(params.id);
  const updateChecklist = useUpdateDischargeChecklist(params.id);
  const dischargePatient = useDischargePatient(params.id);

  const checklistForm = useForm<ChecklistFormValues>({
    resolver: zodResolver(checklistSchema),
    defaultValues: {
      clinicalSummaryCompleted: false,
      dischargeMedicationsOrdered: false,
      followUpAppointmentBooked: false,
      patientEducationProvided: false,
      billingCleared: false,
      transportArranged: false,
      medicalRecordsFinalized: false,
      readyForDischarge: false,
      notes: '',
    },
  });

  const dischargeForm = useForm<DischargeFormValues>({
    resolver: zodResolver(dischargeSchema),
    defaultValues: {
      actualDischargeDate: defaultDateTime(),
      dischargeType: DischargeType.ROUTINE,
      dischargeDestination: DischargeDestination.HOME,
    },
  });

  useEffect(() => {
    if (!data) return;
    checklistForm.reset({
      clinicalSummaryCompleted: (data as any)?.clinicalSummaryCompleted ?? false,
      dischargeMedicationsOrdered: (data as any)?.dischargeMedicationsOrdered ?? false,
      followUpAppointmentBooked: (data as any)?.followUpAppointmentBooked ?? false,
      patientEducationProvided: (data as any)?.patientEducationProvided ?? false,
      billingCleared: (data as any)?.billingCleared ?? false,
      transportArranged: (data as any)?.transportArranged ?? false,
      medicalRecordsFinalized: (data as any)?.medicalRecordsFinalized ?? false,
      readyForDischarge: (data as any)?.readyForDischarge ?? false,
      notes: (data as any)?.notes ?? '',
    });
  }, [data, checklistForm]);

  const onChecklistSubmit = async (values: ChecklistFormValues) => {
    const payload: UpdateDischargeChecklistInput = {
      clinicalSummaryCompleted: values.clinicalSummaryCompleted,
      dischargeMedicationsOrdered: values.dischargeMedicationsOrdered,
      followUpAppointmentBooked: values.followUpAppointmentBooked,
      patientEducationProvided: values.patientEducationProvided,
      billingCleared: values.billingCleared,
      transportArranged: values.transportArranged,
      medicalRecordsFinalized: values.medicalRecordsFinalized,
      readyForDischarge: values.readyForDischarge,
      notes: values.notes?.trim() || undefined,
    };

    try {
      await updateChecklist.mutateAsync(payload);
      toast({ title: 'Checklist updated', description: 'Discharge checklist saved.', variant: 'success' });
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Failed to update checklist.';
      toast({ title: 'Checklist failed', description: message, variant: 'destructive' });
    }
  };

  const onDischargeSubmit = async (values: DischargeFormValues) => {
    const payload: DischargePatientInput = {
      actualDischargeDate: new Date(values.actualDischargeDate).toISOString(),
      dischargeType: values.dischargeType,
      dischargeDestination: values.dischargeDestination,
      dischargeNotes: values.dischargeNotes?.trim() || undefined,
    };

    try {
      await dischargePatient.mutateAsync(payload);
      toast({ title: 'Patient discharged', description: 'Discharge completed.', variant: 'success' });
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Failed to discharge patient.';
      toast({ title: 'Discharge failed', description: message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Discharge Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={checklistForm.handleSubmit(onChecklistSubmit)}>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { name: 'clinicalSummaryCompleted', label: 'Clinical summary completed' },
                { name: 'dischargeMedicationsOrdered', label: 'Discharge medications ordered' },
                { name: 'followUpAppointmentBooked', label: 'Follow-up appointment booked' },
                { name: 'patientEducationProvided', label: 'Patient education provided' },
                { name: 'billingCleared', label: 'Billing cleared' },
                { name: 'transportArranged', label: 'Transport arranged' },
                { name: 'medicalRecordsFinalized', label: 'Medical records finalized' },
                { name: 'readyForDischarge', label: 'Ready for discharge' },
              ].map((item) => (
                <label key={item.name} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    {...checklistForm.register(item.name as keyof ChecklistFormValues)}
                    className="h-4 w-4 rounded border-border"
                  />
                  {item.label}
                </label>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" rows={3} {...checklistForm.register('notes')} />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={checklistForm.formState.isSubmitting || updateChecklist.isPending}>
                {updateChecklist.isPending ? 'Saving...' : 'Save Checklist'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Complete Discharge</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={dischargeForm.handleSubmit(onDischargeSubmit)}>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="actualDischargeDate">Actual Discharge Date *</Label>
                <Input id="actualDischargeDate" type="datetime-local" {...dischargeForm.register('actualDischargeDate')} />
              </div>
              <div className="space-y-2">
                <Label>Discharge Type *</Label>
                <Controller
                  control={dischargeForm.control}
                  name="dischargeType"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(DischargeType).map((value) => (
                          <SelectItem key={value} value={value}>
                            {value.replace(/_/g, ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>Discharge Destination *</Label>
                <Controller
                  control={dischargeForm.control}
                  name="dischargeDestination"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
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
                  )}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="dischargeNotes">Discharge Notes</Label>
                <Textarea id="dischargeNotes" rows={3} {...dischargeForm.register('dischargeNotes')} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={dischargeForm.formState.isSubmitting || dischargePatient.isPending}>
                {dischargePatient.isPending ? 'Discharging...' : 'Complete Discharge'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isLoading && <p className="text-sm text-muted-foreground">Loading checklist...</p>}
    </div>
  );
}
