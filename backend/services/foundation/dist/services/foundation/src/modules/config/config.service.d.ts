import { PrismaService, Prisma } from '@zeal/database-foundation';
export interface ConfigContext {
    tenantId?: string;
    facilityId?: string;
    userId?: string;
}
export declare class ConfigService {
    private prisma;
    constructor(prisma: PrismaService);
    /**
     * Resolve config value through hierarchy (facility → tenant → instance)
     */
    resolve(key: string, context: ConfigContext): Promise<{
        value: Prisma.JsonValue;
        level: string;
    }>;
    /**
     * Get all effective configs for a context
     */
    getEffectiveConfigs(context: ConfigContext): Promise<Record<string, any>>;
    /**
     * Get all instance configs
     */
    getAllInstanceConfigs(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        configKey: string;
        value: Prisma.JsonValue;
        createdBy: string | null;
        updatedBy: string | null;
        category: string;
        valueType: string;
        isOverridable: boolean;
        isSensitive: boolean;
    }[]>;
    /**
     * Get instance config by key
     */
    getInstanceConfig(key: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        configKey: string;
        value: Prisma.JsonValue;
        createdBy: string | null;
        updatedBy: string | null;
        category: string;
        valueType: string;
        isOverridable: boolean;
        isSensitive: boolean;
    }>;
    /**
     * Set instance config (admin only)
     */
    setInstanceConfig(key: string, value: any, userId: string, changeReason?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        configKey: string;
        value: Prisma.JsonValue;
        createdBy: string | null;
        updatedBy: string | null;
        category: string;
        valueType: string;
        isOverridable: boolean;
        isSensitive: boolean;
    }>;
    /**
     * Get all tenant configs
     */
    getTenantConfigs(tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        configKey: string;
        value: Prisma.JsonValue;
        createdBy: string | null;
        updatedBy: string | null;
    }[]>;
    /**
     * Set tenant config
     */
    setTenantConfig(tenantId: string, key: string, value: any, userId: string, changeReason?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        configKey: string;
        value: Prisma.JsonValue;
        createdBy: string | null;
        updatedBy: string | null;
    }>;
    /**
     * Delete tenant config (revert to instance default)
     */
    deleteTenantConfig(tenantId: string, key: string, userId: string, changeReason?: string): Promise<void>;
    /**
     * Get all facility configs
     */
    getFacilityConfigs(facilityId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string;
        configKey: string;
        value: Prisma.JsonValue;
        createdBy: string | null;
        updatedBy: string | null;
    }[]>;
    /**
     * Set facility config
     */
    setFacilityConfig(facilityId: string, key: string, value: any, userId: string, changeReason?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string;
        configKey: string;
        value: Prisma.JsonValue;
        createdBy: string | null;
        updatedBy: string | null;
    }>;
    /**
     * Delete facility config (revert to tenant/instance default)
     */
    deleteFacilityConfig(facilityId: string, key: string, userId: string, changeReason?: string): Promise<void>;
    /**
     * Get config schema (all available config keys)
     */
    getConfigSchema(): Promise<{
        description: string | null;
        configKey: string;
        category: string;
        valueType: string;
        isOverridable: boolean;
        isSensitive: boolean;
    }[]>;
}
//# sourceMappingURL=config.service.d.ts.map