import { PrismaService } from '@zeal/database-foundation';
export interface UserWithRoles {
    id: string;
    email: string;
    tenantId: string;
    roles: string[];
}
export interface UserPermissions {
    roles: string[];
    permissions: string[];
}
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getUserById(userId: string): Promise<{
        id: string;
        status: string;
        email: string;
        tenantId: string;
    } | null>;
    getUserWithRoles(userId: string): Promise<UserWithRoles>;
    getUserPermissions(userId: string, tenantId: string): Promise<UserPermissions>;
    invalidateUserPermissions(userId: string, tenantId: string): void;
    invalidateTenantPermissions(tenantId: string): void;
}
//# sourceMappingURL=user.service.d.ts.map