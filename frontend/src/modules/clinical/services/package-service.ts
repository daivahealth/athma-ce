import { clinicalClient } from '@/lib/api/client';
import type {
  Package,
  PackageFilters,
  PackageTypeOption,
  CatalogTypeOption,
} from '../types/package';

class PackageService {
  private basePath = '/catalogs/packages';

  async list(params?: PackageFilters): Promise<Package[]> {
    const response = await clinicalClient.get(this.basePath, { params });
    return response.data;
  }

  async get(id: string): Promise<Package> {
    const response = await clinicalClient.get(`${this.basePath}/${id}`);
    return response.data;
  }

  async getByCode(code: string): Promise<Package> {
    const response = await clinicalClient.get(`${this.basePath}/by-code/${code}`);
    return response.data;
  }

  async getTypes(): Promise<PackageTypeOption[]> {
    const response = await clinicalClient.get(`${this.basePath}/types`);
    return response.data;
  }

  async getCatalogTypes(): Promise<CatalogTypeOption[]> {
    const response = await clinicalClient.get(`${this.basePath}/catalog-types`);
    return response.data;
  }
}

export const packageService = new PackageService();
