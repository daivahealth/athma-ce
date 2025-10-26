import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService, Prisma } from '@zeal/database-foundation';

export interface ConfigContext {
  tenantId?: string;
  facilityId?: string;
  userId?: string;
}

@Injectable()
export class ConfigService {
  constructor(private prisma: PrismaService) {}

  /**
   * Resolve config value through hierarchy (facility → tenant → instance)
   */
  async resolve(key: string, context: ConfigContext) {
    // 1. Try facility-level
    if (context.facilityId) {
      const facilityConfig = await this.prisma.facilityConfig.findUnique({
        where: {
          facilityId_configKey: {
            facilityId: context.facilityId,
            configKey: key,
          },
        },
      });
      if (facilityConfig) {
        return { value: facilityConfig.value, level: 'facility' };
      }
    }

    // 2. Try tenant-level
    if (context.tenantId) {
      const tenantConfig = await this.prisma.tenantConfig.findUnique({
        where: {
          tenantId_configKey: {
            tenantId: context.tenantId,
            configKey: key,
          },
        },
      });
      if (tenantConfig) {
        return { value: tenantConfig.value, level: 'tenant' };
      }
    }

    // 3. Try instance-level
    const instanceConfig = await this.prisma.instanceConfig.findUnique({
      where: { configKey: key },
    });
    if (instanceConfig) {
      return { value: instanceConfig.value, level: 'instance' };
    }

    throw new NotFoundException(`Configuration key '${key}' not found`);
  }

  /**
   * Get all effective configs for a context
   */
  async getEffectiveConfigs(context: ConfigContext) {
    const allInstanceConfigs = await this.prisma.instanceConfig.findMany();
    const configs: Record<string, any> = {};

    // Start with instance configs
    for (const config of allInstanceConfigs) {
      configs[config.configKey] = config.value;
    }

    // Override with tenant configs
    if (context.tenantId) {
      const tenantConfigs = await this.prisma.tenantConfig.findMany({
        where: { tenantId: context.tenantId },
      });
      for (const config of tenantConfigs) {
        configs[config.configKey] = config.value;
      }
    }

    // Override with facility configs
    if (context.facilityId) {
      const facilityConfigs = await this.prisma.facilityConfig.findMany({
        where: { facilityId: context.facilityId },
      });
      for (const config of facilityConfigs) {
        configs[config.configKey] = config.value;
      }
    }

    return configs;
  }

  /**
   * Get all instance configs
   */
  async getAllInstanceConfigs() {
    return this.prisma.instanceConfig.findMany({
      orderBy: [{ category: 'asc' }, { configKey: 'asc' }],
    });
  }

  /**
   * Get instance config by key
   */
  async getInstanceConfig(key: string) {
    const config = await this.prisma.instanceConfig.findUnique({
      where: { configKey: key },
    });

    if (!config) {
      throw new NotFoundException(`Instance config '${key}' not found`);
    }

    return config;
  }

  /**
   * Set instance config (admin only)
   */
  async setInstanceConfig(key: string, value: any, userId: string, changeReason?: string) {
    // Check if config exists
    const existing = await this.prisma.instanceConfig.findUnique({
      where: { configKey: key },
    });

    if (!existing) {
      throw new NotFoundException(`Instance config '${key}' not found. Cannot update non-existent config.`);
    }

    // Update config
    const updated = await this.prisma.instanceConfig.update({
      where: { configKey: key },
      data: {
        value: value,
        updatedBy: userId,
      },
    });

    // Log audit trail
    await this.prisma.configAuditLog.create({
      data: {
        configLevel: 'instance',
        configKey: key,
        oldValue: existing.value as Prisma.InputJsonValue,
        newValue: value as Prisma.InputJsonValue,
        changedBy: userId,
        changeReason: changeReason || null,
      },
    });

    return updated;
  }

  /**
   * Get all tenant configs
   */
  async getTenantConfigs(tenantId: string) {
    return this.prisma.tenantConfig.findMany({
      where: { tenantId },
      orderBy: { configKey: 'asc' },
    });
  }

