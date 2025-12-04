import { clinicalClient } from '@/lib/api/client';
import type {
  AdministrativeService,
  AdministrativeServiceFilters,
  AdministrativeServiceOption,
} from '../types/administrative-service';

class AdministrativeServiceApi {
  private basePath = '/catalogs/administrative-services';

  async list(params?: AdministrativeServiceFilters): Promise<AdministrativeService[]> {
    const response = await clinicalClient.get(this.basePath, { params });
    return response.data;
  }

  async get(id: string): Promise<AdministrativeService> {
    const response = await clinicalClient.get(`${this.basePath}/${id}`);
    return response.data;
  }

  async getByCode(code: string): Promise<AdministrativeService> {
    const response = await clinicalClient.get(`${this.basePath}/by-code/${code}`);
    return response.data;
  }

  async getCategories(): Promise<AdministrativeServiceOption[]> {
    const response = await clinicalClient.get(`${this.basePath}/categories`);
    return response.data;
  }

  async getTypes(): Promise<AdministrativeServiceOption[]> {
    const response = await clinicalClient.get(`${this.basePath}/types`);
    return response.data;
  }
}

export const administrativeServiceApi = new AdministrativeServiceApi();
