'use client';

import { ToneBadge } from '@/components/ui/tone-badge';
import { oncologyStatusTone } from '@/plugins/oncology/lib/oncology-tone';

export function StatusBadge({ status }: { status: string }) {
  return (
    <ToneBadge tone={oncologyStatusTone(status)} withDot className="capitalize">
      {status.toLowerCase().replace(/_/g, ' ')}
    </ToneBadge>
  );
}

export function LoadingState() {
  return (
    <div className="flex items-center justify-center h-40">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-40 border rounded-lg bg-muted/20">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
