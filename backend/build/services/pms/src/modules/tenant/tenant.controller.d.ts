import { TenantService } from './tenant.service';
import { CreateTenantDto, UpdateTenantDto, TenantSearchDto, TenantStatsDto } from './dto/tenant.dto';
interface ApiResponseType<T> {
    data: T;
    message?: string;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
import type { Tenant } from '@prisma/client';
export declare class TenantController {
    private readonly tenantService;
    constructor(tenantService: TenantService);
    create(createTenantDto: CreateTenantDto): Promise<ApiResponseType<Tenant>>;
    findAll(searchDto: TenantSearchDto, pagination: PaginationParams): Promise<ApiResponseType<Tenant[]>>;
    getActiveTenants(): Promise<ApiResponseType<Tenant[]>>;
    findOne(id: string): Promise<ApiResponseType<Tenant>>;
    getTenantStats(id: string): Promise<ApiResponseType<TenantStatsDto>>;
    findByDomain(domain: string): Promise<ApiResponseType<Tenant>>;
    update(id: string, updateTenantDto: UpdateTenantDto): Promise<ApiResponseType<Tenant>>;
    remove(id: string): Promise<void>;
    checkExists(id: string): Promise<ApiResponseType<{
        exists: boolean;
    }>>;
}
export {};
//# sourceMappingURL=tenant.controller.d.ts.map