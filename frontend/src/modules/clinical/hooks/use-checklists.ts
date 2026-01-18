import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { checklistService } from '@/modules/clinical/services/checklist-service';
import type {
  ChecklistTemplate,
  ChecklistInstance,
  ChecklistInstanceResponse,
  CreateChecklistInstanceRequest,
  SaveChecklistResponseRequest,
  BulkSaveChecklistResponseRequest,
  ListChecklistInstancesQuery,
  CreateChecklistTemplateRequest,
  CreateChecklistTemplateItemRequest,
  PaginatedChecklistTemplates,
  ChecklistTemplateFilters,
} from '@/modules/clinical/types/checklist';

const CHECKLIST_KEYS = {
  templates: (filters?: ChecklistTemplateFilters) => ['checklists', 'templates', filters] as const,
  template: (id: string) => ['checklists', 'templates', id] as const,
  instances: (filters?: ListChecklistInstancesQuery) => ['checklists', 'instances', filters] as const,
  admissionInstances: (admissionId: string) => ['checklists', 'admissions', admissionId] as const,
  instance: (id: string) => ['checklists', 'instances', id] as const,
  responses: (instanceId: string) => ['checklists', 'responses', instanceId] as const,
};

export function useChecklistTemplates(filters?: ChecklistTemplateFilters) {
  return useQuery<PaginatedChecklistTemplates>({
    queryKey: CHECKLIST_KEYS.templates(filters),
    queryFn: () => checklistService.listTemplates(filters),
  });
}

export function useChecklistTemplate(templateId: string) {
  return useQuery<ChecklistTemplate>({
    queryKey: CHECKLIST_KEYS.template(templateId),
    queryFn: () => checklistService.getTemplate(templateId),
    enabled: !!templateId,
  });
}

export function useCreateChecklistTemplate() {
  const queryClient = useQueryClient();
  return useMutation<ChecklistTemplate, Error, CreateChecklistTemplateRequest>({
    mutationFn: (payload) => checklistService.createTemplate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHECKLIST_KEYS.templates() });
    },
  });
}

export function useAddChecklistTemplateItem(templateId: string) {
  const queryClient = useQueryClient();
  return useMutation<ChecklistTemplate, Error, CreateChecklistTemplateItemRequest>({
    mutationFn: (payload) => checklistService.addTemplateItem(templateId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHECKLIST_KEYS.template(templateId) });
    },
  });
}

export function useAdmissionChecklists(admissionId: string) {
  return useQuery<ChecklistInstance[]>({
    queryKey: CHECKLIST_KEYS.admissionInstances(admissionId),
    queryFn: () => checklistService.getAdmissionChecklists(admissionId),
    enabled: !!admissionId,
  });
}

export function useChecklistInstances(filters?: ListChecklistInstancesQuery) {
  return useQuery<ChecklistInstance[]>({
    queryKey: CHECKLIST_KEYS.instances(filters),
    queryFn: () => checklistService.listInstances(filters),
  });
}

export function useChecklistInstance(instanceId: string) {
  return useQuery<ChecklistInstance>({
    queryKey: CHECKLIST_KEYS.instance(instanceId),
    queryFn: () => checklistService.getInstance(instanceId),
    enabled: !!instanceId,
  });
}

export function useCreateChecklistInstance() {
  const queryClient = useQueryClient();
  return useMutation<ChecklistInstance, Error, CreateChecklistInstanceRequest>({
    mutationFn: (payload) => checklistService.createInstance(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CHECKLIST_KEYS.admissionInstances(data.admissionId ?? '') });
      queryClient.invalidateQueries({ queryKey: CHECKLIST_KEYS.instances(undefined), exact: false });
    },
  });
}

export function useSaveChecklistResponse(instanceId: string) {
  const queryClient = useQueryClient();
  return useMutation<ChecklistInstanceResponse, Error, SaveChecklistResponseRequest>({
    mutationFn: (payload) => checklistService.saveResponse(instanceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHECKLIST_KEYS.instance(instanceId) });
      queryClient.invalidateQueries({ queryKey: CHECKLIST_KEYS.responses(instanceId) });
    },
  });
}

export function useSaveChecklistResponsesBulk(instanceId: string) {
  const queryClient = useQueryClient();
  return useMutation<ChecklistInstanceResponse[], Error, BulkSaveChecklistResponseRequest>({
    mutationFn: (payload) => checklistService.saveResponsesBulk(instanceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHECKLIST_KEYS.instance(instanceId) });
      queryClient.invalidateQueries({ queryKey: CHECKLIST_KEYS.responses(instanceId) });
    },
  });
}

export function useCompleteChecklistInstance(instanceId: string) {
  const queryClient = useQueryClient();
  return useMutation<ChecklistInstance, Error, void>({
    mutationFn: () => checklistService.completeInstance(instanceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHECKLIST_KEYS.instance(instanceId) });
    },
  });
}

export function useVerifyChecklistInstance(instanceId: string) {
  const queryClient = useQueryClient();
  return useMutation<ChecklistInstance, Error, void>({
    mutationFn: () => checklistService.verifyInstance(instanceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHECKLIST_KEYS.instance(instanceId) });
    },
  });
}

export function useCancelChecklistInstance(instanceId: string) {
  const queryClient = useQueryClient();
  return useMutation<ChecklistInstance, Error, void>({
    mutationFn: () => checklistService.cancelInstance(instanceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHECKLIST_KEYS.instance(instanceId) });
    },
  });
}
