'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import {
  useDischargeChecklist,
  useDischargePatient,
  useUpdateDischargeChecklist,
} from '@/modules/clinical/hooks/use-inpatient';
import { useStaffList } from '@/modules/foundation/hooks/use-staff';
import {
  DischargeDestination,
  DischargeType,
  type DischargePatientInput,
  type UpdateDischargeChecklistInput,
  type DischargeChecklist,
} from '@/modules/clinical/types/inpatient';
import {
  ClipboardCheck,
  Pill,
  Calendar,
  GraduationCap,
  Wrench,
  Car,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const checklistSchema = z.object({
  // Medical Clearance
  medicalClearance: z.boolean().optional(),
  medicalClearedBy: z.string().optional(),
  medicalClearedAt: z.string().optional(),

  // Medications
  medicationsReconciled: z.boolean().optional(),
  dischargePrescriptionsIssued: z.boolean().optional(),

  // Follow-up Care
  followUpAppointmentScheduled: z.boolean().optional(),
  followUpAppointmentDate: z.string().optional(),
  followUpPhysician: z.string().optional(),

  // Patient Education
  dischargInstructionsProvided: z.boolean().optional(),
  patientEducationCompleted: z.boolean().optional(),
  educationTopics: z.array(z.string()).optional(),

  // Equipment & Supplies
  dmeOrdered: z.boolean().optional(),
  dmeDescription: z.string().optional(),
  homeHealthOrdered: z.boolean().optional(),
  homeHealthAgency: z.string().optional(),

  // Transportation
  transportationArranged: z.boolean().optional(),
  transportationMode: z.string().optional(),

  // Administrative
  billingCleared: z.boolean().optional(),
  insuranceNotified: z.boolean().optional(),
  medicalRecordsCompleted: z.boolean().optional(),

  // Overall Status
  readyForDischarge: z.boolean().optional(),
  dischargeCoordinator: z.string().optional(),

  // Notes
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
  const router = useRouter();
  const { toast } = useToast();
  const [showDischargeDialog, setShowDischargeDialog] = useState(false);

  const { data, isLoading } = useDischargeChecklist(params.id);
  const { data: staffList = [] } = useStaffList();
  const updateChecklist = useUpdateDischargeChecklist(params.id);
  const dischargePatient = useDischargePatient(params.id);

  const checklist = data as DischargeChecklist | undefined;

  const checklistForm = useForm<ChecklistFormValues>({
    resolver: zodResolver(checklistSchema),
    defaultValues: {
      medicalClearance: false,
      medicationsReconciled: false,
      dischargePrescriptionsIssued: false,
      followUpAppointmentScheduled: false,
      dischargInstructionsProvided: false,
      patientEducationCompleted: false,
      dmeOrdered: false,
      homeHealthOrdered: false,
      transportationArranged: false,
      billingCleared: false,
      insuranceNotified: false,
      medicalRecordsCompleted: false,
      readyForDischarge: false,
      educationTopics: [],
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

  // Watch specific fields for conditional rendering
  const watchMedicalClearance = checklistForm.watch('medicalClearance');
  const watchFollowUpScheduled = checklistForm.watch('followUpAppointmentScheduled');
  const watchDmeOrdered = checklistForm.watch('dmeOrdered');
  const watchHomeHealthOrdered = checklistForm.watch('homeHealthOrdered');
  const watchTransportArranged = checklistForm.watch('transportationArranged');

  useEffect(() => {
    if (!checklist) return;
    checklistForm.reset({
      medicalClearance: checklist.medicalClearance ?? false,
      medicalClearedBy: checklist.medicalClearedBy ?? '',
      medicalClearedAt: checklist.medicalClearedAt ?? '',
      medicationsReconciled: checklist.medicationsReconciled ?? false,
      dischargePrescriptionsIssued: checklist.dischargePrescriptionsIssued ?? false,
      followUpAppointmentScheduled: checklist.followUpAppointmentScheduled ?? false,
      followUpAppointmentDate: checklist.followUpAppointmentDate ?? '',
      followUpPhysician: checklist.followUpPhysician ?? '',
      dischargInstructionsProvided: checklist.dischargInstructionsProvided ?? false,
      patientEducationCompleted: checklist.patientEducationCompleted ?? false,
      educationTopics: checklist.educationTopics ?? [],
      dmeOrdered: checklist.dmeOrdered ?? false,
      dmeDescription: checklist.dmeDescription ?? '',
      homeHealthOrdered: checklist.homeHealthOrdered ?? false,
      homeHealthAgency: checklist.homeHealthAgency ?? '',
      transportationArranged: checklist.transportationArranged ?? false,
      transportationMode: checklist.transportationMode ?? '',
      billingCleared: checklist.billingCleared ?? false,
      insuranceNotified: checklist.insuranceNotified ?? false,
      medicalRecordsCompleted: checklist.medicalRecordsCompleted ?? false,
      readyForDischarge: checklist.readyForDischarge ?? false,
      dischargeCoordinator: checklist.dischargeCoordinator ?? '',
      notes: checklist.notes ?? '',
    });
  }, [checklist, checklistForm]);

  // Calculate progress
  const calculateProgress = () => {
    if (!checklist) return 0;
    const totalFields = 12; // Core checklist items
    const completedFields = [
      checklist.medicalClearance,
      checklist.medicationsReconciled,
      checklist.dischargePrescriptionsIssued,
      checklist.followUpAppointmentScheduled,
      checklist.dischargInstructionsProvided,
      checklist.patientEducationCompleted,
      checklist.dmeOrdered || true, // Optional
      checklist.homeHealthOrdered || true, // Optional
      checklist.transportationArranged,
      checklist.billingCleared,
      checklist.insuranceNotified,
      checklist.medicalRecordsCompleted,
    ].filter(Boolean).length;
    return Math.round((completedFields / totalFields) * 100);
  };

  const onChecklistSubmit = async (values: ChecklistFormValues) => {
    const payload: UpdateDischargeChecklistInput = {
      medicalClearance: values.medicalClearance,
      medicalClearedBy: values.medicalClearedBy || undefined,
      medicalClearedAt: values.medicalClearedAt || undefined,
      medicationsReconciled: values.medicationsReconciled,
      dischargePrescriptionsIssued: values.dischargePrescriptionsIssued,
      followUpAppointmentScheduled: values.followUpAppointmentScheduled,
      followUpAppointmentDate: values.followUpAppointmentDate || undefined,
      followUpPhysician: values.followUpPhysician || undefined,
      dischargInstructionsProvided: values.dischargInstructionsProvided,
      patientEducationCompleted: values.patientEducationCompleted,
      educationTopics: values.educationTopics,
      dmeOrdered: values.dmeOrdered,
      dmeDescription: values.dmeDescription || undefined,
      homeHealthOrdered: values.homeHealthOrdered,
      homeHealthAgency: values.homeHealthAgency || undefined,
      transportationArranged: values.transportationArranged,
      transportationMode: values.transportationMode || undefined,
      billingCleared: values.billingCleared,
      insuranceNotified: values.insuranceNotified,
      medicalRecordsCompleted: values.medicalRecordsCompleted,
      readyForDischarge: values.readyForDischarge,
      dischargeCoordinator: values.dischargeCoordinator || undefined,
      notes: values.notes?.trim() || undefined,
    };

    try {
      await updateChecklist.mutateAsync(payload);
      toast({
        title: 'Checklist updated',
        description: 'Discharge checklist saved successfully.',
        variant: 'default',
      });
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
      toast({
        title: 'Patient discharged',
        description: 'Discharge completed successfully.',
        variant: 'default',
      });
      setShowDischargeDialog(false);
      router.push(`/${params.locale}/inpatient/admissions/${params.id}`);
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Failed to discharge patient.';
      toast({ title: 'Discharge failed', description: message, variant: 'destructive' });
    }
  };

  const progress = calculateProgress();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Discharge Planning</h1>
            <p className="text-sm text-muted-foreground">Admission ID: {params.id}</p>
          </div>
        </div>
        {checklist?.readyForDischarge && (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle2 className="mr-1 h-4 w-4" />
            Ready for Discharge
          </Badge>
        )}
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Checklist Progress</CardTitle>
              <CardDescription>Complete all required items before discharge</CardDescription>
            </div>
            <span className="text-2xl font-bold">{progress}%</span>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-3" />
        </CardContent>
      </Card>

      {/* Discharge Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Discharge Checklist</CardTitle>
          <CardDescription>Mark items as completed when done</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={checklistForm.handleSubmit(onChecklistSubmit)}>
            <Accordion type="multiple" className="w-full">
              {/* Medical Clearance */}
              <AccordionItem value="medical">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5" />
                    <span>Medical Clearance</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <Controller
                      control={checklistForm.control}
                      name="medicalClearance"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="medicalClearance"
                        />
                      )}
                    />
                    <Label htmlFor="medicalClearance" className="text-sm font-medium">
                      Medical clearance obtained
                    </Label>
                  </div>

                  {watchMedicalClearance && (
                    <div className="ml-6 space-y-4">
                      <div className="space-y-2">
                        <Label>Cleared By (Staff)</Label>
                        <Controller
                          control={checklistForm.control}
                          name="medicalClearedBy"
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select staff member" />
                              </SelectTrigger>
                              <SelectContent>
                                {staffList.map((staff) => (
                                  <SelectItem key={staff.id} value={staff.id}>
                                    {staff.displayName || `${staff.firstName} ${staff.lastName}`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Clearance Date/Time</Label>
                        <Input
                          type="datetime-local"
                          {...checklistForm.register('medicalClearedAt')}
                        />
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* Medications */}
              <AccordionItem value="medications">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Pill className="h-5 w-5" />
                    <span>Medications</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <Controller
                      control={checklistForm.control}
                      name="medicationsReconciled"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="medicationsReconciled"
                        />
                      )}
                    />
                    <Label htmlFor="medicationsReconciled" className="text-sm font-medium">
                      Medications reconciled
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Controller
                      control={checklistForm.control}
                      name="dischargePrescriptionsIssued"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="dischargePrescriptionsIssued"
                        />
                      )}
                    />
                    <Label htmlFor="dischargePrescriptionsIssued" className="text-sm font-medium">
                      Discharge prescriptions issued
                    </Label>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Follow-up Care */}
              <AccordionItem value="followup">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span>Follow-up Care</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <Controller
                      control={checklistForm.control}
                      name="followUpAppointmentScheduled"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="followUpAppointmentScheduled"
                        />
                      )}
                    />
                    <Label htmlFor="followUpAppointmentScheduled" className="text-sm font-medium">
                      Follow-up appointment scheduled
                    </Label>
                  </div>

                  {watchFollowUpScheduled && (
                    <div className="ml-6 space-y-4">
                      <div className="space-y-2">
                        <Label>Appointment Date/Time</Label>
                        <Input
                          type="datetime-local"
                          {...checklistForm.register('followUpAppointmentDate')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Follow-up Physician</Label>
                        <Controller
                          control={checklistForm.control}
                          name="followUpPhysician"
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select physician" />
                              </SelectTrigger>
                              <SelectContent>
                                {staffList
                                  .filter((s) => s.staffType === 'doctor')
                                  .map((staff) => (
                                    <SelectItem key={staff.id} value={staff.id}>
                                      {staff.displayName || `${staff.firstName} ${staff.lastName}`}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* Patient Education */}
              <AccordionItem value="education">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    <span>Patient Education</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <Controller
                      control={checklistForm.control}
                      name="dischargInstructionsProvided"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="dischargInstructionsProvided"
                        />
                      )}
                    />
                    <Label htmlFor="dischargInstructionsProvided" className="text-sm font-medium">
                      Discharge instructions provided
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Controller
                      control={checklistForm.control}
                      name="patientEducationCompleted"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="patientEducationCompleted"
                        />
                      )}
                    />
                    <Label htmlFor="patientEducationCompleted" className="text-sm font-medium">
                      Patient education completed
                    </Label>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Equipment & Supplies */}
              <AccordionItem value="equipment">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    <span>Equipment & Supplies</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <Controller
                      control={checklistForm.control}
                      name="dmeOrdered"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="dmeOrdered"
                        />
                      )}
                    />
                    <Label htmlFor="dmeOrdered" className="text-sm font-medium">
                      Durable medical equipment (DME) ordered
                    </Label>
                  </div>

                  {watchDmeOrdered && (
                    <div className="ml-6 space-y-2">
                      <Label>DME Description</Label>
                      <Textarea
                        placeholder="Describe equipment ordered..."
                        {...checklistForm.register('dmeDescription')}
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Controller
                      control={checklistForm.control}
                      name="homeHealthOrdered"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="homeHealthOrdered"
                        />
                      )}
                    />
                    <Label htmlFor="homeHealthOrdered" className="text-sm font-medium">
                      Home health services ordered
                    </Label>
                  </div>

                  {watchHomeHealthOrdered && (
                    <div className="ml-6 space-y-2">
                      <Label>Home Health Agency</Label>
                      <Input
                        placeholder="Agency name..."
                        {...checklistForm.register('homeHealthAgency')}
                      />
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* Transportation */}
              <AccordionItem value="transportation">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    <span>Transportation</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <Controller
                      control={checklistForm.control}
                      name="transportationArranged"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="transportationArranged"
                        />
                      )}
                    />
                    <Label htmlFor="transportationArranged" className="text-sm font-medium">
                      Transportation arranged
                    </Label>
                  </div>

                  {watchTransportArranged && (
                    <div className="ml-6 space-y-2">
                      <Label>Transportation Mode</Label>
                      <Select
                        onValueChange={(value) => checklistForm.setValue('transportationMode', value)}
                        value={checklistForm.watch('transportationMode') || ''}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="family">Family/Friend</SelectItem>
                          <SelectItem value="ambulance">Ambulance</SelectItem>
                          <SelectItem value="taxi">Taxi</SelectItem>
                          <SelectItem value="hospital_transport">Hospital Transport</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* Administrative */}
              <AccordionItem value="administrative">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <span>Administrative</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <Controller
                      control={checklistForm.control}
                      name="billingCleared"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="billingCleared"
                        />
                      )}
                    />
                    <Label htmlFor="billingCleared" className="text-sm font-medium">
                      Billing cleared
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Controller
                      control={checklistForm.control}
                      name="insuranceNotified"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="insuranceNotified"
                        />
                      )}
                    />
                    <Label htmlFor="insuranceNotified" className="text-sm font-medium">
                      Insurance notified
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Controller
                      control={checklistForm.control}
                      name="medicalRecordsCompleted"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="medicalRecordsCompleted"
                        />
                      )}
                    />
                    <Label htmlFor="medicalRecordsCompleted" className="text-sm font-medium">
                      Medical records completed
                    </Label>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Discharge Coordinator */}
            <div className="space-y-2">
              <Label>Discharge Coordinator</Label>
              <Controller
                control={checklistForm.control}
                name="dischargeCoordinator"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Assign discharge coordinator" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffList.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.displayName || `${staff.firstName} ${staff.lastName}`} -{' '}
                          {staff.staffType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Ready for Discharge */}
            <div className="border-t pt-4">
              <div className="flex items-center space-x-2">
                <Controller
                  control={checklistForm.control}
                  name="readyForDischarge"
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="readyForDischarge"
                      className="h-5 w-5"
                    />
                  )}
                />
                <Label htmlFor="readyForDischarge" className="text-base font-semibold">
                  Mark patient as ready for discharge
                </Label>
              </div>
              {checklistForm.watch('readyForDischarge') && progress < 80 && (
                <div className="mt-2 flex items-center gap-2 text-sm text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>Warning: Checklist is less than 80% complete</span>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" rows={3} {...checklistForm.register('notes')} />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={checklistForm.formState.isSubmitting || updateChecklist.isPending}
              >
                {updateChecklist.isPending ? 'Saving...' : 'Save Checklist'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Complete Discharge Section */}
      {checklist?.readyForDischarge && (
        <Card>
          <CardHeader>
            <CardTitle>Complete Discharge</CardTitle>
            <CardDescription>Finalize patient discharge</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowDischargeDialog(true)}
              size="lg"
              className="w-full"
            >
              Proceed to Discharge Patient
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Discharge Confirmation Dialog */}
      <AlertDialog open={showDischargeDialog} onOpenChange={setShowDischargeDialog}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Patient Discharge</AlertDialogTitle>
            <AlertDialogDescription>
              Complete the discharge details below. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <form onSubmit={dischargeForm.handleSubmit(onDischargeSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="actualDischargeDate">Actual Discharge Date/Time *</Label>
                <Input
                  id="actualDischargeDate"
                  type="datetime-local"
                  {...dischargeForm.register('actualDischargeDate')}
                />
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
                <Textarea
                  id="dischargeNotes"
                  rows={3}
                  {...dischargeForm.register('dischargeNotes')}
                />
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                disabled={dischargeForm.formState.isSubmitting || dischargePatient.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {dischargePatient.isPending ? 'Discharging...' : 'Confirm Discharge'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      {isLoading && <p className="text-sm text-muted-foreground">Loading checklist...</p>}
    </div>
  );
}
