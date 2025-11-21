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
import { PayerService } from '../services/payer.service';
import {
  CreatePayerDto,
  UpdatePayerDto,
  PayerResponseDto,
  PayerStatus,
} from '../dto/payer.dto';

@ApiTags('Payers')
@ApiBearerAuth()
@Controller('payers')
export class PayerController {
  constructor(private readonly payerService: PayerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payer' })
  @ApiResponse({ status: 201, description: 'Payer created successfully' })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CreatePayerDto,
  ) {
    return this.payerService.create(tenantId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payers for tenant' })
  @ApiQuery({ name: 'status', required: false, enum: PayerStatus })
  @ApiResponse({ status: 200, description: 'Payers retrieved' })
  async findAll(
    @Headers('x-tenant-id') tenantId: string,
    @Query('status') status?: PayerStatus,
  ) {
    return this.payerService.findAll(tenantId, status);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get payer statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getStatistics(
    @Headers('x-tenant-id') tenantId: string,
  ) {
    return this.payerService.getPayerStatistics(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payer by ID' })
  @ApiResponse({ status: 200, description: 'Payer found' })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.payerService.findById(tenantId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update payer' })
  @ApiResponse({ status: 200, description: 'Payer updated' })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePayerDto,
  ) {
    return this.payerService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete (deactivate) payer' })
  @ApiResponse({ status: 200, description: 'Payer deactivated successfully' })
  async delete(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.payerService.delete(tenantId, id);
  }
}
