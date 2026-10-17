'use client';

import { useId, useState } from 'react';
import { AlertTriangle, FlaskConical, Pill } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { TreatmentItem } from '@/plugins/oncology/types';
import {
  clockAt, formatDose, formatOffset, formatProtocolDose, timeline,
} from '@/plugins/oncology/lib/treatment-day';

interface Props {
  items: TreatmentItem[];
  /** Hide the chair start-time input (e.g. compact worklist cards). */
  compact?: boolean;
}

/**
 * Everything to prepare and give on one treatment day, in order: pre-treatment
 * checks, then a timed list (pre-meds, hydration, chemo in sequence), then
 * supportive care / take-home items.
 */
export function DaySheet({ items, compact }: Props) {
  const [start, setStart] = useState('09:00');
  const startId = useId();
  const timed = timeline(items);
  const checks = timed.filter((t) => t.item.kind === 'lab');
  const steps = timed.filter((t) => t.offsetMin != null);
  const supportive = timed.filter((t) => t.item.kind === 'supportive');

  return (
    <div className="space-y-4 text-sm">
      {checks.length > 0 && (
        <section className="space-y-1.5">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Before treatment</h4>
          <ul className="space-y-1">
            {checks.map(({ item }) => (
              <li key={item.sequence} className="flex gap-2">
                <FlaskConical className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                <span>
                  {item.label}
                  {item.detail && <span className="text-muted-foreground"> · {item.detail}</span>}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-1.5">
        <div className="flex items-end justify-between gap-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Administration sequence</h4>
          {!compact && (
            <div className="flex items-center gap-2">
              <Label htmlFor={startId} className="text-xs text-muted-foreground">Chair start</Label>
              <Input id={startId} type="time" className="h-7 w-28 text-xs" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
          )}
        </div>
        <div className="rounded-md border divide-y">
          {steps.map(({ item, offsetMin }) => (
            <div key={item.sequence} className={cn('flex gap-3 px-3 py-2', item.kind === 'chemo' && 'bg-muted/30')}>
              <div className="w-16 shrink-0 font-mono text-xs leading-5">
                {!compact && <div>{clockAt(start, offsetMin)}</div>}
                <div className="text-muted-foreground">{formatOffset(offsetMin)}</div>
              </div>
              <div className="flex-1 min-w-0">
                {item.kind === 'chemo' ? (
                  <>
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-semibold">{item.drug}</span>
                      <span className="font-semibold">{formatDose(item)}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.route}
                        {item.infusionDurationMin ? ` over ${item.infusionDurationMin} min` : ''}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatProtocolDose(item)}
                      {item.doseLevel ? ` (dose level ${item.doseLevel})` : ''}
                      {item.diluent ? ` · prepare in ${item.diluent}` : ''}
                      {item.capped ? ' · capped at max dose' : ''}
                      {item.note ? ` · ${item.note}` : ''}
                    </div>
                    {item.warning && (
                      <div className="flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400">
                        <AlertTriangle className="h-3.5 w-3.5" />{item.warning}
                      </div>
                    )}
                  </>
                ) : (
                  <div>
                    <span className="text-xs text-muted-foreground mr-2">{item.kind === 'premed' ? 'Pre-med' : 'Hydration'}</span>
                    {item.label}
                    {item.detail && <span className="text-muted-foreground"> · {item.detail}</span>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {supportive.length > 0 && (
        <section className="space-y-1.5">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Supportive care / take-home</h4>
          <ul className="space-y-1">
            {supportive.map(({ item }) => (
              <li key={item.sequence} className="flex gap-2">
                <Pill className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
