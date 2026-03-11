/**
 * Hook for AI-powered clinical coding suggestions.
 */

import { useQuery } from '@tanstack/react-query';
import { clinicalCodingService } from '../services/clinical-coding-service';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useResolveConfig } from '@/modules/foundation/hooks/use-configs';

const CODING_QUERY_KEY = 'clinical-coding-suggestions';

interface UseClinicalCodingSuggestionsParams {
  clinicalText: string;
  blockTypes: string[];
  existingCodes: string[];
}

export function useClinicalCodingSuggestions({
  clinicalText,
  blockTypes,
  existingCodes,
}: UseClinicalCodingSuggestionsParams) {
  // Read feature flag and config values
  const { data: enabledConfig } = useResolveConfig('ai.clinical_coding.enabled');
  const { data: minLengthConfig } = useResolveConfig('ai.clinical_coding.min_text_length');
  const { data: debounceConfig } = useResolveConfig('ai.clinical_coding.debounce_ms');

  const isEnabled = enabledConfig?.value === true || enabledConfig?.value === 'true';
  const minLength = Number(minLengthConfig?.value) || 20;
  const debounceMs = Number(debounceConfig?.value) || 1500;

  const debouncedText = useDebouncedValue(clinicalText, debounceMs);
  const debouncedExisting = useDebouncedValue(existingCodes.join(','), debounceMs);

  const shouldFetch = isEnabled && debouncedText.length >= minLength;

  return useQuery({
    queryKey: [CODING_QUERY_KEY, debouncedText, debouncedExisting],
    queryFn: () =>
      clinicalCodingService.suggest({
        clinicalText: debouncedText,
        blockTypes,
        existingCodes,
      }),
    enabled: shouldFetch,
    staleTime: 60_000, // 1 minute
    gcTime: 5 * 60_000, // 5 minutes
    retry: 1,
  });
}

/**
 * Hook to check if AI coding feature is enabled.
 */
export function useAiCodingEnabled(): boolean {
  const { data } = useResolveConfig('ai.clinical_coding.enabled');
  return data?.value === true || data?.value === 'true';
}
