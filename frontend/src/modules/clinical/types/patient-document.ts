export interface PatientDocument {
  id: string;
  tenantId: string;
  patientId: string;
  documentType: string;
  documentNumber: string;
  issuingCountry: string;
  issuingAuthority?: string | null;
  issueDate?: string | null;
  expiryDate?: string | null;
  isPrimaryIdentity: boolean;
  documentUrl?: string | null;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  verificationNotes?: string | null;
  metadata?: {
    originalName?: string;
    mimeType?: string;
    size?: number;
    filePath?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface UploadDocumentDto {
  file: File;
  documentType: string;
  documentNumber?: string;
  issuingCountry?: string;
  issueDate?: string;
  expiryDate?: string;
  isPrimaryIdentity?: boolean;
}
