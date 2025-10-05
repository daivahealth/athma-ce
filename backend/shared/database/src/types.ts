import { Prisma, type Patient } from '@prisma/client';

/**
 * Common database types and interfaces
 */

// Tenant context type
export interface TenantContext {
  tenantId: string;
  userId?: string;
  roleIds?: string[];
  permissions?: string[];
}

// Pagination types
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

// Query filter types
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

// Common entity types
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

// Audit types
export interface AuditInfo {
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// User types
export interface UserWithRoles extends Prisma.UserGetPayload<{
  include: {
    userRoles: {
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true;
              };
            };
          };
        };
      };
    };
  };
}> {}

export interface UserPermissions {
  userId: string;
  permissions: string[];
  roles: string[];
}

// Patient types
export interface PatientWithTranslations extends Patient {
  translations?: unknown[];
}

// Appointment types
export interface AppointmentWithDetails extends Prisma.AppointmentGetPayload<{
  include: {
    patient: true;
    staff: true;
    facility: true;
    space: true;
  };
}> {}

// Encounter types
export interface EncounterWithDetails extends Prisma.EncounterGetPayload<{
  include: {
    patient: true;
    appointment: true;
    primaryStaff: true;
    clinicalNotes: true;
    orders: true;
    vitals: true;
  };
}> {}

// HIE types
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

// Database operation types
export type CreateInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateInput<T> = Partial<CreateInput<T>>;
export type WhereInput<T> = Partial<T> & {
  id?: string;
  tenantId?: string;
  status?: string;
};

// Error types (re-exported from errors.ts)
export type { DatabaseError, ValidationError } from './errors';

// Transaction types
export interface TransactionOptions {
  isolationLevel?: Prisma.TransactionIsolationLevel;
  timeout?: number;
  maxWait?: number;
}

export interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  backoffMultiplier?: number;
}

// Query builder types
export interface QueryBuilder<T> {
  where(condition: Partial<T>): QueryBuilder<T>;
  paginate(page: number, limit: number): QueryBuilder<T>;
  sort(field: string, order: 'asc' | 'desc'): QueryBuilder<T>;
  include(relations: Record<string, boolean>): QueryBuilder<T>;
  execute(): Promise<T[]>;
}

// Cache types
export interface CacheOptions {
  ttl?: number; // Time to live in seconds
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

// Event types
export interface DatabaseEvent<T = any> {
  type: 'create' | 'update' | 'delete' | 'restore';
  model: string;
  data: T;
  previousData?: T;
  timestamp: Date;
  userId?: string;
  tenantId?: string;
}

export interface EventHandler<T = any> {
  handle(event: DatabaseEvent<T>): Promise<void>;
}

// Migration types
export interface Migration {
  id: string;
  name: string;
  appliedAt: Date;
  checksum: string;
}

export interface MigrationStatus {
  current: string | null;
  pending: string[];
  applied: Migration[];
}
