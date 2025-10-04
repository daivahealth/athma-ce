import { PrismaService } from '@zeal/shared-database';
import { CreateTenantDto, UpdateTenantDto, TenantSearchDto } from './dto/tenant.dto';
import type { Tenant } from '@prisma/client';
interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export declare class TenantService {
    private prisma;
    constructor(prisma: PrismaService);
    /**
     * Create a new tenant
     */
    createTenant(createTenantDto: CreateTenantDto): Promise<Tenant>;
    /**
     * Get tenant by ID
     */
    getTenantById(id: string): Promise<Tenant>;
    /**
     * Get tenant by domain
     */
    getTenantByDomain(domain: string): Promise<Tenant>;
    /**
     * Search tenants with pagination
     */
    searchTenants(searchDto: TenantSearchDto, pagination: PaginationParams): Promise<{
        tenants: Tenant[];
        total: number;
    }>;
    /**
     * Update tenant
     */
    updateTenant(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant>;
    /**
     * Delete tenant (soft delete by setting status to inactive)
     */
    deleteTenant(id: string): Promise<void>;
    /**
     * Get tenant statistics
     */
    getTenantStats(id: string): Promise<{
        totalUsers: number;
        totalPatients: number;
        totalFacilities: number;
        totalStaff: number;
        totalAppointments: number;
        activeAppointments: number;
    }>;
    /**
     * Validate domain format
     */
    private isValidDomain;
    /**
     * Get all active tenants
     */
    getActiveTenants(): Promise<Tenant[]>;
    /**
     * Check if tenant exists
     */
    tenantExists(id: string): Promise<boolean>;
}
export {};
//# sourceMappingURL=tenant.service.d.ts.map