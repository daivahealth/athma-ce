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
} from '@nestjs/common';
import { PluginService } from './plugin.service';
import { InstallPluginDto, ActivatePluginDto } from './dto';

@Controller('plugins')
export class PluginController {
  constructor(private readonly pluginService: PluginService) {}

  @Get()
  async listPlugins(
    @Query('status') status?: string,
    @Query('targetService') targetService?: string,
  ) {
    return {
      success: true,
      data: await this.pluginService.listPlugins({ status, targetService }),
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
    @Body() dto: ActivatePluginDto,
    @Headers('x-user-id') userId?: string,
  ) {
    return {
      success: true,
      data: await this.pluginService.activateForTenant(
        pluginId,
        dto.tenantId,
        dto.settings,
        userId,
      ),
    };
  }

  @Put(':pluginId/deactivate')
  async deactivatePlugin(
    @Param('pluginId') pluginId: string,
    @Body() body: { tenantId: string },
  ) {
    return {
      success: true,
      data: await this.pluginService.deactivateForTenant(pluginId, body.tenantId),
    };
  }

  @Get('tenant/:tenantId/active')
  async getActivePluginsForTenant(@Param('tenantId') tenantId: string) {
    return {
      success: true,
      data: await this.pluginService.getActivationsForTenant(tenantId),
    };
  }
}
