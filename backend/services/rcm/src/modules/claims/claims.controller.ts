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
import { ApiTags, ApiOperation, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { ClaimsService } from './claims.service';
import {
    CreateClaimDto,
    UpdateClaimDto,
    GenerateClaimsDto,
    ClaimFilterDto,
    ClaimStatus,
} from './dto/claim.dto';

@ApiTags('Claims')
@Controller('claims')
@ApiHeader({ name: 'x-tenant-id', required: true })
export class ClaimsController {
    constructor(private readonly claimsService: ClaimsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new claim manually' })
    async create(
        @Headers('x-tenant-id') tenantId: string,
        @Body() dto: CreateClaimDto,
    ) {
        return this.claimsService.create(tenantId, dto);
    }

    @Post('generate')
    @ApiOperation({ summary: 'Generate claims from unbilled encounters/charges' })
    async generateClaims(
        @Headers('x-tenant-id') tenantId: string,
        @Body() dto: GenerateClaimsDto,
    ) {
        return this.claimsService.generateClaims(tenantId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'List claims with filters' })
    @ApiQuery({ name: 'patientId', required: false })
    @ApiQuery({ name: 'encounterId', required: false })
    @ApiQuery({ name: 'payerId', required: false })
    @ApiQuery({ name: 'status', required: false, enum: ClaimStatus })
    @ApiQuery({ name: 'batchId', required: false })
    @ApiQuery({ name: 'dateFrom', required: false })
    @ApiQuery({ name: 'dateTo', required: false })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    async findAll(
        @Headers('x-tenant-id') tenantId: string,
        @Headers('authorization') authHeader: string,
        @Headers('x-facility-id') facilityId: string,
        @Headers('x-user-id') userId: string,
        @Query() filters: ClaimFilterDto,
    ) {
        return this.claimsService.findAll(tenantId, filters, authHeader, facilityId, userId);
    }

    @Get('statistics')
    @ApiOperation({ summary: 'Get claim statistics' })
    async getStatistics(@Headers('x-tenant-id') tenantId: string) {
        return this.claimsService.getStatistics(tenantId);
    }

    @Get('formats')
    @ApiOperation({ summary: 'List available claim formats' })
    async listFormats() {
        return this.claimsService.listFormats();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get claim by ID' })
    async findById(
        @Headers('x-tenant-id') tenantId: string,
        @Headers('authorization') authHeader: string,
        @Headers('x-facility-id') facilityId: string,
        @Headers('x-user-id') userId: string,
        @Param('id') id: string,
    ) {
        return this.claimsService.findById(tenantId, id, authHeader, facilityId, userId);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update claim' })
    async update(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
        @Body() dto: UpdateClaimDto,
    ) {
        return this.claimsService.update(tenantId, id, dto);
    }

    @Post(':id/validate')
    @ApiOperation({ summary: 'Validate claim using appropriate generator' })
    async validateClaim(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
    ) {
        return this.claimsService.validateClaim(tenantId, id);
    }

    @Post(':id/submit')
    @ApiOperation({ summary: 'Submit claim - generate file and mark as submitted' })
    async submitClaim(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
    ) {
        return this.claimsService.submitClaim(tenantId, id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Cancel/void a claim' })
    async cancel(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
    ) {
        return this.claimsService.cancel(tenantId, id);
    }
}
