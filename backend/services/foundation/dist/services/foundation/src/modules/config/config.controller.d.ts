import { ConfigService } from './config.service';
import { SetConfigDto } from './dto/set-config.dto';
export declare class ConfigController {
    private configService;
    constructor(configService: ConfigService);
    /**
     * Resolve a config value for the current context
     * GET /api/v1/configs/resolve?key=locale.timezone
     */
    resolve(key: string, tenantId?: string, facilityId?: string): Promise<{
        value: import("@zeal/database-foundation/generated/runtime/library").JsonValue;
        level: string;
    }>;
    /**
     * Get all effective configs for current context
     * GET /api/v1/configs/effective
     */
    getEffective(tenantId?: string, facilityId?: string): Promise<Record<string, any>>;
    /**
     * Get config schema (all available keys)
     * GET /api/v1/configs/schema
     */
    getSchema(): Promise<{
        description: string | null;
        configKey: string;
        category: string;
        valueType: string;
        isOverridable: boolean;
        isSensitive: boolean;
    }[]>;
    /**
     * Get all instance configs
     * GET /api/v1/configs/instance
     */
    getAllInstanceConfigs(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        configKey: string;
        value: import("@zeal/database-foundation/generated/runtime/library").JsonValue;
        createdBy: string | null;
        updatedBy: string | null;
        category: string;
        valueType: string;
        isOverridable: boolean;
        isSensitive: boolean;
    }[]>;
    /**
     * Get specific instance config
     * GET /api/v1/configs/instance/:key
     */
    getInstanceConfig(key: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        configKey: string;
        value: import("@zeal/database-foundation/generated/runtime/library").JsonValue;
        createdBy: string | null;
        updatedBy: string | null;
        category: string;
        valueType: string;
        isOverridable: boolean;
        isSensitive: boolean;
    }>;
    /**
     * Update instance config (admin only)
     * PUT /api/v1/configs/instance/:key
     */
    setInstanceConfig(key: string, dto: SetConfigDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        configKey: string;
        value: import("@zeal/database-foundation/generated/runtime/library").JsonValue;
        createdBy: string | null;
        updatedBy: string | null;
        category: string;
        valueType: string;
        isOverridable: boolean;
        isSensitive: boolean;
    }>;
    /**
     * Get all configs for a tenant
     * GET /api/v1/configs/tenant/:tenantId
     */
    getTenantConfigs(tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        configKey: string;
        value: import("@zeal/database-foundation/generated/runtime/library").JsonValue;
        createdBy: string | null;
        updatedBy: string | null;
    }[]>;
    /**
     * Set tenant config
     * PUT /api/v1/configs/tenant/:tenantId/:key
     */
    setTenantConfig(tenantId: string, key: string, dto: SetConfigDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        configKey: string;
        value: import("@zeal/database-foundation/generated/runtime/library").JsonValue;
        createdBy: string | null;
        updatedBy: string | null;
    }>;
    /**
     * Delete tenant config (revert to instance default)
     * DELETE /api/v1/configs/tenant/:tenantId/:key
     */
    deleteTenantConfig(tenantId: string, key: string, userId: string, changeReason?: string): Promise<{
        message: string;
    }>;
    /**
     * Get all configs for a facility
     * GET /api/v1/configs/facility/:facilityId
     */
    getFacilityConfigs(facilityId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string;
        configKey: string;
        value: import("@zeal/database-foundation/generated/runtime/library").JsonValue;
        createdBy: string | null;
        updatedBy: string | null;
    }[]>;
    /**
     * Set facility config
     * PUT /api/v1/configs/facility/:facilityId/:key
     */
    setFacilityConfig(facilityId: string, key: string, dto: SetConfigDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        facilityId: string;
        configKey: string;
        value: import("@zeal/database-foundation/generated/runtime/library").JsonValue;
        createdBy: string | null;
        updatedBy: string | null;
    }>;
    /**
     * Delete facility config (revert to tenant/instance default)
     * DELETE /api/v1/configs/facility/:facilityId/:key
     */
    deleteFacilityConfig(facilityId: string, key: string, userId: string, changeReason?: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=config.controller.d.ts.map