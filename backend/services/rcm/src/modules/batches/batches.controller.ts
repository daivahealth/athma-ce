import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    Query,
    Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { BatchesService } from './batches.service';
import {
    CreateBatchDto,
    UpdateBatchDto,
    AddClaimsToBatchDto,
    BatchFilterDto,
    BatchStatus,
    BatchType,
} from './dto/batch.dto';

@ApiTags('Batches')
@Controller('batches')
@ApiHeader({ name: 'x-tenant-id', required: true })
export class BatchesController {
    constructor(private readonly batchesService: BatchesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new batch' })
    async create(
        @Headers('x-tenant-id') tenantId: string,
        @Body() dto: CreateBatchDto,
    ) {
        return this.batchesService.create(tenantId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'List batches with filters' })
    @ApiQuery({ name: 'payerId', required: false })
    @ApiQuery({ name: 'status', required: false, enum: BatchStatus })
    @ApiQuery({ name: 'batchType', required: false, enum: BatchType })
    @ApiQuery({ name: 'dateFrom', required: false })
    @ApiQuery({ name: 'dateTo', required: false })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    async findAll(
        @Headers('x-tenant-id') tenantId: string,
        @Query() filters: BatchFilterDto,
    ) {
        return this.batchesService.findAll(tenantId, filters);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get batch by ID with claims' })
    async findById(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
    ) {
        return this.batchesService.findById(tenantId, id);
    }

    @Post(':id/add-claims')
    @ApiOperation({ summary: 'Add claims to batch' })
    async addClaims(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
        @Body() dto: AddClaimsToBatchDto,
    ) {
        return this.batchesService.addClaims(tenantId, id, dto);
    }

    @Post(':id/remove-claims')
    @ApiOperation({ summary: 'Remove claims from batch' })
    async removeClaims(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
        @Body() dto: AddClaimsToBatchDto,
    ) {
        return this.batchesService.removeClaims(tenantId, id, dto);
    }

    @Post(':id/close')
    @ApiOperation({ summary: 'Close batch - no more claims can be added' })
    async closeBatch(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
    ) {
        return this.batchesService.closeBatch(tenantId, id);
    }

    @Post(':id/generate')
    @ApiOperation({ summary: 'Generate batch submission file' })
    async generateFile(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
    ) {
        return this.batchesService.generateFile(tenantId, id);
    }

    @Post(':id/submit')
    @ApiOperation({ summary: 'Submit batch to payer/clearinghouse' })
    async submitBatch(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
    ) {
        return this.batchesService.submitBatch(tenantId, id);
    }
}
