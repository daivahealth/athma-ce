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
        settings: import("@zeal/database-foundation/generated/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    listTenants(): import("@zeal/database-foundation").Prisma.PrismaPromise<{
        id: string;
        name: string;
        domain: string;
        status: string;
        settings: import("@zeal/database-foundation/generated/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getTenant(id: string): Promise<{
        id: string;
        name: string;
        domain: string;
        status: string;
        settings: import("@zeal/database-foundation/generated/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateTenant(id: string, dto: UpdateTenantDto): Promise<{
        id: string;
        name: string;
        domain: string;
        status: string;
        settings: import("@zeal/database-foundation/generated/runtime/library").JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteTenant(id: string): Promise<void>;
}
//# sourceMappingURL=tenant.controller.d.ts.map