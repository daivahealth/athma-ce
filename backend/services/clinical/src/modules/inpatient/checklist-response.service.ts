import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { ChecklistItemType } from '@zeal/database-clinical';

@Injectable()
export class ChecklistResponseService {
  private readonly logger = new Logger(ChecklistResponseService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Save a response to a checklist item
   * @param data - Response data
   * @param context - Request context (tenantId, userId)
   * @returns Created or updated response
   */
  async saveResponse(data: any, context: any) {
    const { tenantId, userId } = context;

    // Verify instance exists
    const instance = await this.prisma.checklistInstance.findUnique({
      where: { id: data.instanceId, tenantId },
      include: {
        template: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!instance) {
      throw new NotFoundException(`Instance with ID ${data.instanceId} not found`);
    }

    // Verify template item exists
    const templateItem = instance.template.items.find(
      (item) => item.id === data.templateItemId
    );

    if (!templateItem) {
      throw new NotFoundException(`Template item with ID ${data.templateItemId} not found`);
    }

    // Validate response value matches item type
    this.validateResponse(templateItem.itemType, data.value);

    // Prepare response data based on item type
    const responseData: any = {
      tenantId,
      instanceId: data.instanceId,
      templateItemId: data.templateItemId,
      answeredBy: userId,
      answeredAt: new Date(),
    };

    // Store value in appropriate column based on type
    switch (templateItem.itemType) {
      case ChecklistItemType.BOOLEAN:
        responseData.valueBoolean = data.value;
        break;
      case ChecklistItemType.TEXT:
      case ChecklistItemType.TEXT_AREA:
        responseData.valueText = data.value;
        break;
      case ChecklistItemType.NUMBER:
        responseData.valueNumber = parseFloat(data.value);
        break;
      case ChecklistItemType.DATE:
        responseData.valueDate = new Date(data.value);
        break;
      case ChecklistItemType.DATETIME:
        responseData.valueDatetime = new Date(data.value);
        break;
      case ChecklistItemType.TIME:
        responseData.valueTime = data.value;
        break;
      case ChecklistItemType.SELECT_SINGLE:
      case ChecklistItemType.SELECT_MULTIPLE:
      case ChecklistItemType.STAFF_SELECTOR:
      case ChecklistItemType.FILE_UPLOAD:
        responseData.valueJson = data.value;
        break;
      default:
        throw new BadRequestException(`Unsupported item type: ${templateItem.itemType}`);
    }

    // Upsert response
    const response = await this.prisma.checklistInstanceResponse.upsert({
      where: {
        instanceId_templateItemId: {
          instanceId: data.instanceId,
          templateItemId: data.templateItemId,
        },
      },
      update: responseData,
      create: responseData,
      include: {
        templateItem: true,
      },
    });

    this.logger.log(
      `Saved response for instance ${data.instanceId}, item ${data.templateItemId}`
    );

    return response;
  }

  /**
   * Validate response value matches item type
   * @param itemType - Template item type
   * @param value - Response value
   * @throws BadRequestException if validation fails
   */
  private validateResponse(itemType: ChecklistItemType, value: any): void {
    if (value === null || value === undefined) {
      throw new BadRequestException('Response value is required');
    }

    switch (itemType) {
      case ChecklistItemType.BOOLEAN:
        if (typeof value !== 'boolean') {
          throw new BadRequestException('Boolean value required');
        }
        break;
      case ChecklistItemType.TEXT:
      case ChecklistItemType.TEXT_AREA:
        if (typeof value !== 'string') {
          throw new BadRequestException('Text value required');
        }
        break;
      case ChecklistItemType.NUMBER:
        if (typeof value !== 'number' && isNaN(parseFloat(value))) {
          throw new BadRequestException('Numeric value required');
        }
        break;
      case ChecklistItemType.DATE:
      case ChecklistItemType.DATETIME:
        if (isNaN(Date.parse(value))) {
          throw new BadRequestException('Valid date required');
        }
        break;
      case ChecklistItemType.TIME:
        if (!/^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
          throw new BadRequestException('Valid time required (HH:MM or HH:MM:SS)');
        }
        break;
      case ChecklistItemType.SELECT_SINGLE:
        if (typeof value !== 'string' && typeof value !== 'number') {
          throw new BadRequestException('Single selection value required');
        }
        break;
      case ChecklistItemType.SELECT_MULTIPLE:
        if (!Array.isArray(value)) {
          throw new BadRequestException('Array of values required for multiple selection');
        }
        break;
      case ChecklistItemType.STAFF_SELECTOR:
        if (typeof value !== 'string') {
          throw new BadRequestException('Staff ID required');
        }
        break;
      case ChecklistItemType.FILE_UPLOAD:
        if (typeof value !== 'object') {
          throw new BadRequestException('File metadata object required');
        }
        break;
    }
  }

  /**
   * Get responses for an instance
   * @param instanceId - Instance ID
   * @param tenantId - Tenant ID
   * @returns List of responses
   */
  async getResponsesByInstance(instanceId: string, tenantId: string) {
    const responses = await this.prisma.checklistInstanceResponse.findMany({
      where: { instanceId, tenantId },
      include: {
        templateItem: true,
      },
      orderBy: {
        templateItem: {
          sortOrder: 'asc',
        },
      },
    });

    return responses;
  }

  /**
   * Get a single response
   * @param responseId - Response ID
   * @param tenantId - Tenant ID
   * @returns Response
   */
  async getResponseById(responseId: string, tenantId: string) {
    const response = await this.prisma.checklistInstanceResponse.findUnique({
      where: { id: responseId, tenantId },
      include: {
        templateItem: true,
        instance: {
          include: {
            template: true,
          },
        },
      },
    });

    if (!response) {
      throw new NotFoundException(`Response with ID ${responseId} not found`);
    }

    return response;
  }

  /**
   * Delete a response
   * @param responseId - Response ID
   * @param tenantId - Tenant ID
   */
  async deleteResponse(responseId: string, tenantId: string) {
    const response = await this.prisma.checklistInstanceResponse.findUnique({
      where: { id: responseId, tenantId },
    });

    if (!response) {
      throw new NotFoundException(`Response with ID ${responseId} not found`);
    }

    await this.prisma.checklistInstanceResponse.delete({
      where: { id: responseId },
    });

    this.logger.log(`Deleted response: ${responseId}`);
  }

  /**
   * Bulk save responses for an instance
   * @param instanceId - Instance ID
   * @param responses - Array of response data
   * @param context - Request context
   * @returns Array of saved responses
   */
  async bulkSaveResponses(instanceId: string, responses: any[], context: any) {
    const { tenantId } = context;

    // Verify instance exists
    const instance = await this.prisma.checklistInstance.findUnique({
      where: { id: instanceId, tenantId },
    });

    if (!instance) {
      throw new NotFoundException(`Instance with ID ${instanceId} not found`);
    }

    // Save each response
    const savedResponses = await Promise.all(
      responses.map((response) =>
        this.saveResponse(
          {
            instanceId,
            templateItemId: response.templateItemId,
            value: response.value,
          },
          context
        )
      )
    );

    this.logger.log(`Bulk saved ${savedResponses.length} responses for instance ${instanceId}`);

    return savedResponses;
  }

  /**
   * Get formatted response value
   * @param response - Response object
   * @returns Formatted value
   */
  getFormattedValue(response: any): any {
    if (response.valueBoolean !== null) return response.valueBoolean;
    if (response.valueText !== null) return response.valueText;
    if (response.valueNumber !== null) return response.valueNumber;
    if (response.valueDate !== null) return response.valueDate;
    if (response.valueDatetime !== null) return response.valueDatetime;
    if (response.valueTime !== null) return response.valueTime;
    if (response.valueJson !== null) return response.valueJson;
    return null;
  }
}
