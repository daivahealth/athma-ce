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
import { ExercisePrescriptionService } from '../services/exercise-prescription.service';
import {
  CreateExercisePrescriptionDto,
  UpdateExercisePrescriptionDto,
  ExercisePrescriptionResponseDto,
} from '../dto/lifestyle.dto';
import { JwtAuthGuard, PermissionsGuard } from '@zeal/shared-utils';

@ApiTags('Exercise Prescriptions')
@ApiBearerAuth()
@Controller('lifestyle/exercise-prescriptions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ExercisePrescriptionController {
  constructor(private readonly exerciseService: ExercisePrescriptionService) {}

  @Post()
  @ApiOperation({ summary: 'Create an exercise prescription' })
  @ApiResponse({ status: 201, type: ExercisePrescriptionResponseDto })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateExercisePrescriptionDto,
  ) {
    return this.exerciseService.create(tenantId, userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an exercise prescription by ID' })
  @ApiResponse({ status: 200, type: ExercisePrescriptionResponseDto })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.exerciseService.findById(tenantId, id);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get exercise prescriptions for a patient' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'goal', required: false })
  @ApiResponse({ status: 200, type: [ExercisePrescriptionResponseDto] })
  async findByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
    @Query('status') status?: string,
    @Query('goal') goal?: string,
  ) {
    const options: { status?: string; goal?: string } = {};
    if (status !== undefined) options.status = status;
    if (goal !== undefined) options.goal = goal;
    return this.exerciseService.findByPatient(tenantId, patientId, options);
  }

  @Get('patient/:patientId/active')
  @ApiOperation({ summary: 'Get active exercise prescription for a patient' })
  @ApiResponse({ status: 200, type: ExercisePrescriptionResponseDto })
  async getActiveForPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
  ) {
    return this.exerciseService.getActiveForPatient(tenantId, patientId);
  }

  @Get('patient/:patientId/summary')
  @ApiOperation({ summary: 'Get exercise summary for a patient' })
  async getPatientSummary(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
  ) {
    return this.exerciseService.getPatientExerciseSummary(tenantId, patientId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an exercise prescription' })
  @ApiResponse({ status: 200, type: ExercisePrescriptionResponseDto })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateExercisePrescriptionDto,
  ) {
    return this.exerciseService.update(tenantId, id, dto);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Mark an exercise prescription as completed' })
  @ApiResponse({ status: 200, type: ExercisePrescriptionResponseDto })
  async complete(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.exerciseService.complete(tenantId, id);
  }

  @Post(':id/pause')
  @ApiOperation({ summary: 'Pause an exercise prescription' })
  @ApiResponse({ status: 200, type: ExercisePrescriptionResponseDto })
  async pause(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.exerciseService.pause(tenantId, id);
  }

  @Post(':id/resume')
  @ApiOperation({ summary: 'Resume a paused exercise prescription' })
  @ApiResponse({ status: 200, type: ExercisePrescriptionResponseDto })
  async resume(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.exerciseService.resume(tenantId, id);
  }

  @Post(':id/log-session')
  @ApiOperation({ summary: 'Log an exercise session' })
  async logSession(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body()
    body: {
      completedAt: string;
      actualDuration: number;
      exercisesCompleted: any[];
      heartRateAvg?: number;
      caloriesBurned?: number;
      notes?: string;
    },
  ) {
    return this.exerciseService.logSession(tenantId, id, {
      ...body,
      completedAt: new Date(body.completedAt),
    });
  }
}
