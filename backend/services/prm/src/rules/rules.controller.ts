/**
 * Rules Controller
 * CRUD endpoints for engagement rules
 */

import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '@zeal/shared-utils';
import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { TenantId } from '../common/decorators/tenant-id.decorator';
import { UserId } from '../common/decorators/user-id.decorator';

@ApiTags('Rules')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('v1/rules')
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Post()
  @ApiOperation({ summary: 'Create new engagement rule' })
  @ApiResponse({ status: 201, description: 'Rule created successfully' })
  @ApiResponse({ status: 409, description: 'Rule code already exists' })
  async create(
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @Body() createRuleDto: CreateRuleDto,
  ) {
    return this.rulesService.create(tenantId, userId, createRuleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all engagement rules' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Rules retrieved successfully' })
  async findAll(
    @TenantId() tenantId: string,
    @Query('isActive') isActive?: string,
    @Query('category') category?: string,
  ) {
    const filters: any = {};
    if (isActive !== undefined) {
      filters.isActive = isActive === 'true';
    }
    if (category) {
      filters.category = category;
    }

    return this.rulesService.findAll(tenantId, filters);
  }

  @Get(':ruleId')
  @ApiOperation({ summary: 'Get rule by ID' })
  @ApiResponse({ status: 200, description: 'Rule retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Rule not found' })
  async findOne(@TenantId() tenantId: string, @Param('ruleId') ruleId: string) {
    return this.rulesService.findOne(tenantId, ruleId);
  }

  @Patch(':ruleId')
  @ApiOperation({ summary: 'Update engagement rule' })
  @ApiResponse({ status: 200, description: 'Rule updated successfully' })
  @ApiResponse({ status: 404, description: 'Rule not found' })
  @ApiResponse({ status: 409, description: 'Rule code already exists' })
  async update(
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @Param('ruleId') ruleId: string,
    @Body() updateRuleDto: UpdateRuleDto,
  ) {
    return this.rulesService.update(tenantId, userId, ruleId, updateRuleDto);
  }

  @Delete(':ruleId')
  @ApiOperation({ summary: 'Delete engagement rule (soft delete)' })
  @ApiResponse({ status: 200, description: 'Rule deleted successfully' })
  @ApiResponse({ status: 404, description: 'Rule not found' })
  async remove(
    @TenantId() tenantId: string,
    @UserId() userId: string,
    @Param('ruleId') ruleId: string,
  ) {
    return this.rulesService.remove(tenantId, userId, ruleId);
  }
}
