import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { PluginService } from './plugin.service';
import { InstallPluginDto, ActivatePluginDto, UpdateLoadStatusDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { InternalApiKeyGuard } from '../../common/guards/internal-api-key.guard';
import {
  PLUGIN_READ,
  PLUGIN_INSTALL,
  PLUGIN_ACTIVATE,
  PLUGIN_DEACTIVATE,
} from '@zeal/contracts';

@Controller('plugins')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PluginController {
  constructor(private readonly pluginService: PluginService) {}

  @Get()
  @Permissions(PLUGIN_READ)
  async listPlugins(
    @Query('status') status?: string,
    @Query('targetService') targetService?: string,
    @Query('capability') capability?: string,
  ) {
    const filters: { status?: string; targetService?: string; capability?: string } = {};
    if (status) filters.status = status;
    if (targetService) filters.targetService = targetService;
    if (capability) filters.capability = capability;
    return {
      success: true,
      data: await this.pluginService.listPlugins(filters),
    };
  }

  @Get('tenant/:tenantId/active')
  @Permissions(PLUGIN_READ)
  async getActivePluginsForTenant(@Param('tenantId') tenantId: string) {
    return {
      success: true,
      data: await this.pluginService.getActivationsForTenant(tenantId),
    };
  }

  @Get(':pluginId')
  @Permissions(PLUGIN_READ)
  async getPlugin(@Param('pluginId') pluginId: string) {
    return {
      success: true,
      data: await this.pluginService.getPluginByPluginId(pluginId),
    };
  }

  @Post('install')
  @Permissions(PLUGIN_INSTALL)
  @HttpCode(HttpStatus.CREATED)
  async installPlugin(@Body() dto: InstallPluginDto) {
    return {
      success: true,
      data: await this.pluginService.installPlugin(dto.packagePath, dto.manifest),
    };
  }

  @Put(':pluginId/activate')
  @Permissions(PLUGIN_ACTIVATE)
  async activatePlugin(
    @Param('pluginId') pluginId: string,
    @Body() body: ActivatePluginDto,
    @Headers('x-tenant-id') headerTenantId?: string,
    @Headers('x-user-id') userId?: string,
  ) {
    const tenantId: string | undefined = body?.tenantId || headerTenantId;
    if (!tenantId) {
      throw new BadRequestException('tenantId is required in the body or x-tenant-id header');
    }
    return {
      success: true,
      data: await this.pluginService.activateForTenant(pluginId, tenantId, userId),
    };
  }

  @Put(':pluginId/deactivate')
  @Permissions(PLUGIN_DEACTIVATE)
  async deactivatePlugin(
    @Param('pluginId') pluginId: string,
    @Body() body: ActivatePluginDto,
    @Headers('x-tenant-id') headerTenantId?: string,
  ) {
    const tenantId: string | undefined = body?.tenantId || headerTenantId;
    if (!tenantId) {
      throw new BadRequestException('tenantId is required in the body or x-tenant-id header');
    }
    return {
      success: true,
      data: await this.pluginService.deactivateForTenant(pluginId, tenantId),
    };
  }
}

/**
 * Service-to-service surface, authenticated by X-Internal-Api-Key instead of a
 * user JWT. Split into its own controller so the class-level JWT guards above
 * never apply to it.
 */
@Public() // exempt from the global JWT guard — InternalApiKeyGuard applies
@Controller('plugins/internal')
@UseGuards(InternalApiKeyGuard)
export class PluginInternalController {
  constructor(private readonly pluginService: PluginService) {}

  /**
   * Called by a plugin-hosting service (e.g. clinical) after boot to record
   * whether each installed plugin actually loaded ('active') or was
   * quarantined ('error'). An 'active' report may carry the manifest that was
   * actually loaded, which re-syncs the registry snapshot (version,
   * description, permissions) — install writes that snapshot once and never
   * revisits it, so without this the row drifts on every version bump.
   */
  @Put(':pluginId/load-status')
  async updateLoadStatus(
    @Param('pluginId') pluginId: string,
    @Body() dto: UpdateLoadStatusDto,
  ) {
    return {
      success: true,
      data: await this.pluginService.updateLoadStatus(
        pluginId,
        dto.status,
        dto.error,
        dto.manifest,
      ),
    };
  }

  /**
   * Activation lookup for PluginGuard enforcement in plugin-hosting services.
   * PluginActivation is the single source of truth (the feature.nav.{id}
   * config key is a derived UI flag).
   */
  @Get(':pluginId/activation/:tenantId')
  async getActivation(
    @Param('pluginId') pluginId: string,
    @Param('tenantId') tenantId: string,
  ) {
    return {
      success: true,
      data: await this.pluginService.getActivation(pluginId, tenantId),
    };
  }
}
