'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useRef, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogCloseButton,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useCreateAdmission } from '@/modules/clinical/hooks/use-inpatient';
import { useBedSearch } from '@/modules/clinical/hooks/use-bed-search';
import { useActivePatientEncounters } from '@/modules/clinical/hooks/use-encounters';
import { usePatients } from '@/modules/clinical/hooks/use-patients';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { decodeAccessToken } from '@/lib/auth/tokens';
import { getSession } from '@/lib/api/client';
import type { Patient } from '@/modules/clinical/types/patient';
import type { Encounter } from '@/modules/clinical/types/encounter';
import { useStaffSearch } from '@/modules/foundation/hooks/use-staff';
import { useBed } from '@/modules/foundation/hooks/use-bed';
import { useWard } from '@/modules/foundation/hooks/use-ward';
import type { StaffMember } from '@/modules/foundation/types/staff';
import type { BedSearchResult } from '@/modules/clinical/types/bed-search';
import {
  AdmissionSource,
  AdmissionType,
  IsolationType,
  VitalsFrequency,
  type CreateAdmissionInput,
} from '@/modules/clinical/types/inpatient';

const admissionSchema = z
  .object({
  patientId: z.string().uuid('Patient ID must be a UUID'),
  encounterId: z.string().optional(),
  encounterMode: z.enum(['new', 'existing']),
  admissionDate: z.string().min(1, 'Admission date is required'),
  admissionType: z.nativeEnum(AdmissionType),
  admissionSource: z.nativeEnum(AdmissionSource),
  attendingPhysicianId: z.string().uuid('Attending physician ID must be a UUID'),
  primaryNurseId: z.string().optional(),
  initialWardId: z.string().uuid('Ward ID must be a UUID'),
  initialBedId: z.string().uuid('Bed ID must be a UUID'),
  clinicalAlerts: z.string().optional(),
  isolationType: z.union([z.literal('none'), z.nativeEnum(IsolationType)]).optional(),
  fallRiskScore: z.preprocess(
    (value) => (value === '' || value == null ? undefined : Number(value)),
    z.number().int().min(1).max(5).optional()
  ),
  vitalsFrequency: z.union([z.literal('none'), z.nativeEnum(VitalsFrequency)]).optional(),
  insuranceAuthNumber: z.string().optional(),
  estimatedCost: z.preprocess(
    (value) => (value === '' || value == null ? undefined : Number(value)),
    z.number().optional()
  ),
})
  .superRefine((values, ctx) => {
    if (values.encounterMode === 'existing' && !values.encounterId?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['encounterId'],
        message: 'Select an active encounter.',
      });
    }
  });

type AdmissionFormValues = z.infer<typeof admissionSchema>;

const defaultDateTime = () => {
  const now = new Date();
  const iso = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
  return iso.slice(0, 16);
};

