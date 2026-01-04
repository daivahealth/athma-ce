import type { UseQueryOptions } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { catalogMappingService } from '../services/catalog-mapping-service';
import type {
  CatalogMapping,
  CatalogMappingFilters,
  CreateCatalogMappingInput,
  UpdateCatalogMappingInput,
} from '../types/catalog-mapping';

export const catalogMappingKeys = {
  all: ['catalog-mappings'] as const,
  list: (filters?: CatalogMappingFilters) => [...catalogMappingKeys.all, 'list', filters] as const,
  detail: (id: string) => [...catalogMappingKeys.all, 'detail', id] as const,
};

export function useCatalogMappings(
  filters?: CatalogMappingFilters,
  options?: UseQueryOptions<CatalogMapping[]>
) {
  return useQuery({
    queryKey: catalogMappingKeys.list(filters),
    queryFn: () => catalogMappingService.list(filters),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useCatalogMapping(
  id: string,
  options?: UseQueryOptions<CatalogMapping>
) {
  return useQuery({
    queryKey: catalogMappingKeys.detail(id),
    queryFn: () => catalogMappingService.get(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useCreateCatalogMapping() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCatalogMappingInput) => catalogMappingService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogMappingKeys.all });
    },
  });
}

export function useUpdateCatalogMapping() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCatalogMappingInput }) =>
      catalogMappingService.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: catalogMappingKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: catalogMappingKeys.all });
    },
  });
}

export function useDeleteCatalogMapping() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => catalogMappingService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogMappingKeys.all });
    },
  });
}
