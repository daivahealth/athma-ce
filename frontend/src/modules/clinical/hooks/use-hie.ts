import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { hieService } from '../services/hie-service';
import type {
  CreateHieConsentRequestInput,
  FetchExternalRecordsInput,
} from '../types/hie';

const HIE_KEYS = {
  consentRequest: (id: string) => ['hie', 'consent-request', id] as const,
  fetchJob: (id: string) => ['hie', 'fetch-job', id] as const,
};

/** Poll a fetch job while it is in-flight so the UI reflects live status. */
export function useHieFetchJob(jobId: string | null) {
  return useQuery({
    queryKey: HIE_KEYS.fetchJob(jobId ?? ''),
    queryFn: () => hieService.getFetchStatus(jobId as string),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'pending' || status === 'fetching' ? 2000 : false;
    },
  });
}

export function useHieConsentRequest(consentId: string | null) {
  return useQuery({
    queryKey: HIE_KEYS.consentRequest(consentId ?? ''),
    queryFn: () => hieService.getConsentRequest(consentId as string),
    enabled: !!consentId,
    staleTime: 30_000,
  });
}

export function useCreateHieConsentRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateHieConsentRequestInput) =>
      hieService.createConsentRequest(input),
    onSuccess: (consent) => {
      queryClient.setQueryData(HIE_KEYS.consentRequest(consent.id), consent);
    },
  });
}

export function useFetchExternalRecords() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: FetchExternalRecordsInput) =>
      hieService.fetchRecords(input),
    onSuccess: (job) => {
      queryClient.setQueryData(HIE_KEYS.fetchJob(job.id), job);
      queryClient.invalidateQueries({
        queryKey: ['patient-documents', job.patientId],
      });
    },
  });
}

export function useRetryHieFetch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => hieService.retryFetch(jobId),
    onSuccess: (job) => {
      queryClient.setQueryData(HIE_KEYS.fetchJob(job.id), job);
      queryClient.invalidateQueries({
        queryKey: ['patient-documents', job.patientId],
      });
    },
  });
}
