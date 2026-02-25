/**
 * Dashboard Metrics Hook
 * Fetches real-time metrics for the HealthAI+ dashboard using the Report Builder API
 */

import { useQuery } from '@tanstack/react-query';
import { reportService } from '../services/report-service';

// Query keys for dashboard metrics
const DASHBOARD_KEYS = {
  all: ['dashboard'] as const,
  metrics: () => [...DASHBOARD_KEYS.all, 'metrics'] as const,
  revenue: () => [...DASHBOARD_KEYS.all, 'revenue'] as const,
  patients: () => [...DASHBOARD_KEYS.all, 'patients'] as const,
  appointments: () => [...DASHBOARD_KEYS.all, 'appointments'] as const,
  encounters: () => [...DASHBOARD_KEYS.all, 'encounters'] as const,
  invoices: () => [...DASHBOARD_KEYS.all, 'invoices'] as const,
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
}

/**
 * Execute a dashboard query and extract the first numeric value
 */
async function executeMetricQuery(query: string, currency?: string): Promise<number> {
  try {
    const response = await reportService.generate({ query, limit: 1, currency });
    if (response.success && response.result && response.result.rows.length > 0) {
      const row = response.result.rows[0];
      // Get the first numeric value from the row
      const values = Object.values(row);
      for (const value of values) {
        if (typeof value === 'number') {
          return value;
        }
        if (typeof value === 'string' && !isNaN(parseFloat(value))) {
          return parseFloat(value);
        }
      }
    }
    return 0;
  } catch {
    return 0;
  }
}

/**
 * Hook to fetch MTD revenue
 */
