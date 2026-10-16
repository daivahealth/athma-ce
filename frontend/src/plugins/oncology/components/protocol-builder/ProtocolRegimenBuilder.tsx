'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ProtocolPhase } from '@/plugins/oncology/types';
import {
  emptyPhase, newId, phaseStartCycles, scheduleLengthDays, totalCycles,
} from '@/plugins/oncology/lib/protocol-phases';
import { PhaseEditor } from './PhaseEditor';
import { RegimenMatrix } from './RegimenMatrix';
import { SchedulePreview } from './SchedulePreview';

interface Props {
  phases: ProtocolPhase[];
  onChange: (phases: ProtocolPhase[]) => void;
  errors: string[];
}

/**
 * Phase-based regimen editor: sequential phases (each with its own cycle count,
 * cycle length and drugs), per-cycle overrides, a drug × cycle matrix and a
 * day-by-day schedule preview.
 */
export function ProtocolRegimenBuilder({ phases, onChange, errors }: Props) {
  const starts = phaseStartCycles(phases);
  const update = (i: number, ph: ProtocolPhase) => onChange(phases.map((p, idx) => (idx === i ? ph : p)));
  const move = (i: number, dir: -1 | 1) => {
    const next = [...phases];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    onChange(next);
  };
  const duplicate = (i: number) => {
    const src = phases[i];
    const copy: ProtocolPhase = {
      ...src, id: newId(), name: `${src.name} (copy)`,
      drugs: src.drugs.map((d) => ({ ...d, id: newId(), overrides: d.overrides?.map((o) => ({ ...o })) })),
    };
    onChange([...phases.slice(0, i + 1), copy, ...phases.slice(i + 1)]);
  };
  const total = totalCycles(phases);
  const days = scheduleLengthDays(phases);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Regimen &amp; Cycles *</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Split the protocol into phases when drugs change between cycles (e.g. AC × 4 then Paclitaxel × 4).
                {' '}{total} cycle{total !== 1 ? 's' : ''} · {days} days in total.
              </p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => onChange([...phases, emptyPhase(phases.length, phases.at(-1)?.cycleDurationDays)])}>
              <Plus className="h-4 w-4 mr-1" />Add Phase
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {phases.map((ph, i) => (
            <PhaseEditor
              key={ph.id}
              phase={ph}
              index={i}
              count={phases.length}
              startCycle={starts[i]}
              onChange={(next) => update(i, next)}
              onMove={(dir) => move(i, dir)}
              onDuplicate={() => duplicate(i)}
              onRemove={() => onChange(phases.filter((_, idx) => idx !== i))}
            />
          ))}
          {errors.length > 0 && (
            <ul className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive space-y-0.5">
              {errors.map((e) => <li key={e}>{e}</li>)}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Plan Overview</CardTitle></CardHeader>
        <CardContent>
          <Tabs defaultValue="matrix">
            <TabsList>
              <TabsTrigger value="matrix">Cycle matrix</TabsTrigger>
              <TabsTrigger value="schedule">Day-by-day schedule</TabsTrigger>
            </TabsList>
            <TabsContent value="matrix" className="pt-3">
              <RegimenMatrix phases={phases} onChange={onChange} />
            </TabsContent>
            <TabsContent value="schedule" className="pt-3">
              <SchedulePreview phases={phases} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}
