export declare enum NoteType {
    SOAP = "soap",
    H_AND_P = "h_and_p",
    PROGRESS = "progress",
    DISCHARGE = "discharge",
    PROCEDURE = "procedure",
    CONSULTATION = "consultation"
}
export declare enum NoteStatus {
    DRAFT = "draft",
    FINAL = "final",
    AMENDED = "amended",
    SIGNED = "signed"
}
export declare enum NoteLanguage {
    EN = "en",
    AR = "ar"
}
export declare class ClinicalNoteSectionDto {
    sectionCode: string;
    sectionName: string;
    content: Record<string, any>;
    sortOrder?: number;
    isEmpty?: boolean;
}
export declare class CreateClinicalNoteDto {
    encounterId: string;
    patientId: string;
    noteType: NoteType;
    language?: NoteLanguage;
    title?: string;
    authorStaffId: string;
    coSignStaffId?: string;
    sections?: ClinicalNoteSectionDto[];
}
export declare class UpdateClinicalNoteDto {
    title?: string;
    status?: NoteStatus;
    coSignStaffId?: string;
    amendmentReason?: string;
}
export declare class UpdateNoteSectionsDto {
    sections: ClinicalNoteSectionDto[];
}
export declare class SignNoteDto {
    staffId: string;
    isCoSign?: boolean;
}
export declare class ClinicalNoteResponseDto {
    id: string;
    tenantId: string;
    encounterId: string;
    patientId: string;
    noteType: NoteType;
    language: NoteLanguage;
    title?: string;
    status: NoteStatus;
    version: number;
    authorStaffId: string;
    coSignStaffId?: string;
    signedAt?: Date;
    coSignedAt?: Date;
    amendmentReason?: string;
    supersededBy?: string;
    createdAt: Date;
    updatedAt: Date;
    sections?: ClinicalNoteSectionDto[];
}
//# sourceMappingURL=clinical-note.dto.d.ts.map