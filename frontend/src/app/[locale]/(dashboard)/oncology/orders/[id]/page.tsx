'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, ChevronRight, Clock, Plus, Trash2, XCircle, AlertTriangle, FlaskConical, Stethoscope, Activity, User, Dna } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  useChemoOrder, useApproveChemoOrder, useVerifyChemoOrder,
  useStartAdministration, useCompleteAdministration,
  useHoldChemoOrder, useCancelChemoOrder, useUpdateAdministrationProgress,
} from '@/plugins/oncology/hooks/use-oncology';
import { LoadingState, StatusBadge } from '@/plugins/oncology/components/shared';
import type {
  AdverseReaction, AdministrationDetail, DrugPreparationDetail, NurseVerificationChecklist,
} from '@/plugins/oncology/types';

const CTCAE_TYPES = [
  'Infusion reaction', 'Nausea', 'Vomiting', 'Hypotension', 'Hypersensitivity',
  'Fatigue', 'Neutropenia', 'Thrombocytopenia', 'Peripheral neuropathy', 'Alopecia',
  'Mucositis', 'Diarrhoea', 'Constipation', 'Extravasation', 'Other',
];

const NURSE_CHECKLIST_ITEMS: { key: keyof NurseVerificationChecklist; label: string }[] = [
  { key: 'patientIdentityConfirmed', label: 'Patient identity confirmed (2-factor: name + DOB / MRN)' },
  { key: 'drugMatchesProtocol', label: 'Drug name matches protocol order' },
  { key: 'doseMatchesOrder', label: 'Dose and concentration verified against order' },
  { key: 'routeCorrect', label: 'Route of administration correct' },
  { key: 'timeCorrect', label: 'Administration time within scheduled window' },
  { key: 'expiryChecked', label: 'Drug expiry date verified' },
  { key: 'allergyConfirmed', label: 'Allergy status re-confirmed at bedside' },
  { key: 'infusionLinePatent', label: 'IV line patency confirmed (flushed, no infiltration)' },
  { key: 'patientEducated', label: 'Patient educated on drugs being given and side effects' },
];

const emptyNurseChecklist = (): NurseVerificationChecklist => ({
  patientIdentityConfirmed: false,
  drugMatchesProtocol: false,
  doseMatchesOrder: false,
  routeCorrect: false,
  timeCorrect: false,
  expiryChecked: false,
  allergyConfirmed: false,
  infusionLinePatent: false,
  patientEducated: false,
});

function WorkflowHistory({ order }: { order: NonNullable<ReturnType<typeof useChemoOrder>['data']> }) {
  const steps = [
    { label: 'Ordered', done: true, at: order.created_at },
    { label: 'Approved', done: !!order.approved_at, at: order.approved_at },
    { label: 'Verified', done: !!order.verified_at, at: order.verified_at, extra: order.second_verified_by ? '2nd nurse signed' : undefined },
    { label: 'Administered', done: !!order.administered_at, at: order.administered_at },
  ];
  return (
    <div className="flex gap-4 flex-wrap">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          {step.done ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-muted-foreground/40" />}
          <div>
            <div className={step.done ? 'font-medium' : 'text-muted-foreground'}>{step.label}</div>
            {step.done && step.at && <div className="text-muted-foreground">{new Date(step.at).toLocaleString()}</div>}
            {step.done && step.extra && <div className="text-muted-foreground">{step.extra}</div>}
          </div>
          {i < steps.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground/40" />}
        </div>
      ))}
    </div>
  );
}

function ctcaeBadgeClass(grade: number) {
  if (grade >= 4) return 'bg-red-100 text-red-700';
  if (grade === 3) return 'bg-orange-100 text-orange-700';
  return 'bg-yellow-100 text-yellow-700';
}

