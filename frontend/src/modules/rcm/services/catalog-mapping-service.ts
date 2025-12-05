import { rcmClient } from '@/lib/api/client';
import type {
  CatalogMapping,
  CatalogMappingFilters,
  CreateCatalogMappingInput,
  UpdateCatalogMappingInput,
} from '../types/catalog-mapping';

class CatalogMappingService {
  private basePath = '/catalog-mappings';

  async list(params?: CatalogMappingFilters): Promise<CatalogMapping[]> {
    const response = await rcmClient.get(this.basePath, { params });
    return response.data;
  }

  async get(id: string): Promise<CatalogMapping> {
    const response = await rcmClient.get(`${this.basePath}/${id}`);
    return response.data;
  }

  async create(payload: CreateCatalogMappingInput): Promise<CatalogMapping> {
    const response = await rcmClient.post(this.basePath, payload);
    return response.data;
  }

  async update(id: string, payload: UpdateCatalogMappingInput): Promise<CatalogMapping> {
    const response = await rcmClient.put(`${this.basePath}/${id}`, payload);
    return response.data;
  }

  async remove(id: string): Promise<void> {
    await rcmClient.delete(`${this.basePath}/${id}`);
  }
}

export const catalogMappingService = new CatalogMappingService();
