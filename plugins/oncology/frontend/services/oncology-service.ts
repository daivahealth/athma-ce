import { clinicalClient } from '@/lib/api/client';
import type { TumorStaging, ChemoProtocol, ChemoOrder, TumorBoardCase } from '../types';

const BASE_URL = '/api/v1/plugins/oncology';

export const oncologyService = {
  // Tumor Staging
  async listStagings(params?: { patientId?: string; page?: number; limit?: number }) {
    const { data } = await clinicalClient.get(`${BASE_URL}/staging`, { params });
    return data;
  },

  async getStaging(id: string): Promise<TumorStaging> {
    const { data } = await clinicalClient.get(`${BASE_URL}/staging/${id}`);
    return data.data;
  },

  async createStaging(staging: Partial<TumorStaging>): Promise<TumorStaging> {
    const { data } = await clinicalClient.post(`${BASE_URL}/staging`, staging);
    return data.data;
  },

  // Chemo Protocols
  async listProtocols(params?: { cancerType?: string; page?: number; limit?: number }) {
    const { data } = await clinicalClient.get(`${BASE_URL}/protocols`, { params });
    return data;
  },

  async getProtocol(id: string): Promise<ChemoProtocol> {
    const { data } = await clinicalClient.get(`${BASE_URL}/protocols/${id}`);
    return data.data;
  },

  async createProtocol(protocol: Partial<ChemoProtocol>): Promise<ChemoProtocol> {
    const { data } = await clinicalClient.post(`${BASE_URL}/protocols`, protocol);
    return data.data;
  },

  // Chemo Orders
  async listChemoOrders(params?: { patientId?: string; status?: string; date?: string; page?: number; limit?: number }) {
    const { data } = await clinicalClient.get(`${BASE_URL}/orders`, { params });
    return data;
  },

  async createChemoOrder(order: Partial<ChemoOrder>): Promise<ChemoOrder> {
    const { data } = await clinicalClient.post(`${BASE_URL}/orders`, order);
    return data.data;
  },

  // Tumor Board
  async listTumorBoardCases(params?: { status?: string; date?: string; page?: number; limit?: number }) {
    const { data } = await clinicalClient.get(`${BASE_URL}/tumor-board`, { params });
    return data;
  },

  async createTumorBoardCase(boardCase: Partial<TumorBoardCase>): Promise<TumorBoardCase> {
    const { data } = await clinicalClient.post(`${BASE_URL}/tumor-board`, boardCase);
    return data.data;
  },
};
