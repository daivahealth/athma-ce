"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicalNotesService = void 0;
const common_1 = require("@nestjs/common");
const database_clinical_1 = require("@zeal/database-clinical");
const clinical_note_dto_1 = require("../dto/clinical-note.dto");
let ClinicalNotesService = class ClinicalNotesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, dto) {
        const data = {
            tenantId,
            encounterId: dto.encounterId,
            patientId: dto.patientId,
            noteType: dto.noteType,
            language: dto.language || 'en',
            authorStaffId: dto.authorStaffId,
        };
        if (dto.title)
            data.title = dto.title;
        if (dto.coSignStaffId)
            data.coSignStaffId = dto.coSignStaffId;
        if (dto.sections) {
            data.sections = {
                create: dto.sections.map((section) => ({
                    sectionCode: section.sectionCode,
                    sectionName: section.sectionName,
                    content: section.content,
                    sortOrder: section.sortOrder || 0,
                    isEmpty: section.isEmpty || false,
                })),
            };
        }
        return this.prisma.clinicalNote.create({
            data,
            include: {
                sections: {
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });
    }
    async findById(tenantId, id) {
        const note = await this.prisma.clinicalNote.findFirst({
            where: { id, tenantId },
            include: {
                sections: {
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });
        if (!note) {
            throw new common_1.NotFoundException(`Clinical note with ID ${id} not found`);
        }
        return note;
    }
    async findByEncounter(tenantId, encounterId) {
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
    async findByPatient(tenantId, patientId, limit) {
        const query = {
            where: { tenantId, patientId },
            include: {
                sections: {
                    orderBy: { sortOrder: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        };
        if (limit) {
            query.take = limit;
        }
        return this.prisma.clinicalNote.findMany(query);
    }
    async update(tenantId, id, dto) {
        // Verify note exists and belongs to tenant
        await this.findById(tenantId, id);
        // If status is being changed to amended, require amendment reason
        if (dto.status === clinical_note_dto_1.NoteStatus.AMENDED && !dto.amendmentReason) {
            throw new common_1.BadRequestException('Amendment reason is required when amending a note');
        }
        const data = {
            updatedAt: new Date(),
        };
        if (dto.title)
            data.title = dto.title;
        if (dto.status)
            data.status = dto.status;
        if (dto.coSignStaffId)
            data.coSignStaffId = dto.coSignStaffId;
        if (dto.amendmentReason)
            data.amendmentReason = dto.amendmentReason;
        return this.prisma.clinicalNote.update({
            where: { id },
            data,
            include: {
                sections: {
                    orderBy: { sortOrder: 'asc' },
                },
            },
        });
    }
    async updateSections(tenantId, noteId, dto) {
        // Verify note exists and belongs to tenant
        const note = await this.findById(tenantId, noteId);
        // Check if note is signed - cannot modify signed notes
        if (note.status === clinical_note_dto_1.NoteStatus.SIGNED) {
            throw new common_1.BadRequestException('Cannot modify sections of a signed note');
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
    async signNote(tenantId, noteId, dto) {
        const note = await this.findById(tenantId, noteId);
        // Validate signing
        if (note.status === clinical_note_dto_1.NoteStatus.SIGNED && !dto.isCoSign) {
            throw new common_1.BadRequestException('Note is already signed');
        }
        if (dto.isCoSign) {
            // Co-signing
            if (!note.coSignStaffId) {
                throw new common_1.BadRequestException('Note does not have a co-signer assigned');
            }
            if (note.coSignStaffId !== dto.staffId) {
                throw new common_1.BadRequestException('Staff member is not the assigned co-signer');
            }
            if (note.coSignedAt) {
                throw new common_1.BadRequestException('Note is already co-signed');
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
        }
        else {
            // Primary signing
            if (note.authorStaffId !== dto.staffId) {
                throw new common_1.BadRequestException('Only the author can sign the note');
            }
            return this.prisma.clinicalNote.update({
                where: { id: noteId },
                data: {
                    status: clinical_note_dto_1.NoteStatus.SIGNED,
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
    async delete(tenantId, id) {
        // Verify note exists and belongs to tenant
        await this.findById(tenantId, id);
        // Check if note is signed - cannot delete signed notes
        const note = await this.prisma.clinicalNote.findUnique({
            where: { id },
        });
        if (!note) {
            throw new common_1.NotFoundException(`Clinical note with ID ${id} not found`);
        }
        if (note.status === clinical_note_dto_1.NoteStatus.SIGNED) {
            throw new common_1.BadRequestException('Cannot delete a signed note');
        }
        // Soft delete by updating status
        await this.prisma.clinicalNote.delete({
            where: { id },
        });
        return { message: 'Clinical note deleted successfully' };
    }
    async getNotesStatistics(tenantId, encounterId) {
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
            signed: notes.filter((n) => n.status === clinical_note_dto_1.NoteStatus.SIGNED).length,
            draft: notes.filter((n) => n.status === clinical_note_dto_1.NoteStatus.DRAFT).length,
        };
    }
};
exports.ClinicalNotesService = ClinicalNotesService;
exports.ClinicalNotesService = ClinicalNotesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_clinical_1.PrismaService])
], ClinicalNotesService);
//# sourceMappingURL=clinical-notes.service.js.map