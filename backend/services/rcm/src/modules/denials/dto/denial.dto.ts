// Denial status enum
export enum DenialStatus {
    OPEN = 'open',
    APPEALING = 'appealing',
    UPHELD = 'upheld',
    OVERTURNED = 'overturned',
}

// Appeal status enum
export enum AppealStatus {
    DRAFT = 'draft',
    FILED = 'filed',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
}

// A supporting reference attached to an appeal (document, note, prior-auth number, etc.)
export class AppealSupportingRef {
    type!: string;
    ref!: string;
    description?: string;
}

// DTO for recording a denial against a claim
export class CreateDenialDto {
    claimId!: string;
    denialCode!: string;
    denialReason!: string;
    deniedAmount!: number;
    currency?: string;
    remarkCodes?: string[];
    deniedAt?: Date;
    appealDeadline?: Date;
    status?: DenialStatus;
}

// DTO for drafting an appeal against a denial
export class CreateAppealDto {
    narrative!: string;
    justification?: string;
    supportingRefs?: AppealSupportingRef[];
}

// DTO for filing a drafted appeal
export class FileAppealDto {
    narrative?: string;
    justification?: string;
    supportingRefs?: AppealSupportingRef[];
}

// DTO for filtering denials list
export class DenialFilterDto {
    claimId?: string;
    encounterId?: string;
    patientId?: string;
    status?: DenialStatus;
    limit?: number;
    offset?: number;
}
