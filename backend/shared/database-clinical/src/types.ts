/**
 * Common database types and interfaces shared across domain-specific Prisma packages.
 */

export interface TenantContext {
  tenantId: string;
  userId?: string;
  roleIds?: string[];
  permissions?: string[];
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface DateRangeFilter {
  from?: Date;
  to?: Date;
}

export interface TextSearchFilter {
  search?: string;
  fields?: string[];
}

export interface StatusFilter {
  status?: string | string[];
}

export interface BaseEntity {
  id: string;
  tenantId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDeleteEntity extends BaseEntity {
  status: string;
  deletedAt?: Date;
}

export interface AuditInfo {
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPermissions {
  userId: string;
  permissions: string[];
  roles: string[];
}

export interface HieSyncStatus {
  platformId: string;
  platformName: string;
  status: 'pending' | 'success' | 'failed' | 'retry';
  fhirId?: string;
  errorMessage?: string;
  lastSync?: Date;
}

export interface HiePatientConsent {
  platformId: string;
  platformName: string;
  consentType: string;
  consentStatus: 'granted' | 'denied' | 'partial' | 'withdrawn';
  grantedResources: string[];
  deniedResources: string[];
  consentDate: Date;
  expirationDate?: Date;
}

export type CreateInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateInput<T> = Partial<CreateInput<T>>;
export type WhereInput<T> = Partial<T> & {
  id?: string;
  tenantId?: string;
  status?: string;
};

export interface TransactionOptions {
  isolationLevel?: string;
  timeout?: number;
  maxWait?: number;
}

export interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  backoffMultiplier?: number;
}

export interface CacheOptions {
  ttl?: number;
  key?: string;
  tags?: string[];
}

export interface CacheManager {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: CacheOptions): Promise<void>;
  delete(key: string): Promise<void>;
  invalidateByTag(tag: string): Promise<void>;
  clear(): Promise<void>;
}

export interface DatabaseEvent<T = any> {
  type: 'create' | 'update' | 'delete' | 'restore';
  model: string;
  data: T;
  previousData?: T;
  timestamp: Date;
  userId?: string;
}

export type { DatabaseError, ValidationError } from './errors';
