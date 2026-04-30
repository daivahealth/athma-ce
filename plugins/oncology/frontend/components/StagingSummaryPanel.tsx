'use client';

import { useStagings } from '../hooks/use-oncology';
import type { ChartingPanelProps } from '@/lib/plugins/types';

export function StagingSummaryPanel({ patientId }: ChartingPanelProps) {
  const { data, isLoading } = useStagings({ patientId, limit: 5 });

  if (isLoading) {
    return (
      <div className="rounded-lg border p-4">
        <h3 className="text-sm font-semibold mb-2">Oncology Staging</h3>
        <p className="text-xs text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const stagings = data?.data ?? [];

  if (stagings.length === 0) {
    return (
      <div className="rounded-lg border p-4">
        <h3 className="text-sm font-semibold mb-2">Oncology Staging</h3>
        <p className="text-xs text-muted-foreground">No staging records found</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-4">
      <h3 className="text-sm font-semibold mb-3">Oncology Staging</h3>
      <div className="space-y-3">
        {stagings.map((staging: Record<string, unknown>) => (
          <div key={staging.id as string} className="border-l-2 border-primary pl-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{staging.cancer_type as string}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                Stage {(staging.stage_group as string) || 'N/A'}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {staging.staging_system as string}
              {staging.t_category && ` | T${staging.t_category}`}
              {staging.n_category && ` N${staging.n_category}`}
              {staging.m_category && ` M${staging.m_category}`}
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(staging.staging_date as string).toLocaleDateString()}
              {staging.is_recurrence && (
                <span className="ml-2 text-destructive">Recurrence</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
