import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { labOperationsService } from '../services/lab-operations-service';
import type {
  AccessionLabSpecimenInput,
  PrepareLabSpecimenInput,
  CollectLabSpecimenInput,
  CompleteLabResultEntryInput,
  CreateLabProcessingRunInput,
  LabReportContext,
  LabWorklistStage,
  ReceiveLabSpecimenInput,
  RejectLabSpecimenInput,
  StartLabResultEntryInput,
} from '../types/lab-operations';

export function useLabWorklist(
  stage: LabWorklistStage,
  params?: { encounterId?: string; patientId?: string },
) {
  return useQuery({
    queryKey: ['lab-operations', 'worklist', stage, params],
    queryFn: () => labOperationsService.getWorklist(stage, params),
  });
}

export function useLabSpecimen(id: string) {
  return useQuery({
    queryKey: ['lab-operations', 'specimen', id],
    queryFn: () => labOperationsService.getSpecimen(id),
    enabled: !!id,
  });
}

export function useCollectLabSpecimen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CollectLabSpecimenInput) => labOperationsService.collectSpecimen(payload),
    onSuccess: () => {
      invalidateLabWorklistStages(queryClient, ['collection', 'receiving']);
    },
  });
}

export function usePrepareLabSpecimen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PrepareLabSpecimenInput) => labOperationsService.prepareSpecimen(payload),
    onSuccess: () => {
      invalidateLabWorklistStages(queryClient, ['collection']);
    },
  });
}

export function usePrintLabSpecimenLabel() {
  return useMutation({
    mutationFn: (id: string) => labOperationsService.getSpecimenLabel(id),
  });
}

export function useReceiveLabSpecimen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: ReceiveLabSpecimenInput }) =>
      labOperationsService.receiveSpecimen(id, payload),
    onSuccess: (_, variables) => {
      invalidateLabWorklistStages(queryClient, ['receiving', 'accessioning']);
      queryClient.invalidateQueries({ queryKey: ['lab-operations', 'specimen', variables.id] });
    },
  });
}

export function useAccessionLabSpecimen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: AccessionLabSpecimenInput }) =>
      labOperationsService.accessionSpecimen(id, payload),
    onSuccess: (_, variables) => {
      invalidateLabWorklistStages(queryClient, ['accessioning', 'processing']);
      queryClient.invalidateQueries({ queryKey: ['lab-operations', 'specimen', variables.id] });
    },
  });
}

export function useRejectLabSpecimen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RejectLabSpecimenInput }) =>
      labOperationsService.rejectSpecimen(id, payload),
    onSuccess: (_, variables) => {
      invalidateLabWorklistStages(queryClient, ['receiving', 'accessioning', 'processing', 'result-entry']);
      queryClient.invalidateQueries({ queryKey: ['lab-operations', 'specimen', variables.id] });
    },
  });
}

export function useCreateLabProcessingRun() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLabProcessingRunInput) => labOperationsService.createProcessingRun(payload),
    onSuccess: () => {
      invalidateLabWorklistStages(queryClient, ['processing']);
    },
  });
}

export function useStartLabResultEntry() {
  return useMutation({
    mutationFn: (payload: StartLabResultEntryInput) => labOperationsService.startResultEntry(payload),
  });
}

export function useLabResultEntryContext(labOrderTestId: string, specimenId?: string) {
  return useQuery({
    queryKey: ['lab-operations', 'result-entry-context', labOrderTestId, specimenId],
    queryFn: () => labOperationsService.getResultEntryContext(labOrderTestId, specimenId),
    enabled: !!labOrderTestId,
  });
}

export function useLabResultEntryContexts(labOrderTestIds: string[]) {
  return useQueries({
    queries: labOrderTestIds.map((labOrderTestId) => ({
      queryKey: ['lab-operations', 'result-entry-context', labOrderTestId],
      queryFn: () => labOperationsService.getResultEntryContext(labOrderTestId),
      enabled: !!labOrderTestId,
    })),
    combine: (results) => ({
      data: results
        .map((result) => result.data)
        .filter((context): context is LabReportContext => Boolean(context)),
      isLoading: results.some((result) => result.isLoading),
      isError: results.some((result) => result.isError),
    }),
  });
}

export function useCompleteLabResultEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CompleteLabResultEntryInput) => labOperationsService.completeResultEntry(payload),
    onSuccess: () => {
      invalidateLabWorklistStages(queryClient, ['processing', 'result-entry']);
      invalidateResultQueries(queryClient);
      queryClient.invalidateQueries({ queryKey: ['lab-operations', 'result-entry-context'] });
    },
  });
}

function invalidateLabWorklistStages(
  queryClient: ReturnType<typeof useQueryClient>,
  stages: LabWorklistStage[],
) {
  stages.forEach((stage) => {
    queryClient.invalidateQueries({ queryKey: ['lab-operations', 'worklist', stage] });
  });
}

function invalidateResultQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['results'] });
  queryClient.invalidateQueries({ queryKey: ['patient-results'] });
}
