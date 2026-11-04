import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { specialtyService } from '../services/specialty-service';
import type { Specialty } from '../types/specialty';

/** The specialty master is global and rarely changes, so cache it for the session. */
export function useSpecialties(options: { includeInactive?: boolean } = {}) {
  const locale = useLocale();
  const includeInactive = options.includeInactive ?? false;

  return useQuery<Specialty[]>({
    queryKey: ['specialties', locale, includeInactive],
    queryFn: () => specialtyService.list({ locale, includeInactive }),
    staleTime: 60 * 60 * 1000,
  });
}

/** Resolve specialty codes to display names; unknown codes are shown as-is. */
export function useSpecialtyLabel() {
  const { data } = useSpecialties({ includeInactive: true });
  return useMemo(() => {
    const byCode = new Map((data ?? []).map((s) => [s.code, s.localizedName || s.name]));
    const byId = new Map((data ?? []).map((s) => [s.id, s.localizedName || s.name]));
    return (codeOrId?: string | null) =>
      codeOrId ? byCode.get(codeOrId) ?? byId.get(codeOrId) ?? codeOrId : '';
  }, [data]);
}
