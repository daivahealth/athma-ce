import type { AxiosInstance } from 'axios';

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  query?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages?: number;
  };
}

/**
 * Base API Service class providing common CRUD operations
 * All domain-specific services should extend this class
 */
export class BaseApiService<T> {
  constructor(
    protected client: AxiosInstance,
    protected basePath: string
  ) {}

  /**
   * Get all records with optional pagination and search
   */
  async findAll(params?: PaginationParams): Promise<PaginatedResponse<T>> {
    const response = await this.client.get(this.basePath, { params });
    return response.data;
  }

  /**
   * Get a single record by ID
   */
  async findOne(id: string): Promise<T> {
    const response = await this.client.get(`${this.basePath}/${id}`);
    return response.data;
  }

  /**
   * Create a new record
   */
  async create(data: Partial<T>): Promise<T> {
    const response = await this.client.post(this.basePath, data);
    return response.data;
  }

  /**
   * Update an existing record
   */
  async update(id: string, data: Partial<T>): Promise<T> {
    const response = await this.client.put(`${this.basePath}/${id}`, data);
    return response.data;
  }

  /**
   * Delete a record (soft delete if supported by backend)
   */
  async delete(id: string): Promise<void> {
    await this.client.delete(`${this.basePath}/${id}`);
  }

  /**
   * Search records with query string
   */
  async search(query: string, params?: Omit<PaginationParams, 'search' | 'query'>): Promise<PaginatedResponse<T>> {
    const response = await this.client.get(this.basePath, {
      params: { search: query, ...params },
    });
    return response.data;
  }

  /**
   * Count records matching criteria
   */
  async count(params?: Record<string, any>): Promise<number> {
    const response = await this.client.get(`${this.basePath}/count`, { params });
    return response.data.count;
  }
}
