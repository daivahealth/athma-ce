/**
 * Templates Service
 * CRUD operations for communication templates
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import * as crypto from 'crypto';

@Injectable()
export class TemplatesService {

  constructor(private prisma: PrismaService) {}

  /**
   * Generate content hash for versioning
   */
  private generateContentHash(subject: string | undefined, body: string): string {
    const content = `${subject || ''}||${body}`;
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Create a new communication template
   */
  async create(tenantId: string, userId: string, dto: CreateTemplateDto) {
    const contentHash = this.generateContentHash(dto.subject, dto.body);

    return this.prisma.communicationTemplate.create({
      data: {
        tenantId,
        code: dto.code,
        name: dto.name,
        description: dto.description,
        category: dto.category,
        channel: dto.channel,
        language: dto.language ?? 'en',
        subject: dto.subject,
        body: dto.body,
        variablesSchema: dto.variables_schema,
        approvalStatus: dto.approval_status ?? 'draft',
        version: dto.version ?? 1,
        contentHash,
        isActive: dto.is_active ?? true,
        createdBy: userId,
      },
    });
  }

  /**
   * Get all templates (with optional filters)
   */
  async findAll(
    tenantId: string,
    filters?: { channel?: string; language?: string; category?: string; isActive?: boolean },
  ) {
    const where: any = { tenantId, deletedAt: null };

    if (filters?.channel) {
      where.channel = filters.channel;
    }

    if (filters?.language) {
      where.language = filters.language;
    }

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return this.prisma.communicationTemplate.findMany({
      where,
      orderBy: [{ code: 'asc' }, { version: 'desc' }],
    });
  }

  /**
   * Get template by ID
   */
  async findOne(tenantId: string, templateId: string) {
    const template = await this.prisma.communicationTemplate.findFirst({
      where: { id: templateId, tenantId, deletedAt: null },
    });

    if (!template) {
      throw new NotFoundException(`Template ${templateId} not found`);
    }

    return template;
  }

  /**
   * Update template
   */
  async update(tenantId: string, userId: string, templateId: string, dto: UpdateTemplateDto) {
    // Check template exists
    await this.findOne(tenantId, templateId);

    // Regenerate content hash if subject or body changed
    let contentHash: string | undefined;
    if (dto.subject !== undefined || dto.body !== undefined) {
      const existing = await this.findOne(tenantId, templateId);
      const subject = dto.subject !== undefined ? dto.subject : existing.subject;
      const body = dto.body !== undefined ? dto.body : existing.body;
      contentHash = this.generateContentHash(subject ?? undefined, body);
    }

    return this.prisma.communicationTemplate.update({
      where: { id: templateId },
      data: {
        ...(dto.code && { code: dto.code }),
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.category && { category: dto.category }),
        ...(dto.channel && { channel: dto.channel }),
        ...(dto.language && { language: dto.language }),
        ...(dto.subject !== undefined && { subject: dto.subject }),
        ...(dto.body && { body: dto.body }),
        ...(dto.variables_schema && { variablesSchema: dto.variables_schema }),
        ...(dto.approval_status && { approvalStatus: dto.approval_status }),
        ...(dto.version !== undefined && { version: dto.version }),
        ...(contentHash && { contentHash }),
        ...(dto.is_active !== undefined && { isActive: dto.is_active }),
        updatedBy: userId,
      },
    });
  }

  /**
   * Soft delete template
   */
  async remove(tenantId: string, userId: string, templateId: string) {
    // Check template exists
    await this.findOne(tenantId, templateId);

    await this.prisma.communicationTemplate.update({
      where: { id: templateId },
      data: {
        deletedAt: new Date(),
        deletedBy: userId,
      },
    });

    return { message: 'Template deleted successfully' };
  }
}