export function useRevenueMTD(currency: string = 'INR') {
  return useQuery({
    queryKey: [...DASHBOARD_KEYS.revenue(), 'mtd', currency],
    queryFn: async () => {
      return executeMetricQuery('What is the total revenue for this month?', currency);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });
}

/**
 * Hook to fetch last month revenue (for comparison)
 */
export function useRevenueLastMonth(currency: string = 'INR') {
  return useQuery({
    queryKey: [...DASHBOARD_KEYS.revenue(), 'last-month', currency],
    queryFn: async () => {
      return executeMetricQuery('What is the total revenue for last month?', currency);
    },
    staleTime: 30 * 60 * 1000, // 30 minutes (historical data changes less)
  });
}

/**
 * Hook to fetch total patient count
 */
export function useTotalPatients() {
  return useQuery({
    queryKey: [...DASHBOARD_KEYS.patients(), 'total'],
    queryFn: async () => {
      return executeMetricQuery('What is the total number of patients?');
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch new patients this month
 */
export function useNewPatientsThisMonth() {
  return useQuery({
    queryKey: [...DASHBOARD_KEYS.patients(), 'new-this-month'],
    queryFn: async () => {
      return executeMetricQuery('How many new patients were registered this month?');
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch today's appointments
 */
export function useAppointmentsToday() {
  return useQuery({
    queryKey: [...DASHBOARD_KEYS.appointments(), 'today'],
    queryFn: async () => {
      return executeMetricQuery('How many appointments are scheduled for today?');
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (more real-time)
    refetchInterval: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch completed appointments today
 */
export function useCompletedAppointmentsToday() {
  return useQuery({
    queryKey: [...DASHBOARD_KEYS.appointments(), 'completed-today'],
    queryFn: async () => {
      return executeMetricQuery('How many appointments were completed today?');
    },
    staleTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch today's encounters
 */
export function useEncountersToday() {
  return useQuery({
    queryKey: [...DASHBOARD_KEYS.encounters(), 'today'],
    queryFn: async () => {
      return executeMetricQuery('How many encounters were created today?');
    },
    staleTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch unpaid invoices count
 */
export function useUnpaidInvoices() {
  return useQuery({
    queryKey: [...DASHBOARD_KEYS.invoices(), 'unpaid-count'],
    queryFn: async () => {
      return executeMetricQuery('How many unpaid invoices are there?');
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch total unpaid amount
 */
export function useUnpaidAmount(currency: string = 'INR') {
  return useQuery({
    queryKey: [...DASHBOARD_KEYS.invoices(), 'unpaid-amount', currency],
    queryFn: async () => {
      return executeMetricQuery('What is the total amount of unpaid invoices?', currency);
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch overdue invoices (older than 30 days)
 */
export function useOverdueInvoices() {
  return useQuery({
    queryKey: [...DASHBOARD_KEYS.invoices(), 'overdue-count'],
    queryFn: async () => {
      return executeMetricQuery('How many invoices are overdue more than 30 days?');
    },
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Combined hook for all dashboard metrics
 * This fetches multiple metrics in parallel for better performance
 */
export function useDashboardMetrics(currency: string = 'INR') {
  const revenueMTD = useRevenueMTD(currency);
  const revenueLastMonth = useRevenueLastMonth(currency);
  const totalPatients = useTotalPatients();
  const newPatients = useNewPatientsThisMonth();
  const appointmentsToday = useAppointmentsToday();
  const completedToday = useCompletedAppointmentsToday();
  const encountersToday = useEncountersToday();
  const unpaidInvoices = useUnpaidInvoices();
  const unpaidAmount = useUnpaidAmount(currency);
  const overdueInvoices = useOverdueInvoices();

  const isLoading =
    revenueMTD.isLoading ||
    totalPatients.isLoading ||
    appointmentsToday.isLoading ||
    encountersToday.isLoading ||
    unpaidInvoices.isLoading;

  const isError =
    revenueMTD.isError ||
    totalPatients.isError ||
    appointmentsToday.isError;

  // Calculate derived metrics
  const revenueGrowth = revenueLastMonth.data && revenueLastMonth.data > 0
    ? ((revenueMTD.data || 0) - revenueLastMonth.data) / revenueLastMonth.data * 100
    : 0;

  const appointmentCompletionRate = appointmentsToday.data && appointmentsToday.data > 0
    ? ((completedToday.data || 0) / appointmentsToday.data) * 100
    : 0;

  // Estimate utilization (encounters / expected capacity)
  // Assuming 8 hours per day, 2 encounters per hour average = 16 encounters per provider
  // This is a placeholder - real calculation would need provider count
  const utilizationRate = Math.min(100, ((encountersToday.data || 0) / 20) * 100);

  const metrics: DashboardMetrics = {
    revenueMTD: revenueMTD.data || 0,
    revenueLastMonth: revenueLastMonth.data || 0,
    revenueGrowth,
    totalPatients: totalPatients.data || 0,
    newPatientsThisMonth: newPatients.data || 0,
    patientGrowth: totalPatients.data && totalPatients.data > 0
      ? ((newPatients.data || 0) / totalPatients.data) * 100
      : 0,
    appointmentsToday: appointmentsToday.data || 0,
    appointmentsThisWeek: 0, // Not fetched individually
    completedAppointments: completedToday.data || 0,
    cancelledAppointments: 0, // Not fetched individually
    noShowAppointments: 0, // Not fetched individually
    encountersToday: encountersToday.data || 0,
    encountersThisWeek: 0, // Not fetched individually
    avgEncounterDuration: 0, // Not fetched individually
    unpaidInvoices: unpaidInvoices.data || 0,
    unpaidAmount: unpaidAmount.data || 0,
    overdueInvoices: overdueInvoices.data || 0,
    overdueAmount: 0, // Not fetched individually
    activeFacilities: 0, // Not fetched individually
    appointmentCompletionRate,
    utilizationRate,
  };

  return {
    data: metrics,
    isLoading,
    isError,
    refetch: () => {
      revenueMTD.refetch();
      totalPatients.refetch();
      appointmentsToday.refetch();
      completedToday.refetch();
      encountersToday.refetch();
      unpaidInvoices.refetch();
    },
  };
}
