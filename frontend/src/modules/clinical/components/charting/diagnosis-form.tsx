'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Diagnosis } from '@/modules/clinical/types/charting';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';

interface DiagnosisFormProps {
  diagnoses: Diagnosis[];
  isLoading?: boolean;
  onRemove?: (diagnosisId: string) => void;
  removingId?: string | null;
}

const formatDate = (value?: string | Date | null) => {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, 'MMM dd, yyyy');
};

export function DiagnosisForm({ diagnoses, isLoading, onRemove, removingId }: DiagnosisFormProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-20 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (!diagnoses?.length) {
    return (
      <Card className="p-4 text-sm text-muted-foreground">
        No diagnoses have been added to this encounter yet. Use the “Add” button to attach ICD codes from the
        catalog.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {diagnoses.map((diagnosis) => (
        <Card key={diagnosis.id} className="p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="font-mono">
              {diagnosis.icdCode}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {diagnosis.diagnosisType.replace('_', ' ')}
            </Badge>
            {diagnosis.chronicCondition && <Badge variant="destructive">Chronic</Badge>}
            {onRemove && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto text-destructive"
                onClick={() => onRemove(diagnosis.id)}
                disabled={removingId === diagnosis.id}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div>
            <p className="font-semibold">{diagnosis.diagnosisName}</p>
            {diagnosis.notes && (
              <p className="text-sm text-muted-foreground mt-1">{diagnosis.notes}</p>
            )}
          </div>
          {diagnosis.onsetDate && (
            <>
              <Separator />
              <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide">Onset</p>
                  <p className="font-medium text-foreground">{formatDate(diagnosis.onsetDate)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide">Created</p>
                  <p className="font-medium text-foreground">{formatDate(diagnosis.createdAt)}</p>
                </div>
              </div>
            </>
          )}
        </Card>
      ))}
    </div>
  );
}
