'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ClinicalNotesForm } from '@/modules/clinical/components/charting/clinical-notes-form';
import { DiagnosisForm } from '@/modules/clinical/components/charting/diagnosis-form';
import { useEncounter } from '@/modules/clinical/hooks/use-encounters';
import {
  useDiagnosesByEncounter,
  useCreateDiagnosis,
  useDeleteDiagnosis,
  useClinicalOrdersByEncounter,
  useCreateClinicalOrder,
  useUpdateClinicalOrder,
  useDeleteClinicalOrder,
  usePrescriptionsByEncounter,
  useCreatePrescription,
  useUpdatePrescription,
  useDeletePrescription,
} from '@/modules/clinical/hooks/use-charting';
import { useTriageByEncounter } from '@/modules/clinical/hooks/use-triage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Maximize2, Minimize2, Pencil, Search, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DiagnosisAutocomplete } from '@/components/autocomplete/catalog-autocomplete.diagnosis';
import { OrderAutocomplete, type OrderSelection } from '@/components/autocomplete/catalog-autocomplete.order';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { DiagnosisType, OrderType, OrderPriority, DrugCodeSystem } from '@/modules/clinical/types/charting';
import { useMedications } from '@/modules/foundation/hooks/use-catalogs';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { Diagnosis as CatalogDiagnosis, Medication } from '@/modules/foundation/types/catalog';
import type { ClinicalOrder, Prescription } from '@/modules/clinical/types/charting';
import type { TriageAllergy, TriageVitalSigns } from '@/modules/clinical/types/triage';

function formatAge(date?: string | null) {
  if (!date) return '—';
  const dob = new Date(date);
  if (Number.isNaN(dob.getTime())) return '—';
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return `${age} yrs`;
}

const formatNumeric = (value: number) => (Number.isInteger(value) ? `${value}` : value.toFixed(1));
const isValidNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

function summarizeVitals(vitals?: TriageVitalSigns | null) {
  if (!vitals) return [] as string[];
  const parts: string[] = [];
  if (isValidNumber(vitals.temperature)) {
    const unit = vitals.temperatureUnit === 'fahrenheit' ? '°F' : '°C';
    parts.push(`Temp ${formatNumeric(vitals.temperature)}${unit}`);
  }
  if (isValidNumber(vitals.heartRate)) {
    parts.push(`HR ${formatNumeric(vitals.heartRate)} bpm`);
  }
  if (isValidNumber(vitals.systolicBP) || isValidNumber(vitals.diastolicBP)) {
    const systolic = isValidNumber(vitals.systolicBP) ? formatNumeric(vitals.systolicBP) : '—';
    const diastolic = isValidNumber(vitals.diastolicBP) ? formatNumeric(vitals.diastolicBP) : '—';
    parts.push(`BP ${systolic}/${diastolic}`);
  }
  if (isValidNumber(vitals.respiratoryRate)) {
    parts.push(`RR ${formatNumeric(vitals.respiratoryRate)} rpm`);
  }
  if (isValidNumber(vitals.oxygenSaturation)) {
    parts.push(`SpO2 ${formatNumeric(vitals.oxygenSaturation)}%`);
  }
  if (isValidNumber(vitals.weight)) {
    const unit = vitals.weightUnit === 'lbs' ? 'lb' : 'kg';
    parts.push(`Wt ${formatNumeric(vitals.weight)} ${unit}`);
  }
  if (isValidNumber(vitals.height)) {
    const unit = vitals.heightUnit === 'in' ? 'in' : 'cm';
    parts.push(`Ht ${formatNumeric(vitals.height)} ${unit}`);
  }
  if (isValidNumber(vitals.bmi)) {
    parts.push(`BMI ${formatNumeric(vitals.bmi)}`);
  }
  if (isValidNumber(vitals.bloodGlucose)) {
    const unit = vitals.bloodGlucoseUnit === 'mmol/L' ? 'mmol/L' : 'mg/dL';
    parts.push(`BG ${formatNumeric(vitals.bloodGlucose)} ${unit}`);
  }
  return parts;
}

