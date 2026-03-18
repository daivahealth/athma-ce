import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import {
  CreateEncounterNoteDto,
  UpdateEncounterNoteDto,
  SignNoteDto,
  NoteStatus,
} from '../dto/encounter-note.dto';

@Injectable()
export class EncounterNotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, dto: CreateEncounterNoteDto) {
    const data: any = {
      tenantId,
      encounterId: dto.encounterId,
      patientId: dto.patientId,
      noteType: dto.noteType,
      language: dto.language || 'en',
      authorStaffId: dto.authorStaffId,
    };

    if (dto.title) data.title = dto.title;
    if (dto.coSignStaffId) data.coSignStaffId = dto.coSignStaffId;
    if (dto.content) data.content = dto.content;

    return this.prisma.encounterNote.create({ data });
  }

  async findById(tenantId: string, id: string) {
    const note = await this.prisma.encounterNote.findFirst({
      where: { id, tenantId },
    });

    if (!note) {
      throw new NotFoundException(`Encounter note with ID ${id} not found`);
    }

    return note;
  }

  async findByEncounter(tenantId: string, encounterId: string) {
    return this.prisma.encounterNote.findMany({
      where: { tenantId, encounterId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByPatient(tenantId: string, patientId: string, limit?: number) {
    const query: any = {
      where: { tenantId, patientId },
      orderBy: { createdAt: 'desc' },
    };

    if (limit) {
      query.take = limit;
    }

    return this.prisma.encounterNote.findMany(query);
  }

  async update(tenantId: string, id: string, dto: UpdateEncounterNoteDto) {
    // Verify note exists and belongs to tenant
    const note = await this.findById(tenantId, id);

    // If status is being changed to amended, require amendment reason
    if (dto.status === NoteStatus.AMENDED && !dto.amendmentReason) {
      throw new BadRequestException('Amendment reason is required when amending a note');
    }

    // Cannot modify content of a signed note
    if (dto.content && note.status === NoteStatus.SIGNED) {
      throw new BadRequestException('Cannot modify content of a signed note');
    }

    const data: any = {
      updatedAt: new Date(),
    };

    if (dto.title) data.title = dto.title;
    if (dto.status) data.status = dto.status;
    if (dto.coSignStaffId) data.coSignStaffId = dto.coSignStaffId;
    if (dto.amendmentReason) data.amendmentReason = dto.amendmentReason;
    if (dto.content) data.content = dto.content;

    return this.prisma.encounterNote.update({
      where: { id },
      data,
    });
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

      return this.prisma.encounterNote.update({
        where: { id: noteId },
        data: {
          coSignedAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } else {
      // Primary signing
      if (note.authorStaffId !== dto.staffId) {
        throw new BadRequestException('Only the author can sign the note');
      }

      return this.prisma.encounterNote.update({
        where: { id: noteId },
        data: {
          status: NoteStatus.SIGNED,
          signedAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }

  async delete(tenantId: string, id: string) {
    // Verify note exists and belongs to tenant
    await this.findById(tenantId, id);

    // Check if note is signed - cannot delete signed notes
    const note = await this.prisma.encounterNote.findUnique({
      where: { id },
    });

    if (!note) {
      throw new NotFoundException(`Encounter note with ID ${id} not found`);
    }

    if (note.status === NoteStatus.SIGNED) {
      throw new BadRequestException('Cannot delete a signed note');
    }

    await this.prisma.encounterNote.delete({
      where: { id },
    });

    return { message: 'Encounter note deleted successfully' };
  }

  async getNotesStatistics(tenantId: string, encounterId: string) {
    const notes = await this.prisma.encounterNote.findMany({
      where: { tenantId, encounterId },
    });

    return {
      total: notes.length,
      byType: notes.reduce((acc: Record<string, number>, note) => {
        acc[note.noteType] = (acc[note.noteType] || 0) + 1;
        return acc;
      }, {}),
      byStatus: notes.reduce((acc: Record<string, number>, note) => {
        acc[note.status] = (acc[note.status] || 0) + 1;
        return acc;
      }, {}),
      signed: notes.filter((n) => n.status === NoteStatus.SIGNED).length,
      draft: notes.filter((n) => n.status === NoteStatus.DRAFT).length,
    };
  }
}
