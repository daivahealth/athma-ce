import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { valueSetService } from '../services/valueset-service';
import type {
  ValueSet,
  ValueSetConceptsResponse,
  GetConceptsOptions,
  SearchConceptResult,
  SearchConceptsOptions,
} from '../types/valueset';

/**
 * React Query hooks for ValueSets
 */

// Query keys
export const valueSetKeys = {
  all: ['valuesets'] as const,
  lists: () => [...valueSetKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...valueSetKeys.lists(), filters] as const,
  details: () => [...valueSetKeys.all, 'detail'] as const,
  detail: (code: string) => [...valueSetKeys.details(), code] as const,
  concepts: (code: string, options?: GetConceptsOptions) =>
    [...valueSetKeys.detail(code), 'concepts', options] as const,
  categories: () => [...valueSetKeys.all, 'categories'] as const,
  search: (searchTerm: string, options?: SearchConceptsOptions) =>
    [...valueSetKeys.all, 'search', searchTerm, options] as const,
};

/**
 * Fetch all valuesets
 */
export function useValueSets(
  params?: { category?: string; status?: string; search?: string },
  options?: UseQueryOptions<ValueSet[]>
) {
  return useQuery({
    queryKey: valueSetKeys.list(params),
    queryFn: () => valueSetService.findAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Fetch a specific valueset
 */
export function useValueSet(
  code: string,
  options?: UseQueryOptions<ValueSet>
) {
  return useQuery({
    queryKey: valueSetKeys.detail(code),
    queryFn: () => valueSetService.findOne(code),
    staleTime: 5 * 60 * 1000,
    enabled: !!code,
    ...options,
  });
}

/**
 * Fetch concepts for a valueset
 */
export function useValueSetConcepts(
  code: string,
  conceptOptions?: GetConceptsOptions,
  queryOptions?: UseQueryOptions<ValueSetConceptsResponse>
) {
  return useQuery({
    queryKey: valueSetKeys.concepts(code, conceptOptions),
    queryFn: () => valueSetService.getConcepts(code, conceptOptions),
    staleTime: 5 * 60 * 1000,
    enabled: !!code,
    ...queryOptions,
  });
}

/**
 * Fetch valueset categories
 */
export function useValueSetCategories(
  options?: UseQueryOptions<string[]>
) {
  return useQuery({
    queryKey: valueSetKeys.categories(),
    queryFn: () => valueSetService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

/**
 * Search concepts across valuesets (optionally scoped to a valueset)
 */
export function useSearchConcepts(
  searchTerm: string,
  options?: SearchConceptsOptions,
  queryOptions?: UseQueryOptions<SearchConceptResult[]>
) {
  return useQuery({
    queryKey: valueSetKeys.search(searchTerm, options),
    queryFn: () => valueSetService.searchConcepts(searchTerm, options),
    enabled: Boolean(searchTerm?.trim()),
    staleTime: 2 * 60 * 1000,
    ...queryOptions,
  });
}

/**
 * Convenience hooks for commonly used valuesets
 */

export function useCountries(
  language: string = 'en',
  options?: UseQueryOptions<ValueSetConceptsResponse>
) {
  return useValueSetConcepts('iso_3166_countries', { language }, options);
}

export function useGenders(
  language: string = 'en',
  options?: UseQueryOptions<ValueSetConceptsResponse>
) {
  return useValueSetConcepts('administrative_gender', { language }, options);
}

export function useBloodGroups(
  language: string = 'en',
  options?: UseQueryOptions<ValueSetConceptsResponse>
) {
  return useValueSetConcepts('blood_groups', { language }, options);
}

export function useMaritalStatuses(
  language: string = 'en',
  options?: UseQueryOptions<ValueSetConceptsResponse>
) {
  return useValueSetConcepts('marital_status', { language }, options);
}

export function useLanguages(
  language: string = 'en',
  options?: UseQueryOptions<ValueSetConceptsResponse>
) {
  return useValueSetConcepts('iso_639_languages', { language }, options);
}

export function useCurrencies(
  language: string = 'en',
  options?: UseQueryOptions<ValueSetConceptsResponse>
) {
  return useValueSetConcepts('iso_4217_currencies', { language }, options);
}

export function useNationalities(
  language: string = 'en',
  options?: UseQueryOptions<ValueSetConceptsResponse>
) {
  return useValueSetConcepts('iso_3166_countries', { language }, options);
}

export function useNameTitles(
  language: string = 'en',
  options?: UseQueryOptions<ValueSetConceptsResponse>
) {
  return useValueSetConcepts('name_titles', { language }, options);
}
