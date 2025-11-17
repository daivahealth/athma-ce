import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chartingService } from '../services/charting-service';
import type {
  CreateClinicalNoteInput,
  CreateDiagnosisInput,
  CreateClinicalOrderInput,
  UpdateClinicalOrderInput,
  CreatePrescriptionInput,
  UpdatePrescriptionInput,
} from '../types/charting';

// Clinical Notes Hooks
export function useClinicalNotesByEncounter(encounterId: string) {
  return useQuery({
    queryKey: ['clinical-notes', 'encounter', encounterId],
    queryFn: () => chartingService.getClinicalNotesByEncounter(encounterId),
    enabled: !!encounterId,
  });
}

export function useCreateClinicalNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClinicalNoteInput) =>
      chartingService.createClinicalNote(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['clinical-notes', 'encounter', variables.encounterId],
      });
    },
  });
}

// Diagnoses Hooks
export function useDiagnosesByEncounter(encounterId: string) {
  return useQuery({
    queryKey: ['diagnoses', 'encounter', encounterId],
    queryFn: () => chartingService.getDiagnosesByEncounter(encounterId),
    enabled: !!encounterId,
  });
}

export function useCreateDiagnosis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDiagnosisInput) =>
      chartingService.createDiagnosis(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['diagnoses', 'encounter', variables.encounterId],
      });
    },
  });
}

export function useDeleteDiagnosis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, encounterId }: { id: string; encounterId: string }) =>
      chartingService.deleteDiagnosis(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['diagnoses', 'encounter', variables.encounterId],
      });
    },
  });
}

// Clinical Orders Hooks
export function useClinicalOrdersByEncounter(encounterId: string) {
  return useQuery({
    queryKey: ['clinical-orders', 'encounter', encounterId],
    queryFn: () => chartingService.getClinicalOrdersByEncounter(encounterId),
    enabled: !!encounterId,
  });
}

export function useCreateClinicalOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClinicalOrderInput) =>
      chartingService.createClinicalOrder(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['clinical-orders', 'encounter', variables.encounterId],
      });
    },
  });
}

export function useUpdateClinicalOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      encounterId,
      data,
    }: {
      id: string;
      encounterId: string;
      data: UpdateClinicalOrderInput;
    }) => chartingService.updateClinicalOrder(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['clinical-orders', 'encounter', variables.encounterId],
      });
    },
  });
}

export function useDeleteClinicalOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, encounterId }: { id: string; encounterId: string }) =>
      chartingService.deleteClinicalOrder(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['clinical-orders', 'encounter', variables.encounterId],
      });
    },
  });
}

// Prescriptions Hooks
export function usePrescriptionsByEncounter(encounterId: string) {
  return useQuery({
    queryKey: ['prescriptions', 'encounter', encounterId],
    queryFn: () => chartingService.getPrescriptionsByEncounter(encounterId),
    enabled: !!encounterId,
  });
}

export function useCreatePrescription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePrescriptionInput) =>
      chartingService.createPrescription(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['prescriptions', 'encounter', variables.encounterId],
      });
    },
  });
}

export function useUpdatePrescription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      encounterId,
      data,
    }: {
      id: string;
      encounterId: string;
      data: UpdatePrescriptionInput;
    }) => chartingService.updatePrescription(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['prescriptions', 'encounter', variables.encounterId],
      });
    },
  });
}

export function useDeletePrescription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, encounterId }: { id: string; encounterId: string }) =>
      chartingService.deletePrescription(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['prescriptions', 'encounter', variables.encounterId],
      });
    },
  });
}
