'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Diagnosis } from '@/modules/clinical/types/charting';
import { Trash2 } from 'lucide-react';

interface DiagnosisFormProps {
  diagnoses: Diagnosis[];
  isLoading?: boolean;
  onRemove?: (diagnosisId: string) => void;
  removingId?: string | null;
  compact?: boolean;
}

export function DiagnosisForm({ diagnoses, isLoading, onRemove, removingId, compact = false }: DiagnosisFormProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-10 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (!diagnoses?.length) {
    return (
      <p className="text-sm text-muted-foreground py-2">
        No diagnoses added yet.
      </p>
    );
  }

  // Compact view for Smart Charting
  if (compact) {
    return (
      <div className="space-y-2">
        {diagnoses.map((diagnosis) => (
          <div
            key={diagnosis.id}
            className="flex items-center gap-2 py-2 text-sm group"
          >
            <Badge variant="outline" className="font-mono text-xs shrink-0">
              {diagnosis.icdCode}
            </Badge>
            <Badge variant="secondary" className="capitalize text-xs font-normal shrink-0">
              {diagnosis.diagnosisType.replace('_', ' ')}
            </Badge>
            {diagnosis.chronicCondition && (
              <Badge variant="destructive" className="text-xs shrink-0">Chronic</Badge>
            )}
            <span className="text-sm font-medium truncate flex-1">
              {diagnosis.diagnosisName}
            </span>
            {onRemove && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => onRemove(diagnosis.id)}
                disabled={removingId === diagnosis.id}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Full view for Classic charting
  return (
    <div className="space-y-3">
      {diagnoses.map((diagnosis) => (
        <div
          key={diagnosis.id}
          className="flex items-start gap-3 p-3 rounded-md border bg-card"
        >
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                {diagnosis.icdCode}
              </Badge>
              <Badge variant="secondary" className="capitalize text-xs font-normal">
                {diagnosis.diagnosisType.replace('_', ' ')}
              </Badge>
              {diagnosis.chronicCondition && (
                <Badge variant="destructive" className="text-xs">Chronic</Badge>
              )}
              <span className="text-sm font-medium">
                {diagnosis.diagnosisName}
              </span>
            </div>
            {diagnosis.notes && (
              <p className="text-xs text-muted-foreground mt-1.5">{diagnosis.notes}</p>
            )}
          </div>
          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive shrink-0"
              onClick={() => onRemove(diagnosis.id)}
              disabled={removingId === diagnosis.id}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
