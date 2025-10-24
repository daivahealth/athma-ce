/**
 * Patient Document Service
 *
 * Manages patient identity documents and attachments
 */

import { Injectable, BadRequestException } from '@nestjs/common';
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

@Injectable()
export class PatientDocumentService {
  constructor(private prisma: PrismaService) {}

  /**
   * Add a document to a patient
   */
  async addDocument(
    tenantId: string,
    patientId: string,
    dto: CreateDocumentDto
  ) {
    // Check if patient exists
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId, tenantId },
    });

    if (!patient) {
      throw new BadRequestException('Patient not found');
    }

    // If this is a primary identity, unset other primary identities
    if (dto.isPrimaryIdentity) {
      await this.prisma.patientDocument.updateMany({
        where: {
          tenantId,
          patientId,
          isPrimaryIdentity: true,
        },
        data: {
          isPrimaryIdentity: false,
        },
      });
    }

    const document = await this.prisma.patientDocument.create({
      data: {
        tenantId,
        patientId,
        documentType: dto.documentType,
        documentNumber: dto.documentNumber,
        issuingCountry: dto.issuingCountry,
        issueDate: dto.issueDate ?? null,
        expiryDate: dto.expiryDate ?? null,
        documentUrl: dto.documentUrl ?? null,
        isPrimaryIdentity: dto.isPrimaryIdentity || false,
        verificationStatus: dto.verificationStatus || 'pending',
        verifiedBy: dto.verifiedBy ?? null,
      },
    });

    return document;
  }

  /**
   * Get all documents for a patient
   */
  async getPatientDocuments(tenantId: string, patientId: string) {
    return this.prisma.patientDocument.findMany({
      where: {
        tenantId,
        patientId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get document by ID
   */
  async getDocumentById(tenantId: string, documentId: string) {
    const document = await this.prisma.patientDocument.findUnique({
      where: { id: documentId },
    });

    if (!document || document.tenantId !== tenantId) {
      throw new BadRequestException('Document not found');
    }

    return document;
  }

  /**
   * Update document verification status
   */
  async verifyDocument(
    tenantId: string,
    documentId: string,
    verifiedBy: string,
    status: 'verified' | 'rejected'
  ) {
    const document = await this.prisma.patientDocument.findUnique({
      where: { id: documentId },
    });

    if (!document || document.tenantId !== tenantId) {
      throw new BadRequestException('Document not found');
    }

    return this.prisma.patientDocument.update({
      where: { id: documentId },
      data: {
        verificationStatus: status,
        verifiedBy,
        verifiedAt: new Date(),
      },
    });
  }

  /**
   * Delete a document
   */
  async deleteDocument(tenantId: string, documentId: string) {
    const document = await this.prisma.patientDocument.findUnique({
      where: { id: documentId },
    });

    if (!document || document.tenantId !== tenantId) {
      throw new BadRequestException('Document not found');
    }

    await this.prisma.patientDocument.delete({
      where: { id: documentId },
    });

    return { message: 'Document deleted successfully' };
  }
}
