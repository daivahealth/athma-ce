import { useQuery } from '@tanstack/react-query';
import { prescriptionHeaderService } from '../services/prescription-header-service';

const KEYS = {
  detail: (id: string) => ['prescription-header', id] as const,
  byEncounter: (encounterId: string) => ['prescription-header', 'encounter', encounterId] as const,
};

export function usePrescriptionHeader(prescriptionId?: string | null) {
  return useQuery({
    queryKey: KEYS.detail(prescriptionId!),
    queryFn: () => prescriptionHeaderService.getById(prescriptionId!),
    enabled: Boolean(prescriptionId),
    staleTime: 60 * 1000,
  });
}

export function usePrescriptionHeadersByEncounter(encounterId?: string | null) {
  return useQuery({
    queryKey: KEYS.byEncounter(encounterId!),
    queryFn: () => prescriptionHeaderService.listByEncounter(encounterId!),
    enabled: Boolean(encounterId),
    staleTime: 60 * 1000,
  });
}
