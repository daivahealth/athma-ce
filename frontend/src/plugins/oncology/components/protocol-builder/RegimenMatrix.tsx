'use client';

import { useMemo, useState } from 'react';
import { RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { ProtocolPhase } from '@/plugins/oncology/types';
import {
  buildMatrix, formatDays, setCycleOverride, type MatrixCell,
} from '@/plugins/oncology/lib/protocol-phases';
import { NumberListInput } from './NumberListInput';
import { phaseAccent } from './phase-colors';

interface Props {
  phases: ProtocolPhase[];
  onChange: (phases: ProtocolPhase[]) => void;
}

interface Selection { cycle: number; rowKey: string }

/** Drug × cycle grid. Click a cell to change that one cycle (dose, days or omit). */
export function RegimenMatrix({ phases, onChange }: Props) {
  const { cycles, rows } = useMemo(() => buildMatrix(phases), [phases]);
  const [sel, setSel] = useState<Selection | null>(null);

  const selectedCell: MatrixCell | null = sel
    ? rows.find((r) => r.key === sel.rowKey)?.cells[sel.cycle - 1] ?? null
    : null;

  if (!rows.length || !cycles.length) {
    return <p className="text-sm text-muted-foreground py-6 text-center">Add phases and drugs to see the cycle matrix.</p>;
  }

  // Phase header spans
  const spans = phases.map((ph, i) => ({ name: ph.name || `Phase ${i + 1}`, count: Math.max(0, ph.cycles || 0), i }))
    .filter((s) => s.count > 0);

  const applyOverride = (patch: Parameters<typeof setCycleOverride>[2]) => {
    if (!selectedCell) return;
    const { phaseIndex, phaseCycle, lineId } = selectedCell;
    onChange(phases.map((ph, i) => (i !== phaseIndex ? ph : {
      ...ph,
      drugs: ph.drugs.map((d) => (d.id === lineId ? setCycleOverride(d, phaseCycle, patch) : d)),
    })));
  };

  const base = selectedCell
    ? phases[selectedCell.phaseIndex]?.drugs.find((d) => d.id === selectedCell.lineId)
    : undefined;

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-md border">
        <table className="text-xs border-collapse min-w-full">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-background border-b border-r p-2 text-left font-medium min-w-[160px]" rowSpan={2}>Drug</th>
              {spans.map((s) => (
                <th key={s.i} colSpan={s.count} className={cn('border-b border-r p-1.5 text-center font-medium', phaseAccent(s.i).bg)}>
                  {s.name}
                </th>
              ))}
            </tr>
            <tr>
              {cycles.map((c) => (
                <th key={c.cycle} className="border-b border-r p-1.5 text-center font-mono font-normal text-muted-foreground min-w-[84px]">
                  C{c.cycle}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <td className="sticky left-0 z-10 bg-background border-b border-r p-2 font-medium">{row.drug}</td>
                {row.cells.map((cell, ci) => {
                  const isSel = sel?.rowKey === row.key && sel.cycle === ci + 1;
                  if (!cell) {
                    return <td key={ci} className="border-b border-r p-1.5 text-center text-muted-foreground/50">—</td>;
                  }
                  const r = cell.resolved;
                  return (
                    <td key={ci} className="border-b border-r p-0">
                      <button
                        type="button"
                        onClick={() => setSel(isSel ? null : { cycle: ci + 1, rowKey: row.key })}
                        className={cn(
                          'w-full h-full p-1.5 text-center leading-tight hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                          r.overridden && 'bg-amber-500/10',
                          isSel && 'ring-2 ring-primary ring-inset',
                        )}
                        title={r.note}
                        aria-label={`${row.drug} cycle ${ci + 1}`}
                      >
                        {r.omitted ? (
                          <span className="text-muted-foreground line-through">omit</span>
                        ) : (
                          <>
                            <div className={cn('font-medium', r.overridden && 'text-amber-700 dark:text-amber-400')}>{r.dose} <span className="font-normal text-muted-foreground">{r.unit}</span></div>
                            <div className="text-muted-foreground font-mono">{formatDays(r.days)}</div>
                          </>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        <span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-500/30 align-middle mr-1" />
        Changed for that cycle. Click any cell to change dose, days or omit the drug for that cycle only.
      </p>

      {selectedCell && base && (
        <CellEditor
          key={`${sel!.rowKey}-${sel!.cycle}`}
          title={`${base.drug} · C${sel!.cycle} (${phases[selectedCell.phaseIndex].name} cycle ${selectedCell.phaseCycle})`}
          unit={base.unit}
          baseDose={base.dose}
          baseDays={base.days}
          baseInfusion={base.infusionDurationMin}
          current={selectedCell.resolved}
          onApply={applyOverride}
          onClose={() => setSel(null)}
        />
      )}
    </div>
  );
}

interface CellEditorProps {
  title: string;
  unit: string;
  baseDose: number;
  baseDays: number[];
  baseInfusion?: number;
  current: MatrixCell['resolved'];
  onApply: (patch: Parameters<typeof setCycleOverride>[2]) => void;
  onClose: () => void;
}

function CellEditor({ title, unit, baseDose, baseDays, baseInfusion, current, onApply, onClose }: CellEditorProps) {
  const [dose, setDose] = useState(current.dose !== baseDose ? String(current.dose) : '');
  const [days, setDays] = useState<number[]>(current.days !== baseDays ? current.days : []);
  const [infusion, setInfusion] = useState(
    current.infusionDurationMin != null && current.infusionDurationMin !== baseInfusion ? String(current.infusionDurationMin) : '',
  );
  const [omit, setOmit] = useState(current.omitted);
  const [note, setNote] = useState(current.note ?? '');

  const save = () => {
    const d = dose === '' ? undefined : parseFloat(dose);
    const inf = infusion === '' ? undefined : parseInt(infusion, 10);
    const infChanged = inf != null && inf !== baseInfusion;
    const changed = omit || (d != null && d !== baseDose) || days.length > 0 || infChanged || note;
    onApply(changed ? {
      dose: d != null && d !== baseDose ? d : undefined,
      days: days.length ? days : undefined,
      infusionDurationMin: infChanged ? inf : undefined,
      omit: omit || undefined,
      note: note || undefined,
    } : null);
  };

  return (
    <div className="rounded-md border bg-muted/30 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{title}</p>
        <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose} aria-label="Close"><X className="h-3.5 w-3.5" /></Button>
      </div>
      <div className="grid grid-cols-12 gap-3 items-end">
        <div className="space-y-1 col-span-2">
          <Label className="text-xs">Dose ({unit})</Label>
          <Input className="h-8" type="number" min={0} disabled={omit} value={dose} placeholder={String(baseDose)} onChange={(e) => setDose(e.target.value)} />
        </div>
        <div className="space-y-1 col-span-2">
          <Label className="text-xs">Days</Label>
          <NumberListInput className="h-8" value={days} onChange={setDays} placeholder={baseDays.join(', ')} />
        </div>
        <div className="space-y-1 col-span-2">
          <Label className="text-xs">Infusion (min)</Label>
          <Input className="h-8" type="number" min={0} disabled={omit} value={infusion} placeholder={baseInfusion ? String(baseInfusion) : '—'} onChange={(e) => setInfusion(e.target.value)} />
        </div>
        <label className="col-span-2 flex items-center gap-2 h-8 text-xs">
          <Checkbox checked={omit} onChange={(e) => setOmit(e.target.checked)} />
          Omit this cycle
        </label>
        <div className="space-y-1 col-span-2">
          <Label className="text-xs">Note</Label>
          <Input className="h-8" value={note} placeholder="e.g. loading dose" onChange={(e) => setNote(e.target.value)} />
        </div>
        <div className="col-span-2 flex gap-1 justify-end">
          {current.overridden && (
            <Button type="button" variant="ghost" size="sm" className="h-8" onClick={() => onApply(null)} title="Back to phase default">
              <RotateCcw className="h-3.5 w-3.5 mr-1" />Reset
            </Button>
          )}
          <Button type="button" size="sm" className="h-8" onClick={save}>Apply</Button>
        </div>
      </div>
    </div>
  );
}
