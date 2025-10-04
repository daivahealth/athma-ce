import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
export declare class TenantController {
    private readonly tenantService;
    constructor(tenantService: TenantService);
    createTenant(dto: CreateTenantDto): Promise<{
        id: string;
        name: string;
        domain: string;
        status: string;
        settings: import("@prisma/client/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    listTenants(): import(".prisma/client").Prisma.PrismaPromise<{
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
//# sourceMappingURL=tenant.controller.d.ts.map