import { rcmClient } from '@/lib/api/client';
import type {
  ContractPriceCalculationInput,
  ContractPriceCalculationResult,
  CreatePayerContractAdjustmentInput,
  CreatePayerContractInput,
  PayerContract,
  PayerContractAdjustment,
  PayerContractAdjustmentFilters,
  PayerContractFilters,
  UpdatePayerContractAdjustmentInput,
  UpdatePayerContractInput,
} from '../types/payer-contract';

class PayerContractService {
  async list(filters?: PayerContractFilters): Promise<PayerContract[]> {
    const response = await rcmClient.get('/payer-contracts', { params: filters });
    return response.data;
  }

  async getById(id: string): Promise<PayerContract> {
    const response = await rcmClient.get(`/payer-contracts/${id}`);
    return response.data;
  }

  async create(payload: CreatePayerContractInput): Promise<PayerContract> {
    const response = await rcmClient.post('/payer-contracts', payload);
    return response.data;
  }

  async update(id: string, payload: UpdatePayerContractInput): Promise<PayerContract> {
    const response = await rcmClient.put(`/payer-contracts/${id}`, payload);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await rcmClient.delete(`/payer-contracts/${id}`);
  }

  async listAdjustments(contractId: string, filters?: PayerContractAdjustmentFilters): Promise<PayerContractAdjustment[]> {
    const response = await rcmClient.get(`/payer-contracts/${contractId}/adjustments`, { params: filters });
    return response.data;
  }

  async createAdjustment(payload: CreatePayerContractAdjustmentInput): Promise<PayerContractAdjustment> {
    const response = await rcmClient.post('/payer-contracts/adjustments', payload);
    return response.data;
  }

  async updateAdjustment(id: string, payload: UpdatePayerContractAdjustmentInput): Promise<PayerContractAdjustment> {
    const response = await rcmClient.put(`/payer-contracts/adjustments/${id}`, payload);
    return response.data;
  }

  async deleteAdjustment(id: string): Promise<void> {
    await rcmClient.delete(`/payer-contracts/adjustments/${id}`);
  }

  async calculatePrice(payload: ContractPriceCalculationInput): Promise<ContractPriceCalculationResult> {
    const response = await rcmClient.post('/payer-contracts/calculate-price', payload);
    return response.data;
  }
}

export const payerContractService = new PayerContractService();
