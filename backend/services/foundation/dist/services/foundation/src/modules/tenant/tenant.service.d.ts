import { TenantRepository } from './tenant.repository';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
export declare class TenantService {
    private readonly tenantRepository;
    constructor(tenantRepository: TenantRepository);
    createTenant(dto: CreateTenantDto): Promise<{
        id: string;
        name: string;
        domain: string;
        status: string;
        settings: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getTenants(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        domain: string;
        status: string;
        settings: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getTenant(id: string): Promise<{
        id: string;
        name: string;
        domain: string;
        status: string;
        settings: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateTenant(id: string, dto: UpdateTenantDto): Promise<{
        id: string;
        name: string;
        domain: string;
        status: string;
        settings: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteTenant(id: string): Promise<void>;
}
//# sourceMappingURL=tenant.service.d.ts.map