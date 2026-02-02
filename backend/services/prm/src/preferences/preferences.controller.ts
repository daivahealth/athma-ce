/**
 * Preferences Controller
 * Patient communication preferences
 */

import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@zeal/shared-utils';
import { PreferencesService } from './preferences.service';
import { TenantId } from '../common/decorators/tenant-id.decorator';

@ApiTags('Patients')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('v1/patients/:patientId/preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  @ApiOperation({ summary: 'Get patient communication preferences' })
  @ApiResponse({ status: 200, description: 'Preferences retrieved successfully' })
  async findOne(@TenantId() tenantId: string, @Param('patientId') patientId: string) {
    return this.preferencesService.findOrCreate(tenantId, patientId);
  }

  @Put()
  @ApiOperation({ summary: 'Update patient communication preferences' })
  @ApiResponse({ status: 200, description: 'Preferences updated successfully' })
  async update(
    @TenantId() tenantId: string,
    @Param('patientId') patientId: string,
    @Body() updateData: any,
  ) {
    return this.preferencesService.update(tenantId, patientId, updateData);
  }
}
