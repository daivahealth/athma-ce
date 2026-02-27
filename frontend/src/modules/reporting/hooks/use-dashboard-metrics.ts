/**
 * Dashboard Metrics Hook
 * Fetches cached metrics for the HealthAI+ dashboard using the optimized cached endpoint
 *
 * Performance improvement:
 * - Before: 10 separate API calls -> LLM query planning -> SQL execution (~5-10s)
 * - After:  1 API call -> Redis cache lookup (~50-100ms)
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { aiGatewayClient } from '@/lib/api/client';

// Query keys for dashboard metrics
const DASHBOARD_KEYS = {
  all: ['dashboard'] as const,
  metrics: (currency: string) => [...DASHBOARD_KEYS.all, 'metrics', currency] as const,
};

export interface DashboardMetrics {
  // Revenue metrics
  revenueMTD: number;
  revenueLastMonth: number;
  revenueGrowth: number;

  // Patient metrics
  totalPatients: number;
  newPatientsThisMonth: number;
  patientGrowth: number;

  // Appointment metrics
  appointmentsToday: number;
  appointmentsThisWeek: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;

  // Encounter metrics
  encountersToday: number;
  encountersThisWeek: number;
  avgEncounterDuration: number;

  // Invoice metrics
  unpaidInvoices: number;
  unpaidAmount: number;
  overdueInvoices: number;
  overdueAmount: number;

  // Facility metrics
  activeFacilities: number;

  // Calculated metrics
  appointmentCompletionRate: number;
  utilizationRate: number;

  // Metadata
  cachedAt: string;
  currency: string;
}

interface DashboardMetricsResponse {
  metrics: DashboardMetrics;
  fromCache: boolean;
  ttlSeconds?: number;
}

interface DashboardRefreshResponse {
  success: boolean;
  message: string;
  refreshedAt: string;
}

/**
 * Fetch dashboard metrics from the cached endpoint
 */
async function fetchDashboardMetrics(currency: string): Promise<DashboardMetricsResponse> {
  const response = await aiGatewayClient.get<DashboardMetricsResponse>(
    '/reports/dashboard/metrics',
    { params: { currency } },
  );
  return response.data;
}

/**
 * Refresh dashboard metrics cache
 */
async function refreshDashboardMetrics(currency: string): Promise<DashboardRefreshResponse> {
  const response = await aiGatewayClient.post<DashboardRefreshResponse>(
    '/reports/dashboard/refresh',
    null,
    { params: { currency } },
  );
  return response.data;
}

/**
 * Main hook for fetching dashboard metrics
 * Uses a single cached API call for all metrics
 */
export function useDashboardMetrics(currency: string = 'INR') {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: DASHBOARD_KEYS.metrics(currency),
    queryFn: () => fetchDashboardMetrics(currency),
    staleTime: 5 * 60 * 1000, // 5 minutes - consider data stale after this
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    refetchOnWindowFocus: true,
  });

  const refetch = async () => {
    // First refresh the cache on the server
    try {
      await refreshDashboardMetrics(currency);
    } catch {
      // Ignore refresh errors, the query will still use cached data
    }
    // Then refetch the query
    return query.refetch();
  };

  return {
    data: query.data?.metrics ?? getDefaultMetrics(),
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching,
    fromCache: query.data?.fromCache,
    ttlSeconds: query.data?.ttlSeconds,
    refetch,
  };
}

/**
 * Hook to manually refresh the dashboard cache
 */
export function useRefreshDashboardCache(currency: string = 'INR') {
  const queryClient = useQueryClient();

  return async () => {
    const response = await refreshDashboardMetrics(currency);

    // Invalidate the metrics query to trigger a refetch
    await queryClient.invalidateQueries({
      queryKey: DASHBOARD_KEYS.metrics(currency),
    });

    return response;
  };
}

/**
 * Returns default/empty metrics
 */
