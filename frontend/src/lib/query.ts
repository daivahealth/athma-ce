import { QueryClient } from "@tanstack/react-query";
import { api } from "./api";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Always consider data stale
      cacheTime: 0, // Don't cache data
      retry: 1,
      refetchOnWindowFocus: true, // Refetch when window gains focus
      refetchOnMount: true, // Always refetch on component mount
    },
    mutations: {
      retry: 1,
    },
  },
});

// Real API functions - no fallback to mock data
export const realApi = {
  // Patients
  getPatients: async (params?: any) => {
    return await api.patients.getAll(params);
  },

  createPatient: async (data: any) => {
    return await api.patients.create(data);
  },

  // Appointments
  getAppointments: async (params?: any) => {
    return await api.appointments.getAll(params);
  },

  // Claims
  getClaims: async (params?: any) => {
    return await api.claims.getAll(params);
  },

  // Dashboard KPIs
  getDashboardKPIs: async () => {
    return await api.dashboard.getKPIs();
  },
};

