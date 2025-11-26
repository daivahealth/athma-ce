import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { payerContractService } from '../services/payer-contract-service';
import type {
  ContractPriceCalculationInput,
  CreatePayerContractAdjustmentInput,
  CreatePayerContractInput,
  PayerContractFilters,
  PayerContractAdjustmentFilters,
  UpdatePayerContractAdjustmentInput,
  UpdatePayerContractInput,
} from '../types/payer-contract';

export function usePayerContracts(filters?: PayerContractFilters) {
  return useQuery({
    queryKey: ['payer-contracts', filters],
    queryFn: () => payerContractService.list(filters),
  });
}

export function usePayerContract(id?: string) {
  return useQuery({
    queryKey: ['payer-contract', id],
    queryFn: () => payerContractService.getById(id!),
    enabled: Boolean(id),
  });
}

export function useCreatePayerContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePayerContractInput) => payerContractService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payer-contracts'] });
    },
  });
}

export function useUpdatePayerContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePayerContractInput }) =>
      payerContractService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payer-contracts'] });
      queryClient.invalidateQueries({ queryKey: ['payer-contract', data.id] });
    },
  });
}

export function useDeletePayerContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => payerContractService.delete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['payer-contracts'] });
      queryClient.invalidateQueries({ queryKey: ['payer-contract', id] });
    },
  });
}

export function useContractAdjustments(contractId?: string, filters?: PayerContractAdjustmentFilters) {
  return useQuery({
    queryKey: ['payer-contract-adjustments', contractId, filters],
    queryFn: () => payerContractService.listAdjustments(contractId!, filters),
    enabled: Boolean(contractId),
  });
}

export function useCreateContractAdjustment(contractId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<CreatePayerContractAdjustmentInput, 'contractId'>) =>
      payerContractService.createAdjustment({ contractId, ...payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payer-contract-adjustments', contractId] });
    },
  });
}

export function useUpdateContractAdjustment(contractId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePayerContractAdjustmentInput }) =>
      payerContractService.updateAdjustment(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payer-contract-adjustments', contractId] });
    },
  });
}

export function useDeleteContractAdjustment(contractId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => payerContractService.deleteAdjustment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payer-contract-adjustments', contractId] });
    },
  });
}

export function useContractPriceCalculator() {
  return useMutation({
    mutationFn: (payload: ContractPriceCalculationInput) => payerContractService.calculatePrice(payload),
  });
}
