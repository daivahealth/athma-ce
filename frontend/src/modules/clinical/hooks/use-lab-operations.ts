import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { labOperationsService } from '../services/lab-operations-service';
import type {
  AccessionLabSpecimenInput,
  PrepareLabSpecimenInput,
  CollectLabSpecimenInput,
  CompleteLabResultEntryInput,
  CreateLabProcessingRunInput,
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
      invalidateLabWorklists(queryClient);
    },
  });
}

export function usePrepareLabSpecimen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PrepareLabSpecimenInput) => labOperationsService.prepareSpecimen(payload),
    onSuccess: () => {
      invalidateLabWorklists(queryClient);
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
      invalidateLabWorklists(queryClient);
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
      invalidateLabWorklists(queryClient);
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
      invalidateLabWorklists(queryClient);
      queryClient.invalidateQueries({ queryKey: ['lab-operations', 'specimen', variables.id] });
    },
  });
}

export function useCreateLabProcessingRun() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLabProcessingRunInput) => labOperationsService.createProcessingRun(payload),
    onSuccess: () => {
      invalidateLabWorklists(queryClient);
    },
  });
}

export function useStartLabResultEntry() {
  return useMutation({
    mutationFn: (payload: StartLabResultEntryInput) => labOperationsService.startResultEntry(payload),
  });
}

export function useCompleteLabResultEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CompleteLabResultEntryInput) => labOperationsService.completeResultEntry(payload),
    onSuccess: () => {
      invalidateLabWorklists(queryClient);
    },
  });
}

function invalidateLabWorklists(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['lab-operations'] });
  queryClient.invalidateQueries({ queryKey: ['results'] });
  queryClient.invalidateQueries({ queryKey: ['patient-results'] });
}