function summarizeAllergies(allergies?: TriageAllergy[] | null) {
  if (!allergies || allergies.length === 0) return [] as string[];
  return allergies
    .filter((allergy) => allergy.allergen?.trim())
    .map((allergy) => {
      const severity = allergy.severity?.trim();
      const reaction = allergy.reaction?.trim();
      if (severity && reaction) {
        return `${allergy.allergen} (${severity}, ${reaction})`;
      }
      if (severity) {
        return `${allergy.allergen} (${severity})`;
      }
      if (reaction) {
        return `${allergy.allergen} (${reaction})`;
      }
      return allergy.allergen;
    });
}

type MedicationSelection = {
  id: string;
  label: string;
  code: string;
  codeSystem: DrugCodeSystem;
  dosage: string;
  route: string;
  frequency: string;
};

type PrescriptionFormState = {
  dosage: string;
  frequency: string;
  duration: string;
};

type OrderFormState = {
  clinicalIndication: string;
  specialInstructions: string;
};

export default function ChartingPage() {
  const params = useParams();
  const encounterId = params.id as string;
  const { data: encounter, isLoading } = useEncounter(encounterId);
  const {
    data: encounterDiagnoses = [],
    isLoading: isDiagnosesLoading,
  } = useDiagnosesByEncounter(encounterId);
  const { data: encounterOrders = [] } = useClinicalOrdersByEncounter(encounterId);
  const {
    data: encounterPrescriptions = [],
    isLoading: isPrescriptionsLoading,
  } = usePrescriptionsByEncounter(encounterId);
  const { data: triage } = useTriageByEncounter(encounterId);
  const { mutateAsync: createDiagnosis } = useCreateDiagnosis();
  const { mutateAsync: deleteDiagnosis } = useDeleteDiagnosis();
  const { mutateAsync: createOrder } = useCreateClinicalOrder();
  const { mutateAsync: updateClinicalOrder, isPending: isUpdatingOrder } = useUpdateClinicalOrder();
  const { mutateAsync: deleteOrder } = useDeleteClinicalOrder();
  const { mutateAsync: createPrescription, isPending: isCreatingPrescription } = useCreatePrescription();
  const { mutateAsync: updatePrescription, isPending: isUpdatingPrescription } = useUpdatePrescription();
  const { mutateAsync: deletePrescription } = useDeletePrescription();
  const [expandedPanel, setExpandedPanel] = useState<'notes' | 'diagnoses' | 'orders' | 'prescriptions' | null>(null);
  const [selectedType, setSelectedType] = useState<DiagnosisType>(DiagnosisType.PRIMARY);
  const [removingDiagnosisId, setRemovingDiagnosisId] = useState<string | null>(null);
  const [orderCatalogType, setOrderCatalogType] = useState<'lab' | 'imaging' | 'procedure'>('lab');
  const [removingOrderId, setRemovingOrderId] = useState<string | null>(null);
  const [medicationSearch, setMedicationSearch] = useState('');
  const debouncedMedicationSearch = useDebouncedValue(medicationSearch.trim(), 200);
  const [isMedicationPopoverOpen, setIsMedicationPopoverOpen] = useState(false);
  const [isPrescriptionDialogOpen, setIsPrescriptionDialogOpen] = useState(false);
  const [selectedMedications, setSelectedMedications] = useState<Record<string, MedicationSelection>>({});
  const [editingOrder, setEditingOrder] = useState<ClinicalOrder | null>(null);
  const [orderForm, setOrderForm] = useState<OrderFormState>({ clinicalIndication: '', specialInstructions: '' });
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);
  const [prescriptionForm, setPrescriptionForm] = useState<PrescriptionFormState>({
    dosage: '',
    frequency: '',
    duration: '',
  });
  const [removingPrescriptionId, setRemovingPrescriptionId] = useState<string | null>(null);
  const toast = useToast();

  const triageVitalsSummary = useMemo(() => summarizeVitals(triage?.vitalSigns), [triage?.vitalSigns]);
  const triageAllergiesSummary = useMemo(
    () => summarizeAllergies(triage?.allergies),
    [triage?.allergies]
  );

  const existingDiagnosisCodes = useMemo(
    () => new Set(encounterDiagnoses.map((diagnosis) => diagnosis.icdCode)),
    [encounterDiagnoses]
  );

  const existingOrderCodes = useMemo(
    () => new Set(encounterOrders.map((order) => order.orderCode)),
    [encounterOrders]
  );

  const handleRemoveDiagnosis = async (diagnosisId: string) => {
    setRemovingDiagnosisId(diagnosisId);
    try {
      await deleteDiagnosis({ id: diagnosisId, encounterId });
      toast({ title: 'Diagnosis removed', description: 'The diagnosis was removed from this encounter.' });
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Unable to remove diagnosis',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    } finally {
      setRemovingDiagnosisId(null);
    }
  };

  const { data: medications } = useMedications({ search: debouncedMedicationSearch || undefined });

  useEffect(() => {
    setIsMedicationPopoverOpen(Boolean(medicationSearch.trim()));
  }, [medicationSearch]);

  const existingPrescriptionCodes = useMemo(
    () => new Set(encounterPrescriptions.map((prescription) => prescription.drugCode)),
    [encounterPrescriptions]
  );

  const handleAddDiagnosis = async (catalogDiagnosis: CatalogDiagnosis) => {
    if (!encounter) {
      return;
    }
    if (existingDiagnosisCodes.has(catalogDiagnosis.code)) {
      toast({
        variant: 'destructive',
        title: 'Diagnosis already added',
        description: `${catalogDiagnosis.code} is already recorded for this encounter.`,
      });
      return;
    }

    try {
      await createDiagnosis({
        encounterId,
        patientId: encounter.patientId,
        icdCode: catalogDiagnosis.code,
        diagnosisName: catalogDiagnosis.shortDescription || catalogDiagnosis.description,
        diagnosisType: selectedType,
        diagnosisRank: encounterDiagnoses.length + 1,
        diagnosedBy: encounter.primaryStaffId,
      });
      toast({
        title: 'Diagnosis added',
        description: `${catalogDiagnosis.code} attached to encounter.`,
      });
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Unable to add diagnosis',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    }
  };

  const handleAddOrder = async (selection: OrderSelection) => {
    if (!encounter) {
      return;
    }
    if (existingOrderCodes.has(selection.code)) {
      toast({
        variant: 'destructive',
        title: 'Order already added',
        description: `${selection.code} is already attached to this encounter.`,
      });
      return;
    }

    try {
      await createOrder({
        encounterId,
        patientId: encounter.patientId,
        orderType:
          selection.type === 'lab'
            ? OrderType.LAB
            : selection.type === 'imaging'
            ? OrderType.IMAGING
            : OrderType.PROCEDURE,
        orderCode: selection.code,
        codeSystem: selection.codeSystem,
        orderName: selection.label,
        priority: OrderPriority.ROUTINE,
        orderedBy: encounter.primaryStaffId,
      });
      toast({ title: 'Order added', description: `${selection.label} created.` });
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Unable to add order',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    }
  };

  const handleAddMedication = async (selection: MedicationSelection) => {
    if (!encounter) {
      return;
    }
    if (existingPrescriptionCodes.has(selection.code)) {
      toast({
        variant: 'destructive',
        title: 'Prescription already exists',
        description: `${selection.code} is already prescribed for this encounter.`,
      });
      return;
    }

    try {
      await createPrescription({
        encounterId,
        patientId: encounter.patientId,
        drugCode: selection.code,
        codeSystem: selection.codeSystem,
        drugName: selection.label,
        dosage: selection.dosage,
        route: selection.route,
        frequency: selection.frequency,
        prescribedBy: encounter.primaryStaffId,
      });
      toast({ title: 'Prescription added', description: `${selection.label} created.` });
      setMedicationSearch('');
      setIsMedicationPopoverOpen(false);
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Unable to add prescription',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    }
  };

  const handleRemoveOrder = async (orderId: string) => {
    setRemovingOrderId(orderId);
    try {
      await deleteOrder({ id: orderId, encounterId });
      toast({ title: 'Order removed', description: 'Order removed from encounter.' });
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Unable to remove order',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    } finally {
      setRemovingOrderId(null);
    }
  };

  const openEditOrder = (order: ClinicalOrder) => {
    setEditingOrder(order);
    setOrderForm({
      clinicalIndication: order.clinicalIndication ?? '',
      specialInstructions: order.specialInstructions ?? '',
    });
  };

  const closeEditOrder = () => {
    setEditingOrder(null);
    setOrderForm({ clinicalIndication: '', specialInstructions: '' });
  };

  const handleOrderFieldChange = (field: keyof OrderFormState) =>
    (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const { value } = event.target;
      setOrderForm((prev) => ({ ...prev, [field]: value }));
    };

  const handleUpdateOrder = async () => {
    if (!editingOrder) return;
    const payload = {
      clinicalIndication: orderForm.clinicalIndication.trim() || undefined,
      specialInstructions: orderForm.specialInstructions.trim() || undefined,
    };

    if (!payload.clinicalIndication && !payload.specialInstructions) {
      toast({
        variant: 'destructive',
        title: 'No updates provided',
        description: 'Add clinical indications or special instructions before saving.',
      });
      return;
    }

    try {
      await updateClinicalOrder({
        id: editingOrder.id,
        encounterId,
        data: payload,
      });
      toast({ title: 'Order updated', description: `${editingOrder.orderName} updated.` });
      closeEditOrder();
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Unable to update order',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    }
  };

  const mapMedicationToSelection = (medication: Medication): MedicationSelection => ({
    id: medication.id,
    label: medication.medicationName,
    code: medication.ndcCode || medication.localCode || medication.id,
    codeSystem:
      medication.ndcCode != null && medication.ndcCode !== ''
        ? DrugCodeSystem.NDC
        : medication.localCode
        ? DrugCodeSystem.LOCAL
        : DrugCodeSystem.RXNORM,
    dosage: medication.strength || 'As directed',
    route: medication.route || 'oral',
    frequency: medication.defaultFrequency || 'once daily',
  });

  const openEditPrescription = (prescription: Prescription) => {
    setEditingPrescription(prescription);
    setPrescriptionForm({
      dosage: prescription.dosage ?? '',
      frequency: prescription.frequency ?? '',
      duration: prescription.duration ?? '',
    });
  };

  const closeEditPrescription = () => {
    setEditingPrescription(null);
    setPrescriptionForm({ dosage: '', frequency: '', duration: '' });
  };

  const handlePrescriptionFieldChange = (field: keyof PrescriptionFormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setPrescriptionForm((prev) => ({ ...prev, [field]: value }));
    };

  const handleUpdatePrescription = async () => {
    if (!editingPrescription) return;
    const payload = {
      dosage: prescriptionForm.dosage.trim() || undefined,
      frequency: prescriptionForm.frequency.trim() || undefined,
      duration: prescriptionForm.duration.trim() || undefined,
    };

    if (!payload.dosage && !payload.frequency && !payload.duration) {
      toast({
        variant: 'destructive',
        title: 'No updates provided',
        description: 'Update at least one field to save changes.',
      });
      return;
    }

    try {
      await updatePrescription({
        id: editingPrescription.id,
        encounterId,
        data: payload,
      });
      toast({ title: 'Prescription updated', description: `${editingPrescription.drugName} edited.` });
      closeEditPrescription();
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Unable to update prescription',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    }
  };

  const handleRemovePrescription = async (prescription: Prescription) => {
    setRemovingPrescriptionId(prescription.id);
    try {
      await deletePrescription({ id: prescription.id, encounterId });
      toast({ title: 'Prescription removed', description: `${prescription.drugName} removed.` });
    } catch (err) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Unable to remove prescription',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    } finally {
      setRemovingPrescriptionId(null);
    }
  };

  const addMedicationSelection = (selection: MedicationSelection) => {
    setSelectedMedications((prev) => {
      const next = { ...prev };
      if (next[selection.id]) {
        delete next[selection.id];
      } else {
        next[selection.id] = selection;
      }
      return next;
    });
  };

  const closePrescriptionDialog = () => {
    setIsPrescriptionDialogOpen(false);
    setMedicationSearch('');
    setSelectedMedications({});
    setIsMedicationPopoverOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center text-muted-foreground">
        Loading charting workspace...
      </div>
    );
  }

  if (!encounter) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center text-center space-y-2">
        <p className="text-lg font-semibold">Encounter not found</p>
        <p className="text-sm text-muted-foreground">Please return to encounters and select another record.</p>
      </div>
    );
  }

  // Prefer patientDisplay (pre-computed DTO) over patient relation
  const patientDisplay = encounter.patientDisplay;
  const patient = encounter.patient;
  const patientName =
    patientDisplay?.displayName?.trim() ||
    patient?.fullName?.trim() ||
    `${patient?.firstName ?? ''} ${patient?.lastName ?? ''}`.trim() ||
    'Unknown patient';
  const patientAge = patientDisplay?.age != null ? `${patientDisplay.age} yrs` : formatAge(patient?.dateOfBirth);
  const patientGender = patientDisplay?.gender
    ? patientDisplay.gender[0].toUpperCase() + patientDisplay.gender.slice(1)
    : patient?.gender
    ? patient.gender[0].toUpperCase() + patient.gender.slice(1)
    : '—';
  const patientMrn = patientDisplay?.mrn ?? patient?.mrn ?? '—';

  const OrdersPanel = () => (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex-1">
          <OrderAutocomplete
            type={orderCatalogType}
            disabledCodes={existingOrderCodes}
            onSelect={handleAddOrder}
          />
        </div>
        <Select value={orderCatalogType} onValueChange={(value) => setOrderCatalogType(value as 'lab' | 'imaging' | 'procedure')}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Catalog type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lab">Lab Tests</SelectItem>
            <SelectItem value="imaging">Imaging Studies</SelectItem>
            <SelectItem value="procedure">Procedures</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {encounterOrders.length === 0 ? (
        <p className="text-sm text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="space-y-2">
          {encounterOrders.map((order) => (
            <Card key={order.id} className="p-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="capitalize">
                  {order.orderType}
                </Badge>
                <span className="font-semibold">{order.orderName}</span>
                <span className="font-mono text-xs text-muted-foreground">{order.orderCode}</span>
                <div className="ml-auto flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditOrder(order)}
                    aria-label="Edit order"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => handleRemoveOrder(order.id)}
                    disabled={removingOrderId === order.id}
                    aria-label="Remove order"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Priority: {order.priority}</p>
              {(order.clinicalIndication || order.specialInstructions) && (
                <p className="text-xs text-muted-foreground">
                  {order.clinicalIndication && <span>Clinical indications: {order.clinicalIndication}</span>}
                  {order.clinicalIndication && order.specialInstructions ? ' · ' : ''}
                  {order.specialInstructions && <span>Special instructions: {order.specialInstructions}</span>}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const PrescriptionsPanel = () => (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <Popover open={isMedicationPopoverOpen} onOpenChange={setIsMedicationPopoverOpen}>
          <PopoverTrigger asChild>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search medications..."
                value={medicationSearch}
                onChange={(event) => setMedicationSearch(event.target.value)}
                className="pl-9"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[min(480px,90vw)] p-0">
            <div className="max-h-72 overflow-y-auto divide-y">
              {!medications || medications.length === 0 ? (
                <p className="p-3 text-sm text-muted-foreground">No medications found.</p>
              ) : (
                medications.map((medication) => {
                  const selection = mapMedicationToSelection(medication);
                  const disabled = existingPrescriptionCodes.has(selection.code);
                  return (
                    <button
                      type="button"
                      key={selection.id}
                      className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm ${
                        disabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-muted'
                      }`}
                      onClick={() => !disabled && handleAddMedication(selection)}
                      disabled={disabled}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{selection.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {selection.codeSystem} · {selection.code}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selection.dosage} · {selection.route} · {selection.frequency}
                        </p>
                        {disabled && (
                          <p className="text-xs text-amber-600">Already prescribed</p>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {isPrescriptionsLoading ? (
        <p className="text-sm text-muted-foreground">Loading prescriptions...</p>
      ) : encounterPrescriptions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No prescriptions yet.</p>
      ) : (
        <div className="space-y-2">
          {encounterPrescriptions.map((prescription) => (
            <Card key={prescription.id} className="p-3 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="capitalize">
                  {prescription.status}
                </Badge>
                <span className="font-semibold">{prescription.drugName}</span>
                <span className="font-mono text-xs text-muted-foreground">{prescription.drugCode}</span>
                <div className="ml-auto flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditPrescription(prescription)}
                    aria-label="Edit prescription"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => handleRemovePrescription(prescription)}
                    disabled={removingPrescriptionId === prescription.id}
                    aria-label="Remove prescription"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {prescription.dosage} · {prescription.route} · {prescription.frequency}
                {prescription.duration ? ` · Duration: ${prescription.duration}` : ''}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const DiagnosesPanel = () => (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex-1">
          <DiagnosisAutocomplete
            disabledCodes={existingDiagnosisCodes}
            onSelect={handleAddDiagnosis}
          />
        </div>
        <Select value={selectedType} onValueChange={(value) => setSelectedType(value as DiagnosisType)}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Diagnosis type" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(DiagnosisType).map((type) => (
              <SelectItem key={type} value={type} className="capitalize">
                {type.replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DiagnosisForm
        diagnoses={encounterDiagnoses}
        isLoading={isDiagnosesLoading}
        onRemove={handleRemoveDiagnosis}
        removingId={removingDiagnosisId}
      />
    </div>
  );

  const panelContent = {
    notes: {
      title: 'Clinical Notes',
      content: (
        <ClinicalNotesForm
          encounterId={encounterId}
          patientId={encounter.patientId}
          authorStaffId={encounter.primaryStaffId}
        />
      ),
    },
    diagnoses: {
      title: 'Diagnoses',
      content: <DiagnosesPanel />,
    },
    orders: {
      title: 'Orders',
      content: <OrdersPanel />,
    },
    prescriptions: {
      title: 'Prescriptions',
      content: <PrescriptionsPanel />,
    },
  } as const;

  const renderPanel = (key: keyof typeof panelContent) => {
    const panel = panelContent[key];
    const isExpanded = expandedPanel === key;
    return (
      <Card key={key} className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{panel.title}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpandedPanel(isExpanded ? null : key)}
            aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
        {panel.content}
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="border border-transparent bg-gradient-to-r from-primary/15 via-primary/5 to-secondary/20 dark:from-primary/30 dark:via-primary/15 dark:to-secondary/35 shadow-md">
        <CardHeader>
          <CardTitle>Clinical Charting</CardTitle>
          <CardDescription>Encounter #{encounter.encounterNumber}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 text-sm lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-wrap gap-6">
              <div>
                <div className="text-muted-foreground">Patient</div>
                <div className="font-medium">{patientName}</div>
              </div>
              <Separator orientation="vertical" className="hidden md:block h-10" />
              <div>
                <div className="text-muted-foreground">Age</div>
                <div className="font-medium">{patientAge}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Gender</div>
                <div className="font-medium">{patientGender}</div>
              </div>
              <div>
                <div className="text-muted-foreground">MRN</div>
                <div className="font-mono">{patientMrn}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Status</div>
                <Badge variant="outline" className="capitalize mt-1">
                  {encounter.status}
                </Badge>
              </div>
            </div>
            {triage && (
              <div className="flex flex-col gap-3 text-sm lg:flex-row lg:items-start lg:text-right lg:max-w-xl lg:justify-end">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Triage vitals
                  </div>
                  <div className="font-medium">
                    {triageVitalsSummary.length
                      ? triageVitalsSummary.join(' · ')
                      : 'No vitals recorded'}
                  </div>
                </div>
                <Separator orientation="vertical" className="hidden lg:block h-10" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Allergies
                  </div>
                  <div>
                    {triageAllergiesSummary.length
                      ? triageAllergiesSummary.join(', ')
                      : 'No allergies documented'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {expandedPanel ? (
        <div>{renderPanel(expandedPanel)}</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">{renderPanel('notes')}</div>
          <div className="space-y-6">
            {renderPanel('diagnoses')}
            {renderPanel('orders')}
            {renderPanel('prescriptions')}
          </div>
        </div>
      )}

      <Dialog open={Boolean(editingOrder)} onOpenChange={(open) => !open && closeEditOrder()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit clinical order</DialogTitle>
            <DialogDescription>
              Provide context for why this order is needed and any handling notes for the care team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="order-clinical-info">Clinical indications</Label>
              <p className="text-xs text-muted-foreground">
                Summarize symptoms, differential diagnosis, or the clinical reasoning for requesting this order.
              </p>
              <Textarea
                id="order-clinical-info"
                value={orderForm.clinicalIndication}
                onChange={handleOrderFieldChange('clinicalIndication')}
                placeholder="e.g., Persistent chest pain with elevated troponin"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="order-instructions">Special instructions</Label>
              <p className="text-xs text-muted-foreground">
                Call out patient prep, specimen handling, or coordination notes the lab/radiology team should follow.
              </p>
              <Textarea
                id="order-instructions"
                value={orderForm.specialInstructions}
                onChange={handleOrderFieldChange('specialInstructions')}
                placeholder="e.g., Fasting sample; call results to cardiology on completion"
              />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={closeEditOrder}>
              Cancel
            </Button>
            <Button onClick={handleUpdateOrder} disabled={isUpdatingOrder}>
              {isUpdatingOrder ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isPrescriptionDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closePrescriptionDialog();
          } else {
            setIsPrescriptionDialogOpen(true);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search medications</DialogTitle>
            <DialogDescription>
              Choose medications from the formulary to add new prescriptions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Popover open={isMedicationPopoverOpen} onOpenChange={setIsMedicationPopoverOpen}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search medications..."
                    value={medicationSearch}
                    onChange={(event) => setMedicationSearch(event.target.value)}
                    className="pl-9"
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[min(480px,90vw)] p-0">
                <div className="max-h-72 overflow-y-auto divide-y">
                  {!medications || medications.length === 0 ? (
                    <p className="p-3 text-sm text-muted-foreground">No medications found.</p>
                  ) : (
                    medications.map((medication) => {
                      const selection = mapMedicationToSelection(medication);
                      const disabled = existingPrescriptionCodes.has(selection.code);
                      const checked = Boolean(selectedMedications[selection.id]);
                      return (
                        <button
                          type="button"
                          key={selection.id}
                          className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm ${
                            checked ? 'bg-accent' : disabled ? 'opacity-60' : 'hover:bg-muted'
                          }`}
                          onClick={() => !disabled && addMedicationSelection(selection)}
                        >
                          <Checkbox checked={checked} readOnly className="pointer-events-none" />
                          <div className="flex-1">
                            <p className="font-medium">{selection.label}</p>
                            <p className="text-xs text-muted-foreground">
                              {selection.codeSystem} · {selection.code}
                            </p>
                            {disabled && (
                              <p className="text-xs text-amber-600">Already prescribed</p>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <div>
              <p className="text-xs text-muted-foreground mb-2">
                Selected ({Object.keys(selectedMedications).length})
              </p>
              {Object.values(selectedMedications).length === 0 ? (
                <p className="text-xs text-muted-foreground">No medications selected.</p>
              ) : (
                <div className="space-y-2">
                  {Object.values(selectedMedications).map((selection) => (
                    <Card key={selection.id} className="p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{selection.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {selection.codeSystem} · {selection.code}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {selection.dosage} · {selection.route} · {selection.frequency}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => addMedicationSelection(selection)}>
                          Remove
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={closePrescriptionDialog}>
              Close
            </Button>
            <Button
              disabled={Object.keys(selectedMedications).length === 0 || isCreatingPrescription}
              onClick={async () => {
                const selections = Object.values(selectedMedications);
                if (!selections.length) return;
                try {
                  await Promise.all(
                    selections.map((selection) =>
                      createPrescription({
                        encounterId,
                        patientId: encounter.patientId,
                        drugCode: selection.code,
                        codeSystem: selection.codeSystem,
                        drugName: selection.label,
                        dosage: selection.dosage,
                        route: selection.route,
                        frequency: selection.frequency,
                        prescribedBy: encounter.primaryStaffId,
                      })
                    )
                  );
                  toast({
                    title: 'Prescriptions added',
                    description: `${selections.length} prescription${selections.length > 1 ? 's' : ''} created.`,
                  });
                  closePrescriptionDialog();
                } catch (err) {
                  console.error(err);
                  toast({
                    variant: 'destructive',
                    title: 'Unable to add prescriptions',
                    description: err instanceof Error ? err.message : 'Please try again.',
                  });
                }
              }}
            >
              Add Selected
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editingPrescription)} onOpenChange={(open) => !open && closeEditPrescription()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit prescription</DialogTitle>
            <DialogDescription>
              Update dosing details for {editingPrescription?.drugName} ({editingPrescription?.drugCode}).
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="prescription-dosage">Dosage</Label>
              <Input
                id="prescription-dosage"
                value={prescriptionForm.dosage}
                onChange={handlePrescriptionFieldChange('dosage')}
                placeholder="e.g., 500 mg"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="prescription-frequency">Frequency</Label>
              <Input
                id="prescription-frequency"
                value={prescriptionForm.frequency}
                onChange={handlePrescriptionFieldChange('frequency')}
                placeholder="e.g., twice daily"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="prescription-duration">Duration</Label>
              <Input
                id="prescription-duration"
                value={prescriptionForm.duration}
                onChange={handlePrescriptionFieldChange('duration')}
                placeholder="e.g., 7 days"
              />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={closeEditPrescription}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePrescription} disabled={isUpdatingPrescription}>
              {isUpdatingPrescription ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
