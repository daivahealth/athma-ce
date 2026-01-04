import { prmClient } from '@/lib/api/client';
import type { CreateTemplateInput, Template, UpdateTemplateInput } from '../types/template';

export interface TemplateFilters {
  channel?: string;
  language?: string;
  category?: string;
  isActive?: boolean;
}

class TemplatesService {
  async list(filters?: TemplateFilters): Promise<Template[]> {
    const response = await prmClient.get('/v1/templates', { params: filters });
    return response.data;
  }

  async get(templateId: string): Promise<Template> {
    const response = await prmClient.get(`/v1/templates/${templateId}`);
    return response.data;
  }

  async create(payload: CreateTemplateInput): Promise<Template> {
    const response = await prmClient.post('/v1/templates', payload);
    return response.data;
  }

  async update(templateId: string, payload: UpdateTemplateInput): Promise<Template> {
    const response = await prmClient.patch(`/v1/templates/${templateId}`, payload);
    return response.data;
  }

  async remove(templateId: string): Promise<void> {
    await prmClient.delete(`/v1/templates/${templateId}`);
  }
}

export const templatesService = new TemplatesService();