export default function ChemoOrderDetailPage({ params }: { params: { locale: string; id: string } }) {
  const router = useRouter();
  const back = () => router.push(`/${params.locale}/oncology/orders`);
  const { data: order, isLoading } = useChemoOrder(params.id);

  const approve = useApproveChemoOrder();
  const verify = useVerifyChemoOrder();
  const start = useStartAdministration();
  const complete = useCompleteAdministration();
  const progress = useUpdateAdministrationProgress();
  const hold = useHoldChemoOrder();
  const cancel = useCancelChemoOrder();

  // Hold / Cancel
  const [holdReason, setHoldReason] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [showHoldForm, setShowHoldForm] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);

  // ── Drug Preparation + Nurse Verification (status: approved) ──────────
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  const [drugPrep, setDrugPrep] = useState<DrugPreparationDetail[]>([]);
  const [nurseChecklist, setNurseChecklist] = useState<NurseVerificationChecklist>(emptyNurseChecklist());
  const [secondVerifiedBy, setSecondVerifiedBy] = useState('');

  // ── Administration progress (status: in_progress) ────────────────────
  const [adminDetails, setAdminDetails] = useState<AdministrationDetail[]>([]);
  const [adverseReactions, setAdverseReactions] = useState<AdverseReaction[]>([]);
  const [showAdverseForm, setShowAdverseForm] = useState(false);

  // ── Complete Administration ───────────────────────────────────────────
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [completeNotes, setCompleteNotes] = useState('');

  // Seed administration details from order when available
  useEffect(() => {
    if (!order) return;
    if (order.administration_details?.length) {
      setAdminDetails(order.administration_details as AdministrationDetail[]);
    }
    if (order.adverse_reactions?.length) {
      setAdverseReactions(order.adverse_reactions as AdverseReaction[]);
    }
  }, [order?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) return <LoadingState />;
  if (!order) return <div className="p-8 text-muted-foreground">Order not found.</div>;

  const status = order.status;
  const isMutating = approve.isPending || verify.isPending || start.isPending || complete.isPending || progress.isPending || hold.isPending || cancel.isPending;

  const regimenDrugs = (order.protocol_regimen ?? []).map((d) => d.drug);
  const checklist = (order.pre_chemo_checklist ?? {}) as Record<string, unknown>;

  const checklistItems = [
    { key: 'consentDocumented', label: 'Informed consent documented' },
    { key: 'allergiesReviewed', label: 'Allergies reviewed' },
    { key: 'labsReviewed', label: 'Labs reviewed' },
    { key: 'labsWithinRange', label: 'Labs within acceptable range' },
    { key: 'bsaVerified', label: 'BSA / weight verified' },
    { key: 'doseVerified', label: 'Doses verified' },
    { key: 'premedicationsOrdered', label: 'Pre-medications ordered' },
  ];

  const initDrugPrep = () => {
    setDrugPrep(regimenDrugs.map((d) => ({
      drug: d,
      preparedBy: '',
      preparedAt: new Date().toISOString().slice(0, 16),
      lotNumber: '',
      expiryDate: '',
      diluent: '',
      finalVolumeMl: undefined,
    })));
    setNurseChecklist(emptyNurseChecklist());
    setShowVerifyForm(true);
  };

  const initAdminDetails = () => {
    const existing = (order.administration_details ?? []) as AdministrationDetail[];
    const now = new Date().toISOString().slice(0, 16);
    const seeded = regimenDrugs.map((d) => {
      const ex = existing.find((x) => x.drug === d);
      return ex ?? { drug: d, startedAt: now };
    });
    setAdminDetails(seeded);
  };

  const nurseChecklistAllPassed = NURSE_CHECKLIST_ITEMS.every((item) => nurseChecklist[item.key]);

  function updateDrugPrep(i: number, field: keyof DrugPreparationDetail, value: string | number) {
    setDrugPrep((p) => p.map((x, idx) => idx === i ? { ...x, [field]: value } : x));
  }

  function updateAdminDetail(i: number, field: keyof AdministrationDetail, value: string | number) {
    setAdminDetails((p) => p.map((x, idx) => idx === i ? { ...x, [field]: value } : x));
  }

  function updateAdverseReaction(i: number, field: keyof AdverseReaction, value: string | number) {
    setAdverseReactions((p) => p.map((x, idx) => idx === i ? { ...x, [field]: value } : x));
  }

  function markDrugStarted(i: number) {
    updateAdminDetail(i, 'startedAt', new Date().toISOString().slice(0, 16));
  }

  function markDrugCompleted(i: number) {
    updateAdminDetail(i, 'completedAt', new Date().toISOString().slice(0, 16));
  }

  function saveProgress() {
    progress.mutate({ id: params.id, data: { administrationDetails: adminDetails, adverseReactions } });
  }

  const worstCtcaeGrade = adverseReactions.length
    ? Math.max(...adverseReactions.map((r) => r.ctcaeGrade))
    : 0;

  const patient = order.patientDisplay;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={back}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Chemo Order</h1>
          <p className="text-muted-foreground text-sm font-mono">
            {order.protocol_code} · C{order.cycle_number} D{order.day_number} · {order.scheduled_date}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Context banner — Patient + Cancer Diagnosis */}
      <div className="grid grid-cols-2 gap-4">
        {/* Blue patient card */}
        <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:border-blue-900/40 dark:from-blue-950/40 dark:to-indigo-950/40 p-4">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/60 dark:bg-blue-900/20" />
          <div className="relative space-y-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/50">
                <User className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider">Patient</span>
            </div>
            <p className="text-base font-bold text-foreground leading-tight">
              {patient?.displayName || '—'}
            </p>
            <div className="flex flex-wrap gap-2">
              {patient?.mrn && (
                <span className="inline-flex items-center rounded-md bg-blue-100/70 dark:bg-blue-900/40 px-2 py-0.5 text-xs font-mono font-medium text-blue-700 dark:text-blue-300">
                  {patient.mrn}
                </span>
              )}
              {patient?.age != null && (
                <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 text-xs text-muted-foreground">
                  {patient.age} yrs
                </span>
              )}
              {patient?.gender && (
                <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 text-xs capitalize text-muted-foreground">
                  {patient.gender}
                </span>
              )}
              {patient?.phoneNumber && (
                <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 text-xs text-muted-foreground">
                  {patient.phoneNumber}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Rose/purple cancer diagnosis card */}
        <div className="relative overflow-hidden rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-purple-50 dark:border-rose-900/40 dark:from-rose-950/40 dark:to-purple-950/40 p-4">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-rose-100/60 dark:bg-rose-900/20" />
          <div className="relative space-y-2">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-100 dark:bg-rose-900/50">
                <Dna className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider">Cancer Diagnosis</span>
            </div>
            <p className="text-base font-bold text-foreground leading-tight">
              {order.cancer_type || '—'}
            </p>
            <div className="flex flex-wrap gap-2">
              {order.primary_site && (
                <span className="inline-flex items-center rounded-md bg-rose-100/70 dark:bg-rose-900/40 px-2 py-0.5 text-xs font-medium text-rose-700 dark:text-rose-300">
                  {order.primary_site}
                  {order.primary_site_code && (
                    <span className="font-mono ml-1 opacity-70">({order.primary_site_code})</span>
                  )}
                </span>
              )}
              {order.laterality && order.laterality !== 'not_applicable' && (
                <span className="inline-flex items-center rounded-md bg-white/70 dark:bg-white/10 border border-rose-100 dark:border-rose-900/50 px-2 py-0.5 text-xs capitalize text-muted-foreground">
                  {order.laterality}
                </span>
              )}
              {order.metastatic_status && order.metastatic_status !== 'unknown' && (
                <span className="inline-flex items-center rounded-md bg-amber-100/70 dark:bg-amber-900/30 px-2 py-0.5 text-xs capitalize font-medium text-amber-700 dark:text-amber-400">
                  {order.metastatic_status}
                </span>
              )}
              {order.clinical_status && (
                <span className="inline-flex items-center rounded-md bg-emerald-100/70 dark:bg-emerald-900/30 px-2 py-0.5 text-xs capitalize font-medium text-emerald-700 dark:text-emerald-400">
                  {order.clinical_status}
                </span>
              )}
              {order.diagnosis_grade && (
                <span className="inline-flex items-center gap-1 rounded-md bg-purple-100/70 dark:bg-purple-900/30 px-2 py-0.5 text-xs font-medium text-purple-700 dark:text-purple-300">
                  <span className="opacity-70">Grade</span> {order.diagnosis_grade}
                </span>
              )}
              {order.diagnosis_histology && (
                <span className="inline-flex items-center gap-1 rounded-md bg-white/70 dark:bg-white/10 border border-rose-100 dark:border-rose-900/50 px-2 py-0.5 text-xs text-muted-foreground">
                  <span className="opacity-70">Histology</span>
                  <span className="font-medium text-foreground">{order.diagnosis_histology}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── PENDING: Approve ── */}
      {status === 'pending' && (
        <Card className="border-blue-200 bg-blue-50/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />Pharmacist / Physician Approval
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Review the order summary, protocol regimen, dose calculations, and pre-chemo checklist below before approving.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => approve.mutate(params.id)} disabled={isMutating}>
                <CheckCircle className="h-4 w-4 mr-2" />Approve Order
              </Button>
              {!showHoldForm && !showCancelForm && (
                <>
                  <Button variant="outline" onClick={() => setShowHoldForm(true)} disabled={isMutating}>Hold</Button>
                  <Button variant="outline" className="text-destructive hover:text-destructive" onClick={() => setShowCancelForm(true)} disabled={isMutating}>
                    <XCircle className="h-4 w-4 mr-2" />Cancel
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── APPROVED: Drug Preparation + Nurse Verification ── */}
      {status === 'approved' && !showVerifyForm && (
        <Card className="border-violet-200 bg-violet-50/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-violet-600" />Drug Preparation &amp; Nurse Verification Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Order approved. Pharmacist must document drug preparation, then nurse completes the 5-Rights bedside verification before administration can begin.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={initDrugPrep} disabled={isMutating}>
                <FlaskConical className="h-4 w-4 mr-2" />Start Drug Prep &amp; Verification
              </Button>
              {!showHoldForm && !showCancelForm && (
                <>
                  <Button variant="outline" onClick={() => setShowHoldForm(true)} disabled={isMutating}>Hold</Button>
                  <Button variant="outline" className="text-destructive hover:text-destructive" onClick={() => setShowCancelForm(true)} disabled={isMutating}>
                    <XCircle className="h-4 w-4 mr-2" />Cancel
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {status === 'approved' && showVerifyForm && (
        <Card className="border-violet-200 bg-violet-50/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-violet-600" />Drug Preparation &amp; Nurse Verification
            </CardTitle>
            <p className="text-xs text-muted-foreground">ASCO/ONS — document preparation details and complete bedside 5-Rights check</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Drug Preparation */}
            <div>
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-violet-600" />Step 1 — Pharmacist Drug Preparation
              </h3>
              <div className="space-y-3">
                {drugPrep.map((dp, i) => (
                  <div key={i} className="border rounded-lg p-3 space-y-2 bg-background">
                    <div className="font-medium text-sm text-violet-700">{dp.drug}</div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Prepared by</Label>
                        <Input className="h-8" placeholder="Pharmacist name / ID" value={dp.preparedBy} onChange={(e) => updateDrugPrep(i, 'preparedBy', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Prepared at</Label>
                        <Input className="h-8" type="datetime-local" value={dp.preparedAt} onChange={(e) => updateDrugPrep(i, 'preparedAt', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Lot number</Label>
                        <Input className="h-8" placeholder="e.g. LOT-2024-001" value={dp.lotNumber ?? ''} onChange={(e) => updateDrugPrep(i, 'lotNumber', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Expiry date</Label>
                        <Input className="h-8" type="date" value={dp.expiryDate ?? ''} onChange={(e) => updateDrugPrep(i, 'expiryDate', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Diluent</Label>
                        <Input className="h-8" placeholder="e.g. 250 mL NS" value={dp.diluent ?? ''} onChange={(e) => updateDrugPrep(i, 'diluent', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Final volume (mL)</Label>
                        <Input className="h-8" type="number" placeholder="e.g. 250" value={dp.finalVolumeMl ?? ''} onChange={(e) => updateDrugPrep(i, 'finalVolumeMl', parseFloat(e.target.value))} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nurse Bedside Verification */}
            <div>
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-blue-600" />Step 2 — Nurse Bedside Verification (5 Rights)
              </h3>
              <div className="border rounded-lg divide-y bg-background">
                {NURSE_CHECKLIST_ITEMS.map((item) => (
                  <div key={item.key} className="flex items-center gap-3 px-3 py-2.5">
                    <Checkbox
                      id={`nvc-${item.key}`}
                      checked={nurseChecklist[item.key]}
                      onChange={(e) => setNurseChecklist((p) => ({ ...p, [item.key]: e.target.checked }))}
                    />
                    <label htmlFor={`nvc-${item.key}`} className={`text-sm cursor-pointer ${nurseChecklist[item.key] ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {item.label}
                    </label>
                    {nurseChecklist[item.key] && <CheckCircle className="h-3.5 w-3.5 text-green-500 ml-auto flex-shrink-0" />}
                  </div>
                ))}
              </div>
              {!nurseChecklistAllPassed && (
                <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" />All checklist items must be confirmed before verifying.
                </p>
              )}
            </div>

            {/* Second Nurse */}
            <div>
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-blue-600" />Step 3 — Second Nurse / Independent Check (Optional)
              </h3>
              <div className="flex items-center gap-3">
                <Input className="w-60" placeholder="Second nurse name / ID" value={secondVerifiedBy} onChange={(e) => setSecondVerifiedBy(e.target.value)} />
                <span className="text-xs text-muted-foreground">Required if dual-sign is enabled for this protocol</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <Button
                onClick={() => verify.mutate({
                  id: params.id,
                  secondVerifiedBy: secondVerifiedBy || undefined,
                  nurseVerificationChecklist: nurseChecklist as unknown as Record<string, unknown>,
                  drugPreparationDetails: drugPrep,
                })}
                disabled={isMutating || !nurseChecklistAllPassed}
              >
                <CheckCircle className="h-4 w-4 mr-2" />Complete Verification
              </Button>
              <Button variant="outline" onClick={() => setShowVerifyForm(false)}>Back</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── VERIFIED: Start Administration ── */}
      {status === 'verified' && (
        <Card className="border-green-200 bg-green-50/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-600" />Ready for Administration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Order verified. Click Start Administration to begin the infusion and open the live drug tracking view.</p>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => { start.mutate(params.id); initAdminDetails(); }} disabled={isMutating}>
                <Activity className="h-4 w-4 mr-2" />Start Administration
              </Button>
              {!showHoldForm && !showCancelForm && (
                <>
                  <Button variant="outline" onClick={() => setShowHoldForm(true)} disabled={isMutating}>Hold</Button>
                  <Button variant="outline" className="text-destructive hover:text-destructive" onClick={() => setShowCancelForm(true)} disabled={isMutating}>
                    <XCircle className="h-4 w-4 mr-2" />Cancel
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── IN PROGRESS: Live Administration Tracker ── */}
      {status === 'in_progress' && (
        <Card className="border-blue-200 bg-blue-50/10">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600 animate-pulse" />Administration In Progress
              </CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={saveProgress} disabled={isMutating}>Save Progress</Button>
                {!showCompleteForm && (
                  <Button size="sm" onClick={() => setShowCompleteForm(true)}>
                    <CheckCircle className="h-4 w-4 mr-2" />Complete Cycle
                  </Button>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Started: {order.administered_at ? new Date(order.administered_at).toLocaleString() : '—'}</p>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Per-drug tracker */}
            <div>
              <h3 className="font-semibold text-sm mb-3">Drug-by-Drug Administration</h3>
              <div className="space-y-3">
                {adminDetails.map((d, i) => {
                  const isStarted = !!d.startedAt;
                  const isComplete = !!d.completedAt;
                  return (
                    <div key={i} className={`border rounded-lg p-3 space-y-2 ${isComplete ? 'border-green-200 bg-green-50/20' : isStarted ? 'border-blue-200 bg-blue-50/10' : 'bg-muted/10'}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{d.drug}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${isComplete ? 'bg-green-100 text-green-700' : isStarted ? 'bg-blue-100 text-blue-700' : 'bg-muted text-muted-foreground'}`}>
                          {isComplete ? 'Completed' : isStarted ? 'Infusing' : 'Pending'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <div className="space-y-1">
                          <Label className="text-xs">Started at</Label>
                          <Input className="h-8" type="datetime-local" value={d.startedAt ?? ''} onChange={(e) => updateAdminDetail(i, 'startedAt', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Completed at</Label>
                          <Input className="h-8" type="datetime-local" value={d.completedAt ?? ''} onChange={(e) => updateAdminDetail(i, 'completedAt', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Rate (mL/hr)</Label>
                          <Input className="h-8" type="number" placeholder="e.g. 100" value={d.ratePerHour ?? ''} onChange={(e) => updateAdminDetail(i, 'ratePerHour', parseFloat(e.target.value))} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">IV Access Site</Label>
                          <Input className="h-8" placeholder="e.g. Right AC" value={d.accessSite ?? ''} onChange={(e) => updateAdminDetail(i, 'accessSite', e.target.value)} />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        {!isStarted && (
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => markDrugStarted(i)}>
                            Mark Started Now
                          </Button>
                        )}
                        {isStarted && !isComplete && (
                          <Button size="sm" variant="outline" className="h-7 text-xs border-green-300 text-green-700 hover:bg-green-50" onClick={() => markDrugCompleted(i)}>
                            <CheckCircle className="h-3 w-3 mr-1" />Mark Completed Now
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mid-infusion adverse reactions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />Adverse Reactions
                  {adverseReactions.length > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${ctcaeBadgeClass(worstCtcaeGrade)}`}>
                      Worst: Grade {worstCtcaeGrade}
                    </span>
                  )}
                </h3>
                <Button type="button" size="sm" variant="outline" onClick={() => {
                  setAdverseReactions((p) => [...p, { drug: regimenDrugs[0] ?? '', ctcaeGrade: 1, type: '', onsetTime: new Date().toISOString().slice(0, 16), description: '' }]);
                  setShowAdverseForm(true);
                }}>
                  <Plus className="h-4 w-4 mr-1" />Report Reaction
                </Button>
              </div>
              {adverseReactions.length === 0 ? (
                <p className="text-xs text-muted-foreground">No adverse reactions reported</p>
              ) : (
                <div className="space-y-2">
                  {adverseReactions.map((ar, i) => (
                    <div key={i} className="border rounded-lg p-2 grid grid-cols-5 gap-2 items-center">
                      <Select value={ar.drug || regimenDrugs[0]} onValueChange={(v) => updateAdverseReaction(i, 'drug', v)}>
                        <SelectTrigger className="h-8"><SelectValue placeholder="Drug" /></SelectTrigger>
                        <SelectContent>{regimenDrugs.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                      </Select>
                      <Select value={ar.ctcaeGrade?.toString()} onValueChange={(v) => updateAdverseReaction(i, 'ctcaeGrade', parseInt(v, 10) as AdverseReaction['ctcaeGrade'])}>
                        <SelectTrigger className="h-8"><SelectValue placeholder="Grade" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Grade 1 — Mild</SelectItem>
                          <SelectItem value="2">Grade 2 — Moderate</SelectItem>
                          <SelectItem value="3">Grade 3 — Severe</SelectItem>
                          <SelectItem value="4">Grade 4 — Life-threatening</SelectItem>
                          <SelectItem value="5">Grade 5 — Fatal</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={ar.type || '__none'} onValueChange={(v) => updateAdverseReaction(i, 'type', v === '__none' ? '' : v)}>
                        <SelectTrigger className="h-8"><SelectValue placeholder="Type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none">— Type —</SelectItem>
                          {CTCAE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Input className="h-8" placeholder="Description" value={ar.description} onChange={(e) => updateAdverseReaction(i, 'description', e.target.value)} />
                      <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" onClick={() => setAdverseReactions((p) => p.filter((_, idx) => idx !== i))}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {adverseReactions.length > 0 && (
                <Button size="sm" variant="outline" className="mt-2" onClick={saveProgress} disabled={isMutating}>
                  Save Reactions
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── COMPLETE CYCLE FORM ── */}
      {status === 'in_progress' && showCompleteForm && (
        <Card className="border-green-300 bg-green-50/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />Complete Cycle — Final Record
            </CardTitle>
            <p className="text-xs text-muted-foreground">Confirm per-drug administration times and adverse reactions, then submit to close this cycle.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Final drug times review */}
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-2 font-medium text-xs">Drug</th>
                    <th className="text-left p-2 font-medium text-xs">Started</th>
                    <th className="text-left p-2 font-medium text-xs">Completed</th>
                    <th className="text-left p-2 font-medium text-xs">Rate (mL/hr)</th>
                    <th className="text-left p-2 font-medium text-xs">IV Site</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {adminDetails.map((d, i) => (
                    <tr key={i}>
                      <td className="p-2 font-medium">{d.drug}</td>
                      <td className="p-2 text-xs"><Input className="h-7" type="datetime-local" value={d.startedAt ?? ''} onChange={(e) => updateAdminDetail(i, 'startedAt', e.target.value)} /></td>
                      <td className="p-2 text-xs"><Input className="h-7" type="datetime-local" value={d.completedAt ?? ''} onChange={(e) => updateAdminDetail(i, 'completedAt', e.target.value)} /></td>
                      <td className="p-2 text-xs"><Input className="h-7" type="number" placeholder="—" value={d.ratePerHour ?? ''} onChange={(e) => updateAdminDetail(i, 'ratePerHour', parseFloat(e.target.value))} /></td>
                      <td className="p-2 text-xs"><Input className="h-7" placeholder="—" value={d.accessSite ?? ''} onChange={(e) => updateAdminDetail(i, 'accessSite', e.target.value)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Adverse reactions summary */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="font-semibold">Adverse Reactions (CTCAE)</Label>
                <Button type="button" size="sm" variant="ghost" onClick={() => setAdverseReactions((p) => [...p, { drug: regimenDrugs[0] ?? '', ctcaeGrade: 1, type: '', onsetTime: '', description: '' }])}>
                  <Plus className="h-4 w-4 mr-1" />Add
                </Button>
              </div>
              {adverseReactions.length === 0 && <p className="text-xs text-muted-foreground">No adverse reactions to report</p>}
              {adverseReactions.map((ar, i) => (
                <div key={i} className="grid grid-cols-5 gap-2 items-center mt-2">
                  <Select value={ar.drug || regimenDrugs[0]} onValueChange={(v) => updateAdverseReaction(i, 'drug', v)}>
                    <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>{regimenDrugs.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={ar.ctcaeGrade?.toString()} onValueChange={(v) => updateAdverseReaction(i, 'ctcaeGrade', parseInt(v, 10) as AdverseReaction['ctcaeGrade'])}>
                    <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((g) => <SelectItem key={g} value={g.toString()}>Grade {g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={ar.type || '__none'} onValueChange={(v) => updateAdverseReaction(i, 'type', v === '__none' ? '' : v)}>
                    <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none">— Type —</SelectItem>
                      {CTCAE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input className="h-8" placeholder="Description" value={ar.description} onChange={(e) => updateAdverseReaction(i, 'description', e.target.value)} />
                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" onClick={() => setAdverseReactions((p) => p.filter((_, idx) => idx !== i))}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Completion Notes</Label>
              <textarea className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={completeNotes} onChange={(e) => setCompleteNotes(e.target.value)} placeholder="Patient tolerance, observations, follow-up actions..." />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => complete.mutate({
                  id: params.id,
                  data: { administrationDetails: adminDetails, adverseReactions, notes: completeNotes || undefined },
                })}
                disabled={isMutating}
              >
                <CheckCircle className="h-4 w-4 mr-2" />Mark Cycle Complete
              </Button>
              <Button variant="outline" onClick={() => setShowCompleteForm(false)}>Back</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── HOLD FORM ── */}
      {showHoldForm && (
        <Card className="border-amber-200 bg-amber-50/30">
          <CardContent className="pt-4 space-y-3">
            <Label>Reason for hold</Label>
            <Input value={holdReason} onChange={(e) => setHoldReason(e.target.value)} placeholder="e.g. Lab values out of range, patient unwell" />
            <div className="flex gap-2">
              <Button size="sm" onClick={() => { hold.mutate({ id: params.id, reason: holdReason }); setShowHoldForm(false); }} disabled={isMutating}>Confirm Hold</Button>
              <Button size="sm" variant="outline" onClick={() => setShowHoldForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── CANCEL FORM ── */}
      {showCancelForm && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="pt-4 space-y-3">
            <Label>Reason for cancellation</Label>
            <Input value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="e.g. Patient declined, adverse reaction, contraindication found" />
            <div className="flex gap-2">
              <Button size="sm" variant="destructive" onClick={() => { cancel.mutate({ id: params.id, reason: cancelReason }); setShowCancelForm(false); }} disabled={isMutating}>Confirm Cancel</Button>
              <Button size="sm" variant="outline" onClick={() => setShowCancelForm(false)}>Back</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── HELD ── */}
      {status === 'held' && (
        <Card className="border-amber-200 bg-amber-50/30">
          <CardContent className="pt-4 space-y-3">
            <p className="text-sm font-medium text-amber-700">Order is on hold.</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => hold.mutate({ id: params.id, reason: 'Re-activated' })} disabled={isMutating}>Re-activate</Button>
              <Button variant="outline" className="text-destructive hover:text-destructive" onClick={() => cancel.mutate({ id: params.id })} disabled={isMutating}>Cancel Order</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── COMPLETED: Cycle Summary ── */}
      {status === 'completed' && (
        <Card className="border-green-300 bg-green-50/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />Cycle {order.cycle_number} Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-muted-foreground">Protocol</div>
              <div className="font-mono font-semibold">{order.protocol_code}</div>
              <div className="text-muted-foreground">Cycle / Day</div>
              <div>C{order.cycle_number} / D{order.day_number}</div>
              <div className="text-muted-foreground">Administered</div>
              <div>{order.administered_at ? new Date(order.administered_at).toLocaleString() : '—'}</div>
              <div className="text-muted-foreground">Adverse Reactions</div>
              <div>
                {(order.adverse_reactions as AdverseReaction[])?.length > 0 ? (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${ctcaeBadgeClass(Math.max(...(order.adverse_reactions as AdverseReaction[]).map((r) => r.ctcaeGrade)))}`}>
                    {(order.adverse_reactions as AdverseReaction[]).length} reaction(s) · worst Grade {Math.max(...(order.adverse_reactions as AdverseReaction[]).map((r) => r.ctcaeGrade))}
                  </span>
                ) : (
                  <span className="text-green-600">None reported</span>
                )}
              </div>
            </div>
            {order.notes && <div className="pt-2 border-t text-muted-foreground text-xs">{order.notes}</div>}
          </CardContent>
        </Card>
      )}

      {/* ── ORDER DETAILS GRID ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Order Summary */}
        <Card>
          <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-muted-foreground">Patient</div>
              <div>{order.patientDisplay?.displayName ?? '—'}{order.patientDisplay?.mrn ? ` (MRN: ${order.patientDisplay.mrn})` : ''}</div>
              <div className="text-muted-foreground">Cancer Type</div>
              <div>{order.cancer_type ?? '—'}</div>
              <div className="text-muted-foreground">Protocol</div>
              <div className="font-mono font-semibold">{order.protocol_code} — {order.protocol_name}</div>
              <div className="text-muted-foreground">Cycle / Day</div>
              <div>C{order.cycle_number} / D{order.day_number}</div>
              <div className="text-muted-foreground">Scheduled</div>
              <div>{order.scheduled_date}</div>
              <div className="text-muted-foreground">BSA</div>
              <div>{order.bsa ? `${order.bsa} m²` : '—'} {order.weight ? `· ${order.weight} kg` : ''} {order.height ? `· ${order.height} cm` : ''}</div>
              <div className="text-muted-foreground">Creatinine Cl.</div>
              <div>{order.creatinine_clearance ? `${order.creatinine_clearance} mL/min` : '—'}</div>
              <div className="text-muted-foreground">Hepatic</div>
              <div className="capitalize">{order.hepatic_adjustment_grade?.replace(/_/g, ' ') ?? 'Normal'}</div>
              <div className="text-muted-foreground">Renal</div>
              <div className="capitalize">{order.renal_adjustment_grade?.replace(/_/g, ' ') ?? 'Normal'}</div>
            </div>
            {order.notes && (
              <div className="pt-2 border-t">
                <div className="text-muted-foreground text-xs mb-1">Notes</div>
                <div className="text-sm whitespace-pre-wrap">{order.notes}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Protocol Regimen */}
        {order.protocol_regimen && order.protocol_regimen.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Protocol Regimen</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {order.protocol_regimen.map((drug, i) => (
                  <div key={i} className="flex items-center justify-between text-sm border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <span className="font-medium">{drug.drug}</span>
                      <span className="text-muted-foreground ml-2 text-xs">{drug.route} · Day {Array.isArray(drug.day) ? drug.day.join(', ') : drug.day}</span>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <div>{drug.dose} {drug.unit} ({drug.doseFormula})</div>
                      {drug.infusionDurationMin && <div>{drug.infusionDurationMin} min infusion</div>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pre-Chemo Checklist */}
        <Card>
          <CardHeader><CardTitle>Pre-Chemo Safety Checklist</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {checklistItems.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                {checklist[key]
                  ? <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  : <XCircle className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />}
                <span className={checklist[key] ? '' : 'text-muted-foreground'}>{label}</span>
              </div>
            ))}
            {(!!checklist.consentDate || !!checklist.allergiesSummary || !!checklist.labsDate) && (
              <div className="pt-2 border-t text-xs text-muted-foreground space-y-1">
                {!!checklist.consentDate && <div>Consent date: {String(checklist.consentDate)}</div>}
                {!!checklist.allergiesSummary && <div>Allergies: {String(checklist.allergiesSummary)}</div>}
                {!!checklist.labsDate && <div>Labs date: {String(checklist.labsDate)}</div>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dose Adjustments */}
        {Array.isArray(order.dose_adjustments) && order.dose_adjustments.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Dose Adjustments</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {(order.dose_adjustments as { drug: string; adjustmentPercent: number; reason: string }[]).map((adj, i) => (
                <div key={i} className="flex justify-between border-b pb-2 last:border-0 last:pb-0">
                  <span className="font-medium">{adj.drug}</span>
                  <span className="text-muted-foreground">{adj.adjustmentPercent}% — {adj.reason}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Workflow History */}
      <Card>
        <CardHeader><CardTitle>Workflow History</CardTitle></CardHeader>
        <CardContent><WorkflowHistory order={order} /></CardContent>
      </Card>

      {/* Nurse Verification Checklist (read-only when verified/beyond) */}
      {['verified', 'in_progress', 'completed'].includes(status) && order.nurse_verification_checklist && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />Nurse Verification Record (5 Rights)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            {NURSE_CHECKLIST_ITEMS.map((item) => {
              const checked = !!(order.nurse_verification_checklist as unknown as Record<string, boolean>)?.[item.key];
              return (
                <div key={item.key} className="flex items-center gap-2">
                  {checked ? <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" /> : <XCircle className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />}
                  <span className={checked ? '' : 'text-muted-foreground'}>{item.label}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Drug Preparation Details (read-only when verified/beyond) */}
      {['verified', 'in_progress', 'completed'].includes(status) && Array.isArray(order.drug_preparation_details) && order.drug_preparation_details.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />Drug Preparation Record
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-2 font-medium text-xs">Drug</th>
                    <th className="text-left p-2 font-medium text-xs">Prepared by</th>
                    <th className="text-left p-2 font-medium text-xs">Prepared at</th>
                    <th className="text-left p-2 font-medium text-xs">Lot / Expiry</th>
                    <th className="text-left p-2 font-medium text-xs">Diluent / Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(order.drug_preparation_details as DrugPreparationDetail[]).map((dp, i) => (
                    <tr key={i}>
                      <td className="p-2 font-medium">{dp.drug}</td>
                      <td className="p-2 text-xs text-muted-foreground">{dp.preparedBy || '—'}</td>
                      <td className="p-2 text-xs text-muted-foreground">{dp.preparedAt ? new Date(dp.preparedAt).toLocaleString() : '—'}</td>
                      <td className="p-2 text-xs">
                        {dp.lotNumber && <div>Lot: {dp.lotNumber}</div>}
                        {dp.expiryDate && <div className="text-muted-foreground">Exp: {dp.expiryDate}</div>}
                      </td>
                      <td className="p-2 text-xs">
                        {dp.diluent && <div>{dp.diluent}</div>}
                        {dp.finalVolumeMl && <div className="text-muted-foreground">{dp.finalVolumeMl} mL</div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Administration Details (read-only completed) */}
      {status === 'completed' && Array.isArray(order.administration_details) && order.administration_details.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Administration Timeline</CardTitle></CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-2 font-medium text-xs">Drug</th>
                    <th className="text-left p-2 font-medium text-xs">Started</th>
                    <th className="text-left p-2 font-medium text-xs">Completed</th>
                    <th className="text-left p-2 font-medium text-xs">Rate</th>
                    <th className="text-left p-2 font-medium text-xs">IV Site</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(order.administration_details as AdministrationDetail[]).map((d, i) => (
                    <tr key={i}>
                      <td className="p-2 font-medium">{d.drug}</td>
                      <td className="p-2 text-xs text-muted-foreground">{d.startedAt ? new Date(d.startedAt).toLocaleString() : '—'}</td>
                      <td className="p-2 text-xs text-muted-foreground">{d.completedAt ? new Date(d.completedAt).toLocaleString() : '—'}</td>
                      <td className="p-2 text-xs">{d.ratePerHour ? `${d.ratePerHour} mL/hr` : '—'}</td>
                      <td className="p-2 text-xs">{d.accessSite ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Adverse Reactions (read-only completed or in_progress summary) */}
      {Array.isArray(order.adverse_reactions) && order.adverse_reactions.length > 0 && status !== 'in_progress' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />Adverse Reactions (CTCAE)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-2 font-medium text-xs">Drug</th>
                    <th className="text-left p-2 font-medium text-xs">CTCAE Grade</th>
                    <th className="text-left p-2 font-medium text-xs">Type</th>
                    <th className="text-left p-2 font-medium text-xs">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(order.adverse_reactions as AdverseReaction[]).map((ar, i) => (
                    <tr key={i}>
                      <td className="p-2">{ar.drug}</td>
                      <td className="p-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${ctcaeBadgeClass(ar.ctcaeGrade)}`}>Grade {ar.ctcaeGrade}</span>
                      </td>
                      <td className="p-2 text-muted-foreground text-xs">{ar.type}</td>
                      <td className="p-2 text-xs">{ar.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
