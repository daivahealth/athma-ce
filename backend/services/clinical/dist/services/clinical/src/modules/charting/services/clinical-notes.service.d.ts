import { PrismaService } from '@zeal/database-clinical';
import { CreateClinicalNoteDto, UpdateClinicalNoteDto, UpdateNoteSectionsDto, SignNoteDto } from '../dto/clinical-note.dto';
export declare class ClinicalNotesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, dto: CreateClinicalNoteDto): Promise<{
        id: string;
        tenantId: string;
        patientId: string;
        title: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        version: number;
        language: string;
        encounterId: string;
        noteType: string;
        authorStaffId: string;
        coSignStaffId: string | null;
        amendmentReason: string | null;
        signedAt: Date | null;
        coSignedAt: Date | null;
        supersededBy: string | null;
    }>;
    findById(tenantId: string, id: string): Promise<{
        sections: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
            sectionCode: string;
            sectionName: string;
            sortOrder: number;
            isEmpty: boolean;
            noteId: string;
        }[];
    } & {
        id: string;
        tenantId: string;
        patientId: string;
        title: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        version: number;
        language: string;
        encounterId: string;
        noteType: string;
        authorStaffId: string;
        coSignStaffId: string | null;
        amendmentReason: string | null;
        signedAt: Date | null;
        coSignedAt: Date | null;
        supersededBy: string | null;
    }>;
    findByEncounter(tenantId: string, encounterId: string): Promise<({
        sections: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
            sectionCode: string;
            sectionName: string;
            sortOrder: number;
            isEmpty: boolean;
            noteId: string;
        }[];
    } & {
        id: string;
        tenantId: string;
        patientId: string;
        title: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        version: number;
        language: string;
        encounterId: string;
        noteType: string;
        authorStaffId: string;
        coSignStaffId: string | null;
        amendmentReason: string | null;
        signedAt: Date | null;
        coSignedAt: Date | null;
        supersededBy: string | null;
    })[]>;
    findByPatient(tenantId: string, patientId: string, limit?: number): Promise<{
        id: string;
        tenantId: string;
        patientId: string;
        title: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        version: number;
        language: string;
        encounterId: string;
        noteType: string;
        authorStaffId: string;
        coSignStaffId: string | null;
        amendmentReason: string | null;
        signedAt: Date | null;
        coSignedAt: Date | null;
        supersededBy: string | null;
    }[]>;
    update(tenantId: string, id: string, dto: UpdateClinicalNoteDto): Promise<{
        id: string;
        tenantId: string;
        patientId: string;
        title: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        version: number;
        language: string;
        encounterId: string;
        noteType: string;
        authorStaffId: string;
        coSignStaffId: string | null;
        amendmentReason: string | null;
        signedAt: Date | null;
        coSignedAt: Date | null;
        supersededBy: string | null;
    }>;
    updateSections(tenantId: string, noteId: string, dto: UpdateNoteSectionsDto): Promise<{
        sections: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
            sectionCode: string;
            sectionName: string;
            sortOrder: number;
            isEmpty: boolean;
            noteId: string;
        }[];
    } & {
        id: string;
        tenantId: string;
        patientId: string;
        title: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        version: number;
        language: string;
        encounterId: string;
        noteType: string;
        authorStaffId: string;
        coSignStaffId: string | null;
        amendmentReason: string | null;
        signedAt: Date | null;
        coSignedAt: Date | null;
        supersededBy: string | null;
    }>;
    signNote(tenantId: string, noteId: string, dto: SignNoteDto): Promise<{
        sections: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
            sectionCode: string;
            sectionName: string;
            sortOrder: number;
            isEmpty: boolean;
            noteId: string;
        }[];
    } & {
        id: string;
        tenantId: string;
        patientId: string;
        title: string | null;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        version: number;
        language: string;
        encounterId: string;
        noteType: string;
        authorStaffId: string;
        coSignStaffId: string | null;
        amendmentReason: string | null;
        signedAt: Date | null;
        coSignedAt: Date | null;
        supersededBy: string | null;
    }>;
    delete(tenantId: string, id: string): Promise<{
        message: string;
    }>;
    getNotesStatistics(tenantId: string, encounterId: string): Promise<{
        total: number;
        byType: {};
        byStatus: {};
        signed: number;
        draft: number;
    }>;
}
//# sourceMappingURL=clinical-notes.service.d.ts.map