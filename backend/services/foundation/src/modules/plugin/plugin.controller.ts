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
} from '@nestjs/common';
import { PluginService } from './plugin.service';
import { InstallPluginDto } from './dto';

@Controller('plugins')
export class PluginController {
  constructor(private readonly pluginService: PluginService) {}

  @Get()
  async listPlugins(
    @Query('status') status?: string,
    @Query('targetService') targetService?: string,
  ) {
    const filters: { status?: string; targetService?: string } = {};
    if (status) filters.status = status;
    if (targetService) filters.targetService = targetService;
    return {
      success: true,
      data: await this.pluginService.listPlugins(filters),
    };
  }

  @Get('tenant/:tenantId/active')
  async getActivePluginsForTenant(@Param('tenantId') tenantId: string) {
    return {
      success: true,
      data: await this.pluginService.getActivationsForTenant(tenantId),
    };
  }

  @Get(':pluginId')
  async getPlugin(@Param('pluginId') pluginId: string) {
    return {
      success: true,
      data: await this.pluginService.getPluginByPluginId(pluginId),
    };
  }

  @Post('install')
  @HttpCode(HttpStatus.CREATED)
  async installPlugin(@Body() dto: InstallPluginDto) {
    return {
      success: true,
      data: await this.pluginService.installPlugin(dto.packagePath, dto.manifest),
    };
  }

  @Put(':pluginId/activate')
  async activatePlugin(
    @Param('pluginId') pluginId: string,
    @Body() body: Record<string, any>,
    @Headers('x-tenant-id') headerTenantId?: string,
    @Headers('x-user-id') userId?: string,
  ) {
    const tenantId: string | undefined = body?.tenantId || headerTenantId;
    if (!tenantId) {
      throw new BadRequestException('tenantId is required in the body or x-tenant-id header');
    }
    return {
      success: true,
      data: await this.pluginService.activateForTenant(
        pluginId,
        tenantId,
        body?.settings,
        userId,
      ),
    };
  }

  @Put(':pluginId/deactivate')
  async deactivatePlugin(
    @Param('pluginId') pluginId: string,
    @Body() body: Record<string, any>,
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
