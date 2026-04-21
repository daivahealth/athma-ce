'use client';

import { useEffect, useMemo, useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Trash2, GripVertical, Search } from 'lucide-react';
import {
  usePrescriptionsByEncounter,
  useCreatePrescription,
  useDeletePrescription,
} from '@/modules/clinical/hooks/use-charting';
import { useEncounter } from '@/modules/clinical/hooks/use-encounters';
import { useMedications } from '@/modules/foundation/hooks/use-catalogs';
import { useStaffMember } from '@/modules/foundation/hooks/use-staff';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { DrugCodeSystem } from '@/modules/clinical/types/charting';
import type { Medication } from '@/modules/foundation/types/catalog';
import type { Prescription } from '@/modules/clinical/types/charting';
import { useToast } from '@/components/ui/use-toast';
import { useSmartChartingContext } from '../SmartChartingEditor';
import { BLOCK_COLORS } from '../types';

type MedicationSelection = {
  id: string;
  label: string;
  code: string;
  codeSystem: DrugCodeSystem;
  dosage: string;
  route: string;
  frequency: string;
};

export function PrescriptionBlockView({ deleteNode }: NodeViewProps) {
  const { encounterId, patientId } = useSmartChartingContext();
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebouncedValue(searchValue.trim(), 200);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const toast = useToast();

  const { data: encounter } = useEncounter(encounterId);
  const { data: prescribingStaff } = useStaffMember(encounter?.primaryStaffId);
  const { data: prescriptions = [], isLoading } = usePrescriptionsByEncounter(encounterId);
  const { data: medications } = useMedications({ search: debouncedSearch || undefined });
  const { mutateAsync: createPrescription } = useCreatePrescription();
  const { mutateAsync: deletePrescription } = useDeletePrescription();

  useEffect(() => {
    setIsPopoverOpen(Boolean(searchValue.trim()));
  }, [searchValue]);

  const existingCodes = useMemo(
    () => new Set(prescriptions.map((p) => p.drugCode)),
    [prescriptions]
  );

  const mapMedicationToSelection = (medication: Medication): MedicationSelection => ({
    id: medication.id,
    label: medication.medicationName,
    code: medication.ndcCode || medication.localCode || medication.id,
    codeSystem:
      medication.ndcCode != null && medication.ndcCode !== ''
        ? DrugCodeSystem.NDC
        : medication.localCode
        ? DrugCodeSystem.LOCAL
        : DrugCodeSystem.RXNORM,
    dosage: medication.strength || 'As directed',
    route: medication.route || 'oral',
    frequency: medication.defaultFrequency || 'once daily',
  });

  const handleAddMedication = async (selection: MedicationSelection) => {
    if (!encounter) return;

    if (existingCodes.has(selection.code)) {
      toast({
        variant: 'destructive',
        title: 'Prescription already exists',
        description: `${selection.code} is already prescribed for this encounter.`,
      });
      return;
    }

    try {
      await createPrescription({
        encounterId,
        patientId,
        drugCode: selection.code,
        codeSystem: selection.codeSystem,
        drugName: selection.label,
        dosage: selection.dosage,
        route: selection.route,
        frequency: selection.frequency,
        prescribedBy: encounter.primaryStaffId,
        ...(prescribingStaff?.displayName && { prescribedByName: prescribingStaff.displayName }),
      });
      toast({
        title: 'Prescription added',
        description: `${selection.label} created.`,
      });
      setSearchValue('');
      setIsPopoverOpen(false);
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Unable to add prescription',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    }
  };

  const handleRemovePrescription = async (prescription: Prescription) => {
    setRemovingId(prescription.id);
    try {
      await deletePrescription({ id: prescription.id, encounterId });
      toast({
        title: 'Prescription removed',
        description: `${prescription.drugName} removed.`,
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Unable to remove prescription',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <NodeViewWrapper className="smart-charting-block my-3">
      <div className="group">
        <div
          contentEditable={false}
          className="flex items-center gap-2 mb-2"
          data-drag-handle
        >
          <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Prescription
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={deleteNode}
            className="h-6 w-6 p-0 ml-auto text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div contentEditable={false} className={`pl-6 space-y-3 border-l-2 ${BLOCK_COLORS.prescription}`}>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search medications..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[min(480px,90vw)] p-0">
              <div className="max-h-72 overflow-y-auto divide-y">
                {!medications || medications.length === 0 ? (
                  <p className="p-3 text-sm text-muted-foreground">No medications found.</p>
                ) : (
                  medications.map((medication) => {
                    const selection = mapMedicationToSelection(medication);
                    const disabled = existingCodes.has(selection.code);
                    return (
                      <button
                        type="button"
                        key={selection.id}
                        className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm ${
                          disabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-muted'
                        }`}
                        onClick={() => !disabled && handleAddMedication(selection)}
                        disabled={disabled}
                      >
                        <div className="flex-1">
                          <p className="font-medium">{selection.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {selection.codeSystem} · {selection.code}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {selection.dosage} · {selection.route} · {selection.frequency}
                          </p>
                          {disabled && (
                            <p className="text-xs text-amber-600">Already prescribed</p>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </PopoverContent>
          </Popover>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading prescriptions...</p>
          ) : prescriptions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No prescriptions yet.</p>
          ) : (
            <div className="space-y-1">
              {prescriptions.map((prescription) => (
                <div key={prescription.id} className="flex items-center gap-2 py-1.5 text-sm group/item">
                  <span className="font-medium">{prescription.drugName}</span>
                  <Badge variant="outline" className="capitalize text-xs font-normal shrink-0">
                    {prescription.status}
                  </Badge>
                  <span className="text-muted-foreground">
                    {prescription.dosage} · {prescription.route} · {prescription.frequency}
                    {prescription.duration ? ` · ${prescription.duration}` : ''}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-auto text-muted-foreground opacity-0 group-hover/item:opacity-100 transition-opacity hover:text-destructive shrink-0"
                    onClick={() => handleRemovePrescription(prescription)}
                    disabled={removingId === prescription.id}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
}
