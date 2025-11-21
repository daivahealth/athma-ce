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
import { EncounterCoverageService } from '../services/encounter-coverage.service';
import {
  CreateEncounterCoverageDto,
  UpdateEncounterCoverageDto,
  FinancialClass,
  CoverageLevel,
} from '../dto/encounter-coverage.dto';

@ApiTags('Encounter Coverages')
@ApiBearerAuth()
@Controller('encounter-coverages')
export class EncounterCoverageController {
  constructor(private readonly encounterCoverageService: EncounterCoverageService) {}

  @Post()
  @ApiOperation({ summary: 'Create encounter coverage' })
  @ApiResponse({ status: 201, description: 'Coverage created successfully' })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreateEncounterCoverageDto,
  ) {
    return this.encounterCoverageService.create(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all encounter coverages' })
  @ApiQuery({ name: 'encounterId', required: false })
  @ApiQuery({ name: 'patientId', required: false })
  @ApiQuery({ name: 'policyId', required: false })
  @ApiQuery({ name: 'payerId', required: false })
  @ApiQuery({ name: 'financialClass', required: false, enum: FinancialClass })
  @ApiQuery({ name: 'coverageLevel', required: false, enum: CoverageLevel })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Coverages retrieved' })
  async findAll(
    @Headers('x-tenant-id') tenantId: string,
    @Query('encounterId') encounterId?: string,
    @Query('patientId') patientId?: string,
    @Query('policyId') policyId?: string,
    @Query('payerId') payerId?: string,
    @Query('financialClass') financialClass?: FinancialClass,
    @Query('coverageLevel') coverageLevel?: CoverageLevel,
    @Query('isActive') isActive?: string,
  ) {
    const filters: any = {};
    if (encounterId) filters.encounterId = encounterId;
    if (patientId) filters.patientId = patientId;
    if (policyId) filters.policyId = policyId;
    if (payerId) filters.payerId = payerId;
    if (financialClass) filters.financialClass = financialClass;
    if (coverageLevel) filters.coverageLevel = coverageLevel;
    if (isActive !== undefined) filters.isActive = isActive === 'true';

    return this.encounterCoverageService.findAll(tenantId, filters);
  }

  @Get('encounter/:encounterId')
  @ApiOperation({ summary: 'Get coverages for an encounter' })
  @ApiResponse({ status: 200, description: 'Encounter coverages retrieved' })
  async findByEncounter(
    @Headers('x-tenant-id') tenantId: string,
    @Param('encounterId') encounterId: string,
  ) {
    return this.encounterCoverageService.findByEncounter(tenantId, encounterId);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get coverages for a patient' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Patient coverages retrieved' })
  async findByPatient(
    @Headers('x-tenant-id') tenantId: string,
    @Param('patientId') patientId: string,
    @Query('isActive') isActive?: string,
  ) {
    const isActiveFilter = isActive !== undefined ? isActive === 'true' : undefined;
    return this.encounterCoverageService.findByPatient(tenantId, patientId, isActiveFilter);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get coverage statistics' })
  @ApiQuery({ name: 'patientId', required: false })
  @ApiQuery({ name: 'encounterId', required: false })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getStatistics(
    @Headers('x-tenant-id') tenantId: string,
    @Query('patientId') patientId?: string,
    @Query('encounterId') encounterId?: string,
  ) {
    const filters: any = {};
    if (patientId) filters.patientId = patientId;
    if (encounterId) filters.encounterId = encounterId;

    return this.encounterCoverageService.getCoverageStatistics(tenantId, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get coverage by ID' })
  @ApiResponse({ status: 200, description: 'Coverage found' })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.encounterCoverageService.findById(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update coverage' })
  @ApiResponse({ status: 200, description: 'Coverage updated' })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateEncounterCoverageDto,
  ) {
    return this.encounterCoverageService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate coverage' })
  @ApiResponse({ status: 200, description: 'Coverage deactivated successfully' })
  async delete(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.encounterCoverageService.delete(tenantId, id);
  }
}
