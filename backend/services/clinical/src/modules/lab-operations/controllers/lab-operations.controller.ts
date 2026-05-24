import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions, PermissionsGuard, JwtAuthGuard } from '@zeal/shared-utils';
import {
  LAB_ORDER_READ,
  LAB_ORDER_UPDATE,
  LAB_RESULT_ENTER,
  LAB_RESULT_READ,
} from '@zeal/contracts';
import { LabOperationsService } from '../services/lab-operations.service';
import {
  AccessionLabSpecimenDto,
  PrepareLabSpecimenDto,
  CollectLabSpecimenDto,
  CompleteLabResultEntryDto,
  CreateLabProcessingRunDto,
  LabWorklistQueryDto,
  PrintLabSpecimenLabelDto,
  ReceiveLabSpecimenDto,
  RejectLabSpecimenDto,
  StartLabResultEntryDto,
} from '../dto/lab-operations.dto';

@ApiTags('Lab Operations')
@ApiBearerAuth()
@Controller('lab-operations')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class LabOperationsController {
  constructor(private readonly labOperationsService: LabOperationsService) {}

  @Get('worklists/:stage')
  @Permissions(LAB_ORDER_READ)
  @ApiOperation({ summary: 'Get a stage-specific lab operational worklist' })
  @ApiResponse({ status: 200, description: 'Worklist retrieved' })
  async getWorklist(
    @Headers('x-tenant-id') tenantId: string,
    @Param('stage') stage: string,
    @Query() query: LabWorklistQueryDto,
  ) {
    return this.labOperationsService.getWorklist(tenantId, stage, query);
  }

  @Get('specimens/:id')
  @Permissions(LAB_ORDER_READ)
  @ApiOperation({ summary: 'Get lab specimen with lifecycle context' })
  @ApiResponse({ status: 200, description: 'Specimen found' })
  async getSpecimenById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.labOperationsService.getSpecimenById(tenantId, id);
  }

  @Post('collection/prepare')
  @Permissions(LAB_ORDER_UPDATE)
  @ApiOperation({ summary: 'Prepare specimen labels before physical collection' })
  @ApiResponse({ status: 201, description: 'Specimen label prepared' })
  async prepareSpecimen(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: PrepareLabSpecimenDto,
  ) {
    return this.labOperationsService.prepareSpecimen(tenantId, userId, dto);
  }

  @Post('collection')
  @Permissions(LAB_ORDER_UPDATE)
  @ApiOperation({ summary: 'Mark a prepared specimen as physically collected' })
  @ApiResponse({ status: 201, description: 'Specimen collected' })
  async collectSpecimen(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CollectLabSpecimenDto,
  ) {
    return this.labOperationsService.collectSpecimen(tenantId, userId, dto);
  }

  @Post('specimens/:id/print-label')
  @Permissions(LAB_ORDER_UPDATE)
  @ApiOperation({ summary: 'Regenerate printable label content for a prepared specimen' })
  @ApiResponse({ status: 200, description: 'Printable label content ready' })
  async printSpecimenLabel(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: PrintLabSpecimenLabelDto,
  ) {
    return this.labOperationsService.getSpecimenLabel(tenantId, id, userId, dto);
  }

  @Post('specimens/:id/receive')
  @Permissions(LAB_ORDER_UPDATE)
  @ApiOperation({ summary: 'Mark a collected specimen as physically received by the lab' })
  @ApiResponse({ status: 200, description: 'Specimen received' })
  async receiveSpecimen(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: ReceiveLabSpecimenDto,
  ) {
    return this.labOperationsService.receiveSpecimen(tenantId, id, userId, dto);
  }

  @Post('specimens/:id/accession')
  @Permissions(LAB_ORDER_UPDATE)
  @ApiOperation({ summary: 'Accession a received specimen into LIS workflow' })
  @ApiResponse({ status: 200, description: 'Specimen accessioned' })
  async accessionSpecimen(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: AccessionLabSpecimenDto,
  ) {
    return this.labOperationsService.accessionSpecimen(tenantId, id, userId, dto);
  }

  @Post('specimens/:id/reject')
  @Permissions(LAB_ORDER_UPDATE)
  @ApiOperation({ summary: 'Reject a specimen from the lab workflow' })
  @ApiResponse({ status: 200, description: 'Specimen rejected' })
  async rejectSpecimen(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Param('id') id: string,
    @Body() dto: RejectLabSpecimenDto,
  ) {
    return this.labOperationsService.rejectSpecimen(tenantId, id, userId, dto);
  }

  @Post('processing')
  @Permissions(LAB_RESULT_ENTER)
  @ApiOperation({ summary: 'Create a lab processing run for a specimen and ordered test' })
  @ApiResponse({ status: 201, description: 'Processing run created' })
  async createProcessingRun(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateLabProcessingRunDto,
  ) {
    return this.labOperationsService.createProcessingRun(tenantId, userId, dto);
  }

  @Post('result-entry/start')
  @Permissions(LAB_RESULT_ENTER)
  @ApiOperation({ summary: 'Open result entry for an ordered lab test and ensure a draft report exists' })
  @ApiResponse({ status: 200, description: 'Result entry context ready' })
  async startResultEntry(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: StartLabResultEntryDto,
  ) {
    return this.labOperationsService.startResultEntry(tenantId, userId, dto);
  }

  @Post('result-entry/complete')
  @Permissions(LAB_RESULT_ENTER)
  @ApiOperation({ summary: 'Mark result entry complete after report items are saved' })
  @ApiResponse({ status: 200, description: 'Result entry completed' })
  async completeResultEntry(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CompleteLabResultEntryDto,
  ) {
    return this.labOperationsService.completeResultEntry(tenantId, userId, dto);
  }
}
