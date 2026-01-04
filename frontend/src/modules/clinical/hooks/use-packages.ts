import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { packageService } from '../services/package-service';
import type {
  Package,
  PackageFilters,
  PackageTypeOption,
  CatalogTypeOption,
} from '../types/package';

export const packageKeys = {
  all: ['packages'] as const,
  list: (filters?: PackageFilters) => [...packageKeys.all, 'list', filters] as const,
  detail: (id: string) => [...packageKeys.all, 'detail', id] as const,
  types: () => [...packageKeys.all, 'types'] as const,
  catalogTypes: () => [...packageKeys.all, 'catalog-types'] as const,
};

export function usePackages(
  filters?: PackageFilters,
  options?: UseQueryOptions<Package[]>
) {
  return useQuery({
    queryKey: packageKeys.list(filters),
    queryFn: () => packageService.list(filters),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function usePackage(
  id: string,
  options?: UseQueryOptions<Package>
) {
  return useQuery({
    queryKey: packageKeys.detail(id),
    queryFn: () => packageService.get(id),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(id),
    ...options,
  });
}

export function usePackageTypes(
  options?: UseQueryOptions<PackageTypeOption[]>
) {
  return useQuery({
    queryKey: packageKeys.types(),
    queryFn: () => packageService.getTypes(),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function usePackageCatalogTypes(
  options?: UseQueryOptions<CatalogTypeOption[]>
) {
  return useQuery({
    queryKey: packageKeys.catalogTypes(),
    queryFn: () => packageService.getCatalogTypes(),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}
