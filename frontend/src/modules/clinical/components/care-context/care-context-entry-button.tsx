'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Grid3x3 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { usePatientEncounters } from '@/modules/clinical/hooks/use-encounters';

/** Care Context is only offered for information-rich patients. */
export const CARE_CONTEXT_MIN_ENCOUNTERS = 10;

/**
 * Circular entry button (rubik-cube icon) that opens the Care Context workspace.
 * Renders nothing until the patient has at least CARE_CONTEXT_MIN_ENCOUNTERS
 * encounters, so patients with a thin history keep only the existing views.
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

  if ((encounters?.length ?? 0) < CARE_CONTEXT_MIN_ENCOUNTERS) return null;

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
