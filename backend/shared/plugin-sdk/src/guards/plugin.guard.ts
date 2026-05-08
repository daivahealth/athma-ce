import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigClient } from '@zeal/config-client';

export const PLUGIN_ID_KEY = 'plugin_id';

@Injectable()
export class PluginGuard implements CanActivate {
  private readonly logger = new Logger(PluginGuard.name);
  private configClient: ConfigClient;

  constructor(private readonly reflector: Reflector) {
    const foundationUrl = process.env.FOUNDATION_BASE_URL || 'http://localhost:3010';
    this.configClient = new ConfigClient({ foundationBaseUrl: foundationUrl });
  }

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

    try {
      const featureFlag = `feature.nav.${pluginId}`;
      const value = await this.configClient.get(featureFlag as any, { tenantId });
      const isEnabled = value === true || value === 'true';

      if (!isEnabled) {
        this.logger.warn(
          `Plugin '${pluginId}' is not enabled for tenant '${tenantId}'`,
        );
        throw new ForbiddenException(
          `Plugin '${pluginId}' is not enabled for this tenant`,
        );
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      this.logger.warn(
        `Failed to check plugin activation for '${pluginId}': ${error}. Defaulting to disabled.`,
      );
      throw new ForbiddenException(
        `Plugin '${pluginId}' is not available`,
      );
    }
  }
}
