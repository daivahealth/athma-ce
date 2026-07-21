'use client';

import { cn } from '@/lib/utils';
import { ResultStatusBadge } from './ResultStatusBadge';
import type { PatientResult } from '../../types/reporting';

const typeIcons: Record<string, string> = {
  lab: '\u{1F9EA}',      // test tube
  imaging: '\u{1F4F7}',  // camera
  procedure: '\u{2702}',  // scissors
};

const typeLabels: Record<string, string> = {
  lab: 'Lab',
  imaging: 'Imaging',
  procedure: 'Procedure',
};

interface ResultTimelineProps {
  results: PatientResult[];
  onResultClick?: (result: PatientResult) => void;
  selectedResultId?: string;
  className?: string;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getSummaryText(result: PatientResult): string | null {
  if (result.labSummary) {
    const { itemCount, abnormalCount, criticalCount } = result.labSummary;
    const parts: string[] = [`${itemCount} test${itemCount !== 1 ? 's' : ''}`];
    if (criticalCount > 0) parts.push(`${criticalCount} critical`);
    else if (abnormalCount > 0) parts.push(`${abnormalCount} abnormal`);
    return parts.join(', ');
  }
  if (result.imagingSummary) {
    if (result.imagingSummary.criticalFinding) return 'Critical finding';
    if (result.imagingSummary.impression) {
      return result.imagingSummary.impression.length > 80
        ? result.imagingSummary.impression.slice(0, 80) + '...'
        : result.imagingSummary.impression;
    }
    return null;
  }
  if (result.procedureSummary?.complications) {
    return `Complications: ${result.procedureSummary.complications.slice(0, 60)}`;
  }
  return null;
}

export function ResultTimeline({ results, onResultClick, selectedResultId, className }: ResultTimelineProps) {
  if (results.length === 0) {
    return (
      <div className={cn('py-8 text-center text-muted-foreground', className)}>
        No results found
      </div>
    );
  }

  // Group by date
  const grouped = results.reduce<Record<string, PatientResult[]>>((acc, result) => {
    const date = formatDate(result.createdAt);
    if (!acc[date]) acc[date] = [];
    acc[date].push(result);
    return acc;
  }, {});

  return (
    <div className={cn('space-y-6', className)}>
      {Object.entries(grouped).map(([date, dateResults]) => (
        <div key={date}>
          <h4 className="mb-3 text-sm font-medium text-muted-foreground">{date}</h4>
          <div className="space-y-2">
            {dateResults.map((result) => {
              const summary = getSummaryText(result);
              const hasCritical =
                result.labSummary?.criticalCount
                  ? result.labSummary.criticalCount > 0
                  : result.imagingSummary?.criticalFinding || false;

              return (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => onResultClick?.(result)}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50',
                    hasCritical && 'border-red-200 bg-red-50',
                    selectedResultId === result.id && 'border-primary bg-primary/5 hover:bg-primary/10',
                  )}
                >
                  <span className="text-lg" title={typeLabels[result.reportType]}>
                    {typeIcons[result.reportType] || ''}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{result.orderName}</span>
                      <ResultStatusBadge status={result.reportStatus} />
                      {result.version > 1 && (
                        <span className="text-xs text-muted-foreground">v{result.version}</span>
                      )}
                    </div>
                    {summary && (
                      <p className="mt-0.5 text-sm text-muted-foreground truncate">{summary}</p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {typeLabels[result.reportType]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
