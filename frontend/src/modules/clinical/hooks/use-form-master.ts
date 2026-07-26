import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formMasterService } from '../services/form-master-service';
import type {
  CreateFormMasterInput,
  UpdateFormMasterInput,
  FormMasterStatus,
  CreateFormResponseInput,
  SaveFormResponseInput,
} from '../types/form-master';

// Form Master (template) hooks

export function useFormMasters(status?: FormMasterStatus) {
  return useQuery({
    queryKey: ['form-masters', status ?? 'all'],
    queryFn: () => formMasterService.listFormMasters(status),
  });
}

export function useFormMaster(id: string) {
  return useQuery({
    queryKey: ['form-masters', id],
    queryFn: () => formMasterService.getFormMaster(id),
    enabled: !!id,
  });
}

export function useCreateFormMaster() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFormMasterInput) => formMasterService.createFormMaster(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-masters'] });
    },
  });
}

export function useUpdateFormMaster() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateFormMasterInput }) =>
      formMasterService.updateFormMaster(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['form-masters'] });
      queryClient.invalidateQueries({ queryKey: ['form-masters', variables.id] });
    },
  });
}

// Form Response (fill instance) hooks

export function useFormResponsesByEncounter(encounterId: string) {
  return useQuery({
    queryKey: ['form-responses', 'encounter', encounterId],
    queryFn: () => formMasterService.getFormResponsesByEncounter(encounterId),
    enabled: !!encounterId,
  });
}

export function useFormResponsesByPatient(patientId: string) {
  return useQuery({
    queryKey: ['form-responses', 'patient', patientId],
    queryFn: () => formMasterService.getFormResponsesByPatient(patientId),
    enabled: !!patientId,
  });
}

export function useFormResponse(id: string) {
  return useQuery({
    queryKey: ['form-responses', id],
    queryFn: () => formMasterService.getFormResponse(id),
    enabled: !!id,
  });
}

export function useCreateFormResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFormResponseInput) => formMasterService.createFormResponse(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['form-responses', 'encounter', variables.encounterId] });
      queryClient.invalidateQueries({ queryKey: ['form-responses', 'patient', variables.patientId] });
    },
  });
}

export function useSaveFormResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      encounterId: string;
      payload: SaveFormResponseInput;
    }) => formMasterService.saveFormResponse(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['form-responses', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['form-responses', 'encounter', variables.encounterId] });
    },
  });
}
