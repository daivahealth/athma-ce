import { clinicalClient } from '@/lib/api/client';
import type { PatientDocument, UploadDocumentDto } from '../types/patient-document';

class PatientDocumentService {
  private basePath(patientId: string) {
    return `/patients/${patientId}/documents`;
  }

  async getDocuments(patientId: string): Promise<PatientDocument[]> {
    const response = await clinicalClient.get(this.basePath(patientId));
    return response.data;
  }

  async uploadDocument(patientId: string, dto: UploadDocumentDto): Promise<PatientDocument> {
    const formData = new FormData();
    formData.append('file', dto.file);
    formData.append('documentType', dto.documentType);
    if (dto.documentNumber) formData.append('documentNumber', dto.documentNumber);
    if (dto.issuingCountry) formData.append('issuingCountry', dto.issuingCountry);
    if (dto.issueDate) formData.append('issueDate', dto.issueDate);
    if (dto.expiryDate) formData.append('expiryDate', dto.expiryDate);
    if (dto.isPrimaryIdentity) formData.append('isPrimaryIdentity', 'true');

    const response = await clinicalClient.post(
      `${this.basePath(patientId)}/upload`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return response.data;
  }

  async deleteDocument(patientId: string, documentId: string): Promise<void> {
    await clinicalClient.delete(`${this.basePath(patientId)}/${documentId}`);
  }

  async verifyDocument(
    patientId: string,
    documentId: string,
    status: 'verified' | 'rejected',
  ): Promise<PatientDocument> {
    const response = await clinicalClient.put(
      `${this.basePath(patientId)}/${documentId}/verify`,
      { status },
    );
    return response.data;
  }

  getDocumentViewUrl(documentUrl: string): string {
    const base = process.env.NEXT_PUBLIC_CLINICAL_BASE_URL || 'http://localhost:3011';
    return `${base}${documentUrl}`;
  }
}

export const patientDocumentService = new PatientDocumentService();
