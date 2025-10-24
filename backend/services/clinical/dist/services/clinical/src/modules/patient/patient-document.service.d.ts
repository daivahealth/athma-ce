/**
 * Patient Document Service
 *
 * Manages patient identity documents and attachments
 */
import { PrismaService } from '@zeal/database-clinical';
export interface CreateDocumentDto {
    documentType: string;
    documentNumber: string;
    issuingCountry: string;
    issueDate?: Date;
    expiryDate?: Date;
    documentUrl?: string;
    isPrimaryIdentity?: boolean;
    verificationStatus?: string;
    verifiedBy?: string;
}
export declare class PatientDocumentService {
    private prisma;
    constructor(prisma: PrismaService);
    /**
     * Add a document to a patient
     */
    addDocument(tenantId: string, patientId: string, dto: CreateDocumentDto): Promise<{
        id: string;
        tenantId: string;
        patientId: string;
        issuingCountry: string;
        createdAt: Date;
        updatedAt: Date;
        documentType: string;
        documentNumber: string;
        issuingAuthority: string | null;
        issueDate: Date | null;
        expiryDate: Date | null;
        isPrimaryIdentity: boolean;
        documentUrl: string | null;
        verificationStatus: string;
        verifiedBy: string | null;
        verifiedAt: Date | null;
        verificationNotes: string | null;
        metadata: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
    }>;
    /**
     * Get all documents for a patient
     */
    getPatientDocuments(tenantId: string, patientId: string): Promise<{
        id: string;
        tenantId: string;
        patientId: string;
        issuingCountry: string;
        createdAt: Date;
        updatedAt: Date;
        documentType: string;
        documentNumber: string;
        issuingAuthority: string | null;
        issueDate: Date | null;
        expiryDate: Date | null;
        isPrimaryIdentity: boolean;
        documentUrl: string | null;
        verificationStatus: string;
        verifiedBy: string | null;
        verifiedAt: Date | null;
        verificationNotes: string | null;
        metadata: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
    }[]>;
    /**
     * Get document by ID
     */
    getDocumentById(tenantId: string, documentId: string): Promise<{
        id: string;
        tenantId: string;
        patientId: string;
        issuingCountry: string;
        createdAt: Date;
        updatedAt: Date;
        documentType: string;
        documentNumber: string;
        issuingAuthority: string | null;
        issueDate: Date | null;
        expiryDate: Date | null;
        isPrimaryIdentity: boolean;
        documentUrl: string | null;
        verificationStatus: string;
        verifiedBy: string | null;
        verifiedAt: Date | null;
        verificationNotes: string | null;
        metadata: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
    }>;
    /**
     * Update document verification status
     */
    verifyDocument(tenantId: string, documentId: string, verifiedBy: string, status: 'verified' | 'rejected'): Promise<{
        id: string;
        tenantId: string;
        patientId: string;
        issuingCountry: string;
        createdAt: Date;
        updatedAt: Date;
        documentType: string;
        documentNumber: string;
        issuingAuthority: string | null;
        issueDate: Date | null;
        expiryDate: Date | null;
        isPrimaryIdentity: boolean;
        documentUrl: string | null;
        verificationStatus: string;
        verifiedBy: string | null;
        verifiedAt: Date | null;
        verificationNotes: string | null;
        metadata: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
    }>;
    /**
     * Delete a document
     */
    deleteDocument(tenantId: string, documentId: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=patient-document.service.d.ts.map