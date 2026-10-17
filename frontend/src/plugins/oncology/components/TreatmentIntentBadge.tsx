'use client';

import { ToneBadge } from '@/components/ui/tone-badge';
import { treatmentIntentTone } from '@/plugins/oncology/lib/oncology-tone';

export function TreatmentIntentBadge({ intent }: { intent: string }) {
  return (
    <ToneBadge tone={treatmentIntentTone(intent)} className="capitalize">
      {intent.replace(/_/g, ' ')}
    </ToneBadge>
  );
}
