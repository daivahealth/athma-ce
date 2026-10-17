'use client';

import { useId, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { ProtocolPhase } from '@/plugins/oncology/types';
import { buildRelativeSchedule, scheduleLengthDays } from '@/plugins/oncology/lib/protocol-phases';
import { phaseAccent } from './phase-colors';

interface Props {
  phases: ProtocolPhase[];
  /** Controlled start date (YYYY-MM-DD); hides the sample-date input. */
  startDate?: string;
}

const addDays = (iso: string, n: number) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n));
};
const fmt = new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

/**
 * Treatment days counted from Day 1 of Cycle 1. An optional sample start date
 * shows calendar dates (preview only — the patient schedule is created from
 * the care plan).
 */
export function SchedulePreview({ phases, startDate }: Props) {
  const days = useMemo(() => buildRelativeSchedule(phases), [phases]);
  const [sampleStart, setStart] = useState('');
  const start = startDate ?? sampleStart;
  const startId = useId();
  const length = scheduleLengthDays(phases);

  if (!days.length) {
    return <p className="text-sm text-muted-foreground py-6 text-center">Add phases and drugs to see the schedule.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-4">
        {startDate === undefined && (
          <div className="space-y-1">
            <Label htmlFor={startId} className="text-xs">Sample start date (optional)</Label>
            <Input id={startId} type="date" className="h-8 w-44" value={sampleStart} onChange={(e) => setStart(e.target.value)} />
          </div>
        )}
        <p className="text-xs text-muted-foreground pb-2">
          {days.length} treatment days over {length} days (~{Math.round(length / 7)} weeks)
        </p>
      </div>

      <div className="rounded-md border divide-y">
        {days.map((d, i) => {
          const date = start ? addDays(start, d.treatmentDay - 1) : null;
          const weekend = date ? [0, 6].includes(date.getUTCDay()) : false;
          const newCycle = i === 0 || days[i - 1].cycle !== d.cycle;
          return (
            <div key={`${d.cycle}-${d.cycleDay}`} className={cn('flex gap-4 px-3 py-2 text-sm', newCycle && i > 0 && 'border-t-2')}>
              <div className="w-28 shrink-0">
                <div className="font-medium font-mono">Day {d.treatmentDay}</div>
                <div className="text-xs text-muted-foreground">Week {Math.ceil(d.treatmentDay / 7)}</div>
              </div>
              <div className="w-36 shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className={cn('h-2 w-2 rounded-full', phaseAccent(d.phaseIndex).dot)} />
                  <span className="font-mono">C{d.cycle} D{d.cycleDay}</span>
                </div>
                <div className="text-xs text-muted-foreground truncate">{d.phaseName}</div>
              </div>
              {start && (
                <div className={cn('w-40 shrink-0 text-xs pt-0.5', weekend ? 'text-amber-700 dark:text-amber-400' : 'text-muted-foreground')}>
                  {date && fmt.format(date)}{weekend && ' · weekend'}
                </div>
              )}
              <ul className="flex-1 space-y-0.5">
                {d.drugs.map((drug) => (
                  <li key={drug.lineId} className="flex flex-wrap gap-x-2">
                    <span className="font-medium">{drug.drug}</span>
                    <span className={cn(drug.overridden ? 'text-amber-700 dark:text-amber-400' : 'text-muted-foreground')}>
                      {drug.dose} {drug.unit} {drug.route}
                      {drug.infusionDurationMin ? ` · ${drug.infusionDurationMin} min` : ''}
                      {drug.diluent ? ` · ${drug.diluent}` : ''}
                    </span>
                    {drug.note && <span className="text-xs text-muted-foreground italic">({drug.note})</span>}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
