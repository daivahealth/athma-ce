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
import { RemittanceService } from './remittance.service';
import {
    CreateRemittanceDto,
    RemittanceLineDto,
    RemittanceFilterDto,
    RemittanceStatus,
} from './dto/remittance.dto';

@ApiTags('Remittance')
@Controller('remittance')
@ApiHeader({ name: 'x-tenant-id', required: true })
export class RemittanceController {
    constructor(private readonly remittanceService: RemittanceService) { }

    @Post()
    @ApiOperation({ summary: 'Upload/create a remittance with payment details' })
    async create(
        @Headers('x-tenant-id') tenantId: string,
        @Body() body: { remittance: CreateRemittanceDto; lines?: RemittanceLineDto[] },
    ) {
        return this.remittanceService.create(tenantId, body.remittance, body.lines);
    }

    @Get()
    @ApiOperation({ summary: 'List remittances' })
    @ApiQuery({ name: 'payerId', required: false })
    @ApiQuery({ name: 'status', required: false, enum: RemittanceStatus })
    @ApiQuery({ name: 'dateFrom', required: false })
    @ApiQuery({ name: 'dateTo', required: false })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    async findAll(
        @Headers('x-tenant-id') tenantId: string,
        @Query() filters: RemittanceFilterDto,
    ) {
        return this.remittanceService.findAll(tenantId, filters);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get remittance by ID with line items' })
    async findById(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
    ) {
        return this.remittanceService.findById(tenantId, id);
    }

    @Post(':id/reconcile')
    @ApiOperation({ summary: 'Reconcile remittance payments with claims' })
    async reconcile(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
    ) {
        return this.remittanceService.reconcile(tenantId, id);
    }
}
