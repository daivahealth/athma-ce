import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import {
  CreateClinicalNoteDto,
  UpdateClinicalNoteDto,
  UpdateNoteSectionsDto,
  SignNoteDto,
  NoteStatus,
} from '../dto/clinical-note.dto';

@Injectable()
export class ClinicalNotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateClinicalNoteDto) {
    return this.prisma.clinicalNote.create({
      data: {
        tenantId,
        encounterId: dto.encounterId,
        patientId: dto.patientId,
        noteType: dto.noteType,
        language: dto.language || 'en',
        title: dto.title,
        authorStaffId: dto.authorStaffId,
        coSignStaffId: dto.coSignStaffId,
        sections: dto.sections
          ? {
              create: dto.sections.map((section) => ({
                sectionCode: section.sectionCode,
                sectionName: section.sectionName,
                content: section.content,
                sortOrder: section.sortOrder || 0,
                isEmpty: section.isEmpty || false,
              })),
            }
          : undefined,
      },
      include: {
        sections: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  async findById(tenantId: string, id: string) {
    const note = await this.prisma.clinicalNote.findFirst({
      where: { id, tenantId },
      include: {
        sections: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!note) {
      throw new NotFoundException(`Clinical note with ID ${id} not found`);
    }

    return note;
  }

  async findByEncounter(tenantId: string, encounterId: string) {
    return this.prisma.clinicalNote.findMany({
      where: { tenantId, encounterId },
      include: {
        sections: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByPatient(tenantId: string, patientId: string, limit?: number) {
    return this.prisma.clinicalNote.findMany({
      where: { tenantId, patientId },
      include: {
        sections: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async update(tenantId: string, id: string, dto: UpdateClinicalNoteDto) {
    // Verify note exists and belongs to tenant
    await this.findById(tenantId, id);

    // If status is being changed to amended, require amendment reason
    if (dto.status === NoteStatus.AMENDED && !dto.amendmentReason) {
      throw new BadRequestException('Amendment reason is required when amending a note');
    }

    return this.prisma.clinicalNote.update({
      where: { id },
      data: {
        title: dto.title,
        status: dto.status,
        coSignStaffId: dto.coSignStaffId,
        amendmentReason: dto.amendmentReason,
        updatedAt: new Date(),
      },
      include: {
        sections: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  async updateSections(tenantId: string, noteId: string, dto: UpdateNoteSectionsDto) {
    // Verify note exists and belongs to tenant
    const note = await this.findById(tenantId, noteId);

    // Check if note is signed - cannot modify signed notes
    if (note.status === NoteStatus.SIGNED) {
      throw new BadRequestException('Cannot modify sections of a signed note');
    }

    // Delete existing sections
    await this.prisma.clinicalNoteSection.deleteMany({
      where: { noteId },
    });

    // Create new sections
    await this.prisma.clinicalNoteSection.createMany({
      data: dto.sections.map((section) => ({
        noteId,
        sectionCode: section.sectionCode,
        sectionName: section.sectionName,
        content: section.content,
        sortOrder: section.sortOrder || 0,
        isEmpty: section.isEmpty || false,
      })),
    });

    // Return updated note
    return this.findById(tenantId, noteId);
  }

  async signNote(tenantId: string, noteId: string, dto: SignNoteDto) {
    const note = await this.findById(tenantId, noteId);

    // Validate signing
    if (note.status === NoteStatus.SIGNED && !dto.isCoSign) {
      throw new BadRequestException('Note is already signed');
    }

    if (dto.isCoSign) {
      // Co-signing
      if (!note.coSignStaffId) {
        throw new BadRequestException('Note does not have a co-signer assigned');
      }
      if (note.coSignStaffId !== dto.staffId) {
        throw new BadRequestException('Staff member is not the assigned co-signer');
      }
      if (note.coSignedAt) {
        throw new BadRequestException('Note is already co-signed');
      }

      return this.prisma.clinicalNote.update({
        where: { id: noteId },
        data: {
          coSignedAt: new Date(),
          updatedAt: new Date(),
        },
        include: {
          sections: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      });
    } else {
      // Primary signing
      if (note.authorStaffId !== dto.staffId) {
        throw new BadRequestException('Only the author can sign the note');
      }

      return this.prisma.clinicalNote.update({
        where: { id: noteId },
        data: {
          status: NoteStatus.SIGNED,
          signedAt: new Date(),
          updatedAt: new Date(),
        },
        include: {
          sections: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      });
    }
  }

  async delete(tenantId: string, id: string) {
    // Verify note exists and belongs to tenant
    await this.findById(tenantId, id);

    // Check if note is signed - cannot delete signed notes
    const note = await this.prisma.clinicalNote.findUnique({
      where: { id },
    });

    if (note.status === NoteStatus.SIGNED) {
      throw new BadRequestException('Cannot delete a signed note');
    }

    // Soft delete by updating status
    await this.prisma.clinicalNote.delete({
      where: { id },
    });

    return { message: 'Clinical note deleted successfully' };
  }

  async getNotesStatistics(tenantId: string, encounterId: string) {
    const notes = await this.prisma.clinicalNote.findMany({
      where: { tenantId, encounterId },
    });

    return {
      total: notes.length,
      byType: notes.reduce((acc, note) => {
        acc[note.noteType] = (acc[note.noteType] || 0) + 1;
        return acc;
      }, {}),
      byStatus: notes.reduce((acc, note) => {
        acc[note.status] = (acc[note.status] || 0) + 1;
        return acc;
      }, {}),
      signed: notes.filter((n) => n.status === NoteStatus.SIGNED).length,
      draft: notes.filter((n) => n.status === NoteStatus.DRAFT).length,
    };
  }
}
