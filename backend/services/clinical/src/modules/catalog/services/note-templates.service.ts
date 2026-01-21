import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService, NoteTemplateType } from '@zeal/database-clinical';
import {
  CreateNoteTemplateDto,
  UpdateNoteTemplateDto,
  CreateTemplateVersionDto,
  TemplateStatus,
} from '../dto/note-template.dto';

@Injectable()
export class NoteTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateNoteTemplateDto) {
    const data: any = {
      tenantId,
      name: dto.name,
      templateType: dto.templateType || NoteTemplateType.GENERAL,
      status: dto.status || TemplateStatus.ACTIVE,
      currentVersion: 1,
    };

    if (dto.description) data.description = dto.description;
    if (dto.specialtyId) data.specialtyId = dto.specialtyId;

    // Create template with first version
    const versionData: any = {
      version: 1,
      schema: dto.schema,
      changeLog: dto.changeLog || 'Initial version',
    };

    if (dto.createdBy) {
      versionData.createdBy = dto.createdBy;
    }

    data.versions = {
      create: versionData,
    };

    return this.prisma.noteTemplate.create({
      data,
      include: {
        versions: {
          orderBy: { version: 'desc' },
        },
      },
    });
  }

  async findAll(
    tenantId: string,
    specialtyId?: string,
    status?: TemplateStatus,
    templateType?: NoteTemplateType
  ) {
    const where: any = {
      OR: [
        { tenantId },
        { tenantId: null }, // Include global templates
      ],
    };

    if (specialtyId) {
      where.specialtyId = specialtyId;
    }

    if (status) {
      where.status = status;
    }

    if (templateType) {
      where.templateType = templateType;
    }

    return this.prisma.noteTemplate.findMany({
      where,
      include: {
        versions: {
          orderBy: { version: 'desc' },
          take: 1, // Only include latest version in list view
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findById(tenantId: string, id: string) {
    const template = await this.prisma.noteTemplate.findFirst({
      where: {
        id,
        OR: [
          { tenantId },
          { tenantId: null }, // Allow access to global templates
        ],
      },
      include: {
        versions: {
          orderBy: { version: 'desc' },
        },
      },
    });

    if (!template) {
      throw new NotFoundException(`Note template with ID ${id} not found`);
    }

    return template;
  }

  async findByIdAndVersion(tenantId: string, id: string, version: number) {
    const template = await this.findById(tenantId, id);

    const templateVersion = template.versions.find((v) => v.version === version);

    if (!templateVersion) {
      throw new NotFoundException(`Template version ${version} not found`);
    }

    return {
      ...template,
      currentVersionData: templateVersion,
    };
  }

  async update(tenantId: string, id: string, dto: UpdateNoteTemplateDto) {
    // Verify template exists and belongs to tenant (not global)
    const existing = await this.prisma.noteTemplate.findFirst({
      where: { id, tenantId }, // Must belong to tenant
    });

    if (!existing) {
      throw new NotFoundException(`Note template with ID ${id} not found or is not editable`);
    }

    const data: any = {
      updatedAt: new Date(),
    };

    if (dto.name) data.name = dto.name;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.templateType) data.templateType = dto.templateType;
    if (dto.specialtyId !== undefined) data.specialtyId = dto.specialtyId;
    if (dto.status) data.status = dto.status;

    return this.prisma.noteTemplate.update({
      where: { id },
      data,
      include: {
        versions: {
          orderBy: { version: 'desc' },
        },
      },
    });
  }

  async createVersion(tenantId: string, templateId: string, dto: CreateTemplateVersionDto) {
    // Verify template exists and belongs to tenant
    const template = await this.prisma.noteTemplate.findFirst({
      where: { id: templateId, tenantId },
      include: {
        versions: {
          orderBy: { version: 'desc' },
          take: 1,
        },
      },
    });

    if (!template) {
      throw new NotFoundException(`Note template with ID ${templateId} not found or is not editable`);
    }

    const nextVersion = template.currentVersion + 1;

    // Create new version and update template's current version
    const versionCreateData: any = {
      templateId,
      version: nextVersion,
      schema: dto.schema,
      changeLog: dto.changeLog || `Version ${nextVersion}`,
    };

    if (dto.createdBy) {
      versionCreateData.createdBy = dto.createdBy;
    }

    const [newVersion] = await this.prisma.$transaction([
      this.prisma.noteTemplateVersion.create({
        data: versionCreateData,
      }),
      this.prisma.noteTemplate.update({
        where: { id: templateId },
        data: { currentVersion: nextVersion },
      }),
    ]);

    return newVersion;
  }

  async delete(tenantId: string, id: string) {
    // Verify template exists and belongs to tenant
    const template = await this.prisma.noteTemplate.findFirst({
      where: { id, tenantId },
    });

    if (!template) {
      throw new NotFoundException(`Note template with ID ${id} not found or is not editable`);
    }

    // Soft delete by updating status to archived
    await this.prisma.noteTemplate.update({
      where: { id },
      data: { status: TemplateStatus.ARCHIVED },
    });

    return { message: 'Note template archived successfully' };
  }

  async getTemplateStatistics(tenantId: string) {
    const templates = await this.prisma.noteTemplate.findMany({
      where: {
        OR: [
          { tenantId },
          { tenantId: null },
        ],
      },
    });

    return {
      total: templates.length,
      byStatus: templates.reduce((acc: Record<string, number>, template) => {
        acc[template.status] = (acc[template.status] || 0) + 1;
        return acc;
      }, {}),
      byTemplateType: templates.reduce((acc: Record<string, number>, template) => {
        acc[template.templateType] = (acc[template.templateType] || 0) + 1;
        return acc;
      }, {}),
      tenantOwned: templates.filter((t) => t.tenantId === tenantId).length,
      global: templates.filter((t) => t.tenantId === null).length,
    };
  }
}
