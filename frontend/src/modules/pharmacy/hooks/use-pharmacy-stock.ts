import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pharmacyStockService } from '../services/pharmacy-stock-service';
import type {
  CreateStockInput,
  UpdateStockInput,
  AdjustStockInput,
  StockFilters,
} from '../types/stock';

const STOCK_KEYS = {
  all: ['pharmacy', 'stock'] as const,
  list: (filters?: StockFilters) => [...STOCK_KEYS.all, 'list', filters] as const,
  detail: (id: string) => [...STOCK_KEYS.all, 'detail', id] as const,
  movements: (stockId: string) => [...STOCK_KEYS.all, 'movements', stockId] as const,
  alerts: {
    lowStock: ['pharmacy', 'alerts', 'low-stock'] as const,
    expiring: (days: number) => ['pharmacy', 'alerts', 'expiring', days] as const,
  },
};

export function usePharmacyStock(filters?: StockFilters) {
  return useQuery({
    queryKey: STOCK_KEYS.list(filters),
    queryFn: () => pharmacyStockService.list(filters),
    staleTime: 60 * 1000,
  });
}

export function usePharmacyStockById(id?: string) {
  return useQuery({
    queryKey: STOCK_KEYS.detail(id!),
    queryFn: () => pharmacyStockService.getById(id!),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
}

export function useLowStockAlerts() {
  return useQuery({
    queryKey: STOCK_KEYS.alerts.lowStock,
    queryFn: () => pharmacyStockService.getLowStockAlerts(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useExpiringStockAlerts(days = 30) {
  return useQuery({
    queryKey: STOCK_KEYS.alerts.expiring(days),
    queryFn: () => pharmacyStockService.getExpiringAlerts(days),
    staleTime: 5 * 60 * 1000,
  });
}

export function useStockMovements(stockId?: string) {
  return useQuery({
    queryKey: STOCK_KEYS.movements(stockId!),
    queryFn: () => pharmacyStockService.getMovements(stockId!),
    enabled: Boolean(stockId),
    staleTime: 30 * 1000,
  });
}

export function useCreateStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateStockInput) => pharmacyStockService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STOCK_KEYS.all });
      queryClient.invalidateQueries({ queryKey: STOCK_KEYS.alerts.lowStock });
    },
  });
}

export function useUpdateStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateStockInput }) =>
      pharmacyStockService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: STOCK_KEYS.all });
      queryClient.invalidateQueries({ queryKey: STOCK_KEYS.detail(id) });
    },
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AdjustStockInput }) =>
      pharmacyStockService.adjust(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: STOCK_KEYS.all });
      queryClient.invalidateQueries({ queryKey: STOCK_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: STOCK_KEYS.alerts.lowStock });
    },
  });
}

export function useQuarantineStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pharmacyStockService.quarantine(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STOCK_KEYS.all });
    },
  });
}
