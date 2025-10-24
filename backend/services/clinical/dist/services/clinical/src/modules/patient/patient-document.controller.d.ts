/**
 * Patient Document Controller
 *
 * REST API endpoints for patient document management
 */
import { PatientDocumentService } from './patient-document.service';
export declare class PatientDocumentController {
    private readonly documentService;
    constructor(documentService: PatientDocumentService);
    /**
     * POST /patients/:patientId/documents - Add document
     */
    addDocument(patientId: string, dto: any, req: any): Promise<{
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
     * GET /patients/:patientId/documents - Get all documents
     */
    getDocuments(patientId: string, req: any): Promise<{
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
     * GET /patients/:patientId/documents/:documentId - Get document by ID
     */
    getDocument(documentId: string, req: any): Promise<{
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
     * PUT /patients/:patientId/documents/:documentId/verify - Verify document
     */
    verifyDocument(documentId: string, body: {
        status: 'verified' | 'rejected';
    }, req: any): Promise<{
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
     * DELETE /patients/:patientId/documents/:documentId - Delete document
     */
    deleteDocument(documentId: string, req: any): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=patient-document.controller.d.ts.map