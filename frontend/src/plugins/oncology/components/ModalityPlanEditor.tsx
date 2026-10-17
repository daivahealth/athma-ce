'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { useProtocols } from '../hooks/use-oncology';
import type { ChemoProtocol, PlannedModality, TreatmentModality } from '../types';

export interface ModalityFormRow {
  modality: TreatmentModality | '';
  sequence: number;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  details: string;
  protocolId: string;
  plannedCycles: string;
  cycleDurationDays: string;
  plannedFractions: string;
  startDate: string;
  endDate: string;
}

const MODALITIES: { value: TreatmentModality; label: string }[] = [
  { value: 'surgery', label: 'Surgery' },
  { value: 'chemotherapy', label: 'Chemotherapy' },
  { value: 'radiation', label: 'Radiation' },
  { value: 'immunotherapy', label: 'Immunotherapy' },
  { value: 'hormonal', label: 'Hormonal Therapy' },
  { value: 'targeted', label: 'Targeted Therapy' },
  { value: 'palliative', label: 'Palliative Care' },
  { value: 'surveillance', label: 'Surveillance' },
];

export function emptyModalityRow(sequence: number): ModalityFormRow {
  return {
    modality: '',
    sequence,
    status: 'planned',
    details: '',
    protocolId: '',
    plannedCycles: '',
    cycleDurationDays: '',
    plannedFractions: '',
    startDate: '',
    endDate: '',
  };
}

export function fromPlannedModalities(modalities?: PlannedModality[]): ModalityFormRow[] {
  if (!modalities?.length) return [emptyModalityRow(1)];
  return modalities.map((m) => ({
    modality: m.modality,
    sequence: m.sequence,
    status: m.status,
    details: m.details ?? '',
    protocolId: m.protocolId ?? '',
    plannedCycles: m.plannedCycles?.toString() ?? '',
    cycleDurationDays: m.cycleDurationDays?.toString() ?? '',
    plannedFractions: m.plannedFractions?.toString() ?? '',
    startDate: m.startDate?.substring(0, 10) ?? '',
    endDate: m.endDate?.substring(0, 10) ?? '',
  }));
}

export function toPlannedModalitiesPayload(
  rows: ModalityFormRow[],
  protocols: ChemoProtocol[],
): PlannedModality[] {
  return rows
    .filter((m): m is ModalityFormRow & { modality: TreatmentModality } => !!m.modality)
    .map((m) => {
      const protocol =
        m.modality === 'chemotherapy' && m.protocolId
          ? protocols.find((p) => p.id === m.protocolId)
          : undefined;
      return {
        modality: m.modality,
        sequence: m.sequence,
        status: m.status,
        details: m.details || undefined,
        protocolId: protocol?.id,
        protocolCode: protocol?.code,
        protocolName: protocol?.name,
        plannedCycles: m.plannedCycles ? parseInt(m.plannedCycles, 10) : undefined,
        cycleDurationDays: m.cycleDurationDays ? parseInt(m.cycleDurationDays, 10) : undefined,
        plannedFractions: m.plannedFractions ? parseInt(m.plannedFractions, 10) : undefined,
        startDate: m.startDate || undefined,
        endDate: m.endDate || undefined,
      };
    });
}

/** Overall cycles kept on the plan for list views — taken from the first chemo modality. */
export function deriveOverallSchedule(rows: ModalityFormRow[]): {
  plannedCycles?: number;
  cycleDurationDays?: number;
} {
  const chemo = rows.find((m) => m.modality === 'chemotherapy');
  return {
    plannedCycles: chemo?.plannedCycles ? parseInt(chemo.plannedCycles, 10) : undefined,
    cycleDurationDays: chemo?.cycleDurationDays ? parseInt(chemo.cycleDurationDays, 10) : undefined,
  };
}

const CYCLE_BASED: TreatmentModality[] = ['chemotherapy', 'immunotherapy', 'targeted', 'hormonal'];

interface ModalityPlanEditorProps {
  rows: ModalityFormRow[];
  onChange: (rows: ModalityFormRow[]) => void;
  /** Cancer type of the linked diagnosis — filters the chemo protocol list. */
  cancerType?: string;
}

