import { clinicalClient } from '@/lib/api/client';
import type {
  VitalSignsTemplate,
  VitalSignsTemplateFilters,
  CareSetting,
  AgeGroup,
  CreateVitalSignsTemplateInput,
} from '../types/vital-signs-template';

class VitalSignsTemplateService {
  private basePath = '/catalogs/vital-signs-templates';

  async list(params?: VitalSignsTemplateFilters): Promise<VitalSignsTemplate[]> {
    const response = await clinicalClient.get(this.basePath, { params });
    return response.data;
  }

  async get(id: string): Promise<VitalSignsTemplate> {
    const response = await clinicalClient.get(`${this.basePath}/${id}`);
    return response.data;
  }

  async getByCode(code: string): Promise<VitalSignsTemplate> {
    const response = await clinicalClient.get(`${this.basePath}/by-code/${code}`);
    return response.data;
  }

  async getCareSettings(): Promise<CareSetting[]> {
    const response = await clinicalClient.get(`${this.basePath}/care-settings`);
    return response.data;
  }

  async getAgeGroups(): Promise<AgeGroup[]> {
    const response = await clinicalClient.get(`${this.basePath}/age-groups`);
    return response.data;
  }

  async create(payload: CreateVitalSignsTemplateInput): Promise<VitalSignsTemplate> {
    const response = await clinicalClient.post(this.basePath, payload);
    return response.data;
  }

  async findBestMatch(params: { careSetting: CareSetting; ageGroup: AgeGroup; specialty?: string }) {
    const response = await clinicalClient.post(`${this.basePath}/find-match`, params);
    return response.data as VitalSignsTemplate;
  }
}

export const vitalSignsTemplateService = new VitalSignsTemplateService();
