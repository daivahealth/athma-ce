'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  useCreateTreatmentPlan, useOncologyCarePlan, useOncologyCarePlans, useProtocol, useProtocols, useTreatmentPlans,
} from '@/plugins/oncology/hooks/use-oncology';
import { SchedulePreview } from '@/plugins/oncology/components/protocol-builder/SchedulePreview';
import { getProtocolPhases, totalCycles } from '@/plugins/oncology/lib/protocol-phases';
import { todayIso } from '@/plugins/oncology/lib/treatment-day';
import type { ChemoProtocol, OncologyCarePlan } from '@/plugins/oncology/types';

const mosteller = (h: number, w: number) => Math.round(Math.sqrt((h * w) / 3600) * 100) / 100;
const chemoModality = (cp?: OncologyCarePlan) =>
  cp?.planned_modalities?.find((m) => m.modality === 'chemotherapy');

export default function NewTreatmentPlanPage() {
  const params = useParams() as { locale: string };
  const search = useSearchParams();
  const router = useRouter();
  const create = useCreateTreatmentPlan();

  const [carePlanId, setCarePlanId] = useState(search.get('carePlanId') ?? '');
  const [protocolId, setProtocolId] = useState('');
  const [startDate, setStartDate] = useState(todayIso());
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [crcl, setCrcl] = useState('');

  const { data: carePlansData } = useOncologyCarePlans({ status: 'active' });
  const carePlans: OncologyCarePlan[] = carePlansData?.data ?? [];
  const { data: carePlan } = useOncologyCarePlan(carePlanId);
  const { data: existing } = useTreatmentPlans(carePlanId ? { carePlanId } : undefined, !!carePlanId);
  const existingActive = (existing?.data ?? []).filter((p) => ['active', 'on_hold'].includes(p.status));

  const { data: protocolsData } = useProtocols(carePlan?.cancer_type ? { cancerType: carePlan.cancer_type } : undefined);
  const protocols: ChemoProtocol[] = protocolsData?.data ?? [];
  const { data: protocol } = useProtocol(protocolId);

  // Pre-fill protocol and start date from the care plan's chemotherapy modality
  useEffect(() => {
    const m = chemoModality(carePlan);
    if (m?.protocolId) setProtocolId(m.protocolId);
    const planned = m?.startDate ?? carePlan?.start_date;
    if (planned && planned.slice(0, 10) >= todayIso()) setStartDate(planned.slice(0, 10));
  }, [carePlan?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const phases = useMemo(() => (protocol ? getProtocolPhases(protocol) : []), [protocol]);
  const h = parseFloat(height);
  const w = parseFloat(weight);
  const bsa = h > 0 && w > 0 ? mosteller(h, w) : null;
  const needsCrcl = phases.some((ph) => ph.drugs.some((d) => d.doseFormula === 'auc'));
  const valid = carePlanId && protocolId && /^\d{4}-\d{2}-\d{2}$/.test(startDate) && bsa && (!needsCrcl || parseFloat(crcl) > 0);

  const submit = async () => {
    if (!valid) return;
    const plan = await create.mutateAsync({
      oncologyCarePlanId: carePlanId,
      protocolId,
      startDate,
      heightCm: h,
      weightKg: w,
      creatinineClearance: parseFloat(crcl) || undefined,
    });
    router.push(`/${params.locale}/oncology/treatment-plans/${plan.id}`);
  };

  const errorText = (create.error as { response?: { data?: { message?: string } } } | null)?.response?.data?.message;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/${params.locale}/oncology/treatment-plans`)} aria-label="Back to treatment schedules">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Start Treatment Schedule</h1>
          <p className="text-muted-foreground text-sm">Generate the dated cycle-by-cycle schedule for a patient from their chemo protocol</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Patient &amp; Protocol</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tp-care-plan">Care plan *</Label>
              <Select value={carePlanId || '__none'} onValueChange={(v) => setCarePlanId(v === '__none' ? '' : v)}>
                <SelectTrigger id="tp-care-plan"><SelectValue placeholder="Select care plan..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">— Select care plan —</SelectItem>
                  {carePlans.map((cp) => (
                    <SelectItem key={cp.id} value={cp.id}>
                      {cp.plan_number} · {cp.cancer_type}{chemoModality(cp)?.protocolCode ? ` · ${chemoModality(cp)!.protocolCode}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {carePlan?.patientDisplay && (
                <p className="text-sm text-muted-foreground">
                  {carePlan.patientDisplay.displayName}{carePlan.patientDisplay.mrn ? ` · ${carePlan.patientDisplay.mrn}` : ''}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tp-protocol">Protocol *</Label>
              <Select value={protocolId || '__none'} onValueChange={(v) => setProtocolId(v === '__none' ? '' : v)} disabled={!carePlanId}>
                <SelectTrigger id="tp-protocol"><SelectValue placeholder="Select protocol..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">— Select protocol —</SelectItem>
                  {protocols.map((p) => <SelectItem key={p.id} value={p.id}>{p.code} — {p.name}</SelectItem>)}
                  {protocol && !protocols.some((p) => p.id === protocol.id) && (
                    <SelectItem value={protocol.id}>{protocol.code} — {protocol.name}</SelectItem>
                  )}
                </SelectContent>
              </Select>
              {phases.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {phases.map((ph) => `${ph.name} ${ph.cycles}×${ph.cycleDurationDays}d`).join(' → ')} · {totalCycles(phases)} cycles
                </p>
              )}
            </div>
          </div>
          {existingActive.length > 0 && (
            <p className="text-sm text-amber-700 dark:text-amber-400">
              This care plan already has an active schedule —{' '}
              <Link className="underline" href={`/${params.locale}/oncology/treatment-plans/${existingActive[0].id}`}>open it</Link>
              {' '}instead of starting another.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Start Date &amp; Dosing Basis</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="tp-start">C1 D1 date *</Label>
              <Input id="tp-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tp-height">Height (cm) *</Label>
              <Input id="tp-height" type="number" min={0} step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tp-weight">Weight (kg) *</Label>
              <Input id="tp-weight" type="number" min={0} step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tp-crcl">CrCl (mL/min){needsCrcl ? ' *' : ''}</Label>
              <Input id="tp-crcl" type="number" min={0} step="0.1" value={crcl} onChange={(e) => setCrcl(e.target.value)} placeholder={needsCrcl ? 'Needed for AUC dosing' : 'Optional'} />
            </div>
            <div className="text-sm pb-2">
              <span className="text-muted-foreground">BSA (Mosteller): </span>
              <span className="font-semibold">{bsa ? `${bsa} m²` : '—'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {phases.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Schedule Preview</CardTitle></CardHeader>
          <CardContent>
            <SchedulePreview phases={phases} startDate={startDate} />
          </CardContent>
        </Card>
      )}

      {errorText && <p role="alert" className="text-sm text-destructive">{errorText}</p>}
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => router.back()} disabled={create.isPending}>Cancel</Button>
        <Button onClick={submit} disabled={!valid || create.isPending}>
          {create.isPending ? 'Generating…' : 'Generate schedule'}
        </Button>
      </div>
    </div>
  );
}
