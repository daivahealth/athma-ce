'use client';

import { ToneBadge } from '@/components/ui/tone-badge';
import { reportStatusTone } from '../../utils/lab-result-tone';
import { ReportStatus } from '../../types/reporting';

const statusLabel: Record<string, string> = {
  [ReportStatus.DRAFT]: 'Draft',
  [ReportStatus.PRELIMINARY]: 'Preliminary',
  [ReportStatus.FINAL]: 'Final',
  [ReportStatus.AMENDED]: 'Amended',
  [ReportStatus.CORRECTED]: 'Corrected',
  [ReportStatus.CANCELLED]: 'Cancelled',
};

interface ResultStatusBadgeProps {
  status: string;
  className?: string;
}

export function ResultStatusBadge({ status, className }: ResultStatusBadgeProps) {
  return (
    <ToneBadge tone={reportStatusTone(status)} withDot className={className}>
      {statusLabel[status] ?? status}
    </ToneBadge>
  );
}