export function ModalityPlanEditor({ rows, onChange, cancerType }: ModalityPlanEditorProps) {
  // Parents building the submit payload use the same query (shared react-query cache)
  const { data: protocolsData } = useProtocols(cancerType ? { cancerType } : undefined);
  const protocols: ChemoProtocol[] = protocolsData?.data ?? [];

  const addRow = () => onChange([...rows, emptyModalityRow(rows.length + 1)]);

  const removeRow = (i: number) =>
    onChange(rows.filter((_, idx) => idx !== i).map((m, idx) => ({ ...m, sequence: idx + 1 })));

  const updateRow = (i: number, patch: Partial<ModalityFormRow>) =>
    onChange(rows.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));

  const handleModalityChange = (i: number, value: string) => {
    const modality = (value === '__none' ? '' : value) as TreatmentModality | '';
    // Protocol and schedule fields are modality-specific — clear them on change
    updateRow(i, {
      modality,
      protocolId: '',
      plannedCycles: '',
      cycleDurationDays: '',
      plannedFractions: '',
    });
  };

  const handleProtocolChange = (i: number, value: string) => {
    const protocolId = value === '__none' ? '' : value;
    const protocol = protocols.find((p) => p.id === protocolId);
    updateRow(i, {
      protocolId,
      // Default the schedule from the protocol; the user can still adjust
      plannedCycles: protocol ? protocol.total_cycles.toString() : rows[i].plannedCycles,
      cycleDurationDays: protocol ? protocol.cycle_duration_days.toString() : rows[i].cycleDurationDays,
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b pb-1">
        <h3 className="text-sm font-semibold">Planned Modalities</h3>
        <Button type="button" variant="ghost" size="sm" onClick={addRow}>
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add
        </Button>
      </div>

      {rows.map((m, i) => {
        const selectedProtocol = protocols.find((p) => p.id === m.protocolId);
        const isChemo = m.modality === 'chemotherapy';
        const isCycleBased = !!m.modality && CYCLE_BASED.includes(m.modality);
        const isRadiation = m.modality === 'radiation';
        return (
          <div key={i} className="rounded-md border p-3 space-y-2">
            <div className="flex gap-2 items-start">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <Select
                  value={m.modality || '__none'}
                  onValueChange={(v) => handleModalityChange(i, v)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Modality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">— Modality —</SelectItem>
                    {MODALITIES.map((mod) => (
                      <SelectItem key={mod.value} value={mod.value}>{mod.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={m.status}
                  onValueChange={(v) => updateRow(i, { status: v as ModalityFormRow['status'] })}
                >
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {rows.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeRow(i)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            {isChemo && (
              <div className="space-y-1">
                <Label className="text-xs">Chemo Protocol</Label>
                <Select
                  value={m.protocolId || '__none'}
                  onValueChange={(v) => handleProtocolChange(i, v)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select protocol..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">— No protocol —</SelectItem>
                    {protocols.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.code} — {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedProtocol && (
                  <p className="text-xs text-muted-foreground">
                    {selectedProtocol.total_cycles} cycles × {selectedProtocol.cycle_duration_days} days
                    {selectedProtocol.emetogenic_risk ? ` · ${selectedProtocol.emetogenic_risk} emetogenic` : ''}
                  </p>
                )}
                {!protocols.length && (
                  <p className="text-xs text-muted-foreground">
                    No protocols found{cancerType ? ` for ${cancerType}` : ''}.
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {isCycleBased && (
                <>
                  <div className="space-y-1">
                    <Label className="text-xs">Planned Cycles</Label>
                    <Input
                      className="h-8 text-xs"
                      type="number"
                      min={1}
                      placeholder="e.g. 6"
                      value={m.plannedCycles}
                      onChange={(e) => updateRow(i, { plannedCycles: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Cycle Duration (days)</Label>
                    <Input
                      className="h-8 text-xs"
                      type="number"
                      min={1}
                      placeholder="e.g. 21"
                      value={m.cycleDurationDays}
                      onChange={(e) => updateRow(i, { cycleDurationDays: e.target.value })}
                    />
                  </div>
                </>
              )}
              {isRadiation && (
                <div className="space-y-1">
                  <Label className="text-xs">Planned Fractions</Label>
                  <Input
                    className="h-8 text-xs"
                    type="number"
                    min={1}
                    placeholder="e.g. 30"
                    value={m.plannedFractions}
                    onChange={(e) => updateRow(i, { plannedFractions: e.target.value })}
                  />
                </div>
              )}
              {m.modality && (
                <>
                  <div className="space-y-1">
                    <Label className="text-xs">Start Date</Label>
                    <Input
                      className="h-8 text-xs"
                      type="date"
                      value={m.startDate}
                      onChange={(e) => updateRow(i, { startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">End Date</Label>
                    <Input
                      className="h-8 text-xs"
                      type="date"
                      value={m.endDate}
                      onChange={(e) => updateRow(i, { endDate: e.target.value })}
                    />
                  </div>
                </>
              )}
            </div>

            <Input
              className="h-8 text-xs"
              placeholder="Details (optional)"
              value={m.details}
              onChange={(e) => updateRow(i, { details: e.target.value })}
            />
          </div>
        );
      })}
    </div>
  );
}
