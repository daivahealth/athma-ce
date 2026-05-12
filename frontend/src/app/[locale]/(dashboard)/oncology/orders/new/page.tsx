'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { PatientSearchSelect } from '@/components/patient-search-select';
import {
  useCancerDiagnoses, useOncologyCarePlans, useProtocols, useCreateChemoOrder,
} from '@/plugins/oncology/hooks/use-oncology';
import type { CancerDiagnosis, ChemoProtocol, OncologyCarePlan, DoseAdjustment, PreChemoChecklist } from '@/plugins/oncology/types';

function calcBSA(heightCm: number, weightKg: number): number {
  return Math.sqrt((heightCm * weightKg) / 3600);
}

function calcDose(protocolDose: number, formula: string, bsa: number, weight: number): number {
  if (formula === 'bsa') return protocolDose * bsa;
  if (formula === 'weight') return protocolDose * weight;
  return protocolDose;
}

export default function NewChemoOrderPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const back = () => router.push(`/${params.locale}/oncology/orders`);
  const createOrder = useCreateChemoOrder();

  // Step 1 — Patient
  const [selectedPatient, setSelectedPatient] = useState<{ id: string } | null>(null);

  // Step 2 — Diagnosis (auto-listed once patient selected)
  const [cancerDiagnosisId, setCancerDiagnosisId] = useState('');

  // Step 3 onwards — order fields
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

  // Active diagnoses for selected patient
  const { data: diagnosesData, isLoading: diagnosesLoading } = useCancerDiagnoses(
    selectedPatient ? { patientId: selectedPatient.id, clinicalStatus: 'active' } : undefined,
  );
  const diagnoses: CancerDiagnosis[] = diagnosesData?.data ?? [];
  const selectedDiagnosis = diagnoses.find((d) => d.id === cancerDiagnosisId);

  const { data: carePlansData } = useOncologyCarePlans(
    cancerDiagnosisId ? { cancerDiagnosisId } : undefined,
  );
  const carePlans = carePlansData?.data ?? [];

  const { data: protocolsData } = useProtocols();
  const allProtocols: ChemoProtocol[] = protocolsData?.data ?? [];
  const filteredProtocols = selectedDiagnosis
    ? allProtocols.filter((p) => p.is_active && p.cancer_type.toLowerCase().includes(selectedDiagnosis.cancer_type.toLowerCase().split(' ')[0]))
    : allProtocols.filter((p) => p.is_active);
  const selectedProtocol = allProtocols.find((p) => p.id === protocolId);

  const bsa = useMemo(() => {
    if (bsaOverride) return parseFloat(bsaOverride);
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (h > 0 && w > 0) return parseFloat(calcBSA(h, w).toFixed(2));
    return 0;
  }, [height, weight, bsaOverride]);

  const calculatedDoses = useMemo(() => {
    if (!selectedProtocol || !bsa) return [];
    const w = parseFloat(weight) || 0;
    return selectedProtocol.regimen.map((drug) => ({
      drug: drug.drug,
      protocolDose: drug.dose,
      unit: drug.unit,
      formula: drug.doseFormula,
      calculatedDose: parseFloat(calcDose(drug.dose, drug.doseFormula, bsa, w).toFixed(2)),
      route: drug.route,
      day: drug.day,
      infusionDurationMin: drug.infusionDurationMin,
    }));
  }, [selectedProtocol, bsa, weight]);

  const handleSelectPatient = (p: { id: string }) => {
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={back}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">New Chemo Order</h1>
          <p className="text-muted-foreground text-sm">Create a patient-specific chemotherapy order</p>
        </div>
      </div>

      <div className="space-y-6">

        {/* Step 1 — Patient */}
        <Card>
          <CardHeader><CardTitle>Patient</CardTitle></CardHeader>
          <CardContent>
            <PatientSearchSelect
              required
              selectedPatient={selectedPatient}
              onSelect={handleSelectPatient}
              onClear={handleClearPatient}
            />
          </CardContent>
        </Card>

        {/* Step 2 — Active cancer diagnoses (auto-listed) */}
        {selectedPatient && (
          <Card>
            <CardHeader><CardTitle>Active Cancer Diagnosis *</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {diagnosesLoading ? (
                <p className="text-sm text-muted-foreground">Loading diagnoses...</p>
              ) : diagnoses.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No active cancer diagnoses found for this patient.{' '}
                  <button
                    className="underline text-primary"
                    onClick={() => router.push(`/${params.locale}/oncology/registry/new`)}
                  >
                    Add one first
                  </button>
                </p>
              ) : (
                diagnoses.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => handleSelectDiagnosis(d.id)}
                    className={[
                      'w-full text-left px-4 py-3 rounded-md border text-sm transition-colors',
                      cancerDiagnosisId === d.id
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border hover:bg-muted/40',
                    ].join(' ')}
                  >
                    <div className="font-medium">{d.cancer_type}</div>
                    <div className="text-muted-foreground mt-0.5">
                      {d.primary_site}
                      {d.primary_site_code && (
                        <span className="ml-2 font-mono text-xs">{d.primary_site_code}</span>
                      )}
                      <span className="ml-3">
                        Diagnosed {new Date(d.diagnosis_date).toLocaleDateString()}
                      </span>
                      {d.metastatic_status && d.metastatic_status !== 'unknown' && (
                        <span className="ml-3 capitalize">{d.metastatic_status}</span>
                      )}
                    </div>
                    {d.histology_morphology && (
                      <div className="text-xs text-muted-foreground mt-0.5">{d.histology_morphology}</div>
                    )}
                  </button>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {/* Steps 3+ — shown only after a diagnosis is selected */}
        {cancerDiagnosisId && (
          <>
            {/* Care Plan (optional) */}
            <Card>
              <CardHeader><CardTitle>Care Plan (Optional)</CardTitle></CardHeader>
              <CardContent>
                <Select value={oncologyCarePlanId || '__none'} onValueChange={(v) => setOncologyCarePlanId(v === '__none' ? '' : v)}>
                  <SelectTrigger><SelectValue placeholder="Link to care plan..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">— No care plan —</SelectItem>
                    {(carePlans as OncologyCarePlan[]).map((cp) => (
                      <SelectItem key={cp.id} value={cp.id}>
                        {cp.plan_number} · {cp.treatment_intent} · {cp.status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Protocol */}
            <Card>
              <CardHeader><CardTitle>Protocol *</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Select value={protocolId} onValueChange={setProtocolId}>
                  <SelectTrigger><SelectValue placeholder="Select protocol..." /></SelectTrigger>
                  <SelectContent>
                    {filteredProtocols.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.code} — {p.name}
                        {p.emetogenic_risk ? ` (${p.emetogenic_risk} emetogenic)` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedProtocol && (
                  <div className="rounded-md bg-muted/40 px-3 py-2 text-xs space-y-1">
                    <div className="font-medium">{selectedProtocol.name}</div>
                    <div className="text-muted-foreground">
                      {selectedProtocol.total_cycles} cycles × {selectedProtocol.cycle_duration_days} days ·{' '}
                      {selectedProtocol.regimen.length} drug{selectedProtocol.regimen.length !== 1 ? 's' : ''} ·{' '}
                      Emetogenic: {selectedProtocol.emetogenic_risk ?? 'not specified'}
                    </div>
                    {selectedProtocol.lab_prerequisites?.length > 0 && (
                      <div className="text-amber-600">
                        Lab prerequisites: {selectedProtocol.lab_prerequisites.map((l) => `${l.parameter} ≥ ${l.minValue ?? '?'} ${l.unit} (${l.timing})`).join(', ')}
                      </div>
                    )}
                    {selectedProtocol.premedications?.filter(Boolean).length > 0 && (
                      <div className="text-muted-foreground">Pre-meds: {selectedProtocol.premedications.filter(Boolean).join(', ')}</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Patient Biometrics */}
            <Card>
              <CardHeader><CardTitle>Patient Biometrics</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Weight (kg)</Label>
                    <Input type="number" min={0} step={0.1} placeholder="e.g. 68.5" value={weight} onChange={(e) => { setWeight(e.target.value); setBsaOverride(''); }} />
                  </div>
                  <div className="space-y-2">
                    <Label>Height (cm)</Label>
                    <Input type="number" min={0} step={0.1} placeholder="e.g. 168" value={height} onChange={(e) => { setHeight(e.target.value); setBsaOverride(''); }} />
                  </div>
                  <div className="space-y-2">
                    <Label>BSA (m²) <span className="text-xs text-muted-foreground">auto-calculated</span></Label>
                    <Input type="number" min={0} step={0.01} placeholder={bsa ? bsa.toString() : 'e.g. 1.73'} value={bsaOverride || (bsa ? bsa.toString() : '')} onChange={(e) => setBsaOverride(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Creatinine Clearance (mL/min)</Label>
                    <Input type="number" min={0} step={1} placeholder="e.g. 85" value={creatinineClearance} onChange={(e) => setCreatinineClearance(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Hepatic Function</Label>
                    <Select value={hepaticGrade || '__none'} onValueChange={(v) => setHepaticGrade(v === '__none' ? '' : v)}>
                      <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none">— Normal —</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="child_a">Child-Pugh A</SelectItem>
                        <SelectItem value="child_b">Child-Pugh B</SelectItem>
                        <SelectItem value="child_c">Child-Pugh C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Renal Function</Label>
                    <Select value={renalGrade || '__none'} onValueChange={(v) => setRenalGrade(v === '__none' ? '' : v)}>
                      <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none">— Normal —</SelectItem>
                        <SelectItem value="normal">Normal (≥60)</SelectItem>
                        <SelectItem value="mild">Mild (45–59)</SelectItem>
                        <SelectItem value="moderate">Moderate (30–44)</SelectItem>
                        <SelectItem value="severe">Severe (&lt;30)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calculated Doses */}
            {calculatedDoses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Calculated Doses</CardTitle>
                  <p className="text-xs text-muted-foreground">Based on BSA {bsa} m² · Weight {weight || '—'} kg</p>
                </CardHeader>
                <CardContent>
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
                  <p className="text-xs text-amber-600 mt-2">Verify calculated doses before submission. Apply dose adjustments below if required by organ function or toxicity.</p>
                </CardContent>
              </Card>
            )}

            {/* Cycle Details */}
            <Card>
              <CardHeader><CardTitle>Cycle Details</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Cycle Number *</Label>
                    <Input type="number" min={1} value={cycleNumber} onChange={(e) => setCycleNumber(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Day Number *</Label>
                    <Input type="number" min={1} value={dayNumber} onChange={(e) => setDayNumber(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Scheduled Date *</Label>
                    <Input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dose Adjustments */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Dose Adjustments</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Document any dose reductions (organ function, toxicity, etc.)</p>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setDoseAdjustments((p) => [...p, { drug: '', adjustmentPercent: 100, reason: '' }])}>
                    <Plus className="h-4 w-4 mr-1" />Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {doseAdjustments.length === 0 && <p className="text-xs text-muted-foreground">No dose adjustments — add if reducing doses from protocol</p>}
                {doseAdjustments.map((adj, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2 items-center">
                    <Input className="h-8" placeholder="Drug name" value={adj.drug} onChange={(e) => setDoseAdjustments((p) => p.map((a, idx) => idx === i ? { ...a, drug: e.target.value } : a))} />
                    <div className="flex items-center gap-1">
                      <Input className="h-8" type="number" min={0} max={100} value={adj.adjustmentPercent} onChange={(e) => setDoseAdjustments((p) => p.map((a, idx) => idx === i ? { ...a, adjustmentPercent: parseInt(e.target.value, 10) || 100 } : a))} />
                      <span className="text-xs text-muted-foreground flex-shrink-0">% of dose</span>
                    </div>
                    <div className="flex gap-1 items-center">
                      <Input className="h-8" placeholder="Reason" value={adj.reason} onChange={(e) => setDoseAdjustments((p) => p.map((a, idx) => idx === i ? { ...a, reason: e.target.value } : a))} />
                      <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive flex-shrink-0" onClick={() => setDoseAdjustments((p) => p.filter((_, idx) => idx !== i))}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Pre-Chemo Safety Checklist */}
            <Card>
              <CardHeader>
                <CardTitle>Pre-Chemo Safety Checklist</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">ASCO/ONS pre-treatment verification</p>
              </CardHeader>
              <CardContent className="space-y-3">
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
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={key} className="cursor-pointer font-normal">{label}</Label>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label>Consent Date</Label>
                    <Input type="date" value={checklist.consentDate ?? ''} onChange={(e) => setChecklist((p) => ({ ...p, consentDate: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Allergies Summary</Label>
                    <Input placeholder="e.g. NKDA or list allergies" value={checklist.allergiesSummary ?? ''} onChange={(e) => setChecklist((p) => ({ ...p, allergiesSummary: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Labs Date</Label>
                    <Input type="date" value={checklist.labsDate ?? ''} onChange={(e) => setChecklist((p) => ({ ...p, labsDate: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <textarea
                    className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Clinical notes, special instructions..."
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" onClick={back} disabled={createOrder.isPending}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!isValid || createOrder.isPending}>
                {createOrder.isPending ? 'Saving...' : 'Submit Order'}
              </Button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