function getDefaultMetrics(): DashboardMetrics {
  return {
    revenueMTD: 0,
    revenueLastMonth: 0,
    revenueGrowth: 0,
    totalPatients: 0,
    newPatientsThisMonth: 0,
    patientGrowth: 0,
    appointmentsToday: 0,
    appointmentsThisWeek: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    noShowAppointments: 0,
    encountersToday: 0,
    encountersThisWeek: 0,
    avgEncounterDuration: 0,
    unpaidInvoices: 0,
    unpaidAmount: 0,
    overdueInvoices: 0,
    overdueAmount: 0,
    activeFacilities: 0,
    appointmentCompletionRate: 0,
    utilizationRate: 0,
    cachedAt: new Date().toISOString(),
    currency: 'INR',
  };
}

// ============================================================================
// LEGACY HOOKS (kept for backwards compatibility, now use cached endpoint)
// ============================================================================

/**
 * @deprecated Use useDashboardMetrics() instead for better performance
 */
export function useRevenueMTD(currency: string = 'INR') {
  const { data, isLoading, isError } = useDashboardMetrics(currency);
  return {
    data: data.revenueMTD,
    isLoading,
    isError,
    refetch: () => {},
  };
}

/**
 * @deprecated Use useDashboardMetrics() instead for better performance
 */
export function useRevenueLastMonth(currency: string = 'INR') {
  const { data, isLoading, isError } = useDashboardMetrics(currency);
  return {
    data: data.revenueLastMonth,
    isLoading,
    isError,
    refetch: () => {},
  };
}

/**
 * @deprecated Use useDashboardMetrics() instead for better performance
 */
export function useTotalPatients() {
  const { data, isLoading, isError } = useDashboardMetrics();
  return {
    data: data.totalPatients,
    isLoading,
    isError,
    refetch: () => {},
  };
}

/**
 * @deprecated Use useDashboardMetrics() instead for better performance
 */
export function useNewPatientsThisMonth() {
  const { data, isLoading, isError } = useDashboardMetrics();
  return {
    data: data.newPatientsThisMonth,
    isLoading,
    isError,
    refetch: () => {},
  };
}

/**
 * @deprecated Use useDashboardMetrics() instead for better performance
 */
export function useAppointmentsToday() {
  const { data, isLoading, isError } = useDashboardMetrics();
  return {
    data: data.appointmentsToday,
    isLoading,
    isError,
    refetch: () => {},
  };
}

/**
 * @deprecated Use useDashboardMetrics() instead for better performance
 */
export function useCompletedAppointmentsToday() {
  const { data, isLoading, isError } = useDashboardMetrics();
  return {
    data: data.completedAppointments,
    isLoading,
    isError,
    refetch: () => {},
  };
}

/**
 * @deprecated Use useDashboardMetrics() instead for better performance
 */
export function useEncountersToday() {
  const { data, isLoading, isError } = useDashboardMetrics();
  return {
    data: data.encountersToday,
    isLoading,
    isError,
    refetch: () => {},
  };
}

/**
 * @deprecated Use useDashboardMetrics() instead for better performance
 */
export function useUnpaidInvoices() {
  const { data, isLoading, isError } = useDashboardMetrics();
  return {
    data: data.unpaidInvoices,
    isLoading,
    isError,
    refetch: () => {},
  };
}

/**
 * @deprecated Use useDashboardMetrics() instead for better performance
 */
export function useUnpaidAmount(currency: string = 'INR') {
  const { data, isLoading, isError } = useDashboardMetrics(currency);
  return {
    data: data.unpaidAmount,
    isLoading,
    isError,
    refetch: () => {},
  };
}

/**
 * @deprecated Use useDashboardMetrics() instead for better performance
 */
export function useOverdueInvoices() {
  const { data, isLoading, isError } = useDashboardMetrics();
  return {
    data: data.overdueInvoices,
    isLoading,
    isError,
    refetch: () => {},
  };
}
