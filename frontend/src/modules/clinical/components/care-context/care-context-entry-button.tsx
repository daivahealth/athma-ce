'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Grid3x3 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { usePatientEncounters } from '@/modules/clinical/hooks/use-encounters';
import { useResolveConfig } from '@/modules/foundation/hooks/use-configs';

/** Care Context config key, editable at /configurations (category: clinical). */
export const CARE_CONTEXT_MIN_ENCOUNTERS_CONFIG_KEY = 'care_context.min_encounters';

/** Fallback used only while the config value is still loading. */
export const CARE_CONTEXT_MIN_ENCOUNTERS_DEFAULT = 5;

/**
 * Circular entry button (rubik-cube icon) that opens the Care Context workspace.
 * Renders nothing until the patient has at least the configured minimum number
 * of encounters (care_context.min_encounters, see /configurations), so patients
 * with a thin history keep only the existing views.
 */
export function CareContextEntryButton({
  patientId,
  locale,
  size = 'sm',
  stopPropagation = false,
}: {
  patientId: string;
  locale: string;
  size?: 'sm' | 'md';
  stopPropagation?: boolean;
}) {
  const router = useRouter();
  const { data: encounters } = usePatientEncounters(patientId);
  const { data: minEncountersConfig } = useResolveConfig(CARE_CONTEXT_MIN_ENCOUNTERS_CONFIG_KEY);
  const minEncounters = Number(minEncountersConfig?.value ?? CARE_CONTEXT_MIN_ENCOUNTERS_DEFAULT);

  if ((encounters?.length ?? 0) < minEncounters) return null;

  const dim = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9';

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(dim, 'rounded-full')}
      aria-label="Open Care Context"
      title="Open Care Context"
      onClick={(e) => {
        if (stopPropagation) e.stopPropagation();
        router.push(`/${locale}/patients/${patientId}/care-context`);
      }}
    >
      <Grid3x3 className="h-4 w-4" />
    </Button>
  );
}
