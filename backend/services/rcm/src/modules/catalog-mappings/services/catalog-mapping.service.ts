import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';
import {
  CreateCatalogMappingDto,
  UpdateCatalogMappingDto,
  QueryCatalogMappingsDto,
  FindBillingItemsDto,
  BillingItemMappingResponse,
  FindBillingItemsResponse,
} from '../dto/catalog-mapping.dto';

@Injectable()
export class CatalogMappingService {
  private readonly logger = new Logger(CatalogMappingService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new catalog item mapping
   */
  async create(tenantId: string, dto: CreateCatalogMappingDto) {
    // Check if exact mapping already exists
    const existing = await this.prisma.catalogItemMapping.findFirst({
      where: {
        tenantId,
        catalogType: dto.catalogType,
        catalogItemId: dto.catalogItemId,
        billingItemId: dto.billingItemId,
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Mapping already exists for catalog item ${dto.catalogItemId} to billing item ${dto.billingItemId}`
      );
    }

    // Verify billing item exists
    const billingItem = await this.prisma.billingItem.findFirst({
      where: {
        id: dto.billingItemId,
        OR: [
          { tenantId },
          { tenantId: null }, // Allow global billing items
        ],
      },
    });

    if (!billingItem) {
      throw new NotFoundException(`Billing item with ID ${dto.billingItemId} not found`);
    }

    const mapping = await this.prisma.catalogItemMapping.create({
      data: {
        tenantId,
        catalogType: dto.catalogType,
        catalogItemId: dto.catalogItemId,
        billingItemId: dto.billingItemId,
        quantity: dto.quantity ?? 1,
        isAutomatic: dto.isAutomatic ?? true,
        isPrimary: dto.isPrimary ?? false,
        requiresApproval: dto.requiresApproval ?? false,
        facilityIds: dto.facilityIds ?? [],
        payerIds: dto.payerIds ?? [],
        patientTypes: dto.patientTypes ?? [],
        mappingReason: dto.mappingReason || null,
        notes: dto.notes || null,
        effectiveDate: dto.effectiveDate ? new Date(dto.effectiveDate) : null,
        expirationDate: dto.expirationDate ? new Date(dto.expirationDate) : null,
        isActive: dto.isActive ?? true,
        createdBy: null, // TODO: Get from request context
      },
      include: {
        billingItem: true,
      },
    });

    this.logger.log(
      `Created catalog mapping: ${dto.catalogType}:${dto.catalogItemId} → ${dto.billingItemId} for tenant: ${tenantId}`
    );

    return mapping;
  }

  /**
   * Get all catalog mappings with optional filtering
   */
  async findAll(tenantId: string, query: QueryCatalogMappingsDto) {
    const where: any = { tenantId };

    if (query.catalogType) {
      where.catalogType = query.catalogType;
    }

    if (query.catalogItemId) {
      where.catalogItemId = query.catalogItemId;
    }

    if (query.billingItemId) {
      where.billingItemId = query.billingItemId;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    if (query.isPrimary !== undefined) {
      where.isPrimary = query.isPrimary;
    }

    if (query.facilityId) {
      where.facilityIds = { has: query.facilityId };
    }

    if (query.payerId) {
      where.payerIds = { has: query.payerId };
    }

    if (query.patientType) {
      where.patientTypes = { has: query.patientType };
    }

    const mappings = await this.prisma.catalogItemMapping.findMany({
      where,
      include: {
        billingItem: true,
      },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return mappings;
  }

  /**
   * Get a specific catalog mapping by ID
   */
  async findOne(tenantId: string, id: string) {
    const mapping = await this.prisma.catalogItemMapping.findFirst({
      where: { id, tenantId },
      include: {
        billingItem: true,
      },
    });

    if (!mapping) {
      throw new NotFoundException(`Catalog mapping with ID ${id} not found`);
    }

    return mapping;
  }

  /**
   * Find billing items for a catalog item with context-based filtering
   * This is the main method used when an order is placed in the clinical system
   */
  async findBillingItemsForCatalogItem(
    tenantId: string,
    dto: FindBillingItemsDto
  ): Promise<FindBillingItemsResponse> {
    const now = new Date();

    // Build where clause with context-based filtering
    const where: any = {
      tenantId,
      catalogType: dto.catalogType,
      catalogItemId: dto.catalogItemId,
      isActive: true,
      // Check effective/expiration dates
      OR: [
        { effectiveDate: null },
        { effectiveDate: { lte: now } },
      ],
      AND: [
        {
          OR: [
            { expirationDate: null },
            { expirationDate: { gte: now } },
          ],
        },
      ],
    };

    // Apply context-based filters
    if (dto.facilityId) {
      where.OR = [
        { facilityIds: { isEmpty: true } }, // Empty array = all facilities
        { facilityIds: { has: dto.facilityId } }, // Specific facility
      ];
    }

    if (dto.payerId) {
      where.AND.push({
        OR: [
          { payerIds: { isEmpty: true } }, // Empty array = all payers
          { payerIds: { has: dto.payerId } }, // Specific payer
        ],
      });
    }

    if (dto.patientType) {
      where.AND.push({
        OR: [
          { patientTypes: { isEmpty: true } }, // Empty array = all patient types
          { patientTypes: { has: dto.patientType } }, // Specific patient type
        ],
      });
    }

    const mappings = await this.prisma.catalogItemMapping.findMany({
      where,
      include: {
        billingItem: true,
      },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'asc' },
      ],
    });

    // Transform to response format
    const mappingResponses: BillingItemMappingResponse[] = mappings.map((mapping) => ({
      billingItemId: mapping.billingItemId,
      billingCode: mapping.billingItem.billingCode,
      billingDescription: mapping.billingItem.billingDescription,
      quantity: Number(mapping.quantity),
      isPrimary: mapping.isPrimary,
      isAutomatic: mapping.isAutomatic,
      requiresApproval: mapping.requiresApproval,
    }));

    this.logger.log(
      `Found ${mappingResponses.length} billing items for ${dto.catalogType}:${dto.catalogItemId}`
    );

    return {
      catalogType: dto.catalogType,
      catalogItemId: dto.catalogItemId,
      mappings: mappingResponses,
    };
  }

  /**
   * Update a catalog mapping
   */
  async update(tenantId: string, id: string, dto: UpdateCatalogMappingDto) {
    const existing = await this.findOne(tenantId, id);

    // If updating billing item, verify it exists
    if (dto.billingItemId && dto.billingItemId !== existing.billingItemId) {
      const billingItem = await this.prisma.billingItem.findFirst({
        where: {
          id: dto.billingItemId,
          OR: [
            { tenantId },
            { tenantId: null },
          ],
        },
      });

      if (!billingItem) {
        throw new NotFoundException(`Billing item with ID ${dto.billingItemId} not found`);
      }
    }

    const mapping = await this.prisma.catalogItemMapping.update({
      where: { id },
      data: {
        ...(dto.catalogType && { catalogType: dto.catalogType }),
        ...(dto.catalogItemId && { catalogItemId: dto.catalogItemId }),
        ...(dto.billingItemId && { billingItemId: dto.billingItemId }),
        ...(dto.quantity !== undefined && { quantity: dto.quantity }),
        ...(dto.isAutomatic !== undefined && { isAutomatic: dto.isAutomatic }),
        ...(dto.isPrimary !== undefined && { isPrimary: dto.isPrimary }),
        ...(dto.requiresApproval !== undefined && { requiresApproval: dto.requiresApproval }),
        ...(dto.facilityIds && { facilityIds: dto.facilityIds }),
        ...(dto.payerIds && { payerIds: dto.payerIds }),
        ...(dto.patientTypes && { patientTypes: dto.patientTypes }),
        ...(dto.mappingReason && { mappingReason: dto.mappingReason }),
        ...(dto.notes && { notes: dto.notes }),
        ...(dto.effectiveDate && { effectiveDate: new Date(dto.effectiveDate) }),
        ...(dto.expirationDate && { expirationDate: new Date(dto.expirationDate) }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
      include: {
        billingItem: true,
      },
    });

    this.logger.log(`Updated catalog mapping: ${id}`);

    return mapping;
  }

  /**
   * Delete a catalog mapping (soft delete by setting isActive = false)
   */
  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);

    await this.prisma.catalogItemMapping.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    this.logger.log(`Deactivated catalog mapping: ${id}`);

    return { message: 'Catalog mapping deactivated successfully' };
  }

  /**
   * Permanently delete a catalog mapping (use with caution)
   */
  async permanentDelete(tenantId: string, id: string) {
    await this.findOne(tenantId, id);

    await this.prisma.catalogItemMapping.delete({
      where: { id },
    });

    this.logger.log(`Permanently deleted catalog mapping: ${id}`);

    return { message: 'Catalog mapping permanently deleted' };
  }

  /**
   * Get audit trail for a mapping
   */
  async getAuditTrail(tenantId: string, mappingId: string) {
    await this.findOne(tenantId, mappingId);

    const auditRecords = await this.prisma.catalogMappingAudit.findMany({
      where: {
        tenantId,
        mappingId,
      },
      orderBy: {
        changedAt: 'desc',
      },
    });

    return auditRecords;
  }
}
