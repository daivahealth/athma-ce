'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CalendarClock, ClipboardList, FileText, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useTreatmentPlan, useTreatmentPlanActions } from '@/plugins/oncology/hooks/use-oncology';
import { LoadingState, StatusBadge } from '@/plugins/oncology/components/shared';
import { DaySheet } from '@/plugins/oncology/components/treatment-schedule/DaySheet';
import { phaseAccent } from '@/plugins/oncology/components/protocol-builder/phase-colors';
import { formatDate, formatDayMonthYear, formatDose, formatShortDate, isWeekend, todayIso } from '@/plugins/oncology/lib/treatment-day';
import type { TreatmentCycle, TreatmentDay, TreatmentPlan } from '@/plugins/oncology/types';

const errorText = (e: unknown) =>
  (e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? (e as Error)?.message;

export default function TreatmentPlanPage() {
  const params = useParams() as { locale: string; id: string };
  const router = useRouter();
  const { data: plan, isLoading } = useTreatmentPlan(params.id);
  const actions = useTreatmentPlanActions(params.id);
  const [openDayId, setOpenDayId] = useState<string | null>(null);

  const daysByCycle = useMemo(() => {
    const map = new Map<number, TreatmentDay[]>();
    for (const d of plan?.days ?? []) {
      if (!map.has(d.cycle_number)) map.set(d.cycle_number, []);
      map.get(d.cycle_number)!.push(d);
    }
    return map;
  }, [plan?.days]);

  if (isLoading) return <LoadingState />;
  if (!plan) return <div className="p-8 text-muted-foreground">Treatment plan not found.</div>;

  const openDay = plan.days.find((d) => d.id === openDayId) ?? null;
  const editable = plan.status === 'active';
  const lastError = [actions.update, actions.delayCycle, actions.setDoseLevel, actions.updateDay, actions.createOrder]
    .find((m) => m.isError)?.error;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push(`/${params.locale}/oncology/treatment-plans`)} aria-label="Back to treatment schedules">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold">Treatment Schedule</h1>
          <p className="text-muted-foreground text-sm truncate">
            {plan.patientDisplay?.displayName ?? 'Patient'}
            {plan.patientDisplay?.mrn ? ` · ${plan.patientDisplay.mrn}` : ''}
            {' · '}{plan.protocol_snapshot.code} — {plan.protocol_snapshot.name}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push(`/${params.locale}/oncology/day-care`)}>
          <ClipboardList className="h-4 w-4 mr-1" />Day-care worklist
        </Button>
      </div>

      {lastError && (
        <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {errorText(lastError)}
        </div>
      )}

      <PlanSummary plan={plan} onStatus={(status) => actions.update.mutate({ status })} busy={actions.update.isPending}
        onMeasures={(m) => actions.update.mutate(m)} />

      <div className="space-y-4">
        {plan.cycles.map((cycle) => (
          <CycleCard
            key={cycle.id}
            cycle={cycle}
            totalInPhase={plan.protocol_snapshot.phases[cycle.phase_index]?.cycles ?? 0}
            days={daysByCycle.get(cycle.cycle_number) ?? []}
            editable={editable}
            locale={params.locale}
            onOpenDay={setOpenDayId}
            onDelay={(days, reason) => actions.delayCycle.mutate({ cycleNumber: cycle.cycle_number, days, reason })}
            onDoseLevel={(doseLevel, applyToLaterCycles) => actions.setDoseLevel.mutate({ cycleNumber: cycle.cycle_number, doseLevel, applyToLaterCycles })}
            onDayStatus={(dayId, status) => actions.updateDay.mutate({ dayId, status })}
            onCreateOrder={(dayId) => actions.createOrder.mutate(dayId)}
            busy={actions.delayCycle.isPending || actions.setDoseLevel.isPending || actions.updateDay.isPending || actions.createOrder.isPending}
          />
        ))}
      </div>

      <Sheet open={!!openDay} onOpenChange={(o) => !o && setOpenDayId(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {openDay && (
            <>
              <SheetHeader>
                <SheetTitle>{formatDate(openDay.scheduled_date)}</SheetTitle>
                <SheetDescription>
                  Cycle {openDay.cycle_number} · Day {openDay.cycle_day}
                  {' · '}{plan.cycles.find((c) => c.cycle_number === openDay.cycle_number)?.phase_name}
                  {' · BSA '}{plan.bsa ?? '—'} m²
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-2">
                  <StatusBadge status={openDay.status} />
                  {openDay.chemo_order_id && (
                    <Link className="text-sm underline underline-offset-2" href={`/${params.locale}/oncology/orders/${openDay.chemo_order_id}`}>
                      Chemo order{openDay.order_status ? ` (${openDay.order_status.replace(/_/g, ' ')})` : ''}
                    </Link>
                  )}
                </div>
                <DaySheet items={openDay.items} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function PlanSummary({ plan, onStatus, onMeasures, busy }: {
  plan: TreatmentPlan;
  onStatus: (s: string) => void;
  onMeasures: (m: { heightCm?: number; weightKg?: number; creatinineClearance?: number }) => void;
  busy: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [height, setHeight] = useState(String(plan.height_cm ?? ''));
  const [weight, setWeight] = useState(String(plan.weight_kg ?? ''));
  const [crcl, setCrcl] = useState(String(plan.creatinine_clearance ?? ''));
  const active = plan.days.filter((d) => !['skipped', 'cancelled'].includes(d.status));
  const given = plan.days.filter((d) => d.status === 'given').length;
  const next = plan.days.find((d) => ['planned', 'ordered', 'held'].includes(d.status));
  const end = active.at(-1)?.scheduled_date;

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <Stat label="Status"><StatusBadge status={plan.status} /></Stat>
          <Stat label="Start → end">{formatDayMonthYear(plan.start_date)} → {end ? formatDayMonthYear(end) : '—'}</Stat>
          <Stat label="Next treatment">{next ? `${formatShortDate(next.scheduled_date)} · C${next.cycle_number} D${next.cycle_day}` : '—'}</Stat>
          <Stat label="Progress">{given} / {active.length} treatment days given</Stat>
          <Stat label="Dosing basis">
            BSA {plan.bsa ?? '—'} m² · {plan.weight_kg ?? '—'} kg · {plan.height_cm ?? '—'} cm
            {plan.creatinine_clearance ? ` · CrCl ${plan.creatinine_clearance}` : ''}
          </Stat>
        </div>
        <div className="flex flex-wrap gap-2">
          {plan.status === 'active' && (
            <>
              <Button size="sm" variant="outline" disabled={busy} onClick={() => setEditing((e) => !e)}>Update measurements</Button>
              <Button size="sm" variant="outline" disabled={busy} onClick={() => onStatus('on_hold')}>Put on hold</Button>
              <Button size="sm" variant="outline" disabled={busy} onClick={() => onStatus('completed')}>Mark completed</Button>
              <Button size="sm" variant="ghost" className="text-destructive" disabled={busy} onClick={() => { if (window.confirm('Cancel this treatment plan?')) onStatus('cancelled'); }}>Cancel plan</Button>
            </>
          )}
          {plan.status === 'on_hold' && (
            <Button size="sm" disabled={busy} onClick={() => onStatus('active')}>Resume plan</Button>
          )}
        </div>
        {editing && (
          <form
            className="flex flex-wrap items-end gap-3 rounded-md bg-muted/40 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              onMeasures({
                heightCm: parseFloat(height) || undefined,
                weightKg: parseFloat(weight) || undefined,
                creatinineClearance: parseFloat(crcl) || undefined,
              });
              setEditing(false);
            }}
          >
            <Field label="Height (cm)" value={height} onChange={setHeight} />
            <Field label="Weight (kg)" value={weight} onChange={setWeight} />
            <Field label="CrCl (mL/min)" value={crcl} onChange={setCrcl} />
            <Button type="submit" size="sm" disabled={busy}>Recalculate doses</Button>
            <p className="text-xs text-muted-foreground basis-full">Only days that are not yet ordered or given are re-dosed.</p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="space-y-1">
      <span className="text-xs">{label}</span>
      <Input className="h-8 w-28" type="number" min={0} step="0.1" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

interface CycleCardProps {
  cycle: TreatmentCycle;
  totalInPhase: number;
  days: TreatmentDay[];
  editable: boolean;
  locale: string;
  busy: boolean;
  onOpenDay: (id: string) => void;
  onDelay: (days: number, reason?: string) => void;
  onDoseLevel: (level: number, applyToLater: boolean) => void;
  onDayStatus: (dayId: string, status: string) => void;
  onCreateOrder: (dayId: string) => void;
}

function CycleCard({
  cycle, totalInPhase, days, editable, locale, busy, onOpenDay, onDelay, onDoseLevel, onDayStatus, onCreateOrder,
}: CycleCardProps) {
  const [delayOpen, setDelayOpen] = useState(false);
  const [delayDays, setDelayDays] = useState('7');
  const [reason, setReason] = useState('');
  const [applyLater, setApplyLater] = useState(true);
  const today = todayIso();
  const accent = phaseAccent(cycle.phase_index);
  const locked = days.some((d) => ['ordered', 'given'].includes(d.status));
  const done = days.length > 0 && days.every((d) => ['given', 'skipped', 'cancelled'].includes(d.status));

  return (
    <Card className={cn('border-l-4', accent.border, done && 'opacity-80')}>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <CardTitle className="text-base">Cycle {cycle.cycle_number}</CardTitle>
          <span className="text-sm text-muted-foreground">
            {cycle.phase_name} · cycle {cycle.phase_cycle} of {totalInPhase} · starts {formatShortDate(cycle.planned_start_date)}
          </span>
          {cycle.delay_days > 0 && (
            <span className="text-xs rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 px-2 py-0.5" title={cycle.delay_reason ?? undefined}>
              delayed +{cycle.delay_days}d{cycle.delay_reason ? ` · ${cycle.delay_reason}` : ''}
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Label className="text-xs text-muted-foreground" htmlFor={`dl-${cycle.id}`}>Dose level</Label>
            <Select
              value={String(cycle.dose_level)}
              disabled={!editable || busy || done}
              onValueChange={(v) => onDoseLevel(Number(v), applyLater)}
            >
              <SelectTrigger id={`dl-${cycle.id}`} className="h-8 w-24"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">DL 0</SelectItem>
                <SelectItem value="-1">DL −1</SelectItem>
                <SelectItem value="-2">DL −2</SelectItem>
              </SelectContent>
            </Select>
            <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Checkbox checked={applyLater} onChange={(e) => setApplyLater(e.target.checked)} disabled={!editable || done} />
              and later cycles
            </label>
            <Button size="sm" variant="outline" className="h-8" disabled={!editable || busy || locked} onClick={() => setDelayOpen((o) => !o)}
              title={locked ? 'Cancel this cycle\'s orders before delaying' : undefined}>
              <CalendarClock className="h-4 w-4 mr-1" />Delay
            </Button>
          </div>
        </div>
        {delayOpen && (
          <form
            className="mt-3 flex flex-wrap items-end gap-3 rounded-md bg-muted/40 p-3"
            onSubmit={(e) => { e.preventDefault(); onDelay(parseInt(delayDays, 10), reason || undefined); setDelayOpen(false); setReason(''); }}
          >
            <label className="space-y-1">
              <span className="text-xs">Delay by (days)</span>
              <Input className="h-8 w-24" type="number" min={1} max={90} value={delayDays} onChange={(e) => setDelayDays(e.target.value)} />
            </label>
            <label className="space-y-1 flex-1 min-w-[200px]">
              <span className="text-xs">Reason</span>
              <Input className="h-8" value={reason} placeholder="e.g. ANC 900 — count recovery" onChange={(e) => setReason(e.target.value)} />
            </label>
            <Button type="submit" size="sm" disabled={busy || !(parseInt(delayDays, 10) >= 1)}>Delay cycle {cycle.cycle_number} and later</Button>
          </form>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-md border divide-y">
          {days.map((d) => {
            const chemo = d.items.filter((i) => i.kind === 'chemo');
            const isToday = d.scheduled_date.slice(0, 10) === today;
            const warn = chemo.some((i) => i.warning);
            return (
              <div key={d.id} className={cn('flex flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2 text-sm', isToday && 'bg-primary/5')}>
                <div className="w-36 shrink-0">
                  <div className={cn('font-medium', isWeekend(d.scheduled_date) && 'text-amber-700 dark:text-amber-400')}>
                    {formatShortDate(d.scheduled_date)}{isToday && ' · today'}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">C{d.cycle_number} D{d.cycle_day}</div>
                </div>
                <div className="w-24 shrink-0"><StatusBadge status={d.status} /></div>
                <div className={cn('flex-1 min-w-[220px]', ['skipped', 'cancelled'].includes(d.status) && 'line-through text-muted-foreground')}>
                  {chemo.map((i) => (
                    <span key={i.sequence} className="mr-3 whitespace-nowrap">
                      {i.drug} <span className="font-medium">{formatDose(i)}</span>
                    </span>
                  ))}
                  {warn && <span className="text-xs text-amber-700 dark:text-amber-400">needs attention</span>}
                </div>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" className="h-8" onClick={() => onOpenDay(d.id)}>
                    <FileText className="h-4 w-4 mr-1" />Day sheet
                  </Button>
                  {d.chemo_order_id ? (
                    <Button size="sm" variant="outline" className="h-8" asChild>
                      <Link href={`/${locale}/oncology/orders/${d.chemo_order_id}`}>Order{d.order_status ? ` · ${d.order_status.replace(/_/g, ' ')}` : ''}</Link>
                    </Button>
                  ) : (
                    <Button size="sm" className="h-8" disabled={!editable || busy || !['planned', 'held'].includes(d.status)} onClick={() => onCreateOrder(d.id)}>
                      Create order
                    </Button>
                  )}
                  {editable && !d.chemo_order_id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" aria-label={`More actions for C${d.cycle_number} D${d.cycle_day}`}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {d.status !== 'held' && <DropdownMenuItem onClick={() => onDayStatus(d.id, 'held')}>Hold this day</DropdownMenuItem>}
                        {d.status !== 'skipped' && <DropdownMenuItem onClick={() => onDayStatus(d.id, 'skipped')}>Skip (omit) this day</DropdownMenuItem>}
                        {d.status !== 'planned' && <DropdownMenuItem onClick={() => onDayStatus(d.id, 'planned')}>Restore to planned</DropdownMenuItem>}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
