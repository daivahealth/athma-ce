import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dischargeService, type DischargeSearchParams } from '../services/discharge-service';

/**
 * Hook to search discharge transactions
 */
export function useDischargesSearch(params: DischargeSearchParams) {
  return useQuery({
    queryKey: ['discharges', 'search', params],
    queryFn: () => dischargeService.search(params),
  });
}

/**
 * Hook to get discharge by ID
 */
export function useDischarge(dischargeId: string) {
  return useQuery({
    queryKey: ['discharge', dischargeId],
    queryFn: () => dischargeService.getById(dischargeId),
    enabled: !!dischargeId,
  });
}

/**
 * Hook to get discharge by admission ID
 */
export function useDischargeByAdmissionId(admissionId: string) {
  return useQuery({
    queryKey: ['discharge', 'admission', admissionId],
    queryFn: () => dischargeService.getByAdmissionId(admissionId),
    enabled: !!admissionId,
  });
}

/**
 * Hook to initiate discharge
 */
export function useInitiateDischarge(admissionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      targetDischargeDate?: string;
      targetDischargeTime?: string;
      approvalRequired?: boolean;
      internalNotes?: string;
    }) => dischargeService.initiate(admissionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discharges'] });
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
      queryClient.invalidateQueries({ queryKey: ['discharge', 'admission', admissionId] });
    },
  });
}

/**
 * Hook to mark discharge as ready
 */
export function useMarkDischargeReady(dischargeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { readyRemarks?: string }) =>
      dischargeService.markReady(dischargeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discharges'] });
      queryClient.invalidateQueries({ queryKey: ['discharge', dischargeId] });
    },
  });
}

/**
 * Hook to approve discharge
 */
export function useApproveDischarge(dischargeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { approvalRemarks?: string }) =>
      dischargeService.approve(dischargeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discharges'] });
      queryClient.invalidateQueries({ queryKey: ['discharge', dischargeId] });
    },
  });
}

/**
 * Hook to execute discharge
 */
export function useExecuteDischarge(dischargeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      dischargeType: string;
      dischargeDestination: string;
      dischargeDisposition?: string;
      dischargeSummaryId?: string;
      finalDiagnosis?: string;
      dischargeMedications?: any;
      followUpInstructions?: string;
      followUpAppointments?: any;
      dietInstructions?: string;
      activityRestrictions?: string;
    }) => dischargeService.execute(dischargeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discharges'] });
      queryClient.invalidateQueries({ queryKey: ['discharge', dischargeId] });
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
    },
  });
}

/**
 * Hook to cancel discharge
 */
export function useCancelDischarge(dischargeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { cancellationReason: string }) =>
      dischargeService.cancel(dischargeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discharges'] });
      queryClient.invalidateQueries({ queryKey: ['discharge', dischargeId] });
      queryClient.invalidateQueries({ queryKey: ['admissions'] });
    },
  });
}
