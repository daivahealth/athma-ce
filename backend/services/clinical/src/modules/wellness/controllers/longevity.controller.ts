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
import { LongevityService } from '../services/longevity.service';
import {
    CreateLongevityProtocolDto,
    CreateLongevityTreatmentDto,
    LongevityProtocolResponseDto,
    LongevityTreatmentResponseDto,
    LongevityTreatmentStatus,
} from '../dto/longevity.dto';
import { JwtAuthGuard, PermissionsGuard } from '@zeal/shared-utils';

@ApiTags('Longevity')
@ApiBearerAuth()
@Controller('wellness/longevity')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LongevityController {
    constructor(private readonly longevityService: LongevityService) { }

    // ============================================
    // Protocol Endpoints
    // ============================================

    @Post('protocols')
    @ApiOperation({ summary: 'Create a longevity protocol' })
    @ApiResponse({ status: 201, type: LongevityProtocolResponseDto })
    async createProtocol(
        @Headers('x-tenant-id') tenantId: string,
        @Headers('x-user-id') userId: string,
        @Body() dto: CreateLongevityProtocolDto,
    ) {
        return this.longevityService.createProtocol(tenantId, userId, dto);
    }

    @Get('protocols')
    @ApiOperation({ summary: 'List all longevity protocols' })
    @ApiQuery({ name: 'protocolType', required: false })
    @ApiQuery({ name: 'isActive', required: false, type: Boolean })
    @ApiResponse({ status: 200, type: [LongevityProtocolResponseDto] })
    async findAllProtocols(
        @Headers('x-tenant-id') tenantId: string,
        @Query('protocolType') protocolType?: string,
        @Query('isActive') isActive?: string,
    ) {
        const options: { protocolType?: string; isActive?: boolean } = {};
        if (protocolType !== undefined) options.protocolType = protocolType;
        if (isActive !== undefined) options.isActive = isActive === 'true';
        return this.longevityService.findAllProtocols(tenantId, options);
    }

    @Get('protocols/:id')
    @ApiOperation({ summary: 'Get a longevity protocol by ID' })
    @ApiResponse({ status: 200, type: LongevityProtocolResponseDto })
    async findProtocolById(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
    ) {
        return this.longevityService.findProtocolById(tenantId, id);
    }

    // ============================================
    // Treatment Endpoints
    // ============================================

    @Post('treatments')
    @ApiOperation({ summary: 'Create a longevity treatment' })
    @ApiResponse({ status: 201, type: LongevityTreatmentResponseDto })
    async createTreatment(
        @Headers('x-tenant-id') tenantId: string,
        @Headers('x-user-id') userId: string,
        @Body() dto: CreateLongevityTreatmentDto,
    ) {
        return this.longevityService.createTreatment(tenantId, userId, dto);
    }

    @Get('treatments')
    @ApiOperation({ summary: 'List all longevity treatments' })
    @ApiQuery({ name: 'status', required: false, enum: LongevityTreatmentStatus })
    @ApiResponse({ status: 200, type: [LongevityTreatmentResponseDto] })
    async findAllTreatments(
        @Headers('x-tenant-id') tenantId: string,
        @Query('status') status?: LongevityTreatmentStatus,
    ) {
        const options: { status?: LongevityTreatmentStatus } = {};
        if (status !== undefined) options.status = status;
        return this.longevityService.findAllTreatments(tenantId, options);
    }

    @Get('treatments/:id')
    @ApiOperation({ summary: 'Get a longevity treatment by ID' })
    @ApiResponse({ status: 200, type: LongevityTreatmentResponseDto })
    async findTreatmentById(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
    ) {
        return this.longevityService.findTreatmentById(tenantId, id);
    }

    @Get('treatments/patient/:patientId')
    @ApiOperation({ summary: 'Get longevity treatments for a patient' })
    @ApiResponse({ status: 200, type: [LongevityTreatmentResponseDto] })
    async findTreatmentsByPatient(
        @Headers('x-tenant-id') tenantId: string,
        @Param('patientId') patientId: string,
    ) {
        return this.longevityService.findTreatmentsByPatient(tenantId, patientId);
    }

    @Patch('treatments/:id/status')
    @ApiOperation({ summary: 'Update treatment status' })
    @ApiResponse({ status: 200, type: LongevityTreatmentResponseDto })
    async updateTreatmentStatus(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
        @Body() body: { status: LongevityTreatmentStatus; notes?: string },
    ) {
        return this.longevityService.updateTreatmentStatus(tenantId, id, body.status, body.notes);
    }
}
