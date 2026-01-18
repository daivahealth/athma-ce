import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ChecklistInstanceService } from './checklist-instance.service';
import { ChecklistResponseService } from './checklist-response.service';
import { ChecklistIntegrationService } from './checklist-integration.service';
import { CreateChecklistInstanceDto } from './dto/create-checklist-instance.dto';
import { SaveChecklistResponseDto, BulkSaveChecklistResponseDto } from './dto/save-checklist-response.dto';
import { TenantId, Context } from '../../common/decorators/tenant-context.decorator';
import { ChecklistInstanceStatus } from '@zeal/database-clinical';

@Controller('inpatient/checklists')
export class ChecklistController {
  constructor(
    private readonly checklistInstanceService: ChecklistInstanceService,
    private readonly checklistResponseService: ChecklistResponseService,
    private readonly checklistIntegrationService: ChecklistIntegrationService,
  ) {}

  // ============================================================================
  // Instance Operations
  // ============================================================================

  /**
   * Create a checklist instance
   * POST /api/v1/inpatient/checklists/instances
   */
  @Post('instances')
  @HttpCode(HttpStatus.CREATED)
  async createInstance(
    @Body() dto: CreateChecklistInstanceDto,
    @Context() context: any,
  ) {
    return this.checklistInstanceService.createInstance(dto, context);
  }

  /**
   * List checklist instances with filtering
   * GET /api/v1/inpatient/checklists/instances
   */
  @Get('instances')
  async listInstances(
    @Query('admissionId') admissionId?: string,
    @Query('careChannelId') careChannelId?: string,
    @Query('patientId') patientId?: string,
    @Query('status') status?: ChecklistInstanceStatus,
    @Query('context') contextFilter?: string,
    @TenantId() tenantId?: string,
  ) {
    const filters: any = {};

    if (admissionId) filters.admissionId = admissionId;
    if (careChannelId) filters.careChannelId = careChannelId;
    if (patientId) filters.patientId = patientId;
    if (status) filters.status = status;
    if (contextFilter) filters.context = contextFilter;

    if (!tenantId) {
      return [];
    }
    return this.checklistInstanceService.listInstances(filters, tenantId);
  }

  /**
   * Get checklist instance by ID
   * GET /api/v1/inpatient/checklists/instances/:instanceId
   */
  @Get('instances/:instanceId')
  async getInstance(
    @Param('instanceId') instanceId: string,
    @TenantId() tenantId: string,
  ) {
    return this.checklistInstanceService.getInstanceById(instanceId, tenantId);
  }

  /**
   * Get checklists for an admission
   * GET /api/v1/inpatient/admissions/:admissionId/checklists
   */
  @Get('admissions/:admissionId')
  async getAdmissionChecklists(
    @Param('admissionId') admissionId: string,
    @TenantId() tenantId: string,
  ) {
    return this.checklistIntegrationService.getAdmissionChecklists(
      admissionId,
      tenantId,
    );
  }

  /**
   * Complete a checklist instance
   * PATCH /api/v1/inpatient/checklists/instances/:instanceId/complete
   */
  @Patch('instances/:instanceId/complete')
  async completeInstance(
    @Param('instanceId') instanceId: string,
    @Context() context: any,
  ) {
    return this.checklistIntegrationService.completeInstance(
      instanceId,
      context,
    );
  }

  /**
   * Verify a checklist instance
   * PATCH /api/v1/inpatient/checklists/instances/:instanceId/verify
   */
  @Patch('instances/:instanceId/verify')
  async verifyInstance(
    @Param('instanceId') instanceId: string,
    @Context() context: any,
  ) {
    return this.checklistIntegrationService.verifyInstance(instanceId, context);
  }

  /**
   * Cancel a checklist instance
   * PATCH /api/v1/inpatient/checklists/instances/:instanceId/cancel
   */
  @Patch('instances/:instanceId/cancel')
  async cancelInstance(
    @Param('instanceId') instanceId: string,
    @Context() context: any,
  ) {
    return this.checklistInstanceService.cancelInstance(instanceId, context);
  }

  /**
   * Update instance status manually
   * PATCH /api/v1/inpatient/checklists/instances/:instanceId/status
   */
  @Patch('instances/:instanceId/status')
  async updateInstanceStatus(
    @Param('instanceId') instanceId: string,
    @Body('status') status: ChecklistInstanceStatus,
    @Context() context: any,
  ) {
    return this.checklistInstanceService.updateInstanceStatus(
      instanceId,
      status,
      context,
    );
  }

  // ============================================================================
  // Response Operations
  // ============================================================================

  /**
   * Save a response to a checklist item
   * POST /api/v1/inpatient/checklists/instances/:instanceId/responses
   */
  @Post('instances/:instanceId/responses')
  @HttpCode(HttpStatus.CREATED)
  async saveResponse(
    @Param('instanceId') instanceId: string,
    @Body() dto: SaveChecklistResponseDto,
    @Context() context: any,
  ) {
    const response = await this.checklistResponseService.saveResponse(
      {
        instanceId,
        templateItemId: dto.templateItemId,
        value: dto.value,
      },
      context,
    );

    // Update completion percentage after saving response
    await this.checklistInstanceService.updateCompletionPercent(
      instanceId,
      context.tenantId,
    );

    return response;
  }

  /**
   * Bulk save responses
   * POST /api/v1/inpatient/checklists/instances/:instanceId/responses/bulk
   */
  @Post('instances/:instanceId/responses/bulk')
  @HttpCode(HttpStatus.CREATED)
  async bulkSaveResponses(
    @Param('instanceId') instanceId: string,
    @Body() dto: BulkSaveChecklistResponseDto,
    @Context() context: any,
  ) {
    const responses = await this.checklistResponseService.bulkSaveResponses(
      instanceId,
      dto.responses,
      context,
    );

    // Update completion percentage after saving responses
    await this.checklistInstanceService.updateCompletionPercent(
      instanceId,
      context.tenantId,
    );

    return responses;
  }

  /**
   * Get responses for a checklist instance
   * GET /api/v1/inpatient/checklists/instances/:instanceId/responses
   */
  @Get('instances/:instanceId/responses')
  async getResponses(
    @Param('instanceId') instanceId: string,
    @TenantId() tenantId: string,
  ) {
    return this.checklistResponseService.getResponsesByInstance(
      instanceId,
      tenantId,
    );
  }

  /**
   * Get a single response
   * GET /api/v1/inpatient/checklists/responses/:responseId
   */
  @Get('responses/:responseId')
  async getResponse(
    @Param('responseId') responseId: string,
    @TenantId() tenantId: string,
  ) {
    return this.checklistResponseService.getResponseById(responseId, tenantId);
  }

  /**
   * Delete a response
   * DELETE /api/v1/inpatient/checklists/responses/:responseId
   */
  @Delete('responses/:responseId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteResponse(
    @Param('responseId') responseId: string,
    @TenantId() tenantId: string,
  ) {
    await this.checklistResponseService.deleteResponse(responseId, tenantId);
  }
}
