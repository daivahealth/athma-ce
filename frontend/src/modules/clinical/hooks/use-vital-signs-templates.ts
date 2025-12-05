import { useQuery, UseQueryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { vitalSignsTemplateService } from '../services/vital-signs-template-service';
import type {
  VitalSignsTemplate,
  VitalSignsTemplateFilters,
  CareSetting,
  AgeGroup,
  CreateVitalSignsTemplateInput,
} from '../types/vital-signs-template';

export const vitalTemplateKeys = {
  all: ['vital-signs-templates'] as const,
  list: (filters?: VitalSignsTemplateFilters) => [...vitalTemplateKeys.all, 'list', filters] as const,
  detail: (id: string) => [...vitalTemplateKeys.all, 'detail', id] as const,
  careSettings: () => [...vitalTemplateKeys.all, 'care-settings'] as const,
  ageGroups: () => [...vitalTemplateKeys.all, 'age-groups'] as const,
  bestMatch: (careSetting?: CareSetting, ageGroup?: AgeGroup, specialty?: string) =>
    [...vitalTemplateKeys.all, 'best-match', careSetting, ageGroup, specialty] as const,
};

export function useVitalSignsTemplates(
  filters?: VitalSignsTemplateFilters,
  options?: UseQueryOptions<VitalSignsTemplate[]>
) {
  return useQuery({
    queryKey: vitalTemplateKeys.list(filters),
    queryFn: () => vitalSignsTemplateService.list(filters),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useVitalSignsTemplate(
  id: string,
  options?: UseQueryOptions<VitalSignsTemplate>
) {
  return useQuery({
    queryKey: vitalTemplateKeys.detail(id),
    queryFn: () => vitalSignsTemplateService.get(id),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(id),
    ...options,
  });
}

export function useVitalCareSettings(
  options?: UseQueryOptions<CareSetting[]>
) {
  return useQuery({
    queryKey: vitalTemplateKeys.careSettings(),
    queryFn: () => vitalSignsTemplateService.getCareSettings(),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useVitalAgeGroups(
  options?: UseQueryOptions<AgeGroup[]>
) {
  return useQuery({
    queryKey: vitalTemplateKeys.ageGroups(),
    queryFn: () => vitalSignsTemplateService.getAgeGroups(),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useBestVitalTemplate(
  careSetting?: CareSetting,
  ageGroup?: AgeGroup,
  specialty?: string,
  options?: UseQueryOptions<VitalSignsTemplate>
) {
  const enabled = Boolean(careSetting && ageGroup);
  return useQuery({
    queryKey: vitalTemplateKeys.bestMatch(careSetting, ageGroup, specialty),
    queryFn: () =>
      vitalSignsTemplateService.findBestMatch({
        careSetting: careSetting as CareSetting,
        ageGroup: ageGroup as AgeGroup,
        specialty,
      }),
    enabled,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useCreateVitalSignsTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateVitalSignsTemplateInput) =>
      vitalSignsTemplateService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vitalTemplateKeys.all });
    },
  });
}
