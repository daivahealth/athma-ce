import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const PLUGIN_ID_KEY = 'plugin_id';

interface CachedActivation {
  isEnabled: boolean;
  expiresAt: number;
}

const CACHE_TTL_MS = 60_000;

/**
 * Enforces per-tenant plugin activation on @PluginController routes.
 *
 * PluginActivation (Foundation) is the single source of truth — this guard
 * queries it through the internal activation endpoint. The feature.nav.{id}
 * config key is only a derived UI-visibility flag and is deliberately NOT
 * consulted here, so editing that config key can never grant API access.
 *
 * Fails closed: any lookup error denies access.
 */
@Injectable()
export class PluginGuard implements CanActivate {
  private readonly logger = new Logger(PluginGuard.name);
  private readonly cache = new Map<string, CachedActivation>();

  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const pluginId = this.reflector.getAllAndOverride<string>(PLUGIN_ID_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!pluginId) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const tenantId = request.headers['x-tenant-id'];

    if (!tenantId) {
      throw new ForbiddenException('Tenant context required for plugin access');
    }

    const isEnabled = await this.isActivated(pluginId, tenantId);
    if (!isEnabled) {
      this.logger.warn(`Plugin '${pluginId}' is not enabled for tenant '${tenantId}'`);
      throw new ForbiddenException(`Plugin '${pluginId}' is not enabled for this tenant`);
    }
    return true;
  }

  private async isActivated(pluginId: string, tenantId: string): Promise<boolean> {
    const cacheKey = `${pluginId}:${tenantId}`;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.isEnabled;
    }

    let isEnabled = false;
    try {
      const baseUrl = process.env.FOUNDATION_BASE_URL || 'http://localhost:3010';
      const apiKey = process.env.INTERNAL_API_KEY;
      if (!apiKey) {
        this.logger.warn('INTERNAL_API_KEY not configured — plugin activation checks fail closed');
        return false;
      }
      const res = await fetch(
        `${baseUrl}/api/v1/plugins/internal/${encodeURIComponent(pluginId)}/activation/${encodeURIComponent(tenantId)}`,
        { headers: { 'x-internal-api-key': apiKey } },
      );
      if (res.ok) {
        const body = (await res.json()) as { data?: { isEnabled?: boolean } };
        isEnabled = body?.data?.isEnabled === true;
      } else if (res.status === 404) {
        isEnabled = false; // Plugin not installed.
      } else {
        this.logger.warn(
          `Activation lookup for '${pluginId}' returned ${res.status}. Defaulting to disabled.`,
        );
        return false; // Transient failure: fail closed, don't cache.
      }
    } catch (error) {
      this.logger.warn(
        `Failed to check plugin activation for '${pluginId}': ${error}. Defaulting to disabled.`,
      );
      return false; // Transient failure: fail closed, don't cache.
    }

    this.cache.set(cacheKey, { isEnabled, expiresAt: Date.now() + CACHE_TTL_MS });
    return isEnabled;
  }
}
