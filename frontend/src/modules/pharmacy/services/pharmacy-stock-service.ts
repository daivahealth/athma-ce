import { rcmClient } from '@/lib/api/client';
import type {
  PharmacyStock,
  PharmacyStockMovement,
  CreateStockInput,
  UpdateStockInput,
  AdjustStockInput,
  StockFilters,
} from '../types/stock';

class PharmacyStockService {
  async list(filters?: StockFilters): Promise<PharmacyStock[]> {
    const response = await rcmClient.get('/pharmacy/stock', { params: filters });
    return response.data;
  }

  async getById(id: string): Promise<PharmacyStock> {
    const response = await rcmClient.get(`/pharmacy/stock/${id}`);
    return response.data;
  }

  async getLowStockAlerts(): Promise<PharmacyStock[]> {
    const response = await rcmClient.get('/pharmacy/stock/alerts/low-stock');
    return response.data;
  }

  async getExpiringAlerts(days = 30): Promise<PharmacyStock[]> {
    const response = await rcmClient.get('/pharmacy/stock/alerts/expiring', { params: { days } });
    return response.data;
  }

  async create(payload: CreateStockInput): Promise<PharmacyStock> {
    const response = await rcmClient.post('/pharmacy/stock', payload);
    return response.data;
  }

  async update(id: string, payload: UpdateStockInput): Promise<PharmacyStock> {
    const response = await rcmClient.put(`/pharmacy/stock/${id}`, payload);
    return response.data;
  }

  async adjust(id: string, payload: AdjustStockInput): Promise<PharmacyStock> {
    const response = await rcmClient.post(`/pharmacy/stock/${id}/adjust`, payload);
    return response.data;
  }

  async quarantine(id: string): Promise<PharmacyStock> {
    const response = await rcmClient.post(`/pharmacy/stock/${id}/quarantine`);
    return response.data;
  }

  async getMovements(stockId: string): Promise<PharmacyStockMovement[]> {
    const response = await rcmClient.get(`/pharmacy/movements/stock/${stockId}`);
    return response.data;
  }

  async listMovements(filters?: {
    movementType?: string;
    dateFrom?: string;
    dateTo?: string;
    performedBy?: string;
  }): Promise<PharmacyStockMovement[]> {
    const response = await rcmClient.get('/pharmacy/movements', { params: filters });
    return response.data;
  }
}

export const pharmacyStockService = new PharmacyStockService();
