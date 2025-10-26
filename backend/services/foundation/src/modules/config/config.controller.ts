import {
  Controller,
  Get,
  Put,
  Delete,
  Query,
  Param,
  Body,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from './config.service';
import { SetConfigDto } from './dto/set-config.dto';

@Controller('configs')
export class ConfigController {
  constructor(private configService: ConfigService) {}

  /**
   * Resolve a config value for the current context
   * GET /api/v1/configs/resolve?key=locale.timezone
   */
  @Get('resolve')
  async resolve(
    @Query('key') key: string,
    @Headers('x-tenant-id') tenantId?: string,
    @Headers('x-facility-id') facilityId?: string,
  ) {
    const context: any = {};
    if (tenantId) context.tenantId = tenantId;
    if (facilityId) context.facilityId = facilityId;
    return this.configService.resolve(key, context);
  }

  /**
   * Get all effective configs for current context
   * GET /api/v1/configs/effective
   */
  @Get('effective')
  async getEffective(
    @Headers('x-tenant-id') tenantId?: string,
    @Headers('x-facility-id') facilityId?: string,
  ) {
    const context: any = {};
    if (tenantId) context.tenantId = tenantId;
    if (facilityId) context.facilityId = facilityId;
    return this.configService.getEffectiveConfigs(context);
  }

  /**
   * Get config schema (all available keys)
   * GET /api/v1/configs/schema
   */
  @Get('schema')
  async getSchema() {
    return this.configService.getConfigSchema();
  }

  // ===================================
  // Instance Config Endpoints
  // ===================================

  /**
   * Get all instance configs
   * GET /api/v1/configs/instance
   */
  @Get('instance')
  async getAllInstanceConfigs() {
    return this.configService.getAllInstanceConfigs();
  }

  /**
   * Get specific instance config
   * GET /api/v1/configs/instance/:key
   */
  @Get('instance/:key')
  async getInstanceConfig(@Param('key') key: string) {
    return this.configService.getInstanceConfig(key);
  }

  /**
   * Update instance config (admin only)
   * PUT /api/v1/configs/instance/:key
   */
  @Put('instance/:key')
  async setInstanceConfig(
    @Param('key') key: string,
    @Body() dto: SetConfigDto,
    @Headers('x-user-id') userId: string,
  ) {
    return this.configService.setInstanceConfig(key, dto.value, userId, dto.changeReason);
  }

  // ===================================
  // Tenant Config Endpoints
  // ===================================

  /**
   * Get all configs for a tenant
   * GET /api/v1/configs/tenant/:tenantId
   */
  @Get('tenant/:tenantId')
  async getTenantConfigs(@Param('tenantId') tenantId: string) {
    return this.configService.getTenantConfigs(tenantId);
  }

  /**
   * Set tenant config
   * PUT /api/v1/configs/tenant/:tenantId/:key
   */
  @Put('tenant/:tenantId/:key')
  async setTenantConfig(
    @Param('tenantId') tenantId: string,
    @Param('key') key: string,
    @Body() dto: SetConfigDto,
    @Headers('x-user-id') userId: string,
  ) {
    return this.configService.setTenantConfig(tenantId, key, dto.value, userId, dto.changeReason);
  }

  /**
   * Delete tenant config (revert to instance default)
   * DELETE /api/v1/configs/tenant/:tenantId/:key
   */
  @Delete('tenant/:tenantId/:key')
  async deleteTenantConfig(
    @Param('tenantId') tenantId: string,
    @Param('key') key: string,
    @Headers('x-user-id') userId: string,
    @Body('changeReason') changeReason?: string,
  ) {
    await this.configService.deleteTenantConfig(tenantId, key, userId, changeReason);
    return { message: 'Tenant config deleted, reverted to instance default' };
  }

  // ===================================
  // Facility Config Endpoints
  // ===================================

  /**
   * Get all configs for a facility
   * GET /api/v1/configs/facility/:facilityId
   */
  @Get('facility/:facilityId')
  async getFacilityConfigs(@Param('facilityId') facilityId: string) {
    return this.configService.getFacilityConfigs(facilityId);
  }

  /**
   * Set facility config
   * PUT /api/v1/configs/facility/:facilityId/:key
   */
  @Put('facility/:facilityId/:key')
  async setFacilityConfig(
    @Param('facilityId') facilityId: string,
    @Param('key') key: string,
    @Body() dto: SetConfigDto,
    @Headers('x-user-id') userId: string,
  ) {
    return this.configService.setFacilityConfig(
      facilityId,
      key,
      dto.value,
      userId,
      dto.changeReason,
    );
  }

  /**
   * Delete facility config (revert to tenant/instance default)
   * DELETE /api/v1/configs/facility/:facilityId/:key
   */
  @Delete('facility/:facilityId/:key')
  async deleteFacilityConfig(
    @Param('facilityId') facilityId: string,
    @Param('key') key: string,
    @Headers('x-user-id') userId: string,
    @Body('changeReason') changeReason?: string,
  ) {
    await this.configService.deleteFacilityConfig(facilityId, key, userId, changeReason);
    return { message: 'Facility config deleted, reverted to tenant/instance default' };
  }
}
