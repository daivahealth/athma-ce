import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { templatesService, type TemplateFilters } from '../services/templates-service';
import type { CreateTemplateInput, Template, UpdateTemplateInput } from '../types/template';

const TEMPLATE_KEYS = {
  all: ['prm', 'templates'] as const,
  list: (filters: TemplateFilters | undefined) => [...TEMPLATE_KEYS.all, 'list', filters] as const,
  detail: (templateId: string) => [...TEMPLATE_KEYS.all, 'detail', templateId] as const,
};

export function useTemplates(filters?: TemplateFilters) {
  return useQuery<Template[]>({
    queryKey: TEMPLATE_KEYS.list(filters),
    queryFn: () => templatesService.list(filters),
  });
}

export function useTemplate(templateId: string) {
  return useQuery<Template>({
    queryKey: TEMPLATE_KEYS.detail(templateId),
    queryFn: () => templatesService.get(templateId),
    enabled: !!templateId,
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTemplateInput) => templatesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEMPLATE_KEYS.all });
    },
  });
}

export function useUpdateTemplate(templateId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTemplateInput) => templatesService.update(templateId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEMPLATE_KEYS.all });
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (templateId: string) => templatesService.remove(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEMPLATE_KEYS.all });
    },
  });
}
