import type { BadgeTone } from '@/components/ui/tone-badge';
import { toneOf } from '@/components/ui/tone-classes';
import type { LabCollectionWorklistItem } from '@/modules/clinical/types/lab-operations';

type CollectionState = LabCollectionWorklistItem['workflowState'];

export const LAB_COLLECTION_STATE_TONE: Record<CollectionState, BadgeTone> = {
  ready: 'amber',
  prepared: 'emerald',
};

export const LAB_COLLECTION_STATE_LABEL: Record<CollectionState, string> = {
  ready: 'Ready to Prepare',
  prepared: 'Label Prepared',
};

export const labCollectionStateTone = (state: string | null | undefined): BadgeTone =>
  toneOf(LAB_COLLECTION_STATE_TONE, state);

/** A fasting requirement is the prep instruction a collector must not miss. */
export const fastingTone = (fastingRequired: boolean): BadgeTone =>
  fastingRequired ? 'orange' : 'slate';
