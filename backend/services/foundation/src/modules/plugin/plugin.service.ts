import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@zeal/database-foundation';
import type { Prisma } from '@zeal/database-foundation';
import { PluginManifest, PLUGIN_MANIFEST_SCHEMA } from '@athma/plugin-sdk';
import Ajv from 'ajv';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PluginService {
  private readonly logger = new Logger(PluginService.name);
  private readonly validateManifestSchema = new Ajv({ allErrors: true }).compile(
    PLUGIN_MANIFEST_SCHEMA as unknown as Record<string, unknown>,
  );

  constructor(private readonly prisma: PrismaService) {}

  async listPlugins(filters?: { status?: string; targetService?: string }) {
    const where: Record<string, unknown> = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.targetService) where.targetService = filters.targetService;

    return this.prisma.pluginRegistry.findMany({
      where,
      include: { activations: true },
      orderBy: { installedAt: 'desc' },
    });
  }

  async getPlugin(id: string) {
    const plugin = await this.prisma.pluginRegistry.findUnique({
      where: { id },
      include: { activations: true },
    });
    if (!plugin) throw new NotFoundException(`Plugin '${id}' not found`);
    return plugin;
  }

  async getPluginByPluginId(pluginId: string) {
    const plugin = await this.prisma.pluginRegistry.findUnique({
      where: { pluginId },
      include: { activations: true },
    });
    if (!plugin) throw new NotFoundException(`Plugin '${pluginId}' not found`);
    return plugin;
  }

  async installPlugin(packagePath: string, manifestOverride?: Record<string, unknown>) {
    const manifest = manifestOverride
      ? (manifestOverride as unknown as PluginManifest)
      : this.loadManifest(packagePath);

    this.validateManifest(manifest);

    const existing = await this.prisma.pluginRegistry.findUnique({
      where: { pluginId: manifest.id },
    });

    if (existing) {
      throw new ConflictException(
        `Plugin '${manifest.id}' is already installed (version ${existing.version})`,
      );
    }

    const plugin = await this.prisma.$transaction(async (tx) => {
      const registered = await tx.pluginRegistry.create({
        data: {
          pluginId: manifest.id,
          name: manifest.name,
          version: manifest.version,
          description: manifest.description ?? null,
          author: manifest.author ?? null,
          license: manifest.license ?? null,
          specialtyCode: manifest.specialty?.code ?? null,
          targetService: manifest.backend.targetService,
          manifest: JSON.parse(JSON.stringify(manifest)) as Prisma.InputJsonValue,
          packagePath,
          status: 'installed',
        },
      });

      if (manifest.configKeys?.length) {
        for (const configKey of manifest.configKeys) {
          const existingConfig = await tx.instanceConfig.findUnique({
            where: { configKey: configKey.key },
          });

          if (!existingConfig) {
            await tx.instanceConfig.create({
              data: {
                configKey: configKey.key,
                value: configKey.defaultValue as Prisma.InputJsonValue,
                valueType: configKey.valueType,
                category: configKey.category,
                description: configKey.description,
                isOverridable: configKey.isOverridable,
              },
            });
          }
        }
      }

      if (manifest.backend.permissions?.length) {
        for (const permCode of manifest.backend.permissions) {
          const existingPerm = await tx.permission.findUnique({
            where: { code: permCode },
          });

          if (!existingPerm) {
            const parts = permCode.split('.');
            const resource = parts[0] ?? null;
            const action = parts.slice(1).join('.') || null;
            await tx.permission.create({
              data: {
                code: permCode,
                name: `${manifest.name}: ${permCode}`,
                resource,
                action,
              },
            });
          }
        }
      }

      return registered;
    });

    this.logger.log(`Plugin '${manifest.id}' v${manifest.version} installed successfully`);
    return plugin;
  }

  async activateForTenant(pluginId: string, tenantId: string, enabledBy?: string) {
    const plugin = await this.getPluginByPluginId(pluginId);

    const existing = await this.prisma.pluginActivation.findUnique({
      where: { pluginId_tenantId: { pluginId: plugin.id, tenantId } },
    });

    if (existing?.isEnabled) {
      throw new ConflictException(
        `Plugin '${pluginId}' is already active for tenant '${tenantId}'`,
      );
    }

    const featureFlagKey = `feature.nav.${pluginId}`;

    const activation = await this.prisma.$transaction(async (tx) => {
      const act = existing
        ? await tx.pluginActivation.update({
            where: { id: existing.id },
            data: {
              isEnabled: true,
              enabledAt: new Date(),
              disabledAt: null,
              enabledBy: enabledBy ?? null,
            },
          })
        : await tx.pluginActivation.create({
            data: {
              pluginId: plugin.id,
              tenantId,
              isEnabled: true,
              enabledBy: enabledBy ?? null,
            },
          });

      const tenantConfig = await tx.tenantConfig.findFirst({
        where: { tenantId, configKey: featureFlagKey },
      });

      if (tenantConfig) {
        await tx.tenantConfig.update({
          where: { id: tenantConfig.id },
          data: { value: true },
        });
      } else {
        await tx.tenantConfig.create({
          data: { tenantId, configKey: featureFlagKey, value: true },
        });
      }

      return act;
    });

    this.logger.log(`Plugin '${pluginId}' activated for tenant '${tenantId}'`);
    return activation;
  }

  async deactivateForTenant(pluginId: string, tenantId: string) {
    const plugin = await this.getPluginByPluginId(pluginId);

    const activation = await this.prisma.pluginActivation.findUnique({
      where: { pluginId_tenantId: { pluginId: plugin.id, tenantId } },
    });

    if (!activation || !activation.isEnabled) {
      throw new BadRequestException(
        `Plugin '${pluginId}' is not active for tenant '${tenantId}'`,
      );
    }

    const featureFlagKey = `feature.nav.${pluginId}`;

    const result = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.pluginActivation.update({
        where: { id: activation.id },
        data: { isEnabled: false, disabledAt: new Date() },
      });

      const tenantConfig = await tx.tenantConfig.findFirst({
        where: { tenantId, configKey: featureFlagKey },
      });

      if (tenantConfig) {
        await tx.tenantConfig.update({
          where: { id: tenantConfig.id },
          data: { value: false },
        });
      }

      return updated;
    });

    this.logger.log(`Plugin '${pluginId}' deactivated for tenant '${tenantId}'`);
    return result;
  }

  async getActivationsForTenant(tenantId: string) {
    return this.prisma.pluginActivation.findMany({
      where: { tenantId, isEnabled: true },
      include: { plugin: true },
    });
  }

  /**
   * Single-activation lookup used by PluginGuard in plugin-hosting services.
   * PluginActivation is the source of truth for enforcement; the
   * feature.nav.{id} config key is only a derived UI-visibility flag.
   */
  async getActivation(pluginId: string, tenantId: string) {
    const plugin = await this.getPluginByPluginId(pluginId);
    const activation = await this.prisma.pluginActivation.findUnique({
      where: { pluginId_tenantId: { pluginId: plugin.id, tenantId } },
    });
    return {
      pluginId,
      tenantId,
      isEnabled: activation?.isEnabled === true && plugin.status !== 'error',
      pluginStatus: plugin.status,
    };
  }

  /**
   * Recorded by plugin-hosting services after boot: 'active' when the module
   * loaded and initialized, 'error' when it was quarantined. Never overrides
   * an operator-set 'disabled'.
   */
  async updateLoadStatus(pluginId: string, status: 'active' | 'error', error?: string) {
    const plugin = await this.getPluginByPluginId(pluginId);
    if (plugin.status === 'disabled') return plugin;

    const manifest = (plugin.manifest ?? {}) as Record<string, unknown>;
    const updated = await this.prisma.pluginRegistry.update({
      where: { id: plugin.id },
      data: {
        status,
        manifest: {
          ...manifest,
          _lastLoad: {
            status,
            error: error ?? null,
            at: new Date().toISOString(),
          },
        } as Prisma.InputJsonValue,
      },
    });
    if (status === 'error') {
      this.logger.error(`Plugin '${pluginId}' quarantined by host service: ${error ?? 'unknown error'}`);
    } else {
      this.logger.log(`Plugin '${pluginId}' reported loaded by host service`);
    }
    return updated;
  }

  private resolvePluginPath(packagePath: string): string {
    if (path.isAbsolute(packagePath)) return packagePath;
    // Resolve relative to project root (3 levels up from backend/services/foundation/)
    const projectRoot = path.resolve(__dirname, '..', '..', '..', '..', '..', '..');
    return path.resolve(projectRoot, packagePath);
  }

  private loadManifest(packagePath: string): PluginManifest {
    const resolved = this.resolvePluginPath(packagePath);
    const manifestPath = path.resolve(resolved, 'athma-plugin.json');
    if (!fs.existsSync(manifestPath)) {
      throw new BadRequestException(
        `No athma-plugin.json found at '${manifestPath}'`,
      );
    }
    const raw = fs.readFileSync(manifestPath, 'utf-8');
    return JSON.parse(raw) as PluginManifest;
  }

  private validateManifest(manifest: PluginManifest): void {
    if (!this.validateManifestSchema(manifest)) {
      const detail = (this.validateManifestSchema.errors ?? [])
        .map((e) => `${e.instancePath || 'manifest'} ${e.message}`)
        .join('; ');
      throw new BadRequestException(`Invalid plugin manifest: ${detail}`);
    }
  }
}
