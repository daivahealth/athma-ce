/**
 * React Query hook for the AI Care Narrative.
 *
 * Resolves to either the LLM-generated narrative (`available: true`) or a structured
 * `{ available: false, reason }` when the ai-gateway has no LLM provider configured.
 * The Care Context timeline panel renders the local narrative preview whenever the
 * result is unavailable, so this hook never throws for the "unavailable" case.
 */

import { useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { careNarrativeService } from '../services/care-narrative-service';
import type { CareNarrativeResult } from '../types/care-narrative';

const CARE_NARRATIVE_KEYS = {
  all: ['care-narrative'] as const,
  patient: (patientId: string, specialty?: string) =>
    [...CARE_NARRATIVE_KEYS.all, patientId, specialty ?? ''] as const,
};

export function useCareNarrative(patientId: string, specialty?: string, enabled: boolean = true) {
  // Read once and cleared inside queryFn, so a normal refetch (e.g. query
  // invalidation) still hits the server-side cache; only `regenerate()` forces
  // a fresh LLM call by setting this before triggering the refetch.
  const forceRefreshRef = useRef(false);

  const query = useQuery<CareNarrativeResult>({
    queryKey: CARE_NARRATIVE_KEYS.patient(patientId, specialty),
    queryFn: () => {
      const forceRefresh = forceRefreshRef.current;
      forceRefreshRef.current = false;
      return careNarrativeService.generate(patientId, { specialty, forceRefresh });
    },
    enabled: enabled && !!patientId,
    staleTime: 10 * 60 * 1000, // 10 minutes — generation is relatively expensive
    gcTime: 30 * 60 * 1000,
    retry: false,
  });

  /** Regenerate the narrative, bypassing the ai-gateway's Redis cache. */
  const regenerate = useCallback(() => {
    forceRefreshRef.current = true;
    return query.refetch();
  }, [query]);

  return { ...query, regenerate };
}