  /**
   * Set tenant config
   */
  async setTenantConfig(
    tenantId: string,
    key: string,
    value: any,
    userId: string,
    changeReason?: string
  ) {
    // Check if instance config exists and is overridable
    const instanceConfig = await this.prisma.instanceConfig.findUnique({
      where: { configKey: key },
    });

    if (!instanceConfig) {
      throw new NotFoundException(`Config key '${key}' does not exist`);
    }

    if (!instanceConfig.isOverridable) {
      throw new BadRequestException(`Config '${key}' cannot be overridden at tenant level`);
    }

    // Check if tenant config already exists
    const existing = await this.prisma.tenantConfig.findUnique({
      where: {
        tenantId_configKey: {
          tenantId,
          configKey: key,
        },
      },
    });

    let updated;
    if (existing) {
      updated = await this.prisma.tenantConfig.update({
        where: { id: existing.id },
        data: {
          value,
          updatedBy: userId,
        },
      });
    } else {
      updated = await this.prisma.tenantConfig.create({
        data: {
          tenantId,
          configKey: key,
          value,
          createdBy: userId,
        },
      });
    }

    // Log audit trail
    const auditData: any = {
      configLevel: 'tenant',
      configKey: key,
      entityId: tenantId,
      newValue: value as Prisma.InputJsonValue,
      changedBy: userId,
      changeReason: changeReason || null,
    };

    if (existing?.value) {
      auditData.oldValue = existing.value as Prisma.InputJsonValue;
    }

    await this.prisma.configAuditLog.create({ data: auditData });

    return updated;
  }

  /**
   * Delete tenant config (revert to instance default)
   */
  async deleteTenantConfig(tenantId: string, key: string, userId: string, changeReason?: string) {
    const existing = await this.prisma.tenantConfig.findUnique({
      where: {
        tenantId_configKey: {
          tenantId,
          configKey: key,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(`Tenant config '${key}' not found`);
    }

    await this.prisma.tenantConfig.delete({
      where: { id: existing.id },
    });

    // Log audit trail
    const auditData: any = {
      configLevel: 'tenant',
      configKey: key,
      entityId: tenantId,
      oldValue: existing.value as Prisma.InputJsonValue,
      changedBy: userId,
      changeReason: changeReason || 'Reverted to instance default',
    };

    await this.prisma.configAuditLog.create({ data: auditData });
  }

  /**
   * Get all facility configs
   */
  async getFacilityConfigs(facilityId: string) {
    return this.prisma.facilityConfig.findMany({
      where: { facilityId },
      orderBy: { configKey: 'asc' },
    });
  }

  /**
   * Set facility config
   */
  async setFacilityConfig(
    facilityId: string,
    key: string,
    value: any,
    userId: string,
    changeReason?: string
  ) {
    // Check if instance config exists and is overridable
    const instanceConfig = await this.prisma.instanceConfig.findUnique({
      where: { configKey: key },
    });

    if (!instanceConfig) {
      throw new NotFoundException(`Config key '${key}' does not exist`);
    }

    if (!instanceConfig.isOverridable) {
      throw new BadRequestException(`Config '${key}' cannot be overridden at facility level`);
    }

    // Check if facility config already exists
    const existing = await this.prisma.facilityConfig.findUnique({
      where: {
        facilityId_configKey: {
          facilityId,
          configKey: key,
        },
      },
    });

    let updated;
    if (existing) {
      updated = await this.prisma.facilityConfig.update({
        where: { id: existing.id },
        data: {
          value,
          updatedBy: userId,
        },
      });
    } else {
      updated = await this.prisma.facilityConfig.create({
        data: {
          facilityId,
          configKey: key,
          value,
          createdBy: userId,
        },
      });
    }

    // Log audit trail
    const auditData: any = {
      configLevel: 'facility',
      configKey: key,
      entityId: facilityId,
      newValue: value as Prisma.InputJsonValue,
      changedBy: userId,
      changeReason: changeReason || null,
    };

    if (existing?.value) {
      auditData.oldValue = existing.value as Prisma.InputJsonValue;
    }

    await this.prisma.configAuditLog.create({ data: auditData });

    return updated;
  }

  /**
   * Delete facility config (revert to tenant/instance default)
   */
  async deleteFacilityConfig(
    facilityId: string,
    key: string,
    userId: string,
    changeReason?: string
  ) {
    const existing = await this.prisma.facilityConfig.findUnique({
      where: {
        facilityId_configKey: {
          facilityId,
          configKey: key,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(`Facility config '${key}' not found`);
    }

    await this.prisma.facilityConfig.delete({
      where: { id: existing.id },
    });

    // Log audit trail
    const auditData: any = {
      configLevel: 'facility',
      configKey: key,
      entityId: facilityId,
      oldValue: existing.value as Prisma.InputJsonValue,
      changedBy: userId,
      changeReason: changeReason || 'Reverted to tenant/instance default',
    };

    await this.prisma.configAuditLog.create({ data: auditData });
  }

  /**
   * Get config schema (all available config keys)
   */
  async getConfigSchema() {
    return this.prisma.instanceConfig.findMany({
      select: {
        configKey: true,
        valueType: true,
        category: true,
        description: true,
        isOverridable: true,
        isSensitive: true,
      },
      orderBy: [{ category: 'asc' }, { configKey: 'asc' }],
    });
  }
}
