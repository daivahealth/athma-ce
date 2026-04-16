import { rcmClient } from '@/lib/api/client';
import type {
  PharmacyDispensing,
  CreateDispensingInput,
  VerifyDispensingInput,
  ExecuteDispenseInput,
  DispatchToWardInput,
  CancelDispensingInput,
  ReturnDispensingInput,
  DispensingFilters,
} from '../types/dispensing';

class PharmacyDispensingService {
  async list(filters?: DispensingFilters): Promise<PharmacyDispensing[]> {
    const response = await rcmClient.get('/pharmacy/dispensings', { params: filters });
    return response.data;
  }

  async getById(id: string): Promise<PharmacyDispensing> {
    const response = await rcmClient.get(`/pharmacy/dispensings/${id}`);
    return response.data;
  }

  async create(payload: CreateDispensingInput): Promise<PharmacyDispensing> {
    const response = await rcmClient.post('/pharmacy/dispensings', payload);
    return response.data;
  }

  async verify(id: string, payload: VerifyDispensingInput): Promise<PharmacyDispensing> {
    const response = await rcmClient.post(`/pharmacy/dispensings/${id}/verify`, payload);
    return response.data;
  }

  async dispense(id: string, payload: ExecuteDispenseInput): Promise<PharmacyDispensing> {
    const response = await rcmClient.post(`/pharmacy/dispensings/${id}/dispense`, payload);
    return response.data;
  }

  async dispatchToWard(id: string, payload: DispatchToWardInput): Promise<PharmacyDispensing> {
    const response = await rcmClient.post(`/pharmacy/dispensings/${id}/dispatch-to-ward`, payload);
    return response.data;
  }

  async wardReceive(id: string): Promise<PharmacyDispensing> {
    const response = await rcmClient.post(`/pharmacy/dispensings/${id}/ward-receive`);
    return response.data;
  }

  async cancel(id: string, payload: CancelDispensingInput): Promise<PharmacyDispensing> {
    const response = await rcmClient.post(`/pharmacy/dispensings/${id}/cancel`, payload);
    return response.data;
  }

  async processReturn(id: string, payload: ReturnDispensingInput): Promise<PharmacyDispensing> {
    const response = await rcmClient.post(`/pharmacy/dispensings/${id}/return`, payload);
    return response.data;
  }
}

export const pharmacyDispensingService = new PharmacyDispensingService();
