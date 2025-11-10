import {
    Controller,
    Get,
    Post,
    Put,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    Headers,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
  import { ClinicalOrdersService } from '../services/clinical-orders.service';
  import {
    CreateClinicalOrderDto,
    UpdateClinicalOrderDto,
    AddOrderResultDto,
    ClinicalOrderResponseDto,
  } from '../dto/clinical-order.dto';
  
  @ApiTags('Clinical Orders')
  @ApiBearerAuth()
  @Controller('clinical-orders')
  export class ClinicalOrdersController {
    constructor(private readonly clinicalOrdersService: ClinicalOrdersService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new clinical order (lab, imaging, procedure)' })
    @ApiResponse({ status: 201, description: 'Order created successfully', type: ClinicalOrderResponseDto })
    async create(
      @Headers('x-tenant-id') tenantId: string,
      @Body() dto: CreateClinicalOrderDto,
    ) {
      return this.clinicalOrdersService.create(tenantId, dto);
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get clinical order by ID' })
    @ApiResponse({ status: 200, description: 'Order found', type: ClinicalOrderResponseDto })
    async findById(
      @Headers('x-tenant-id') tenantId: string,
      @Param('id') id: string,
    ) {
      return this.clinicalOrdersService.findById(tenantId, id);
    }
  
    @Get('encounter/:encounterId')
    @ApiOperation({ summary: 'Get all orders for an encounter' })
    @ApiResponse({ status: 200, description: 'Orders retrieved', type: [ClinicalOrderResponseDto] })
    async findByEncounter(
      @Headers('x-tenant-id') tenantId: string,
      @Param('encounterId') encounterId: string,
    ) {
      return this.clinicalOrdersService.findByEncounter(tenantId, encounterId);
    }
  
    @Get('patient/:patientId')
    @ApiOperation({ summary: 'Get all orders for a patient' })
    @ApiResponse({ status: 200, description: 'Orders retrieved', type: [ClinicalOrderResponseDto] })
    async findByPatient(
      @Headers('x-tenant-id') tenantId: string,
      @Param('patientId') patientId: string,
      @Query('limit') limit?: number,
    ) {
      return this.clinicalOrdersService.findByPatient(tenantId, patientId, limit);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update order details' })
    @ApiResponse({ status: 200, description: 'Order updated', type: ClinicalOrderResponseDto })
    async update(
      @Headers('x-tenant-id') tenantId: string,
      @Param('id') id: string,
      @Body() dto: UpdateClinicalOrderDto,
    ) {
      return this.clinicalOrdersService.update(tenantId, id, dto);
    }
  
    @Put(':id/results')
    @ApiOperation({ summary: 'Add order results' })
    @ApiResponse({ status: 200, description: 'Results added', type: ClinicalOrderResponseDto })
    async addResults(
      @Headers('x-tenant-id') tenantId: string,
      @Param('id') id: string,
      @Body() dto: AddOrderResultDto,
    ) {
      return this.clinicalOrdersService.addResults(tenantId, id, dto);
    }
  
    @Post(':id/cancel')
    @ApiOperation({ summary: 'Cancel an order' })
    @ApiResponse({ status: 200, description: 'Order cancelled', type: ClinicalOrderResponseDto })
    async cancel(
      @Headers('x-tenant-id') tenantId: string,
      @Param('id') id: string,
    ) {
      return this.clinicalOrdersService.cancel(tenantId, id);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete an order' })
    @ApiResponse({ status: 200, description: 'Order deleted successfully' })
    async delete(
      @Headers('x-tenant-id') tenantId: string,
      @Param('id') id: string,
    ) {
      return this.clinicalOrdersService.delete(tenantId, id);
    }
  }