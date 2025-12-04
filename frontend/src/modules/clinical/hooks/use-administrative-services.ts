import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { administrativeServiceApi } from '../services/administrative-service';
import type {
  AdministrativeService,
  AdministrativeServiceFilters,
  AdministrativeServiceOption,
} from '../types/administrative-service';

export const administrativeServiceKeys = {
  all: ['administrative-services'] as const,
  list: (filters?: AdministrativeServiceFilters) =>
    [...administrativeServiceKeys.all, 'list', filters] as const,
  detail: (id: string) => [...administrativeServiceKeys.all, 'detail', id] as const,
  categories: () => [...administrativeServiceKeys.all, 'categories'] as const,
  types: () => [...administrativeServiceKeys.all, 'types'] as const,
};

export function useAdministrativeServices(
  filters?: AdministrativeServiceFilters,
  options?: UseQueryOptions<AdministrativeService[]>
) {
  return useQuery({
    queryKey: administrativeServiceKeys.list(filters),
    queryFn: () => administrativeServiceApi.list(filters),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useAdministrativeService(
  id: string,
  options?: UseQueryOptions<AdministrativeService>
) {
  return useQuery({
    queryKey: administrativeServiceKeys.detail(id),
    queryFn: () => administrativeServiceApi.get(id),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(id),
    ...options,
  });
}

export function useAdministrativeServiceCategories(
  options?: UseQueryOptions<AdministrativeServiceOption[]>
) {
  return useQuery({
    queryKey: administrativeServiceKeys.categories(),
    queryFn: () => administrativeServiceApi.getCategories(),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useAdministrativeServiceTypes(
  options?: UseQueryOptions<AdministrativeServiceOption[]>
) {
  return useQuery({
    queryKey: administrativeServiceKeys.types(),
    queryFn: () => administrativeServiceApi.getTypes(),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}
