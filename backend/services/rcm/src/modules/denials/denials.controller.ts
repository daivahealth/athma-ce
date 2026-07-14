import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { DenialsService } from './denials.service';
import {
    CreateDenialDto,
    CreateAppealDto,
    DenialFilterDto,
    DenialStatus,
} from './dto/denial.dto';

@ApiTags('Denials')
@Controller('denials')
@ApiHeader({ name: 'x-tenant-id', required: true })
export class DenialsController {
    constructor(private readonly denialsService: DenialsService) { }

    @Post()
    @ApiOperation({ summary: 'Record a denial against a claim' })
    async create(
        @Headers('x-tenant-id') tenantId: string,
        @Headers('x-user-id') userId: string,
        @Body() dto: CreateDenialDto,
    ) {
        return this.denialsService.create(tenantId, dto, userId);
    }

    @Get()
    @ApiOperation({ summary: 'List denials with filters' })
    @ApiQuery({ name: 'claimId', required: false })
    @ApiQuery({ name: 'encounterId', required: false })
    @ApiQuery({ name: 'patientId', required: false })
    @ApiQuery({ name: 'status', required: false, enum: DenialStatus })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    async findAll(
        @Headers('x-tenant-id') tenantId: string,
        @Query() filters: DenialFilterDto,
    ) {
        return this.denialsService.findAll(tenantId, filters);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get denial by ID with its appeals' })
    async findById(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
    ) {
        return this.denialsService.findById(tenantId, id);
    }

    @Post(':id/appeals')
    @ApiOperation({ summary: 'Draft an appeal against a denial' })
    async draftAppeal(
        @Headers('x-tenant-id') tenantId: string,
        @Headers('x-user-id') userId: string,
        @Param('id') id: string,
        @Body() dto: CreateAppealDto,
    ) {
        return this.denialsService.draftAppeal(tenantId, id, dto, userId);
    }
}
