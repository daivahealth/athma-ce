import { clinicalClient } from '@/lib/api/client';
import type {
  FormMaster,
  CreateFormMasterInput,
  UpdateFormMasterInput,
  FormMasterStatus,
  FormResponse,
  CreateFormResponseInput,
  SaveFormResponseInput,
} from '../types/form-master';

export const formMasterService = {
  async createFormMaster(payload: CreateFormMasterInput): Promise<FormMaster> {
    const response = await clinicalClient.post('/form-master', payload);
    return response.data;
  },

  async listFormMasters(status?: FormMasterStatus): Promise<FormMaster[]> {
    const response = await clinicalClient.get('/form-master', { params: status ? { status } : undefined });
    return response.data;
  },

  async getFormMaster(id: string): Promise<FormMaster> {
    const response = await clinicalClient.get(`/form-master/${id}`);
    return response.data;
  },

  async updateFormMaster(id: string, payload: UpdateFormMasterInput): Promise<FormMaster> {
    const response = await clinicalClient.patch(`/form-master/${id}`, payload);
    return response.data;
  },

  async createFormResponse(payload: CreateFormResponseInput): Promise<FormResponse> {
    const response = await clinicalClient.post('/form-responses', payload);
    return response.data;
  },

  async getFormResponse(id: string): Promise<FormResponse> {
    const response = await clinicalClient.get(`/form-responses/${id}`);
    return response.data;
  },

  async getFormResponsesByEncounter(encounterId: string): Promise<FormResponse[]> {
    const response = await clinicalClient.get(`/form-responses/encounter/${encounterId}`);
    return response.data;
  },

  async getFormResponsesByPatient(patientId: string): Promise<FormResponse[]> {
    const response = await clinicalClient.get(`/form-responses/patient/${patientId}`);
    return response.data;
  },

  async saveFormResponse(id: string, payload: SaveFormResponseInput): Promise<FormResponse> {
    const response = await clinicalClient.patch(`/form-responses/${id}`, payload);
    return response.data;
  },
};
