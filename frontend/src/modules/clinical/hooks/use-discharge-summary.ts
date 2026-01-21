import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dischargeSummaryService } from '@/modules/clinical/services/discharge-summary-service';
import type { DischargeSummary, DischargeSummaryVersion } from '@/modules/clinical/types/discharge-summary';

const DISCHARGE_SUMMARY_KEYS = {
  summaryByAdmission: (admissionId: string) => ['discharge-summary', 'admission', admissionId] as const,
  summaryById: (summaryId: string) => ['discharge-summary', 'id', summaryId] as const,
  versions: (summaryId: string) => ['discharge-summary', 'versions', summaryId] as const,
};

export function useDischargeSummaryByAdmission(admissionId: string) {
  return useQuery<DischargeSummary>({
    queryKey: DISCHARGE_SUMMARY_KEYS.summaryByAdmission(admissionId),
    queryFn: () => dischargeSummaryService.getByAdmission(admissionId),
    enabled: !!admissionId,
  });
}

export function useDischargeSummary(summaryId: string) {
  return useQuery<DischargeSummary>({
    queryKey: DISCHARGE_SUMMARY_KEYS.summaryById(summaryId),
    queryFn: () => dischargeSummaryService.getById(summaryId),
    enabled: !!summaryId,
  });
}

export function useDischargeSummaryVersions(summaryId: string) {
  return useQuery<DischargeSummaryVersion[]>({
    queryKey: DISCHARGE_SUMMARY_KEYS.versions(summaryId),
    queryFn: () => dischargeSummaryService.listVersions(summaryId),
    enabled: !!summaryId,
  });
}

export function useCreateDischargeSummaryVersion(summaryId: string) {
  const queryClient = useQueryClient();
  return useMutation<DischargeSummaryVersion, Error, { data: Record<string, unknown>; changeReason?: string }>({
    mutationFn: (payload) => dischargeSummaryService.createVersion(summaryId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DISCHARGE_SUMMARY_KEYS.summaryById(summaryId) });
      queryClient.invalidateQueries({ queryKey: DISCHARGE_SUMMARY_KEYS.versions(summaryId) });
    },
  });
}
