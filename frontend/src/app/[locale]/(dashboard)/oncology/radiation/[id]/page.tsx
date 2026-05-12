'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  useRadiationPrescription,
  useApproveRadiationPrescription,
  useActivateRadiationPrescription,
  useRadiationSimulations,
  useCreateRadiationSimulation,
  useRadiationPlans,
  useCreateRadiationPlan,
  useApproveRadiationPlan,
  useRadiationFractions,
  useBulkCreateFractions,
  useDeliverFraction,
  useUpdateRadiationFraction,
  useOnTreatmentReviews,
  useCreateOnTreatmentReview,
  useCompletionSummary,
  useCreateCompletionSummary,
} from '@/plugins/oncology/hooks/use-oncology';
import type {
  RadiationTreatmentPlan, RadiationFraction,
} from '@/plugins/oncology/types';

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  APPROVED: 'bg-blue-100 text-blue-700',
  ACTIVE: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-purple-100 text-purple-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const FRACTION_STATUS_COLORS: Record<string, string> = {
  SCHEDULED: 'bg-blue-50 text-blue-700',
  DELIVERED: 'bg-green-100 text-green-700',
  MISSED: 'bg-amber-100 text-amber-700',
  CANCELLED: 'bg-red-100 text-red-700',
  RESCHEDULED: 'bg-purple-100 text-purple-700',
};

function SectionHeader({ title, open, onToggle, action }: {
  title: string; open: boolean; onToggle: () => void; action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between cursor-pointer py-2" onClick={onToggle}>
      <div className="flex items-center gap-2 font-semibold text-sm">
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        {title}
      </div>
      {action && <div onClick={(e) => e.stopPropagation()}>{action}</div>}
    </div>
  );
}

export default function RadiationPrescriptionDetailPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const router = useRouter();
  const { id } = params;

  const { data: rx, isLoading } = useRadiationPrescription(id);
  const approvePrescription = useApproveRadiationPrescription();
  const activatePrescription = useActivateRadiationPrescription();

  // Section open/close state
  const [simOpen, setSimOpen] = useState(true);
  const [planOpen, setPlanOpen] = useState(true);
  const [fractionsOpen, setFractionsOpen] = useState(true);
  const [reviewOpen, setReviewOpen] = useState(true);
  const [completionOpen, setCompletionOpen] = useState(true);

  // ── Simulation ──────────────────────────────────────────────
  const [showSimForm, setShowSimForm] = useState(false);
  const [simDate, setSimDate] = useState('');
  const [patientPosition, setPatientPosition] = useState('');
  const [immobilizationDevice, setImmobilizationDevice] = useState('');
  const [contrastUsed, setContrastUsed] = useState(false);
  const [scanRegion, setScanRegion] = useState('');
  const [setupReference, setSetupReference] = useState('');
  const [tattooMarkingDone, setTattooMarkingDone] = useState(false);
  const [simNotes, setSimNotes] = useState('');

  const { data: simData } = useRadiationSimulations(id);
  const simulations = simData?.data ?? [];
  const createSimulation = useCreateRadiationSimulation();

  const handleCreateSimulation = async () => {
    await createSimulation.mutateAsync({
      prescriptionId: id,
      simulationDate: simDate || undefined,
      patientPosition: patientPosition || undefined,
      immobilizationDevice: immobilizationDevice || undefined,
      contrastUsed,
      scanRegion: scanRegion || undefined,
      setupReference: setupReference || undefined,
      tattooMarkingDone,
      simulationNotes: simNotes || undefined,
    });
    setShowSimForm(false);
    setSimDate(''); setPatientPosition(''); setImmobilizationDevice('');
    setContrastUsed(false); setScanRegion(''); setSetupReference('');
    setTattooMarkingDone(false); setSimNotes('');
  };

  // ── Treatment Plan ──────────────────────────────────────────
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [planningSystem, setPlanningSystem] = useState('');
  const [planMachine, setPlanMachine] = useState('');
  const [planNotes, setPlanNotes] = useState('');
  const [selectedSimId, setSelectedSimId] = useState('');

  const { data: plansData } = useRadiationPlans(id);
  const plans: RadiationTreatmentPlan[] = plansData?.data ?? [];
  const createPlan = useCreateRadiationPlan();
  const approvePlan = useApproveRadiationPlan();

  const handleCreatePlan = async () => {
    await createPlan.mutateAsync({
      prescriptionId: id,
      simulationId: selectedSimId || undefined,
      planningSystem: planningSystem || undefined,
      treatmentMachine: planMachine || undefined,
      planNotes: planNotes || undefined,
    });
    setShowPlanForm(false);
    setPlanningSystem(''); setPlanMachine(''); setPlanNotes(''); setSelectedSimId('');
  };

  // ── Fractions ────────────────────────────────────────────────
  const [activePlanId, setActivePlanId] = useState('');
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [fractionCount, setFractionCount] = useState('');
  const [fractionDose, setFractionDose] = useState('');
  const [fractionStart, setFractionStart] = useState('');
  const [fractionMachine, setFractionMachine] = useState('');

  const planIdForFractions = activePlanId || plans[0]?.id || '';
  const { data: fractionsData } = useRadiationFractions(planIdForFractions);
  const fractions: RadiationFraction[] = fractionsData?.data ?? [];
  const bulkCreate = useBulkCreateFractions();
  const deliverFraction = useDeliverFraction();
  const updateFraction = useUpdateRadiationFraction();

  const handleBulkCreate = async () => {
    await bulkCreate.mutateAsync({
      planId: planIdForFractions,
      data: {
        fractionCount: parseInt(fractionCount, 10),
        dosePerFractionGy: fractionDose ? parseFloat(fractionDose) : undefined,
        startDate: fractionStart || undefined,
        treatmentMachine: fractionMachine || undefined,
      },
    });
    setShowBulkForm(false);
    setFractionCount(''); setFractionDose(''); setFractionStart(''); setFractionMachine('');
  };

  const handleDeliver = async (f: RadiationFraction) => {
    const dose = window.prompt(`Delivered dose for Fraction ${f.fraction_number} (Gy):`, String(f.planned_dose_gy ?? ''));
    if (!dose) return;
    await deliverFraction.mutateAsync({ id: f.id, data: { deliveredDoseGy: parseFloat(dose) } });
  };

  const handleMarkMissed = async (f: RadiationFraction) => {
    const reason = window.prompt('Reason for missed fraction:') ?? '';
    await updateFraction.mutateAsync({ id: f.id, data: { status: 'MISSED', interruptionReason: reason || undefined } });
  };

  // ── On-Treatment Reviews ─────────────────────────────────────
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewDate, setReviewDate] = useState('');
  const [weekNumber, setWeekNumber] = useState('');
  const [toxicityGrade, setToxicityGrade] = useState('');
  const [painScore, setPainScore] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [treatmentBreak, setTreatmentBreak] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');

  const { data: reviewsData } = useOnTreatmentReviews(id);
  const reviews = reviewsData?.data ?? [];
  const createReview = useCreateOnTreatmentReview();

  const handleCreateReview = async () => {
    await createReview.mutateAsync({
      prescriptionId: id,
      reviewDate,
      weekNumber: weekNumber ? parseInt(weekNumber, 10) : undefined,
      toxicityGrade: toxicityGrade || undefined,
      painScore: painScore ? parseInt(painScore, 10) : undefined,
      weightKg: weightKg ? parseFloat(weightKg) : undefined,
      treatmentBreakRequired: treatmentBreak,
      reviewNotes: reviewNotes || undefined,
    });
    setShowReviewForm(false);
    setReviewDate(''); setWeekNumber(''); setToxicityGrade('');
    setPainScore(''); setWeightKg(''); setTreatmentBreak(false); setReviewNotes('');
  };

  // ── Completion Summary ───────────────────────────────────────
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [completionDate, setCompletionDate] = useState('');
  const [deliveredTotalDose, setDeliveredTotalDose] = useState('');
  const [deliveredFractionsCount, setDeliveredFractionsCount] = useState('');
  const [hasInterruptions, setHasInterruptions] = useState(false);
  const [interruptionNotes, setInterruptionNotes] = useState('');
  const [acuteToxicity, setAcuteToxicity] = useState('');
  const [responseAssessment, setResponseAssessment] = useState('');
  const [followupPlan, setFollowupPlan] = useState('');

  const { data: completion } = useCompletionSummary(id);
  const createCompletion = useCreateCompletionSummary();

  const handleCreateCompletion = async () => {
    await createCompletion.mutateAsync({
      prescriptionId: id,
      completionDate: completionDate || undefined,
      plannedTotalDoseGy: rx?.total_dose_gy,
      deliveredTotalDoseGy: deliveredTotalDose ? parseFloat(deliveredTotalDose) : undefined,
      plannedFractions: rx?.planned_fractions,
      deliveredFractions: deliveredFractionsCount ? parseInt(deliveredFractionsCount, 10) : undefined,
      interruptions: hasInterruptions,
      interruptionNotes: interruptionNotes || undefined,
      acuteToxicitySummary: acuteToxicity || undefined,
      responseAssessmentPlan: responseAssessment || undefined,
      followupPlan: followupPlan || undefined,
    });
    setShowCompletionForm(false);
  };

  if (isLoading) {
    return <div className="py-20 text-center text-muted-foreground">Loading prescription...</div>;
  }
  if (!rx) {
    return <div className="py-20 text-center text-muted-foreground">Prescription not found.</div>;
  }

  const canApprove = rx.status === 'DRAFT';
  const canActivate = rx.status === 'APPROVED';
  const canComplete = rx.status === 'ACTIVE' && !completion;
  const deliveredCount = fractions.filter((f) => f.status === 'DELIVERED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push(`/${params.locale}/oncology/radiation`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">
                {rx.patientDisplay?.displayName ?? 'Radiation Prescription'}
              </h1>
              <Badge className={STATUS_COLORS[rx.status] ?? ''} variant="secondary">{rx.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {rx.patientDisplay?.mrn && `MRN: ${rx.patientDisplay.mrn} · `}
              {rx.patientDisplay?.age != null && `${rx.patientDisplay.age}y · `}
              {rx.prescription_number && `Rx# ${rx.prescription_number} · `}
              Created {new Date(rx.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {canApprove && (
            <Button onClick={() => approvePrescription.mutate(id)} disabled={approvePrescription.isPending}>
              {approvePrescription.isPending ? 'Approving...' : 'Approve Prescription'}
            </Button>
          )}
          {canActivate && (
            <Button onClick={() => activatePrescription.mutate(id)} disabled={activatePrescription.isPending}>
              {activatePrescription.isPending ? 'Activating...' : 'Activate (Start Treatment)'}
            </Button>
          )}
          {canComplete && (
            <Button variant="outline" onClick={() => { setCompletionOpen(true); setShowCompletionForm(true); }}>
              Record Completion
            </Button>
          )}
        </div>
      </div>

      {/* Prescription Summary */}
      <Card>
        <CardHeader><CardTitle>Prescription Details</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Intent</p>
              <p className="font-medium">{rx.treatment_intent ?? '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Modality</p>
              <p className="font-medium">{rx.modality ?? '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Technique</p>
              <p className="font-medium">{rx.technique ?? '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Laterality</p>
              <p className="font-medium">{rx.laterality ?? '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Total Dose</p>
              <p className="font-medium">{rx.total_dose_gy != null ? `${rx.total_dose_gy} Gy` : '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Dose / Fraction</p>
              <p className="font-medium">{rx.dose_per_fraction_gy != null ? `${rx.dose_per_fraction_gy} Gy` : '—'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Fractions</p>
              <p className="font-medium">
                {fractions.length > 0
                  ? `${deliveredCount} / ${rx.planned_fractions ?? fractions.length} delivered`
                  : (rx.planned_fractions ?? '—')}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Concurrent Chemo</p>
              <p className="font-medium">{rx.concurrent_chemo ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Planned Start</p>
              <p className="font-medium">
                {rx.planned_start_date ? new Date(rx.planned_start_date).toLocaleDateString() : '—'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Planned End</p>
              <p className="font-medium">
                {rx.planned_end_date ? new Date(rx.planned_end_date).toLocaleDateString() : '—'}
              </p>
            </div>
          </div>
          {rx.prescription_notes && (
            <div className="mt-4 p-3 rounded-md bg-muted/40 text-sm">
              <p className="text-xs text-muted-foreground mb-1">Notes</p>
              <p>{rx.prescription_notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Simulation ─────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeader
            title={`CT Simulation${simulations.length > 0 ? ` (${simulations.length})` : ''}`}
            open={simOpen}
            onToggle={() => setSimOpen((v) => !v)}
            action={
              !showSimForm && (
                <Button size="sm" variant="outline" onClick={() => setShowSimForm(true)}>
                  <Plus className="h-3 w-3 mr-1" />Add Simulation
                </Button>
              )
            }
          />
        </CardHeader>
        {simOpen && (
          <CardContent className="space-y-4 pt-0">
            {/* Existing simulations */}
            {simulations.map((sim) => (
              <div key={sim.id} className="border rounded-md p-3 text-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {sim.simulation_date ? new Date(sim.simulation_date).toLocaleDateString() : 'Date TBD'}
                  </span>
                  <Badge variant="secondary" className="text-xs">{sim.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-x-4 text-muted-foreground text-xs mt-1">
                  {sim.patient_position && <span>Position: {sim.patient_position}</span>}
                  {sim.immobilization_device && <span>Immobilization: {sim.immobilization_device}</span>}
                  {sim.scan_region && <span>Scan region: {sim.scan_region}</span>}
                  <span>Contrast: {sim.contrast_used ? 'Yes' : 'No'}</span>
                  <span>Tattoo marking: {sim.tattoo_marking_done ? 'Done' : 'No'}</span>
                </div>
                {sim.simulation_notes && (
                  <p className="text-xs text-muted-foreground mt-1">{sim.simulation_notes}</p>
                )}
              </div>
            ))}

            {/* Simulation form */}
            {showSimForm && (
              <div className="border rounded-md p-4 space-y-4 bg-muted/20">
                <h4 className="font-medium text-sm">New CT Simulation</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Simulation Date</Label>
                    <Input type="datetime-local" value={simDate} onChange={(e) => setSimDate(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Patient Position</Label>
                    <Input placeholder="e.g. Supine, arms up" value={patientPosition} onChange={(e) => setPatientPosition(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Immobilization Device</Label>
                    <Input placeholder="e.g. Alpha Cradle, Wing Board" value={immobilizationDevice} onChange={(e) => setImmobilizationDevice(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Scan Region</Label>
                    <Input placeholder="e.g. Chest to pelvis" value={scanRegion} onChange={(e) => setScanRegion(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Setup Reference / Isocentre</Label>
                  <Input placeholder="e.g. Sternal notch, 3 field isocentre" value={setupReference} onChange={(e) => setSetupReference(e.target.value)} />
                </div>
                <div className="flex gap-4 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={contrastUsed} onChange={(e) => setContrastUsed(e.target.checked)} />
                    Contrast used
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={tattooMarkingDone} onChange={(e) => setTattooMarkingDone(e.target.checked)} />
                    Tattoo marking done
                  </label>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Notes</Label>
                  <textarea
                    className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={simNotes} onChange={(e) => setSimNotes(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleCreateSimulation} disabled={createSimulation.isPending}>
                    {createSimulation.isPending ? 'Saving...' : 'Save Simulation'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowSimForm(false)}>Cancel</Button>
                </div>
              </div>
            )}

            {simulations.length === 0 && !showSimForm && (
              <p className="text-sm text-muted-foreground">No simulation recorded yet.</p>
            )}
          </CardContent>
        )}
      </Card>

      {/* ── Treatment Plan ──────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeader
            title={`Treatment Plan${plans.length > 0 ? ` (${plans.length})` : ''}`}
            open={planOpen}
            onToggle={() => setPlanOpen((v) => !v)}
            action={
              !showPlanForm && (
                <Button size="sm" variant="outline" onClick={() => setShowPlanForm(true)}>
                  <Plus className="h-3 w-3 mr-1" />Add Plan
                </Button>
              )
            }
          />
        </CardHeader>
        {planOpen && (
          <CardContent className="space-y-4 pt-0">
            {plans.map((plan) => (
              <div key={plan.id} className="border rounded-md p-3 text-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {plan.planning_system ?? 'Treatment Plan'}
                    {plan.external_plan_reference && (
                      <span className="ml-2 font-mono text-xs text-muted-foreground">#{plan.external_plan_reference}</span>
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{plan.planning_status ?? plan.status}</Badge>
                    {plan.planning_status !== 'APPROVED' && (
                      <Button size="sm" variant="outline" className="h-7 text-xs"
                        onClick={() => approvePlan.mutate(plan.id)}
                        disabled={approvePlan.isPending}
                      >
                        Approve Plan
                      </Button>
                    )}
                    {plan.planning_status === 'APPROVED' && (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 text-muted-foreground text-xs">
                  {plan.treatment_machine && <span>Machine: {plan.treatment_machine}</span>}
                  <span>Contouring: {plan.contouring_completed ? '✓' : '—'}</span>
                  <span>Physics QA: {plan.physics_qa_completed ? '✓' : '—'}</span>
                  {plan.approved_at && (
                    <span>Approved: {new Date(plan.approved_at).toLocaleDateString()}</span>
                  )}
                </div>
                {plan.plan_notes && (
                  <p className="text-xs text-muted-foreground">{plan.plan_notes}</p>
                )}

                {/* Select this plan for fraction management */}
                <Button
                  size="sm" variant="ghost" className="h-7 text-xs"
                  onClick={() => { setActivePlanId(plan.id); setFractionsOpen(true); }}
                >
                  Manage Fractions →
                </Button>
              </div>
            ))}

            {showPlanForm && (
              <div className="border rounded-md p-4 space-y-4 bg-muted/20">
                <h4 className="font-medium text-sm">New Treatment Plan</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Planning System</Label>
                    <Select value={planningSystem || '__none'} onValueChange={(v) => setPlanningSystem(v === '__none' ? '' : v)}>
                      <SelectTrigger className="h-9"><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none">— Select —</SelectItem>
                        <SelectItem value="Eclipse">Eclipse</SelectItem>
                        <SelectItem value="Monaco">Monaco</SelectItem>
                        <SelectItem value="RayStation">RayStation</SelectItem>
                        <SelectItem value="Pinnacle">Pinnacle</SelectItem>
                        <SelectItem value="Elekta XiO">Elekta XiO</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Treatment Machine</Label>
                    <Input placeholder="e.g. Varian TrueBeam, Elekta Versa" value={planMachine} onChange={(e) => setPlanMachine(e.target.value)} />
                  </div>
                  {simulations.length > 0 && (
                    <div className="space-y-1">
                      <Label className="text-xs">Link to Simulation</Label>
                      <Select value={selectedSimId || '__none'} onValueChange={(v) => setSelectedSimId(v === '__none' ? '' : v)}>
                        <SelectTrigger className="h-9"><SelectValue placeholder="Select simulation..." /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none">— None —</SelectItem>
                          {simulations.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.simulation_date ? new Date(s.simulation_date).toLocaleDateString() : 'Simulation'} — {s.scan_region ?? s.status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Plan Notes</Label>
                  <textarea
                    className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={planNotes} onChange={(e) => setPlanNotes(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleCreatePlan} disabled={createPlan.isPending}>
                    {createPlan.isPending ? 'Saving...' : 'Save Plan'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowPlanForm(false)}>Cancel</Button>
                </div>
              </div>
            )}

            {plans.length === 0 && !showPlanForm && (
              <p className="text-sm text-muted-foreground">No treatment plan created yet.</p>
            )}
          </CardContent>
        )}
      </Card>

      {/* ── Fractions ───────────────────────────────────────────── */}
      {plans.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <SectionHeader
              title={`Fractions${fractions.length > 0 ? ` — ${deliveredCount}/${fractions.length} delivered` : ''}`}
              open={fractionsOpen}
              onToggle={() => setFractionsOpen((v) => !v)}
              action={
                fractions.length === 0 && !showBulkForm ? (
                  <Button size="sm" variant="outline" onClick={() => setShowBulkForm(true)}>
                    <Plus className="h-3 w-3 mr-1" />Generate Fractions
                  </Button>
                ) : undefined
              }
            />
          </CardHeader>
          {fractionsOpen && (
            <CardContent className="space-y-4 pt-0">
              {/* Plan selector if multiple */}
              {plans.length > 1 && (
                <Select value={activePlanId || plans[0]?.id} onValueChange={setActivePlanId}>
                  <SelectTrigger className="w-64 h-8 text-xs"><SelectValue placeholder="Select plan..." /></SelectTrigger>
                  <SelectContent>
                    {plans.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.planning_system ?? 'Plan'} — {p.treatment_machine ?? p.status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Bulk generate form */}
              {showBulkForm && (
                <div className="border rounded-md p-4 space-y-4 bg-muted/20">
                  <h4 className="font-medium text-sm">Generate Fraction Schedule</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs">Number of Fractions *</Label>
                      <Input type="number" placeholder={String(rx.planned_fractions ?? '')} value={fractionCount} onChange={(e) => setFractionCount(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Dose / Fraction (Gy)</Label>
                      <Input type="number" step="0.01" placeholder={String(rx.dose_per_fraction_gy ?? '')} value={fractionDose} onChange={(e) => setFractionDose(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Start Date</Label>
                      <Input type="date" value={fractionStart} onChange={(e) => setFractionStart(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Treatment Machine</Label>
                      <Input placeholder="e.g. TrueBeam 1" value={fractionMachine} onChange={(e) => setFractionMachine(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleBulkCreate} disabled={!fractionCount || bulkCreate.isPending}>
                      {bulkCreate.isPending ? 'Creating...' : 'Generate'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowBulkForm(false)}>Cancel</Button>
                  </div>
                </div>
              )}

              {/* Fractions grid */}
              {fractions.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        <th className="text-left px-3 py-2">#</th>
                        <th className="text-left px-3 py-2">Planned Date</th>
                        <th className="text-left px-3 py-2">Actual Date</th>
                        <th className="text-left px-3 py-2">Planned Dose</th>
                        <th className="text-left px-3 py-2">Delivered Dose</th>
                        <th className="text-left px-3 py-2">Machine</th>
                        <th className="text-left px-3 py-2">Status</th>
                        <th className="text-left px-3 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fractions.map((f) => (
                        <tr key={f.id} className="border-b last:border-0 hover:bg-muted/20">
                          <td className="px-3 py-2 font-mono">{f.fraction_number}</td>
                          <td className="px-3 py-2">
                            {f.planned_date ? new Date(f.planned_date).toLocaleDateString() : '—'}
                          </td>
                          <td className="px-3 py-2">
                            {f.actual_date ? new Date(f.actual_date).toLocaleString() : '—'}
                          </td>
                          <td className="px-3 py-2">{f.planned_dose_gy != null ? `${f.planned_dose_gy} Gy` : '—'}</td>
                          <td className="px-3 py-2">{f.delivered_dose_gy != null ? `${f.delivered_dose_gy} Gy` : '—'}</td>
                          <td className="px-3 py-2">{f.treatment_machine ?? '—'}</td>
                          <td className="px-3 py-2">
                            <Badge
                              className={FRACTION_STATUS_COLORS[f.status] ?? ''}
                              variant="secondary"
                            >
                              {f.status}
                            </Badge>
                          </td>
                          <td className="px-3 py-2">
                            {(f.status === 'SCHEDULED' || f.status === 'RESCHEDULED') && (
                              <div className="flex gap-1">
                                <button
                                  className="text-green-700 hover:underline text-xs"
                                  onClick={() => handleDeliver(f)}
                                >
                                  Deliver
                                </button>
                                <span className="text-muted-foreground">·</span>
                                <button
                                  className="text-amber-700 hover:underline text-xs"
                                  onClick={() => handleMarkMissed(f)}
                                >
                                  Miss
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {fractions.length === 0 && !showBulkForm && (
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>No fractions generated yet.</p>
                  <Button size="sm" variant="outline" onClick={() => setShowBulkForm(true)}>
                    <Plus className="h-3 w-3 mr-1" />Generate Fraction Schedule
                  </Button>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}

      {/* ── On-Treatment Reviews ────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeader
            title={`On-Treatment Reviews${reviews.length > 0 ? ` (${reviews.length})` : ''}`}
            open={reviewOpen}
            onToggle={() => setReviewOpen((v) => !v)}
            action={
              !showReviewForm && (
                <Button size="sm" variant="outline" onClick={() => setShowReviewForm(true)}>
                  <Plus className="h-3 w-3 mr-1" />Add Review
                </Button>
              )
            }
          />
        </CardHeader>
        {reviewOpen && (
          <CardContent className="space-y-4 pt-0">
            {reviews.map((r) => (
              <div key={r.id} className="border rounded-md p-3 text-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{new Date(r.review_date).toLocaleDateString()}</span>
                  <div className="flex items-center gap-2">
                    {r.week_number != null && (
                      <span className="text-xs text-muted-foreground">Week {r.week_number}</span>
                    )}
                    {r.treatment_break_required && (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-xs">Break required</Badge>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-x-4 text-muted-foreground text-xs">
                  {r.toxicity_grade && <span>Toxicity: Grade {r.toxicity_grade}</span>}
                  {r.pain_score != null && <span>Pain: {r.pain_score}/10</span>}
                  {r.weight_kg != null && <span>Weight: {r.weight_kg} kg</span>}
                </div>
                {r.review_notes && <p className="text-xs text-muted-foreground mt-1">{r.review_notes}</p>}
              </div>
            ))}

            {showReviewForm && (
              <div className="border rounded-md p-4 space-y-4 bg-muted/20">
                <h4 className="font-medium text-sm">New On-Treatment Review</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Review Date *</Label>
                    <Input type="datetime-local" value={reviewDate} onChange={(e) => setReviewDate(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Week Number</Label>
                    <Input type="number" min={1} placeholder="e.g. 2" value={weekNumber} onChange={(e) => setWeekNumber(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Toxicity Grade (CTCAE)</Label>
                    <Select value={toxicityGrade || '__none'} onValueChange={(v) => setToxicityGrade(v === '__none' ? '' : v)}>
                      <SelectTrigger className="h-9"><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none">— Not assessed —</SelectItem>
                        <SelectItem value="0">Grade 0</SelectItem>
                        <SelectItem value="1">Grade 1 — Mild</SelectItem>
                        <SelectItem value="2">Grade 2 — Moderate</SelectItem>
                        <SelectItem value="3">Grade 3 — Severe</SelectItem>
                        <SelectItem value="4">Grade 4 — Life threatening</SelectItem>
                        <SelectItem value="5">Grade 5 — Death</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Pain Score (0–10)</Label>
                    <Input type="number" min={0} max={10} placeholder="0–10" value={painScore} onChange={(e) => setPainScore(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Weight (kg)</Label>
                    <Input type="number" step="0.1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={treatmentBreak} onChange={(e) => setTreatmentBreak(e.target.checked)} />
                  <Label className="text-xs">Treatment break required</Label>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Review Notes</Label>
                  <textarea
                    className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleCreateReview} disabled={!reviewDate || createReview.isPending}>
                    {createReview.isPending ? 'Saving...' : 'Save Review'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowReviewForm(false)}>Cancel</Button>
                </div>
              </div>
            )}

            {reviews.length === 0 && !showReviewForm && (
              <p className="text-sm text-muted-foreground">No on-treatment reviews recorded.</p>
            )}
          </CardContent>
        )}
      </Card>

      {/* ── Completion Summary ──────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeader
            title="Completion Summary"
            open={completionOpen}
            onToggle={() => setCompletionOpen((v) => !v)}
            action={
              !completion && !showCompletionForm && rx.status === 'ACTIVE' ? (
                <Button size="sm" variant="outline" onClick={() => setShowCompletionForm(true)}>
                  <Plus className="h-3 w-3 mr-1" />Record Completion
                </Button>
              ) : undefined
            }
          />
        </CardHeader>
        {completionOpen && (
          <CardContent className="space-y-4 pt-0">
            {completion ? (
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Completion Date</p>
                    <p className="font-medium">
                      {completion.completion_date ? new Date(completion.completion_date).toLocaleDateString() : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Delivered Dose</p>
                    <p className="font-medium">
                      {completion.delivered_total_dose_gy != null ? `${completion.delivered_total_dose_gy} Gy` : '—'}
                      {completion.planned_total_dose_gy != null && (
                        <span className="text-muted-foreground"> / {completion.planned_total_dose_gy} Gy planned</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Fractions</p>
                    <p className="font-medium">
                      {completion.delivered_fractions ?? '—'}
                      {completion.planned_fractions != null && ` / ${completion.planned_fractions} planned`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Interruptions</p>
                    <p className="font-medium">{completion.interruptions ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                {completion.acute_toxicity_summary && (
                  <div className="p-3 rounded-md bg-muted/40">
                    <p className="text-xs text-muted-foreground mb-1">Acute Toxicity Summary</p>
                    <p>{completion.acute_toxicity_summary}</p>
                  </div>
                )}
                {completion.response_assessment_plan && (
                  <div className="p-3 rounded-md bg-muted/40">
                    <p className="text-xs text-muted-foreground mb-1">Response Assessment Plan</p>
                    <p>{completion.response_assessment_plan}</p>
                  </div>
                )}
                {completion.followup_plan && (
                  <div className="p-3 rounded-md bg-muted/40">
                    <p className="text-xs text-muted-foreground mb-1">Follow-up Plan</p>
                    <p>{completion.followup_plan}</p>
                  </div>
                )}
              </div>
            ) : showCompletionForm ? (
              <div className="border rounded-md p-4 space-y-4 bg-muted/20">
                <h4 className="font-medium text-sm">Completion Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Completion Date</Label>
                    <Input type="date" value={completionDate} onChange={(e) => setCompletionDate(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Delivered Total Dose (Gy)</Label>
                    <Input type="number" step="0.01" placeholder={String(rx.total_dose_gy ?? '')} value={deliveredTotalDose} onChange={(e) => setDeliveredTotalDose(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Delivered Fractions</Label>
                    <Input type="number" placeholder={String(rx.planned_fractions ?? deliveredCount)} value={deliveredFractionsCount} onChange={(e) => setDeliveredFractionsCount(e.target.value)} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={hasInterruptions} onChange={(e) => setHasInterruptions(e.target.checked)} />
                  <Label className="text-xs">Treatment had interruptions</Label>
                </div>
                {hasInterruptions && (
                  <div className="space-y-1">
                    <Label className="text-xs">Interruption Details</Label>
                    <textarea
                      className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={interruptionNotes} onChange={(e) => setInterruptionNotes(e.target.value)}
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <Label className="text-xs">Acute Toxicity Summary</Label>
                  <textarea
                    className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Summary of acute toxicities observed during treatment..."
                    value={acuteToxicity} onChange={(e) => setAcuteToxicity(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Response Assessment Plan</Label>
                  <textarea
                    className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Post-treatment imaging, response criteria..."
                    value={responseAssessment} onChange={(e) => setResponseAssessment(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Follow-up Plan</Label>
                  <textarea
                    className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Follow-up schedule, referrals, late effects monitoring..."
                    value={followupPlan} onChange={(e) => setFollowupPlan(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleCreateCompletion} disabled={createCompletion.isPending}>
                    {createCompletion.isPending ? 'Saving...' : 'Save Completion Summary'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowCompletionForm(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {rx.status === 'ACTIVE'
                  ? 'No completion summary recorded yet. Click "Record Completion" when treatment is done.'
                  : 'No completion summary available.'}
              </p>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
