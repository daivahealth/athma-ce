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
import { LifestyleService } from '../services/lifestyle.service';
import {
    CreateNutritionPlanDto,
    CreateExercisePrescriptionDto,
    NutritionPlanResponseDto,
    ExercisePrescriptionResponseDto,
} from '../dto/lifestyle.dto';
import { JwtAuthGuard, PermissionsGuard } from '@zeal/shared-utils';

@ApiTags('Lifestyle')
@ApiBearerAuth()
@Controller('wellness/lifestyle')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LifestyleController {
    constructor(private readonly lifestyleService: LifestyleService) { }

    // ============================================
    // Nutrition Plan Endpoints
    // ============================================

    @Post('nutrition-plans')
    @ApiOperation({ summary: 'Create a nutrition plan' })
    @ApiResponse({ status: 201, type: NutritionPlanResponseDto })
    async createNutritionPlan(
        @Headers('x-tenant-id') tenantId: string,
        @Headers('x-user-id') userId: string,
        @Body() dto: CreateNutritionPlanDto,
    ) {
        return this.lifestyleService.createNutritionPlan(tenantId, userId, dto);
    }

    @Get('nutrition-plans')
    @ApiOperation({ summary: 'List all nutrition plans' })
    @ApiQuery({ name: 'patientId', required: false })
    @ApiQuery({ name: 'status', required: false })
    @ApiResponse({ status: 200, type: [NutritionPlanResponseDto] })
    async findAllNutritionPlans(
        @Headers('x-tenant-id') tenantId: string,
        @Query('patientId') patientId?: string,
        @Query('status') status?: string,
    ) {
        return this.lifestyleService.findAllNutritionPlans(tenantId, {
            ...(patientId && { patientId }),
            ...(status && { status }),
        });
    }

    @Get('nutrition-plans/:id')
    @ApiOperation({ summary: 'Get a nutrition plan by ID' })
    @ApiResponse({ status: 200, type: NutritionPlanResponseDto })
    async findNutritionPlanById(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
    ) {
        return this.lifestyleService.findNutritionPlanById(tenantId, id);
    }

    @Patch('nutrition-plans/:id/status')
    @ApiOperation({ summary: 'Update nutrition plan status' })
    @ApiResponse({ status: 200, type: NutritionPlanResponseDto })
    async updateNutritionPlanStatus(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
        @Body() body: { status: string },
    ) {
        return this.lifestyleService.updateNutritionPlanStatus(tenantId, id, body.status);
    }

    // ============================================
    // Exercise Prescription Endpoints
    // ============================================

    @Post('exercise-prescriptions')
    @ApiOperation({ summary: 'Create an exercise prescription' })
    @ApiResponse({ status: 201, type: ExercisePrescriptionResponseDto })
    async createExercisePrescription(
        @Headers('x-tenant-id') tenantId: string,
        @Headers('x-user-id') userId: string,
        @Body() dto: CreateExercisePrescriptionDto,
    ) {
        return this.lifestyleService.createExercisePrescription(tenantId, userId, dto);
    }

    @Get('exercise-prescriptions')
    @ApiOperation({ summary: 'List all exercise prescriptions' })
    @ApiQuery({ name: 'patientId', required: false })
    @ApiQuery({ name: 'status', required: false })
    @ApiResponse({ status: 200, type: [ExercisePrescriptionResponseDto] })
    async findAllExercisePrescriptions(
        @Headers('x-tenant-id') tenantId: string,
        @Query('patientId') patientId?: string,
        @Query('status') status?: string,
    ) {
        return this.lifestyleService.findAllExercisePrescriptions(tenantId, {
            ...(patientId && { patientId }),
            ...(status && { status }),
        });
    }

    @Get('exercise-prescriptions/:id')
    @ApiOperation({ summary: 'Get an exercise prescription by ID' })
    @ApiResponse({ status: 200, type: ExercisePrescriptionResponseDto })
    async findExercisePrescriptionById(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
    ) {
        return this.lifestyleService.findExercisePrescriptionById(tenantId, id);
    }

    @Patch('exercise-prescriptions/:id/status')
    @ApiOperation({ summary: 'Update exercise prescription status' })
    @ApiResponse({ status: 200, type: ExercisePrescriptionResponseDto })
    async updateExercisePrescriptionStatus(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
        @Body() body: { status: string },
    ) {
        return this.lifestyleService.updateExercisePrescriptionStatus(tenantId, id, body.status);
    }
}