export default function NewAdmissionPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const createAdmission = useCreateAdmission();
  const searchParams = useSearchParams();
  const preselectedBedId = searchParams.get('bedId') ?? '';
  const preselectedWardId = searchParams.get('wardId') ?? '';
  const hasAppliedPrefill = useRef(false);
  const authSession = useMemo(() => getSession(), []);
  const claims = useMemo(
    () => authSession.user ?? decodeAccessToken(authSession.accessToken),
    [authSession]
  );
  const facilityId = claims?.facilityId ?? claims?.defaultFacilityId ?? '';
  const [patientSearch, setPatientSearch] = useState('');
  const debouncedSearch = useDebouncedValue(patientSearch, 300);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [physicianSearch, setPhysicianSearch] = useState('');
  const debouncedPhysicianSearch = useDebouncedValue(physicianSearch, 300);
  const [selectedPhysician, setSelectedPhysician] = useState<StaffMember | null>(null);
  const [selectedBed, setSelectedBed] = useState<BedSearchResult | null>(null);
  const [prefilledBed, setPrefilledBed] = useState<{ bedId: string; wardId: string } | null>(null);
  const [bedTypeFilter, setBedTypeFilter] = useState<string>('all');
  const [genderRestrictionFilter, setGenderRestrictionFilter] = useState<string>('any');
  const [hasSearchedBeds, setHasSearchedBeds] = useState(false);
  const [encounterMode, setEncounterMode] = useState<'new' | 'existing'>('new');
  const [selectedEncounter, setSelectedEncounter] = useState<Encounter | null>(null);
  const [isEncounterModalOpen, setEncounterModalOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      admissionDate: defaultDateTime(),
      admissionType: AdmissionType.ELECTIVE,
      admissionSource: AdmissionSource.DIRECT,
      isolationType: 'none',
      vitalsFrequency: 'none',
      encounterMode: 'new',
    },
  });

  const bedSearchFilters = useMemo(
    () => ({
      facilityId,
      bedType: bedTypeFilter !== 'all' ? bedTypeFilter : undefined,
      genderRestriction: genderRestrictionFilter !== 'any' ? genderRestrictionFilter : undefined,
    }),
    [facilityId, bedTypeFilter, genderRestrictionFilter]
  );

  const bedSearchQuery = useBedSearch(bedSearchFilters, { enabled: false });
  const prefilledBedQuery = useBed(prefilledBed?.bedId);
  const prefilledWardQuery = useWard(prefilledBed?.wardId);

  useEffect(() => {
    if (hasAppliedPrefill.current) return;
    if (!preselectedBedId || !preselectedWardId) return;
    setValue('initialBedId', preselectedBedId, { shouldValidate: true });
    setValue('initialWardId', preselectedWardId, { shouldValidate: true });
    setPrefilledBed({ bedId: preselectedBedId, wardId: preselectedWardId });
    setHasSearchedBeds(false);
    hasAppliedPrefill.current = true;
  }, [preselectedBedId, preselectedWardId, setValue]);

  const { data: patientsData, isLoading: isPatientsLoading } = usePatients({
    search: debouncedSearch,
    page: 1,
    limit: 8,
  });
  const { data: physicianData, isLoading: isPhysicianLoading } = useStaffSearch({
    displayName: debouncedPhysicianSearch,
    staffType: 'physician',
    status: 'active',
    limit: 8,
    offset: 0,
  });

  const patientResults = useMemo(() => {
    if (!debouncedSearch.trim()) return [];
    return (patientsData?.data as Patient[] | undefined) ?? [];
  }, [debouncedSearch, patientsData]);
  const physicianResults = useMemo(() => {
    if (!debouncedPhysicianSearch.trim()) return [];
    return (physicianData?.data as StaffMember[] | undefined) ?? [];
  }, [debouncedPhysicianSearch, physicianData]);

  const activeEncountersQuery = useActivePatientEncounters(
    selectedPatient?.id ?? '',
    isEncounterModalOpen && Boolean(selectedPatient)
  );
  const activeEncounters = activeEncountersQuery.data ?? [];

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setValue('patientId', patient.id, { shouldValidate: true });
    setValue('encounterId', '');
    setPatientSearch('');
    setSelectedEncounter(null);
    setEncounterMode('new');
    setValue('encounterMode', 'new');
    setSelectedBed(null);
    setValue('initialWardId', '');
    setValue('initialBedId', '');
  };

  const handleSelectPhysician = (physician: StaffMember) => {
    setSelectedPhysician(physician);
    setValue('attendingPhysicianId', physician.id, { shouldValidate: true });
    setPhysicianSearch('');
  };

  const handleEncounterModeChange = (mode: 'new' | 'existing') => {
    setEncounterMode(mode);
    setValue('encounterMode', mode);
    if (mode === 'new') {
      setSelectedEncounter(null);
      setValue('encounterId', '');
    }
  };

  const handleSelectEncounter = (encounter: Encounter) => {
    setSelectedEncounter(encounter);
    setValue('encounterId', encounter.id, { shouldValidate: true });
    setEncounterModalOpen(false);
  };

  const handleSearchBeds = async () => {
    if (!facilityId) return;
    setHasSearchedBeds(true);
    await bedSearchQuery.refetch();
  };

  const handleSelectBed = (bed: BedSearchResult) => {
    setSelectedBed(bed);
    setValue('initialBedId', bed.bedId, { shouldValidate: true });
    setValue('initialWardId', bed.ward.id, { shouldValidate: true });
    setHasSearchedBeds(false);
    setPrefilledBed(null);
  };

  const handleClearBedSelection = () => {
    setSelectedBed(null);
    setValue('initialBedId', '');
    setValue('initialWardId', '');
    setHasSearchedBeds(true);
    setPrefilledBed(null);
  };

  const onSubmit = async (values: AdmissionFormValues) => {
    const payload: CreateAdmissionInput = {
      patientId: values.patientId.trim(),
      encounterId: values.encounterId?.trim() || undefined,
      admissionDate: new Date(values.admissionDate).toISOString(),
      admissionType: values.admissionType,
      admissionSource: values.admissionSource,
      attendingPhysicianId: values.attendingPhysicianId.trim(),
      primaryNurseId: values.primaryNurseId?.trim() || undefined,
      initialWardId: values.initialWardId.trim(),
      initialBedId: values.initialBedId.trim(),
      clinicalAlerts: values.clinicalAlerts
        ? values.clinicalAlerts.split(',').map((alert) => alert.trim()).filter(Boolean)
        : undefined,
      isolationType: values.isolationType === 'none' ? undefined : (values.isolationType as IsolationType),
      fallRiskScore: values.fallRiskScore,
      vitalsFrequency:
        values.vitalsFrequency === 'none' ? undefined : (values.vitalsFrequency as VitalsFrequency),
      insuranceAuthNumber: values.insuranceAuthNumber?.trim() || undefined,
      estimatedCost: values.estimatedCost,
    };

    try {
      const result: any = await createAdmission.mutateAsync(payload);
      toast({ title: 'Admission created', description: 'Patient admitted successfully.', variant: 'success' });
      if (result?.id) {
        router.push(`/${params.locale}/inpatient/admissions/${result.id}`);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message ?? 'Failed to create admission.';
      toast({ title: 'Admission failed', description: message, variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Admission</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="patientSearch">Search Patient *</Label>
              <Input
                id="patientSearch"
                value={patientSearch}
                onChange={(event) => {
                  setPatientSearch(event.target.value);
                  setSelectedPatient(null);
                  setSelectedEncounter(null);
                  setValue('patientId', '');
                  setValue('encounterId', '');
                  setEncounterMode('new');
                  setValue('encounterMode', 'new');
                  setSelectedBed(null);
                  setValue('initialWardId', '');
                  setValue('initialBedId', '');
                }}
                placeholder="Search by name, MRN, or mobile"
              />
              {isPatientsLoading && (
                <p className="text-xs text-muted-foreground">Searching patients...</p>
              )}
              {!isPatientsLoading && debouncedSearch.trim() !== '' && patientResults.length === 0 && (
                <p className="text-xs text-muted-foreground">No patients found.</p>
              )}
              {patientResults.length > 0 && (
                <div className="max-h-40 overflow-auto rounded-md border p-2">
                  {patientResults.map((patient) => (
                    <button
                      key={patient.id}
                      type="button"
                      onClick={() => handleSelectPatient(patient)}
                      className="flex w-full flex-col items-start gap-1 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                    >
                      <span className="font-medium">
                        {patient.firstName} {patient.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        MRN: {patient.mrn} · Mobile: {patient.phoneNumber}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input type="hidden" {...register('patientId')} />
            <input type="hidden" {...register('encounterId')} />
            <input type="hidden" {...register('encounterMode')} />
            <input type="hidden" {...register('attendingPhysicianId')} />
            <input type="hidden" {...register('initialWardId')} />
            <input type="hidden" {...register('initialBedId')} />
            {errors.patientId && (
              <p className="text-sm text-destructive md:col-span-2">{errors.patientId.message}</p>
            )}
            {errors.encounterId && (
              <p className="text-sm text-destructive md:col-span-2">{errors.encounterId.message}</p>
            )}
            {errors.attendingPhysicianId && (
              <p className="text-sm text-destructive md:col-span-2">{errors.attendingPhysicianId.message}</p>
            )}
            {(errors.initialWardId || errors.initialBedId) && (
              <p className="text-sm text-destructive md:col-span-2">Select an available bed.</p>
            )}
            {selectedPatient && (
              <div className="space-y-1 md:col-span-2 rounded-md border p-3 text-sm">
                <p className="font-medium">
                  Selected: {selectedPatient.firstName} {selectedPatient.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  MRN: {selectedPatient.mrn} · Mobile: {selectedPatient.phoneNumber}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="physicianSearch">Attending Physician *</Label>
              <Input
                id="physicianSearch"
                value={physicianSearch}
                onChange={(event) => {
                  setPhysicianSearch(event.target.value);
                  setSelectedPhysician(null);
                  setValue('attendingPhysicianId', '');
                }}
                placeholder="Search by physician name"
              />
              {isPhysicianLoading && (
                <p className="text-xs text-muted-foreground">Searching physicians...</p>
              )}
              {!isPhysicianLoading && debouncedPhysicianSearch.trim() !== '' && physicianResults.length === 0 && (
                <p className="text-xs text-muted-foreground">No physicians found.</p>
              )}
              {physicianResults.length > 0 && (
                <div className="max-h-40 overflow-auto rounded-md border p-2">
                  {physicianResults.map((physician) => (
                    <button
                      key={physician.id}
                      type="button"
                      onClick={() => handleSelectPhysician(physician)}
                      className="flex w-full flex-col items-start gap-1 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                    >
                      <span className="font-medium">{physician.displayName}</span>
                      <span className="text-xs text-muted-foreground">
                        ID: {physician.employeeId} · {physician.staffType}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedPhysician && (
              <div className="space-y-1 md:col-span-2 rounded-md border p-3 text-sm">
                <p className="font-medium">Selected: {selectedPhysician.displayName}</p>
                <p className="text-xs text-muted-foreground">
                  ID: {selectedPhysician.employeeId} · {selectedPhysician.staffType}
                </p>
              </div>
            )}
            <div className="space-y-4 md:col-span-2 rounded-md border p-4">
              <div>
                <Label className="text-sm font-medium">Encounter Option</Label>
                <div className="mt-2 space-y-2">
                  <label className="flex items-start gap-2 text-sm">
                    <input
                      type="radio"
                      name="encounterModeOption"
                      value="new"
                      checked={encounterMode === 'new'}
                      onChange={() => handleEncounterModeChange('new')}
                      className="mt-1 h-4 w-4"
                    />
                    <span>
                      <span className="font-medium">Create New Encounter</span>
                      <span className="block text-xs text-muted-foreground">
                        Start a new inpatient encounter (default).
                      </span>
                    </span>
                  </label>
                  <label className="flex items-start gap-2 text-sm">
                    <input
                      type="radio"
                      name="encounterModeOption"
                      value="existing"
                      checked={encounterMode === 'existing'}
                      onChange={() => handleEncounterModeChange('existing')}
                      className="mt-1 h-4 w-4"
                    />
                    <span>
                      <span className="font-medium">Link to Existing Encounter</span>
                      <span className="block text-xs text-muted-foreground">
                        Link to an active ER/OPD encounter.
                      </span>
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={!selectedPatient || encounterMode !== 'existing'}
                  onClick={() => setEncounterModalOpen(true)}
                >
                  Select Encounter
                </Button>
                {selectedEncounter && (
                  <div className="text-xs text-muted-foreground">
                    Selected: {selectedEncounter.encounterNumber ?? selectedEncounter.id}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="admissionDate">Admission Date *</Label>
              <Input id="admissionDate" type="datetime-local" {...register('admissionDate')} />
              {errors.admissionDate && <p className="text-sm text-destructive">{errors.admissionDate.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Admission Type *</Label>
              <Controller
                control={control}
                name="admissionType"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select admission type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(AdmissionType).map((value) => (
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
              <Label>Admission Source *</Label>
              <Controller
                control={control}
                name="admissionSource"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(AdmissionSource).map((value) => (
                        <SelectItem key={value} value={value}>
                          {value.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-4 md:col-span-2 rounded-md border p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-end">
                <div className="space-y-2 md:flex-1">
                  <Label>Bed Type</Label>
                  <Select value={bedTypeFilter} onValueChange={setBedTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All bed types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All bed types</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="icu">ICU</SelectItem>
                      <SelectItem value="isolation">Isolation</SelectItem>
                      <SelectItem value="pediatric">Pediatric</SelectItem>
                      <SelectItem value="maternity">Maternity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:flex-1">
                  <Label>Gender Restriction</Label>
                  <Select value={genderRestrictionFilter} onValueChange={setGenderRestrictionFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="male_only">Male only</SelectItem>
                      <SelectItem value="female_only">Female only</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="button" variant="outline" onClick={handleSearchBeds} disabled={!facilityId}>
                  {bedSearchQuery.isFetching ? 'Searching...' : 'Search Beds'}
                </Button>
              </div>
              {!facilityId && (
                <p className="text-xs text-muted-foreground">
                  Facility context missing. Re-login to load facility-specific beds.
                </p>
              )}
              {selectedPatient && (
                <p className="text-xs text-muted-foreground">
                  Patient gender: {selectedPatient.gender}.
                </p>
              )}
            {selectedBed && (
              <div className="flex flex-col gap-2 rounded-md border bg-muted/30 p-3 text-sm md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium">Selected bed: {selectedBed.bedNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    Ward: {selectedBed.ward.name} · Type: {selectedBed.bedType}
                  </p>
                </div>
                <Button type="button" variant="ghost" onClick={handleClearBedSelection}>
                  Change bed
                </Button>
              </div>
            )}
            {!selectedBed && prefilledBed && (
              <div className="flex flex-col gap-2 rounded-md border bg-muted/30 p-3 text-sm md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium">
                    Selected bed:{' '}
                    {(prefilledBedQuery.data as any)?.bedNumber ?? prefilledBed.bedId}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ward: {(prefilledWardQuery.data as any)?.name ?? prefilledBed.wardId}
                  </p>
                </div>
                <Button type="button" variant="ghost" onClick={handleClearBedSelection}>
                  Change bed
                </Button>
              </div>
            )}
              {!selectedBed && (
                <>
                  {bedSearchQuery.isFetching && (
                    <p className="text-xs text-muted-foreground">Searching available beds...</p>
                  )}
                  {!bedSearchQuery.isFetching &&
                    hasSearchedBeds &&
                    (bedSearchQuery.data?.data.length ?? 0) === 0 && (
                      <p className="text-xs text-muted-foreground">No available beds match the filters.</p>
                    )}
                  {(bedSearchQuery.data?.data.length ?? 0) > 0 && (
                    <div className="max-h-56 space-y-2 overflow-auto">
                      {bedSearchQuery.data?.data.map((bed) => (
                        <button
                          key={bed.bedId}
                          type="button"
                          onClick={() => handleSelectBed(bed)}
                          className="w-full rounded-md border p-3 text-left text-sm hover:bg-accent"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">{bed.bedNumber}</span>
                            <span className="text-xs text-muted-foreground">{bed.bedType}</span>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            Ward: {bed.ward.name} · Facility: {bed.facility.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
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
            <Button type="submit" disabled={isSubmitting || createAdmission.isPending}>
              {createAdmission.isPending ? 'Creating...' : 'Create Admission'}
            </Button>
          </div>
        </form>
      </CardContent>

      <Dialog open={isEncounterModalOpen} onOpenChange={setEncounterModalOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogCloseButton />
          <DialogHeader>
            <DialogTitle>Select Active Encounter</DialogTitle>
            <DialogDescription>Choose an active encounter for this patient.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {activeEncountersQuery.isLoading && (
              <p className="text-sm text-muted-foreground">Loading active encounters...</p>
            )}
            {!activeEncountersQuery.isLoading && activeEncounters.length === 0 && (
              <p className="text-sm text-muted-foreground">No active encounters found.</p>
            )}
            {activeEncounters.length > 0 && (
              <div className="space-y-3">
                {activeEncounters.map((encounter) => (
                  <button
                    key={encounter.id}
                    type="button"
                    onClick={() => handleSelectEncounter(encounter)}
                    className="w-full rounded-md border p-3 text-left text-sm hover:bg-accent"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{encounter.encounterNumber ?? 'Encounter'}</span>
                      <span className="text-xs text-muted-foreground">{encounter.status}</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Start: {encounter.startTime ? format(new Date(encounter.startTime), 'MMM d, yyyy h:mm a') : 'N/A'}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
