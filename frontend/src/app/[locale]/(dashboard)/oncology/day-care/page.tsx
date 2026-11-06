'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, ClipboardList, Maximize2, Minimize2, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/ui/page-header';
import { ToneBadge } from '@/components/ui/tone-badge';
import { useTreatmentDays } from '@/plugins/oncology/hooks/use-oncology';
import { EmptyState, LoadingState, StatusBadge } from '@/plugins/oncology/components/shared';
import { DaySheet } from '@/plugins/oncology/components/treatment-schedule/DaySheet';
import { phaseTone } from '@/plugins/oncology/lib/oncology-tone';
import { addDaysIso, formatDate, formatDose, formatProtocolDose, todayIso } from '@/plugins/oncology/lib/treatment-day';
import { BoardSummary, ChairTimeline, OralDispensing, StatusLanes } from '@/plugins/oncology/components/day-care/DayCareBoard';
import { cn } from '@/lib/utils';

/**
 * Day-care / pharmacy worklist: every scheduled treatment day on a date,
 * across patients — what to prepare and what to administer.
 */
export default function DayCarePage() {
  const params = useParams() as { locale: string };
  const [date, setDate] = useState(todayIso());
  // Big-screen mode: the board full screen on a unit wall display, refreshed every minute.
  const boardRef = useRef<HTMLDivElement>(null);
  const [wall, setWall] = useState(false);
  const [clockNow, setClockNow] = useState(() => new Date());
  useEffect(() => {
    const onChange = () => { if (!document.fullscreenElement) setWall(false); };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);
  useEffect(() => {
    if (!wall) return;
    const t = setInterval(() => setClockNow(new Date()), 30_000);
    // Esc closes the wall view even where the browser did not grant full screen.
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setWall(false); };
    window.addEventListener('keydown', onKey);
    return () => { clearInterval(t); window.removeEventListener('keydown', onKey); };
  }, [wall]);
  const toggleWall = async () => {
    if (wall) {
      if (document.fullscreenElement) await document.exitFullscreen().catch(() => undefined);
      setWall(false);
    } else {
      setDate(todayIso());
      setWall(true);
      await boardRef.current?.requestFullscreen?.().catch(() => undefined);
    }
  };
  const { data, isLoading } = useTreatmentDays({ date }, /^\d{4}-\d{2}-\d{2}$/.test(date), wall ? 60_000 : false);
  const days = useMemo(() => data?.data ?? [], [data]);

  const prep = useMemo(() => days.flatMap((d) =>
    d.items.filter((i) => i.kind === 'chemo').map((i) => ({ day: d, item: i }))), [days]);
  const drugTotals = useMemo(() => {
    const m = new Map<string, { count: number; total: number; unit: string }>();
    for (const { item } of prep) {
      const key = `${item.drug}|${item.calculatedUnit}`;
      const e = m.get(key) ?? { count: 0, total: 0, unit: item.calculatedUnit ?? '' };
      e.count += 1; e.total += item.calculatedDose ?? 0;
      m.set(key, e);
    }
    return [...m.entries()].map(([k, v]) => ({ drug: k.split('|')[0], ...v })).sort((a, b) => a.drug.localeCompare(b.drug));
  }, [prep]);

  const patientLink = (d: (typeof days)[number]) => `/${params.locale}/oncology/treatment-plans/${d.treatment_plan_id}`;

  return (
    <div className="space-y-6 page-transition">
      <PageHeader
        title="Day-care Worklist"
        subtitle="Chemotherapy to prepare and administer, by date"
        icon={ClipboardList}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={toggleWall}>
              <Maximize2 className="h-4 w-4 mr-2" />Big screen
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />Print
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setDate((d) => addDaysIso(d, -1))} aria-label="Previous day"><ChevronLeft className="h-4 w-4" /></Button>
        <Input type="date" className="w-44" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Worklist date" />
        <Button variant="outline" size="sm" onClick={() => setDate((d) => addDaysIso(d, 1))} aria-label="Next day"><ChevronRight className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm" onClick={() => setDate(todayIso())}>Today</Button>
        <span className="text-sm text-muted-foreground ml-2">
          {/^\d{4}-\d{2}-\d{2}$/.test(date) && formatDate(date)} · {days.length} patient{days.length !== 1 ? 's' : ''} · {prep.length} chemo preparation{prep.length !== 1 ? 's' : ''}
        </span>
      </div>

      {isLoading ? <LoadingState /> : days.length === 0 ? (
        <EmptyState message="No chemotherapy scheduled on this date." />
      ) : (
        <Tabs defaultValue="board">
          <TabsList>
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="administration">Administration</TabsTrigger>
            <TabsTrigger value="pharmacy">Pharmacy prep</TabsTrigger>
          </TabsList>

          <TabsContent value="board" className="pt-4">
            <div
              ref={boardRef}
              className={cn('space-y-5', wall && 'fixed inset-0 z-50 overflow-auto bg-background p-6')}
            >
              {wall && (
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Day-care unit</h2>
                    <p className="text-lg text-muted-foreground">{formatDate(date)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-semibold tabular-nums">
                      {clockNow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <Button variant="outline" onClick={toggleWall} aria-label="Exit big screen">
                      <Minimize2 className="h-4 w-4 mr-2" />Exit
                    </Button>
                  </div>
                </div>
              )}
              <BoardSummary days={days} large={wall} />
              <section className="space-y-2" aria-label="Patients by stage">
                <h2 className={cn('font-semibold', wall ? 'text-lg' : 'text-sm')}>Where everyone is</h2>
                <div className="overflow-x-auto pb-1">
                  <StatusLanes days={days} locale={params.locale} large={wall} />
                </div>
              </section>
              <section className="space-y-2" aria-label="Oral dispensing">
                <h2 className={cn('font-semibold', wall ? 'text-lg' : 'text-sm')}>Oral dispensing</h2>
                <OralDispensing days={days} locale={params.locale} large={wall} />
              </section>
              <section className="space-y-2 rounded-xl border border-border/60 bg-card p-4" aria-label="Chair plan">
                <h2 className={cn('font-semibold', wall ? 'text-lg' : 'text-sm')}>Chair plan</h2>
                <ChairTimeline days={days} locale={params.locale} showNow={date === todayIso()} large={wall} />
              </section>
            </div>
          </TabsContent>

          <TabsContent value="administration" className="pt-4 space-y-4">
            {days.map((d) => (
              <Card key={d.id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <CardTitle className="text-base">
                      <Link className="hover:underline" href={patientLink(d)}>{d.patientDisplay?.displayName ?? 'Patient'}</Link>
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {d.patientDisplay?.mrn} · {d.protocol_code} · C{d.cycle_number}/{d.total_cycles} D{d.cycle_day}
                      {' '}· BSA {d.bsa ?? '—'} m²
                      {d.dose_level ? ` · DL ${d.dose_level}` : ''}
                    </span>
                    {d.phase_name ? <ToneBadge tone={phaseTone(d.phase_index)}>{d.phase_name}</ToneBadge> : null}
                    <div className="ml-auto flex items-center gap-2">
                      <StatusBadge status={d.status} />
                      {d.chemo_order_id ? (
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/${params.locale}/oncology/orders/${d.chemo_order_id}`}>Order{d.order_status ? ` · ${d.order_status.replace(/_/g, ' ')}` : ''}</Link>
                        </Button>
                      ) : (
                        <span className="text-xs text-amber-700 dark:text-amber-400">No order yet</span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <DaySheet items={d.items} />
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pharmacy" className="pt-4 space-y-4">
            <div className="rounded-lg border overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs text-muted-foreground">
                  <tr>
                    <th className="text-left p-2 font-medium">Patient</th>
                    <th className="text-left p-2 font-medium">Protocol</th>
                    <th className="text-left p-2 font-medium">Drug</th>
                    <th className="text-left p-2 font-medium">Dose</th>
                    <th className="text-left p-2 font-medium">Basis</th>
                    <th className="text-left p-2 font-medium">Diluent</th>
                    <th className="text-left p-2 font-medium">Route / infusion</th>
                    <th className="text-left p-2 font-medium">Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {prep.map(({ day, item }) => (
                    <tr key={`${day.id}-${item.sequence}`}>
                      <td className="p-2">
                        <Link className="font-medium hover:underline" href={patientLink(day)}>{day.patientDisplay?.displayName ?? '—'}</Link>
                        <div className="text-xs text-muted-foreground">{day.patientDisplay?.mrn}</div>
                      </td>
                      <td className="p-2 text-xs"><span className="font-mono">{day.protocol_code}</span> C{day.cycle_number} D{day.cycle_day}</td>
                      <td className="p-2 font-medium">{item.drug}</td>
                      <td className="p-2 font-semibold">
                        {formatDose(item)}
                        {item.warning && <div className="text-xs font-normal text-amber-700 dark:text-amber-400">{item.warning}</div>}
                      </td>
                      <td className="p-2 text-xs text-muted-foreground">{formatProtocolDose(item)}{item.doseLevel ? ` · DL ${item.doseLevel}` : ''}{item.capped ? ' · capped' : ''}</td>
                      <td className="p-2 text-xs">{item.diluent ?? '—'}</td>
                      <td className="p-2 text-xs">{item.route}{item.infusionDurationMin ? ` · ${item.infusionDurationMin} min` : ''}</td>
                      <td className="p-2"><StatusBadge status={day.order_status ?? day.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Totals by drug</CardTitle></CardHeader>
              <CardContent className="text-sm">
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-1">
                  {drugTotals.map((t) => (
                    <li key={`${t.drug}-${t.unit}`} className="flex justify-between gap-2">
                      <span>{t.drug} <span className="text-muted-foreground">× {t.count}</span></span>
                      <span className="font-medium">{Math.round(t.total * 10) / 10} {t.unit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
