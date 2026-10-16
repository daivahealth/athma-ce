'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Copy, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { ProtocolPhase, ProtocolPhaseDrug, ProtocolDrugOverride } from '@/plugins/oncology/types';
import { emptyPhaseDrug, formatNumberList } from '@/plugins/oncology/lib/protocol-phases';
import { NumberListInput } from './NumberListInput';
import { phaseAccent } from './phase-colors';

interface Props {
  phase: ProtocolPhase;
  index: number;
  count: number;
  startCycle: number;
  onChange: (phase: ProtocolPhase) => void;
  onMove: (dir: -1 | 1) => void;
  onDuplicate: () => void;
  onRemove: () => void;
}

const num = (v: string) => (v === '' ? undefined : parseFloat(v));

export function PhaseEditor({ phase, index, count, startCycle, onChange, onMove, onDuplicate, onRemove }: Props) {
  const accent = phaseAccent(index);
  const endCycle = startCycle + Math.max(1, phase.cycles || 1) - 1;
  const setDrug = (i: number, patch: Partial<ProtocolPhaseDrug>) =>
    onChange({ ...phase, drugs: phase.drugs.map((d, idx) => (idx === i ? { ...d, ...patch } : d)) });

  return (
    <div className={cn('rounded-lg border border-l-4 bg-card', accent.border)}>
      <div className="flex flex-wrap items-end gap-3 p-4 border-b">
        <div className="space-y-1 flex-1 min-w-[180px]">
          <Label className="text-xs">Phase name</Label>
          <Input className="h-8" aria-label="Phase name" value={phase.name} onChange={(e) => onChange({ ...phase, name: e.target.value })} placeholder="e.g. AC, Paclitaxel, Maintenance" />
        </div>
        <div className="space-y-1 w-24">
          <Label className="text-xs">Cycles</Label>
          <Input className="h-8" aria-label="Phase cycles" type="number" min={1} value={phase.cycles || ''} onChange={(e) => onChange({ ...phase, cycles: parseInt(e.target.value, 10) || 0 })} />
        </div>
        <div className="space-y-1 w-32">
          <Label className="text-xs">Cycle length (days)</Label>
          <Input className="h-8" aria-label="Cycle length in days" type="number" min={1} value={phase.cycleDurationDays || ''} onChange={(e) => onChange({ ...phase, cycleDurationDays: parseInt(e.target.value, 10) || 0 })} />
        </div>
        <Badge variant="outline" className="h-8 px-3 font-mono">
          {startCycle === endCycle ? `C${startCycle}` : `C${startCycle}–C${endCycle}`}
        </Badge>
        <div className="flex gap-1 ml-auto">
          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={index === 0} onClick={() => onMove(-1)} aria-label="Move phase up"><ArrowUp className="h-3.5 w-3.5" /></Button>
          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={index === count - 1} onClick={() => onMove(1)} aria-label="Move phase down"><ArrowDown className="h-3.5 w-3.5" /></Button>
          <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onDuplicate} aria-label="Duplicate phase"><Copy className="h-3.5 w-3.5" /></Button>
          {count > 1 && (
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" onClick={onRemove} aria-label="Remove phase"><Trash2 className="h-3.5 w-3.5" /></Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-1">
          <span className="col-span-3">Drug</span><span>Dose</span><span>Unit</span><span>Route</span>
          <span className="col-span-2">Days (e.g. 1, 8)</span><span>Formula</span><span>Infusion (min)</span><span />
        </div>
        {phase.drugs.map((drug, i) => (
          <DrugLine
            key={drug.id}
            drug={drug}
            phaseCycles={phase.cycles}
            startCycle={startCycle}
            canRemove={phase.drugs.length > 1}
            onChange={(patch) => setDrug(i, patch)}
            onRemove={() => onChange({ ...phase, drugs: phase.drugs.filter((_, idx) => idx !== i) })}
          />
        ))}
        <Button type="button" variant="ghost" size="sm" onClick={() => onChange({ ...phase, drugs: [...phase.drugs, emptyPhaseDrug()] })}>
          <Plus className="h-4 w-4 mr-1" />Add drug to {phase.name || 'phase'}
        </Button>
      </div>
    </div>
  );
}

interface DrugLineProps {
  drug: ProtocolPhaseDrug;
  phaseCycles: number;
  startCycle: number;
  canRemove: boolean;
  onChange: (patch: Partial<ProtocolPhaseDrug>) => void;
  onRemove: () => void;
}

function DrugLine({ drug, phaseCycles, startCycle, canRemove, onChange, onRemove }: DrugLineProps) {
  const [open, setOpen] = useState(false);
  const overrides = drug.overrides ?? [];
  const levels = drug.doseLevels ?? [];
  const levelDose = (level: number) => levels.find((l) => l.level === level)?.dose;
  const setLevel = (level: number, dose: number | undefined) =>
    onChange({
      doseLevels: [...levels.filter((l) => l.level !== level), ...(dose ? [{ level, dose }] : [])]
        .sort((a, b) => b.level - a.level),
    });
  const setOverride = (i: number, patch: Partial<ProtocolDrugOverride>) =>
    onChange({ overrides: overrides.map((o, idx) => (idx === i ? { ...o, ...patch } : o)) });
  const extras = overrides.length + levels.length;

  return (
    <div className="rounded-md border border-transparent hover:border-border">
      <div className="grid grid-cols-12 gap-2 items-center">
        <Input className="h-8 col-span-3" placeholder="Drug name" aria-label="Drug name" value={drug.drug} onChange={(e) => onChange({ drug: e.target.value })} />
        <Input className="h-8" type="number" min={0} value={drug.dose || ''} onChange={(e) => onChange({ dose: parseFloat(e.target.value) || 0 })} aria-label="Dose" />
        <Select value={drug.unit} onValueChange={(v) => onChange({ unit: v })}>
          <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
          <SelectContent>
            {['mg/m²', 'mg/kg', 'mg', 'units/m²', 'AUC'].map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={drug.route} onValueChange={(v) => onChange({ route: v })}>
          <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
          <SelectContent>
            {['IV', 'PO', 'SC', 'IM', 'IT'].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <NumberListInput className="h-8 col-span-2" value={drug.days} onChange={(days) => onChange({ days })} placeholder="1" aria-label="Days" />
        <Select value={drug.doseFormula} onValueChange={(v) => onChange({ doseFormula: v as ProtocolPhaseDrug['doseFormula'] })}>
          <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="bsa">BSA</SelectItem>
            <SelectItem value="weight">Weight</SelectItem>
            <SelectItem value="fixed">Fixed</SelectItem>
            <SelectItem value="auc">AUC</SelectItem>
          </SelectContent>
        </Select>
        <Input className="h-8" type="number" min={0} placeholder="—" value={drug.infusionDurationMin ?? ''} onChange={(e) => onChange({ infusionDurationMin: parseInt(e.target.value, 10) || undefined })} aria-label="Infusion minutes" />
        <div className="flex gap-1 items-center justify-end">
          <Button type="button" variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
            {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            {extras > 0 && <span className="ml-0.5 text-amber-600">{extras}</span>}
          </Button>
          {canRemove && (
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" onClick={onRemove} aria-label={`Remove ${drug.drug || 'drug'}`}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {open && (
        <div className="mt-2 mb-3 ml-2 space-y-4 rounded-md bg-muted/40 p-3">
          <div className="grid grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Diluent</Label>
              <Input className="h-8" value={drug.diluent ?? ''} onChange={(e) => onChange({ diluent: e.target.value || undefined })} placeholder="e.g. NS 500 mL" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Max dose (mg)</Label>
              <Input className="h-8" type="number" min={0} value={drug.maxDose ?? ''} onChange={(e) => onChange({ maxDose: num(e.target.value) })} placeholder="No cap" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Dose level −1 ({drug.unit})</Label>
              <Input className="h-8" type="number" min={0} value={levelDose(-1) ?? ''} onChange={(e) => setLevel(-1, num(e.target.value))} placeholder={drug.dose ? String(Math.round(drug.dose * 0.8 * 10) / 10) : ''} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Dose level −2 ({drug.unit})</Label>
              <Input className="h-8" type="number" min={0} value={levelDose(-2) ?? ''} onChange={(e) => setLevel(-2, num(e.target.value))} placeholder={drug.dose ? String(Math.round(drug.dose * 0.6 * 10) / 10) : ''} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium">Cycle-specific changes</p>
                <p className="text-xs text-muted-foreground">Cycle numbers are within this phase (1–{phaseCycles || 1}). Leave a field blank to keep the phase default.</p>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange({ overrides: [...overrides, { cycles: [1] }] })}>
                <Plus className="h-4 w-4 mr-1" />Add change
              </Button>
            </div>
            {overrides.length === 0 && <p className="text-xs text-muted-foreground">Same dose and days every cycle.</p>}
            {overrides.length > 0 && (
              <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-1">
                <span className="col-span-2">Phase cycles</span><span className="col-span-2">Dose ({drug.unit})</span>
                <span className="col-span-2">Days</span><span>Omit</span><span className="col-span-4">Note</span><span />
              </div>
            )}
            {overrides.map((o, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-2">
                  <NumberListInput className="h-8" value={o.cycles} onChange={(cycles) => setOverride(i, { cycles })} placeholder="1" aria-label="Phase cycles" />
                  {o.cycles.length > 0 && (
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">= C{formatNumberList(o.cycles.map((c) => c + startCycle - 1))}</p>
                  )}
                </div>
                <Input className="h-8 col-span-2" type="number" min={0} disabled={o.omit} value={o.dose ?? ''} placeholder={String(drug.dose || '')} onChange={(e) => setOverride(i, { dose: num(e.target.value) })} aria-label="Override dose" />
                <NumberListInput className="h-8 col-span-2" value={o.days ?? []} onChange={(days) => setOverride(i, { days })} placeholder={formatNumberList(drug.days)} aria-label="Override days" />
                <div className="flex items-center">
                  <Checkbox checked={!!o.omit} onChange={(e) => setOverride(i, { omit: e.target.checked || undefined })} aria-label="Omit drug in these cycles" />
                </div>
                <Input className="h-8 col-span-4" value={o.note ?? ''} placeholder="e.g. loading dose" onChange={(e) => setOverride(i, { note: e.target.value || undefined })} />
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" onClick={() => onChange({ overrides: overrides.filter((_, idx) => idx !== i) })} aria-label="Remove change">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
