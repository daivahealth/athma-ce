'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Calculator, CalendarDays, ClipboardList, FlaskConical, Plus, Save, Scale, ShieldCheck, SlidersHorizontal, Syringe, Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/ui/page-header';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { FIELD_CONTROL, FormActions, FormField, FormSection } from '@/components/forms/form-layout';
import {
  DiagnosisContextCard,
  DiagnosisPickerCard,
  PatientContextCard,
  PatientPickerCard,
  diagnosisFromCancerDiagnosis,
  patientFromSearch,
} from '@/plugins/oncology/components/FormContextCards';
import {
  PICKER_LIMIT, useCancerDiagnoses, useOncologyCarePlans, useProtocols, useCreateChemoOrder,
} from '@/plugins/oncology/hooks/use-oncology';
import type { CancerDiagnosis, ChemoProtocol, OncologyCarePlan, DoseAdjustment, PreChemoChecklist } from '@/plugins/oncology/types';
import { getProtocolPhases, resolveCycle } from '@/plugins/oncology/lib/protocol-phases';

function calcBSA(heightCm: number, weightKg: number): number {
  return Math.sqrt((heightCm * weightKg) / 3600);
}

function calcDose(protocolDose: number, formula: string, bsa: number, weight: number): number {
  if (formula === 'bsa') return protocolDose * bsa;
  if (formula === 'weight') return protocolDose * weight;
  return protocolDose;
}

/** A patient as `PatientSearchSelect` returns it; only the id is read here. */
type SearchPatient = { id: string } & Record<string, unknown>;

