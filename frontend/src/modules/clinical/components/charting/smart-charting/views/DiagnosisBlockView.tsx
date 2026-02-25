'use client';

import { useMemo, useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, GripVertical } from 'lucide-react';
import { DiagnosisAutocomplete } from '@/components/autocomplete/catalog-autocomplete.diagnosis';
import { DiagnosisForm } from '@/modules/clinical/components/charting/diagnosis-form';
import {
  useDiagnosesByEncounter,
  useCreateDiagnosis,
  useDeleteDiagnosis,
} from '@/modules/clinical/hooks/use-charting';
import { useEncounter } from '@/modules/clinical/hooks/use-encounters';
import { DiagnosisType } from '@/modules/clinical/types/charting';
import type { Diagnosis as CatalogDiagnosis } from '@/modules/foundation/types/catalog';
import { useToast } from '@/components/ui/use-toast';
import { useSmartChartingContext } from '../SmartChartingEditor';
import { BLOCK_COLORS } from '../types';

export function DiagnosisBlockView({ deleteNode }: NodeViewProps) {
  const { encounterId, patientId } = useSmartChartingContext();
  const [selectedType, setSelectedType] = useState<DiagnosisType>(DiagnosisType.PRIMARY);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const toast = useToast();

  const { data: encounter } = useEncounter(encounterId);
  const { data: diagnoses = [], isLoading } = useDiagnosesByEncounter(encounterId);
  const { mutateAsync: createDiagnosis } = useCreateDiagnosis();
  const { mutateAsync: deleteDiagnosis } = useDeleteDiagnosis();

  const existingCodes = useMemo(
    () => new Set(diagnoses.map((d) => d.icdCode)),
    [diagnoses]
  );

  const handleAddDiagnosis = async (catalogDiagnosis: CatalogDiagnosis) => {
    if (!encounter) return;

    if (existingCodes.has(catalogDiagnosis.code)) {
      toast({
        variant: 'destructive',
        title: 'Diagnosis already added',
        description: `${catalogDiagnosis.code} is already recorded for this encounter.`,
      });
      return;
    }

    try {
      await createDiagnosis({
        encounterId,
        patientId,
        icdCode: catalogDiagnosis.code,
        diagnosisName: catalogDiagnosis.shortDescription || catalogDiagnosis.description,
        diagnosisType: selectedType,
        diagnosisRank: diagnoses.length + 1,
        diagnosedBy: encounter.primaryStaffId,
      });
      toast({
        title: 'Diagnosis added',
        description: `${catalogDiagnosis.code} attached to encounter.`,
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Unable to add diagnosis',
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    }
  };

  const handleRemoveDiagnosis = async (diagnosisId: string) => {
    setRemovingId(diagnosisId);
    try {
      await deleteDiagnosis({ id: diagnosisId, encounterId });
      toast({
        title: 'Diagnosis removed',
        description: 'The diagnosis was removed from this encounter.',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Unable to remove diagnosis',
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
            Diagnosis
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
        <div contentEditable={false} className={`pl-6 space-y-3 border-l-2 ${BLOCK_COLORS.diagnosis}`}>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="flex-1">
              <DiagnosisAutocomplete
                disabledCodes={existingCodes}
                onSelect={handleAddDiagnosis}
              />
            </div>
            <Select value={selectedType} onValueChange={(value) => setSelectedType(value as DiagnosisType)}>
              <SelectTrigger className="md:w-40 h-9">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(DiagnosisType).map((type) => (
                  <SelectItem key={type} value={type} className="capitalize">
                    {type.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DiagnosisForm
            diagnoses={diagnoses}
            isLoading={isLoading}
            onRemove={handleRemoveDiagnosis}
            removingId={removingId}
            compact
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
}
