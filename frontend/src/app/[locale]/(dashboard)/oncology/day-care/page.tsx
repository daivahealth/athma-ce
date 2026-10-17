'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, ClipboardList, Printer } from 'lucide-react';
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

/**
 * Day-care / pharmacy worklist: every scheduled treatment day on a date,
 * across patients — what to prepare and what to administer.
 */
export default function DayCarePage() {
  const params = useParams() as { locale: string };
  const [date, setDate] = useState(todayIso());
  const { data, isLoading } = useTreatmentDays({ date }, /^\d{4}-\d{2}-\d{2}$/.test(date));
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
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />Print
          </Button>
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
        <Tabs defaultValue="administration">
          <TabsList>
            <TabsTrigger value="administration">Administration</TabsTrigger>
            <TabsTrigger value="pharmacy">Pharmacy prep</TabsTrigger>
          </TabsList>

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
