'use client';

import { cn } from '@/lib/utils';

interface ReportVersionIndicatorProps {
  version: number;
  reportStatus: string;
  previousVersionId?: string | null;
  className?: string;
  onViewPrevious?: () => void;
}

export function ReportVersionIndicator({
  version,
  reportStatus,
  previousVersionId,
  className,
  onViewPrevious,
}: ReportVersionIndicatorProps) {
  if (version <= 1) return null;

  return (
    <span className={cn('text-sm text-muted-foreground', className)}>
      v{version}
      {reportStatus === 'AMENDED' && ' (amended)'}
      {reportStatus === 'CORRECTED' && ' (corrected)'}
      {previousVersionId && onViewPrevious && (
        <>
          {' '}
          <button
            type="button"
            onClick={onViewPrevious}
            className="text-blue-600 underline hover:text-blue-800"
          >
            View previous
          </button>
        </>
      )}
    </span>
  );
}
