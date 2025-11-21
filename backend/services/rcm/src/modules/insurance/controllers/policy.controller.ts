import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PolicyService } from '../services/policy.service';
import {
  CreatePolicyDto,
  UpdatePolicyDto,
  PolicyResponseDto,
  PolicyStatus,
} from '../dto/policy.dto';

@ApiTags('Policies')
@ApiBearerAuth()
@Controller('policies')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new insurance policy' })
  @ApiResponse({ status: 201, description: 'Policy created successfully' })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreatePolicyDto,
  ) {
    return this.policyService.create(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all policies' })
  @ApiQuery({ name: 'patientId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: PolicyStatus })
  @ApiResponse({ status: 200, description: 'Policies retrieved' })
  async findAll(
    @Headers('x-tenant-id') tenantId: string,
    @Query('patientId') patientId?: string,
    @Query('status') status?: PolicyStatus,
  ) {
    return this.policyService.findAll(tenantId, patientId, status);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get active policies for a patient' })
  @ApiResponse({ status: 200, description: 'Patient policies retrieved' })
  async findByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
  ) {
    return this.policyService.findByPatient(tenantId, patientId);
  }

  @Get('patient/:patientId/primary')
  @ApiOperation({ summary: 'Get primary policy for a patient' })
  @ApiResponse({ status: 200, description: 'Primary policy retrieved' })
  async findPrimaryPolicy(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
  ) {
    return this.policyService.findPrimaryPolicy(tenantId, patientId);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get policy statistics' })
  @ApiQuery({ name: 'patientId', required: false })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getStatistics(
    @Headers('x-tenant-id') tenantId: string,
    @Query('patientId') patientId?: string,
  ) {
    return this.policyService.getPolicyStatistics(tenantId, patientId);
  }

  @Post('check-expired')
  @ApiOperation({ summary: 'Check and update expired policies' })
  @ApiResponse({ status: 200, description: 'Expired policies updated' })
  async checkExpired(
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.policyService.checkExpiredPolicies(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get policy by ID' })
  @ApiResponse({ status: 200, description: 'Policy found' })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.policyService.findById(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update policy' })
  @ApiResponse({ status: 200, description: 'Policy updated' })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePolicyDto,
  ) {
    return this.policyService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel policy' })
  @ApiResponse({ status: 200, description: 'Policy cancelled successfully' })
  async delete(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.policyService.delete(tenantId, id);
  }
}
