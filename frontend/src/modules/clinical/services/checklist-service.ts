import { clinicalClient } from '@/lib/api/client';
import type {
  ChecklistTemplate,
  ChecklistInstance,
  ChecklistInstanceResponse,
  CreateChecklistInstanceRequest,
  SaveChecklistResponseRequest,
  BulkSaveChecklistResponseRequest,
  ListChecklistInstancesQuery,
  CreateChecklistTemplateRequest,
  CreateChecklistTemplateItemRequest,
  PaginatedChecklistTemplates,
  ChecklistTemplateFilters,
} from '@/modules/clinical/types/checklist';

class ChecklistService {
  async listTemplates(params?: ChecklistTemplateFilters): Promise<PaginatedChecklistTemplates> {
    const response = await clinicalClient.get('/inpatient/checklists/templates', { params });
    return response.data;
  }

  async getTemplate(templateId: string): Promise<ChecklistTemplate> {
    const response = await clinicalClient.get(`/inpatient/checklists/templates/${templateId}`);
    return response.data;
  }

  async createTemplate(payload: CreateChecklistTemplateRequest): Promise<ChecklistTemplate> {
    const response = await clinicalClient.post('/inpatient/checklists/templates', payload);
    return response.data;
  }

  async addTemplateItem(templateId: string, payload: CreateChecklistTemplateItemRequest): Promise<ChecklistTemplate> {
    const response = await clinicalClient.post(`/inpatient/checklists/templates/${templateId}/items`, payload);
    return response.data;
  }

  async getAdmissionChecklists(admissionId: string): Promise<ChecklistInstance[]> {
    const response = await clinicalClient.get(`/inpatient/checklists/admissions/${admissionId}`);
    return response.data;
  }

  async listInstances(params?: ListChecklistInstancesQuery): Promise<ChecklistInstance[]> {
    const response = await clinicalClient.get('/inpatient/checklists/instances', { params });
    return response.data;
  }

  async getInstance(instanceId: string): Promise<ChecklistInstance> {
    const response = await clinicalClient.get(`/inpatient/checklists/instances/${instanceId}`);
    return response.data;
  }

  async createInstance(payload: CreateChecklistInstanceRequest): Promise<ChecklistInstance> {
    const response = await clinicalClient.post('/inpatient/checklists/instances', payload);
    return response.data;
  }

  async saveResponse(instanceId: string, payload: SaveChecklistResponseRequest): Promise<ChecklistInstanceResponse> {
    const response = await clinicalClient.post(`/inpatient/checklists/instances/${instanceId}/responses`, payload);
    return response.data;
  }

  async saveResponsesBulk(
    instanceId: string,
    payload: BulkSaveChecklistResponseRequest
  ): Promise<ChecklistInstanceResponse[]> {
    const response = await clinicalClient.post(
      `/inpatient/checklists/instances/${instanceId}/responses/bulk`,
      payload
    );
    return response.data;
  }

  async getResponses(instanceId: string): Promise<ChecklistInstanceResponse[]> {
    const response = await clinicalClient.get(`/inpatient/checklists/instances/${instanceId}/responses`);
    return response.data;
  }

  async deleteResponse(responseId: string): Promise<void> {
    await clinicalClient.delete(`/inpatient/checklists/responses/${responseId}`);
  }

  async completeInstance(instanceId: string): Promise<ChecklistInstance> {
    const response = await clinicalClient.patch(`/inpatient/checklists/instances/${instanceId}/complete`);
    return response.data;
  }

  async verifyInstance(instanceId: string): Promise<ChecklistInstance> {
    const response = await clinicalClient.patch(`/inpatient/checklists/instances/${instanceId}/verify`);
    return response.data;
  }

  async cancelInstance(instanceId: string): Promise<ChecklistInstance> {
    const response = await clinicalClient.patch(`/inpatient/checklists/instances/${instanceId}/cancel`);
    return response.data;
  }

  async updateStatus(instanceId: string, status: string): Promise<ChecklistInstance> {
    const response = await clinicalClient.patch(`/inpatient/checklists/instances/${instanceId}/status`, { status });
    return response.data;
  }
}

export const checklistService = new ChecklistService();
