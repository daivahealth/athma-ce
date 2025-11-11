'use client';

import { useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { format } from 'date-fns';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import type { AxiosError } from 'axios';
import { useEncounter } from '@/modules/clinical/hooks/use-encounters';
import { useStaff } from '@/modules/foundation/hooks/use-staff';
import { useCreateTriage, useTriageByEncounter, useUpdateTriage } from '@/modules/clinical/hooks/use-triage';
import type {
  TriageAllergy,
  TriageMedication,
  TriageVitalSigns,
} from '@/modules/clinical/types/triage';
import { ArrowLeft, Stethoscope, Thermometer } from 'lucide-react';

type TriageFormValues = {
  triageLevel: number;
  triageStaffId: string;
  chiefComplaintsAndHPI: string;
  painScore?: number | null;
  vitalSigns: TriageVitalSigns;
  allergies: TriageAllergy[];
  currentMedications: TriageMedication[];
  triageNotes?: string;
};

const DEFAULT_VITALS: TriageVitalSigns = {
  temperatureUnit: 'celsius',
  weightUnit: 'kg',
  heightUnit: 'cm',
};

export default function TriagePage() {
  const params = useParams();
  const locale = params.locale as string;
  const encounterId = params.id as string;
  const router = useRouter();
  const { toast } = useToast();

  const { data: encounter, isLoading: encounterLoading } = useEncounter(encounterId);
  const { data: triage, isLoading: triageLoading } = useTriageByEncounter(encounterId);
  const createTriage = useCreateTriage();
  const updateTriage = useUpdateTriage(encounterId);
  const { data: staffData } = useStaff({ status: 'active' });

  const staffOptions = useMemo(() => staffData?.data ?? [], [staffData]);

  const form = useForm<TriageFormValues>({
    defaultValues: {
      triageLevel: 3,
      triageStaffId: '',
      chiefComplaintsAndHPI: '',
      painScore: undefined,
      vitalSigns: DEFAULT_VITALS,
      allergies: [{ allergen: '', reaction: '', severity: '' }],
      currentMedications: [{ name: '', dosage: '', frequency: '' }],
      triageNotes: '',
    },
  });

  const allergiesArray = useFieldArray({ control: form.control, name: 'allergies' });
  const medicationsArray = useFieldArray({ control: form.control, name: 'currentMedications' });

  useEffect(() => {
    if (!triage) return;
    form.reset({
      triageLevel: triage.triageLevel,
      triageStaffId: triage.triageStaffId,
      chiefComplaintsAndHPI: triage.chiefComplaintsAndHPI,
      painScore: triage.painScore ?? undefined,
      vitalSigns: {
        ...DEFAULT_VITALS,
        ...(triage.vitalSigns ?? {}),
      },
      allergies:
        triage.allergies && triage.allergies.length > 0
          ? triage.allergies
          : [{ allergen: '', reaction: '', severity: '' }],
      currentMedications:
        triage.currentMedications && triage.currentMedications.length > 0
          ? triage.currentMedications
          : [{ name: '', dosage: '', frequency: '' }],
      triageNotes: triage.triageNotes ?? '',
    });
  }, [triage, form]);

  useEffect(() => {
    if (encounter && !triage && !form.getValues('triageStaffId')) {
      form.setValue('triageStaffId', encounter.primaryStaffId ?? '');
    }
  }, [encounter, triage, form]);

  const sanitizeVitalSigns = (vitalSigns: TriageVitalSigns) => {
    const entries = Object.entries(vitalSigns ?? {}).filter(([, value]) =>
      value !== undefined && value !== null && value !== ''
    );
    return entries.length > 0 ? Object.fromEntries(entries) : undefined;
  };

  const sanitizeAllergies = (items: TriageAllergy[]) => {
    const cleaned = items
      .map((item) => ({
        allergen: item.allergen?.trim() ?? '',
        reaction: item.reaction?.trim() || undefined,
        severity: item.severity?.trim() || undefined,
      }))
      .filter((item) => item.allergen.length > 0);
    return cleaned.length ? cleaned : undefined;
  };

  const sanitizeMedications = (items: TriageMedication[]) => {
    const cleaned = items
      .map((item) => ({
        name: item.name?.trim() ?? '',
        dosage: item.dosage?.trim() || undefined,
        frequency: item.frequency?.trim() || undefined,
      }))
      .filter((item) => item.name.length > 0);
    return cleaned.length ? cleaned : undefined;
  };

  const onSubmit = async (values: TriageFormValues) => {
    if (!encounter) {
      toast({ variant: 'destructive', title: 'Encounter unavailable', description: 'Cannot submit triage without encounter details.' });
      return;
    }

    const payloadBase = {
      triageLevel: values.triageLevel,
      triageStaffId: values.triageStaffId,
      chiefComplaintsAndHPI: values.chiefComplaintsAndHPI.trim(),
      triageNotes: values.triageNotes?.trim() || undefined,
      vitalSigns: sanitizeVitalSigns(values.vitalSigns),
      painScore: values.painScore ?? undefined,
      allergies: sanitizeAllergies(values.allergies),
      currentMedications: sanitizeMedications(values.currentMedications),
    };

    try {
      if (triage) {
        await updateTriage.mutateAsync({ id: triage.id, data: payloadBase });
        toast({ title: 'Triage updated', description: 'Triage record was updated successfully.' });
      } else {
        await createTriage.mutateAsync({
          encounterId,
          patientId: encounter.patientId,
          ...payloadBase,
        });
        toast({ title: 'Triage created', description: 'Triage record saved successfully.' });
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast({
        variant: 'destructive',
        title: 'Unable to save triage',
        description: axiosError?.response?.data?.message || 'Please try again later.',
      });
    }
  };

  const isSubmitting = form.formState.isSubmitting || createTriage.isPending || updateTriage.isPending;
  const loading = encounterLoading || triageLoading;

  const encounterPatientName = encounter?.patient?.displayName ||
    `${encounter?.patient?.firstName ?? ''} ${encounter?.patient?.lastName ?? ''}`.trim();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/${locale}/encounters/${encounterId}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to encounter
        </Button>
        <h1 className="text-2xl font-semibold">Triage Assessment</h1>
      </div>

      {encounter && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              {encounterPatientName || 'Unknown patient'}
            </CardTitle>
            <CardDescription>
              Encounter #{encounter.id} · {encounter.encounterClass}{' '}
              · {encounter.status?.toUpperCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="font-medium">Start time: </span>
                {encounter.startTime ? format(new Date(encounter.startTime), 'PPP p') : 'Unknown'}
              </div>
              {triage && (
                <div>
                  <span className="font-medium">Last triaged: </span>
                  {format(new Date(triage.updatedAt), 'PPP p')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Triage details</CardTitle>
          <CardDescription>
            Capture the presenting complaint, priority level, and vital signs prior to clinician assessment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <section className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="triageLevel"
                  rules={{ required: true, min: 1, max: 5 }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Triage level</FormLabel>
                      <Select
                        value={String(field.value)}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Level 1 · Critical</SelectItem>
                          <SelectItem value="2">Level 2 · Emergency</SelectItem>
                          <SelectItem value="3">Level 3 · Urgent</SelectItem>
                          <SelectItem value="4">Level 4 · Semi-urgent</SelectItem>
                          <SelectItem value="5">Level 5 · Non-urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="triageStaffId"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Triage clinician</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select staff" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {staffOptions.map((staff) => (
                            <SelectItem key={staff.id} value={staff.id}>
                              {staff.displayName || `${staff.firstName} ${staff.lastName}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="painScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pain score (0-10)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={10}
                          value={field.value ?? ''}
                          onChange={(event) =>
                            field.onChange(
                              event.target.value === '' ? undefined : Number(event.target.value)
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              <FormField
                control={form.control}
                name="chiefComplaintsAndHPI"
                rules={{ required: true }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chief complaint & HPI</FormLabel>
                    <FormControl>
                      <Textarea rows={4} placeholder="Describe the presenting symptoms..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-semibold">Vital signs</p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { name: 'temperature', label: 'Temperature', placeholder: '37.0' },
                    { name: 'heartRate', label: 'Heart rate', placeholder: '80' },
                    { name: 'respiratoryRate', label: 'Respiratory rate', placeholder: '16' },
                    { name: 'systolicBP', label: 'Systolic BP', placeholder: '120' },
                    { name: 'diastolicBP', label: 'Diastolic BP', placeholder: '80' },
                    { name: 'oxygenSaturation', label: 'SpO₂ %', placeholder: '98' },
                    { name: 'weight', label: 'Weight', placeholder: '70' },
                    { name: 'height', label: 'Height', placeholder: '170' },
                    { name: 'bmi', label: 'BMI', placeholder: '22.5' },
                  ].map((fieldConfig) => (
                    <FormField
                      key={fieldConfig.name}
                      control={form.control}
                      name={`vitalSigns.${fieldConfig.name}` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{fieldConfig.label}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder={fieldConfig.placeholder}
                              value={field.value ?? ''}
                              onChange={(event) =>
                                field.onChange(
                                  event.target.value === '' ? undefined : Number(event.target.value)
                                )
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Allergies</p>
                  <Button type="button" variant="outline" size="sm" onClick={() => allergiesArray.append({ allergen: '', reaction: '', severity: '' })}>
                    Add allergy
                  </Button>
                </div>
                <div className="space-y-4">
                  {allergiesArray.fields.map((fieldItem, index) => (
                    <Card key={fieldItem.id} className="p-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <FormField
                          control={form.control}
                          name={`allergies.${index}.allergen`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Allergen</FormLabel>
                              <FormControl>
                                <Input placeholder="Penicillin" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`allergies.${index}.reaction`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reaction</FormLabel>
                              <FormControl>
                                <Input placeholder="Rash" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`allergies.${index}.severity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Severity</FormLabel>
                              <FormControl>
                                <Input placeholder="Moderate" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      {allergiesArray.fields.length > 1 && (
                        <div className="mt-4 flex justify-end">
                          <Button type="button" variant="ghost" size="sm" onClick={() => allergiesArray.remove(index)}>
                            Remove
                          </Button>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Current medications</p>
                  <Button type="button" variant="outline" size="sm" onClick={() => medicationsArray.append({ name: '', dosage: '', frequency: '' })}>
                    Add medication
                  </Button>
                </div>
                <div className="space-y-4">
                  {medicationsArray.fields.map((fieldItem, index) => (
                    <Card key={fieldItem.id} className="p-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <FormField
                          control={form.control}
                          name={`currentMedications.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Aspirin" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`currentMedications.${index}.dosage`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dosage</FormLabel>
                              <FormControl>
                                <Input placeholder="75mg" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`currentMedications.${index}.frequency`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Frequency</FormLabel>
                              <FormControl>
                                <Input placeholder="Once daily" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      {medicationsArray.fields.length > 1 && (
                        <div className="mt-4 flex justify-end">
                          <Button type="button" variant="ghost" size="sm" onClick={() => medicationsArray.remove(index)}>
                            Remove
                          </Button>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </section>

              <FormField
                control={form.control}
                name="triageNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional notes</FormLabel>
                    <FormControl>
                      <Textarea rows={4} placeholder="Observations, quick interventions, etc." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Separator />

              <div className="flex items-center justify-between">
                {triage ? (
                  <Badge variant="secondary">Existing triage record</Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">No triage has been captured yet.</span>
                )}
                <Button type="submit" disabled={isSubmitting || loading}>
                  {isSubmitting ? 'Saving...' : triage ? 'Update triage' : 'Save triage'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
