import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { NutritionPlanService } from '../services/nutrition-plan.service';
import {
  CreateNutritionPlanDto,
  UpdateNutritionPlanDto,
  NutritionPlanResponseDto,
} from '../dto/lifestyle.dto';
import { JwtAuthGuard, PermissionsGuard } from '@zeal/shared-utils';

@ApiTags('Nutrition Plans')
@ApiBearerAuth()
@Controller('lifestyle/nutrition-plans')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class NutritionPlanController {
  constructor(private readonly nutritionPlanService: NutritionPlanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a nutrition plan' })
  @ApiResponse({ status: 201, type: NutritionPlanResponseDto })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateNutritionPlanDto,
  ) {
    return this.nutritionPlanService.create(tenantId, userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a nutrition plan by ID' })
  @ApiResponse({ status: 200, type: NutritionPlanResponseDto })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.nutritionPlanService.findById(tenantId, id);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get nutrition plans for a patient' })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({ status: 200, type: [NutritionPlanResponseDto] })
  async findByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
    @Query('status') status?: string,
  ) {
    const options: { status?: string } = {};
    if (status !== undefined) options.status = status;
    return this.nutritionPlanService.findByPatient(tenantId, patientId, options);
  }

  @Get('patient/:patientId/active')
  @ApiOperation({ summary: 'Get active nutrition plan for a patient' })
  @ApiResponse({ status: 200, type: NutritionPlanResponseDto })
  async getActiveForPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
  ) {
    return this.nutritionPlanService.getActiveForPatient(tenantId, patientId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a nutrition plan' })
  @ApiResponse({ status: 200, type: NutritionPlanResponseDto })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateNutritionPlanDto,
  ) {
    return this.nutritionPlanService.update(tenantId, id, dto);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Mark a nutrition plan as completed' })
  @ApiResponse({ status: 200, type: NutritionPlanResponseDto })
  async complete(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.nutritionPlanService.complete(tenantId, id);
  }

  @Post(':id/pause')
  @ApiOperation({ summary: 'Pause a nutrition plan' })
  @ApiResponse({ status: 200, type: NutritionPlanResponseDto })
  async pause(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.nutritionPlanService.pause(tenantId, id);
  }
}
