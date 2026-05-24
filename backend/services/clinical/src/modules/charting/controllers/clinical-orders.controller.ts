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
    UseGuards,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
  import { ClinicalOrdersService } from '../services/clinical-orders.service';
  import {
    CreateClinicalOrderDto,
    CreatePackageOrderDto,
    UpdateClinicalOrderDto,
    AddOrderResultDto,
    ClinicalOrderResponseDto,
    PackageOrderResponseDto,
    EncounterChartOrdersResponseDto,
  } from '../dto/clinical-order.dto';
  import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
  import {
    CLINICAL_ORDER_READ,
    CLINICAL_ORDER_CREATE,
    CLINICAL_ORDER_UPDATE,
    CLINICAL_ORDER_DELETE,
    CLINICAL_ORDER_CANCEL,
  } from '@zeal/contracts';

  @ApiTags('Clinical Orders')
  @ApiBearerAuth()
  @Controller('clinical-orders')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  export class ClinicalOrdersController {
    constructor(private readonly clinicalOrdersService: ClinicalOrdersService) {}
  
    @Post()
    @Permissions(CLINICAL_ORDER_CREATE)
    @ApiOperation({ summary: 'Create a new clinical order (lab, imaging, procedure)' })
    @ApiResponse({ status: 201, description: 'Order created successfully', type: ClinicalOrderResponseDto })
    async create(
      @Headers('x-tenant-id') tenantId: string,
      @Body() dto: CreateClinicalOrderDto,
    ) {
      return this.clinicalOrdersService.create(tenantId, dto);
    }

    @Post('package-orders')
    @Permissions(CLINICAL_ORDER_CREATE)
    @ApiOperation({ summary: 'Create a runtime package order and expand it into executable clinical orders' })
    @ApiResponse({ status: 201, description: 'Package order created successfully', type: PackageOrderResponseDto })
    async createPackageOrder(
      @Headers('x-tenant-id') tenantId: string,
      @Body() dto: CreatePackageOrderDto,
    ) {
      return this.clinicalOrdersService.createPackageOrder(tenantId, dto);
    }

    @Get('package-orders/:id')
    @Permissions(CLINICAL_ORDER_READ)
    @ApiOperation({ summary: 'Get package order by ID with expanded clinical orders' })
    @ApiResponse({ status: 200, description: 'Package order found', type: PackageOrderResponseDto })
    async findPackageOrderById(
      @Headers('x-tenant-id') tenantId: string,
      @Param('id') id: string,
    ) {
      return this.clinicalOrdersService.findPackageOrderById(tenantId, id);
    }

    @Post('package-orders/:id/cancel')
    @Permissions(CLINICAL_ORDER_CANCEL)
    @ApiOperation({ summary: 'Cancel a package order and cascade cancellation to linked child clinical orders' })
    @ApiResponse({ status: 200, description: 'Package order cancelled', type: PackageOrderResponseDto })
    async cancelPackageOrder(
      @Headers('x-tenant-id') tenantId: string,
      @Param('id') id: string,
    ) {
      return this.clinicalOrdersService.cancelPackageOrder(tenantId, id);
    }

    @Get('encounter/:encounterId/chart-view')
    @Permissions(CLINICAL_ORDER_READ)
    @ApiOperation({ summary: 'Get chart-facing encounter orders grouped into standalone orders and package summaries' })
    @ApiResponse({ status: 200, description: 'Chart-facing encounter orders retrieved', type: EncounterChartOrdersResponseDto })
    async findChartViewByEncounter(
      @Headers('x-tenant-id') tenantId: string,
      @Param('encounterId') encounterId: string,
    ) {
      return this.clinicalOrdersService.findChartViewByEncounter(tenantId, encounterId);
    }
  
    @Get(':id')
    @Permissions(CLINICAL_ORDER_READ)
    @ApiOperation({ summary: 'Get clinical order by ID' })
    @ApiResponse({ status: 200, description: 'Order found', type: ClinicalOrderResponseDto })
    async findById(
      @Headers('x-tenant-id') tenantId: string,
      @Param('id') id: string,
    ) {
      return this.clinicalOrdersService.findById(tenantId, id);
    }
  
    @Get('encounter/:encounterId')
    @Permissions(CLINICAL_ORDER_READ)
    @ApiOperation({ summary: 'Get all orders for an encounter' })
    @ApiResponse({ status: 200, description: 'Orders retrieved', type: [ClinicalOrderResponseDto] })
    async findByEncounter(
      @Headers('x-tenant-id') tenantId: string,
      @Param('encounterId') encounterId: string,
    ) {
      return this.clinicalOrdersService.findByEncounter(tenantId, encounterId);
    }
  
    @Get('patient/:patientId')
    @Permissions(CLINICAL_ORDER_READ)
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
    @Permissions(CLINICAL_ORDER_UPDATE)
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
    @Permissions(CLINICAL_ORDER_UPDATE)
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
    @Permissions(CLINICAL_ORDER_CANCEL)
    @ApiOperation({ summary: 'Cancel an order' })
    @ApiResponse({ status: 200, description: 'Order cancelled', type: ClinicalOrderResponseDto })
    async cancel(
      @Headers('x-tenant-id') tenantId: string,
      @Param('id') id: string,
    ) {
      return this.clinicalOrdersService.cancel(tenantId, id);
    }
  
    @Delete(':id')
    @Permissions(CLINICAL_ORDER_DELETE)
    @ApiOperation({ summary: 'Delete an order' })
    @ApiResponse({ status: 200, description: 'Order deleted successfully' })
    async delete(
      @Headers('x-tenant-id') tenantId: string,
      @Param('id') id: string,
    ) {
      return this.clinicalOrdersService.delete(tenantId, id);
    }
  }
