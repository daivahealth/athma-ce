import { ClinicalNotesService } from '../services/clinical-notes.service';
import { CreateClinicalNoteDto, UpdateClinicalNoteDto, UpdateNoteSectionsDto, SignNoteDto } from '../dto/clinical-note.dto';
export declare class ClinicalNotesController {
    private readonly clinicalNotesService;
    constructor(clinicalNotesService: ClinicalNotesService);
    create(tenantId: string, dto: CreateClinicalNoteDto): Promise<{
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
    updateSections(tenantId: string, id: string, dto: UpdateNoteSectionsDto): Promise<{
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
    signNote(tenantId: string, id: string, dto: SignNoteDto): Promise<{
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
    getStatistics(tenantId: string, encounterId: string): Promise<{
        total: number;
        byType: Record<string, number>;
        byStatus: Record<string, number>;
        signed: number;
        draft: number;
    }>;
}
//# sourceMappingURL=clinical-notes.controller.d.ts.map