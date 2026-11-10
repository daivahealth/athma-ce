'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { CalendarRange, FlaskConical, Save, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/ui/page-header';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { FIELD_CONTROL, FormActions, FormField, FormSection } from '@/components/forms/form-layout';
import {
  PICKER_LIMIT, useCreateTreatmentPlan, useOncologyCarePlan, useOncologyCarePlans, useProtocol, useProtocols, useTreatmentPlans,
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

  const { data: carePlansData } = useOncologyCarePlans({ status: 'active', limit: PICKER_LIMIT });
  const carePlans: OncologyCarePlan[] = carePlansData?.data ?? [];
  const { data: carePlan } = useOncologyCarePlan(carePlanId);
  const { data: existing } = useTreatmentPlans(carePlanId ? { carePlanId } : undefined, !!carePlanId);
  const existingActive = (existing?.data ?? []).filter((p) => ['active', 'on_hold'].includes(p.status));

  const { data: protocolsData } = useProtocols({ cancerType: carePlan?.cancer_type || undefined, limit: PICKER_LIMIT });
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
    <div className="space-y-6 page-transition">
      <PageHeader
        title="Start Treatment Schedule"
        subtitle="Generate the dated cycle-by-cycle schedule for a patient from their chemo protocol"
        icon={CalendarRange}
        breadcrumb={
          <Breadcrumb items={[{ href: `/${params.locale}/oncology/treatment-plans`, label: 'Treatment Schedules' }, { label: 'New' }]} />
        }
      />

      <FormSection icon={FlaskConical} title="Patient & Protocol" description="The active care plan to schedule and the chemo protocol to follow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField id="tp-care-plan" label="Care plan" required>
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
          </FormField>
          <FormField id="tp-protocol" label="Protocol" required>
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
          </FormField>
        </div>
        {existingActive.length > 0 && (
          <p className="rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-warning">
            This care plan already has an active schedule —{' '}
            <Link className="underline" href={`/${params.locale}/oncology/treatment-plans/${existingActive[0].id}`}>open it</Link>
            {' '}instead of starting another.
          </p>
        )}
      </FormSection>

      <FormSection icon={Scale} title="Start Date & Dosing Basis" description="Cycle 1 day 1 and the measurements doses are calculated from">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
          <FormField id="tp-start" label="C1 D1 date" required>
            <Input id="tp-start" type="date" className={FIELD_CONTROL} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </FormField>
          <FormField id="tp-height" label="Height (cm)" required>
            <Input id="tp-height" type="number" min={0} step="0.1" value={height} onChange={(e) => setHeight(e.target.value)} />
          </FormField>
          <FormField id="tp-weight" label="Weight (kg)" required>
            <Input id="tp-weight" type="number" min={0} step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </FormField>
          <FormField id="tp-crcl" label="CrCl (mL/min)" required={needsCrcl}>
            <Input id="tp-crcl" type="number" min={0} step="0.1" value={crcl} onChange={(e) => setCrcl(e.target.value)} placeholder={needsCrcl ? 'Needed for AUC dosing' : 'Optional'} />
          </FormField>
          <div className="text-sm pb-2">
            <span className="text-muted-foreground">BSA (Mosteller): </span>
            <span className="font-semibold">{bsa ? `${bsa} m²` : '—'}</span>
          </div>
        </div>
      </FormSection>

      {phases.length > 0 && (
        <FormSection icon={CalendarRange} title="Schedule Preview" description="The dated cycles this schedule will generate">
          <SchedulePreview phases={phases} startDate={startDate} />
        </FormSection>
      )}

      {errorText && <p role="alert" className="text-sm font-medium text-destructive">{errorText}</p>}
      <FormActions onCancel={() => router.back()} busy={create.isPending}>
        <Button onClick={submit} disabled={!valid || create.isPending} className="gap-2">
          <Save className="h-4 w-4" />
          {create.isPending ? 'Generating…' : 'Generate schedule'}
        </Button>
      </FormActions>
    </div>
  );
}