export default function NewChemoOrderPage() {
  const params = useParams() as { locale: string };
  const router = useRouter();
  const back = () => router.push(`/${params.locale}/oncology/orders`);
  const createOrder = useCreateChemoOrder();

  const [selectedPatient, setSelectedPatient] = useState<SearchPatient | null>(null);
  const [cancerDiagnosisId, setCancerDiagnosisId] = useState('');
  const [oncologyCarePlanId, setOncologyCarePlanId] = useState('');
  const [protocolId, setProtocolId] = useState('');
  const [cycleNumber, setCycleNumber] = useState('1');
  const [dayNumber, setDayNumber] = useState('1');
  const [scheduledDate, setScheduledDate] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bsaOverride, setBsaOverride] = useState('');
  const [creatinineClearance, setCreatinineClearance] = useState('');
  const [hepaticGrade, setHepaticGrade] = useState('');
  const [renalGrade, setRenalGrade] = useState('');
  const [doseAdjustments, setDoseAdjustments] = useState<DoseAdjustment[]>([]);
  const [checklist, setChecklist] = useState<PreChemoChecklist>({});
  const [notes, setNotes] = useState('');

  const { data: diagnosesData, isLoading: diagnosesLoading } = useCancerDiagnoses(
    selectedPatient ? { patientId: selectedPatient.id, clinicalStatus: 'active' } : undefined,
  );
  const diagnoses: CancerDiagnosis[] = diagnosesData?.data ?? [];
  const selectedDiagnosis = diagnoses.find((d) => d.id === cancerDiagnosisId);

  // Auto-select when patient has exactly one active diagnosis
  useEffect(() => {
    if (!diagnosesLoading && diagnoses.length === 1 && !cancerDiagnosisId) {
      setCancerDiagnosisId(diagnoses[0].id);
    }
  }, [diagnosesLoading, diagnoses.length, cancerDiagnosisId]);

  const { data: carePlansData, isLoading: carePlansLoading } = useOncologyCarePlans({
    cancerDiagnosisId: cancerDiagnosisId || undefined,
    limit: PICKER_LIMIT,
  });
  const carePlans = carePlansData?.data ?? [];

  // Protocol planned on the selected care plan's chemotherapy modality
  const selectedCarePlan = (carePlans as OncologyCarePlan[]).find((cp) => cp.id === oncologyCarePlanId);
  const planChemoModality = selectedCarePlan?.planned_modalities?.find(
    (m) => m.modality === 'chemotherapy' && m.protocolId,
  );

  // Auto-link the care plan: prefer an active plan with a planned chemo protocol.
  // Runs once per diagnosis so a user's "No care plan" choice sticks.
  const autoLinkedForDiagnosis = useRef('');
  useEffect(() => {
    if (carePlansLoading || !cancerDiagnosisId || oncologyCarePlanId) return;
    if (autoLinkedForDiagnosis.current === cancerDiagnosisId) return;
    autoLinkedForDiagnosis.current = cancerDiagnosisId;
    const plans = carePlans as OncologyCarePlan[];
    const hasChemoProtocol = (cp: OncologyCarePlan) =>
      cp.planned_modalities?.some((m) => m.modality === 'chemotherapy' && m.protocolId);
    const candidate =
      plans.find((cp) => cp.status === 'active' && hasChemoProtocol(cp)) ??
      plans.find(hasChemoProtocol) ??
      (plans.length === 1 ? plans[0] : undefined);
    if (candidate) setOncologyCarePlanId(candidate.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carePlansLoading, cancerDiagnosisId, carePlans.length]);

  // Apply the care plan's planned protocol whenever the linked plan changes
  useEffect(() => {
    if (planChemoModality?.protocolId) setProtocolId(planChemoModality.protocolId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planChemoModality?.protocolId]);

  const { data: protocolsData } = useProtocols({
    cancerType: selectedDiagnosis?.cancer_type || undefined,
    limit: PICKER_LIMIT,
  });
  const filteredProtocols: ChemoProtocol[] = protocolsData?.data ?? [];
  const selectedProtocol = filteredProtocols.find((p) => p.id === protocolId);

  const bsa = useMemo(() => {
    if (bsaOverride) return parseFloat(bsaOverride);
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (h > 0 && w > 0) return parseFloat(calcBSA(h, w).toFixed(2));
    return 0;
  }, [height, weight, bsaOverride]);

  // Drugs for the selected cycle: phased protocols change drugs/doses by cycle
  const cycleRegimen = useMemo(() => {
    if (!selectedProtocol) return null;
    return resolveCycle(getProtocolPhases(selectedProtocol), parseInt(cycleNumber, 10) || 1) ?? null;
  }, [selectedProtocol, cycleNumber]);

  const calculatedDoses = useMemo(() => {
    if (!selectedProtocol || !bsa || !cycleRegimen) return [];
    const w = parseFloat(weight) || 0;
    return cycleRegimen.drugs.filter((d) => !d.omitted).map((drug) => {
      const raw = calcDose(drug.dose, drug.doseFormula, bsa, w);
      const capped = drug.maxDose && raw > drug.maxDose ? drug.maxDose : raw;
      return {
        drug: drug.drug,
        protocolDose: drug.dose,
        unit: drug.unit,
        formula: drug.doseFormula,
        calculatedDose: parseFloat(capped.toFixed(2)),
        route: drug.route,
        day: drug.days.length === 1 ? drug.days[0] : drug.days,
        infusionDurationMin: drug.infusionDurationMin,
      };
    });
  }, [selectedProtocol, cycleRegimen, bsa, weight]);

  const handleSelectPatient = (p: SearchPatient) => {
    setSelectedPatient(p);
    setCancerDiagnosisId('');
    setProtocolId('');
    setOncologyCarePlanId('');
  };

  const handleClearPatient = () => {
    setSelectedPatient(null);
    setCancerDiagnosisId('');
    setProtocolId('');
    setOncologyCarePlanId('');
  };

  const handleSelectDiagnosis = (id: string) => {
    setCancerDiagnosisId(id);
    setProtocolId('');
    setOncologyCarePlanId('');
  };

  const isValid = cancerDiagnosisId && protocolId && cycleNumber && dayNumber && scheduledDate;

  const handleSubmit = async () => {
    if (!isValid) return;
    await createOrder.mutateAsync({
      cancerDiagnosisId,
      oncologyCarePlanId: oncologyCarePlanId || undefined,
      protocolId,
      cycleNumber: parseInt(cycleNumber, 10),
      dayNumber: parseInt(dayNumber, 10),
      scheduledDate,
      bsa: bsa || undefined,
      weight: parseFloat(weight) || undefined,
      height: parseFloat(height) || undefined,
      creatinineClearance: parseFloat(creatinineClearance) || undefined,
      hepaticAdjustmentGrade: hepaticGrade || undefined,
      renalAdjustmentGrade: renalGrade || undefined,
      doseAdjustments: doseAdjustments.filter((a) => a.drug),
      preChemoChecklist: checklist,
      notes: notes || undefined,
    } as Parameters<typeof createOrder.mutateAsync>[0]);
    back();
  };

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        title="New Chemo Order"
        subtitle="Create a patient-specific chemotherapy order"
        icon={Syringe}
        breadcrumb={
          <Breadcrumb items={[{ href: `/${params.locale}/oncology/orders`, label: 'Chemo Orders' }, { label: 'New' }]} />
        }
      />

      <div className="space-y-6">
        {!selectedPatient ? (
          <PatientPickerCard onSelect={handleSelectPatient} onClear={handleClearPatient} />
        ) : (
          <PatientContextCard patient={patientFromSearch(selectedPatient)} onChange={handleClearPatient} />
        )}

        {selectedPatient && !cancerDiagnosisId && (
          <DiagnosisPickerCard
            diagnoses={diagnoses}
            loading={diagnosesLoading}
            onPick={handleSelectDiagnosis}
            onAddNew={() => router.push(`/${params.locale}/oncology/registry/new`)}
          />
        )}

        {selectedDiagnosis && (
          <DiagnosisContextCard
            diagnosis={diagnosisFromCancerDiagnosis(selectedDiagnosis)}
            onChange={
              diagnoses.length > 1
                ? () => { setCancerDiagnosisId(''); setProtocolId(''); setOncologyCarePlanId(''); }
                : undefined
            }
          />
        )}

        {cancerDiagnosisId && (
          <>
            <FormSection icon={ClipboardList} title="Care Plan" description="Optional — link the order to the patient's oncology care plan">
              <FormField id="oncologyCarePlanId" label="Care plan">
                <Select value={oncologyCarePlanId || '__none'} onValueChange={(v) => setOncologyCarePlanId(v === '__none' ? '' : v)}>
                  <SelectTrigger id="oncologyCarePlanId"><SelectValue placeholder="Link to care plan..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">— No care plan —</SelectItem>
                    {(carePlans as OncologyCarePlan[]).map((cp) => (
                      <SelectItem key={cp.id} value={cp.id}>
                        {cp.plan_number} · {cp.treatment_intent} · {cp.status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              {planChemoModality && (
                <div className="rounded-md bg-muted/40 px-3 py-2 text-xs space-y-0.5">
                  <div className="text-muted-foreground">
                    Planned protocol:{' '}
                    <span className="font-medium text-foreground">
                      {planChemoModality.protocolCode ? `${planChemoModality.protocolCode} — ` : ''}
                      {planChemoModality.protocolName ?? 'selected on care plan'}
                    </span>
                    {planChemoModality.plannedCycles
                      ? ` · ${planChemoModality.plannedCycles} cycles × ${planChemoModality.cycleDurationDays ?? '?'} days`
                      : ''}
                  </div>
                </div>
              )}
            </FormSection>

            <FormSection icon={FlaskConical} title="Protocol" description="The chemotherapy regimen this order follows">
              <FormField id="protocolId" label="Protocol" required>
                <Select value={protocolId} onValueChange={setProtocolId}>
                  <SelectTrigger id="protocolId"><SelectValue placeholder="Select protocol..." /></SelectTrigger>
                  <SelectContent>
                    {filteredProtocols.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.code} — {p.name}
                        {p.emetogenic_risk ? ` (${p.emetogenic_risk} emetogenic)` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              {selectedProtocol && (
                <div className="rounded-md bg-muted/40 px-3 py-2 text-xs space-y-1">
                  <div className="font-medium">{selectedProtocol.name}</div>
                  <div className="text-muted-foreground">
                    {selectedProtocol.total_cycles} cycles × {selectedProtocol.cycle_duration_days} days ·{' '}
                    {selectedProtocol.regimen.length} drug{selectedProtocol.regimen.length !== 1 ? 's' : ''} ·{' '}
                    Emetogenic: {selectedProtocol.emetogenic_risk ?? 'not specified'}
                  </div>
                  {cycleRegimen ? (
                    <div className="text-muted-foreground">
                      Cycle {cycleRegimen.cycle}: <span className="font-medium text-foreground">{cycleRegimen.phase.name}</span>
                      {getProtocolPhases(selectedProtocol).length > 1 && ` (phase cycle ${cycleRegimen.phaseCycle} of ${cycleRegimen.phase.cycles})`}
                      {' · '}{cycleRegimen.drugs.filter((d) => !d.omitted).map((d) => d.drug).join(', ')}
                    </div>
                  ) : (
                    <div className="text-destructive">Cycle {cycleNumber} is beyond this protocol&apos;s {selectedProtocol.total_cycles} cycles.</div>
                  )}
                  {selectedProtocol.lab_prerequisites?.length > 0 && (
                    <div className="text-warning">
                      Lab prerequisites: {selectedProtocol.lab_prerequisites.map((l) => `${l.parameter} ≥ ${l.minValue ?? '?'} ${l.unit} (${l.timing})`).join(', ')}
                    </div>
                  )}
                  {selectedProtocol.premedications?.filter(Boolean).length > 0 && (
                    <div className="text-muted-foreground">Pre-meds: {selectedProtocol.premedications.filter(Boolean).join(', ')}</div>
                  )}
                </div>
              )}
            </FormSection>

            <FormSection icon={Scale} title="Patient Biometrics" description="Measurements and organ function the doses are calculated from">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField id="weight" label="Weight (kg)">
                  <Input id="weight" type="number" min={0} step={0.1} placeholder="e.g. 68.5" value={weight} onChange={(e) => { setWeight(e.target.value); setBsaOverride(''); }} />
                </FormField>
                <FormField id="height" label="Height (cm)">
                  <Input id="height" type="number" min={0} step={0.1} placeholder="e.g. 168" value={height} onChange={(e) => { setHeight(e.target.value); setBsaOverride(''); }} />
                </FormField>
                <FormField id="bsa" label={<>BSA (m²) <span className="text-xs text-muted-foreground">auto-calculated</span></>}>
                  <Input id="bsa" type="number" min={0} step={0.01} placeholder={bsa ? bsa.toString() : 'e.g. 1.73'} value={bsaOverride || (bsa ? bsa.toString() : '')} onChange={(e) => setBsaOverride(e.target.value)} />
                </FormField>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField id="creatinineClearance" label="Creatinine Clearance (mL/min)">
                  <Input id="creatinineClearance" type="number" min={0} step={1} placeholder="e.g. 85" value={creatinineClearance} onChange={(e) => setCreatinineClearance(e.target.value)} />
                </FormField>
                <FormField id="hepaticGrade" label="Hepatic Function">
                  <Select value={hepaticGrade || '__none'} onValueChange={(v) => setHepaticGrade(v === '__none' ? '' : v)}>
                    <SelectTrigger id="hepaticGrade"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none">— Normal —</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="child_a">Child-Pugh A</SelectItem>
                      <SelectItem value="child_b">Child-Pugh B</SelectItem>
                      <SelectItem value="child_c">Child-Pugh C</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField id="renalGrade" label="Renal Function">
                  <Select value={renalGrade || '__none'} onValueChange={(v) => setRenalGrade(v === '__none' ? '' : v)}>
                    <SelectTrigger id="renalGrade"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none">— Normal —</SelectItem>
                      <SelectItem value="normal">Normal (≥60)</SelectItem>
                      <SelectItem value="mild">Mild (45–59)</SelectItem>
                      <SelectItem value="moderate">Moderate (30–44)</SelectItem>
                      <SelectItem value="severe">Severe (&lt;30)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </FormSection>

            {calculatedDoses.length > 0 && (
              <FormSection icon={Calculator} title="Calculated Doses" description={`Based on BSA ${bsa} m² · Weight ${weight || '—'} kg`}>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-2 font-medium text-xs">Drug</th>
                        <th className="text-left p-2 font-medium text-xs">Protocol Dose</th>
                        <th className="text-left p-2 font-medium text-xs">Calculated Dose</th>
                        <th className="text-left p-2 font-medium text-xs">Route</th>
                        <th className="text-left p-2 font-medium text-xs">Day</th>
                        <th className="text-left p-2 font-medium text-xs">Infusion</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {calculatedDoses.map((d, i) => (
                        <tr key={i}>
                          <td className="p-2 font-medium">{d.drug}</td>
                          <td className="p-2 text-xs text-muted-foreground">{d.protocolDose} {d.unit} ({d.formula})</td>
                          <td className="p-2 font-semibold text-foreground">{d.calculatedDose} mg</td>
                          <td className="p-2 text-xs">{d.route}</td>
                          <td className="p-2 text-xs">Day {Array.isArray(d.day) ? d.day.join(', ') : d.day}</td>
                          <td className="p-2 text-xs text-muted-foreground">{d.infusionDurationMin ? `${d.infusionDurationMin} min` : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning">Verify calculated doses before submission. Apply dose adjustments below if required by organ function or toxicity.</p>
              </FormSection>
            )}

            <FormSection icon={CalendarDays} title="Cycle Details" description="Which cycle and day this order is for, and when it is given">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField id="cycleNumber" label="Cycle Number" required>
                  <Input id="cycleNumber" type="number" min={1} value={cycleNumber} onChange={(e) => setCycleNumber(e.target.value)} />
                </FormField>
                <FormField id="dayNumber" label="Day Number" required>
                  <Input id="dayNumber" type="number" min={1} value={dayNumber} onChange={(e) => setDayNumber(e.target.value)} />
                </FormField>
                <FormField id="scheduledDate" label="Scheduled Date" required>
                  <Input id="scheduledDate" type="date" className={FIELD_CONTROL} value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
                </FormField>
              </div>
            </FormSection>

            <FormSection
              icon={SlidersHorizontal}
              title="Dose Adjustments"
              description="Document any dose reductions (organ function, toxicity, etc.)"
              contentClassName="space-y-3"
              actions={
                <Button type="button" variant="ghost" size="sm" onClick={() => setDoseAdjustments((p) => [...p, { drug: '', adjustmentPercent: 100, reason: '' }])}>
                  <Plus className="h-4 w-4 mr-1" />Add
                </Button>
              }
            >
              {doseAdjustments.length === 0 && <p className="text-xs text-muted-foreground">No dose adjustments — add if reducing doses from protocol</p>}
              {doseAdjustments.map((adj, i) => (
                <div key={i} className="grid grid-cols-3 gap-2 items-center">
                  <Input className="h-8" placeholder="Drug name" aria-label={`Adjustment ${i + 1} drug`} value={adj.drug} onChange={(e) => setDoseAdjustments((p) => p.map((a, idx) => idx === i ? { ...a, drug: e.target.value } : a))} />
                  <div className="flex items-center gap-1">
                    <Input className="h-8" type="number" min={0} max={100} aria-label={`Adjustment ${i + 1} percent of dose`} value={adj.adjustmentPercent} onChange={(e) => setDoseAdjustments((p) => p.map((a, idx) => idx === i ? { ...a, adjustmentPercent: parseInt(e.target.value, 10) || 100 } : a))} />
                    <span className="text-xs text-muted-foreground flex-shrink-0">% of dose</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <Input className="h-8" placeholder="Reason" aria-label={`Adjustment ${i + 1} reason`} value={adj.reason} onChange={(e) => setDoseAdjustments((p) => p.map((a, idx) => idx === i ? { ...a, reason: e.target.value } : a))} />
                    <Button type="button" variant="ghost" size="sm" aria-label={`Remove adjustment ${i + 1}`} className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive flex-shrink-0" onClick={() => setDoseAdjustments((p) => p.filter((_, idx) => idx !== i))}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </FormSection>

            <FormSection icon={ShieldCheck} title="Pre-Chemo Safety Checklist" description="ASCO/ONS pre-treatment verification" contentClassName="space-y-3">
              {([
                { key: 'consentDocumented', label: 'Informed consent documented' },
                { key: 'allergiesReviewed', label: 'Allergies reviewed — no contraindications' },
                { key: 'labsReviewed', label: 'Recent lab results reviewed' },
                { key: 'labsWithinRange', label: 'Required labs within acceptable range' },
                { key: 'bsaVerified', label: "Weight / BSA verified at today's visit" },
                { key: 'doseVerified', label: 'Calculated doses verified' },
                { key: 'premedicationsOrdered', label: 'Pre-medications ordered' },
              ] as const).map(({ key, label }) => (
                <div key={key} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={key}
                    checked={!!checklist[key]}
                    onChange={(e) => setChecklist((p) => ({ ...p, [key]: e.target.checked }))}
                    className="rounded border-input accent-primary"
                  />
                  <Label htmlFor={key} className="cursor-pointer font-normal">{label}</Label>
                </div>
              ))}
              <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
                <FormField id="consentDate" label="Consent Date">
                  <Input id="consentDate" type="date" className={FIELD_CONTROL} value={checklist.consentDate ?? ''} onChange={(e) => setChecklist((p) => ({ ...p, consentDate: e.target.value }))} />
                </FormField>
                <FormField id="allergiesSummary" label="Allergies Summary">
                  <Input id="allergiesSummary" placeholder="e.g. NKDA or list allergies" value={checklist.allergiesSummary ?? ''} onChange={(e) => setChecklist((p) => ({ ...p, allergiesSummary: e.target.value }))} />
                </FormField>
                <FormField id="labsDate" label="Labs Date">
                  <Input id="labsDate" type="date" className={FIELD_CONTROL} value={checklist.labsDate ?? ''} onChange={(e) => setChecklist((p) => ({ ...p, labsDate: e.target.value }))} />
                </FormField>
              </div>
              <FormField id="notes" label="Notes">
                <Textarea
                  id="notes"
                  className="min-h-[60px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Clinical notes, special instructions..."
                />
              </FormField>
            </FormSection>

            <FormActions onCancel={back} busy={createOrder.isPending}>
              <Button onClick={handleSubmit} disabled={!isValid || createOrder.isPending} className="gap-2">
                <Save className="h-4 w-4" />
                {createOrder.isPending ? 'Saving...' : 'Submit Order'}
              </Button>
            </FormActions>
          </>
        )}
      </div>
    </div>
  );
}
