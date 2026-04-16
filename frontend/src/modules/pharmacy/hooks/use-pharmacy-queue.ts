import { useQuery } from '@tanstack/react-query';
import { pharmacyQueueService } from '../services/pharmacy-queue-service';
import type { PharmacyQueueFilters } from '../types/queue';

const QUEUE_KEYS = {
  all: ['pharmacy', 'queue'] as const,
  list: (filters?: PharmacyQueueFilters) => [...QUEUE_KEYS.all, 'list', filters] as const,
  detail: (id: string) => [...QUEUE_KEYS.all, 'detail', id] as const,
};

export function usePharmacyQueue(filters?: PharmacyQueueFilters) {
  return useQuery({
    queryKey: QUEUE_KEYS.list(filters),
    queryFn: () => pharmacyQueueService.getQueue(filters),
    staleTime: 30 * 1000, // 30 seconds — queue refreshes often
  });
}

export function usePharmacyQueueItem(prescriptionOrderId?: string) {
  return useQuery({
    queryKey: QUEUE_KEYS.detail(prescriptionOrderId!),
    queryFn: () => pharmacyQueueService.getQueueItem(prescriptionOrderId!),
    enabled: Boolean(prescriptionOrderId),
    staleTime: 30 * 1000,
  });
}
