/**
 * Patient Document Controller
 *
 * REST API endpoints for patient document management
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PatientDocumentService } from './patient-document.service';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import {
  PATIENT_READ,
  PATIENT_UPDATE,
  PATIENT_DELETE,
} from '@zeal/contracts';

@Controller('patients/:patientId/documents')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PatientDocumentController {
  constructor(
    private readonly documentService: PatientDocumentService
  ) {}

  /**
   * POST /patients/:patientId/documents - Add document
   */
  @Post()
  @Permissions(PATIENT_UPDATE)
  async addDocument(
    @Param('patientId') patientId: string,
    @Body() dto: any,
    @Req() req: any
  ) {
    // Context is set by TenantContextMiddleware in req.context
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const tenantId = req.context.tenantId;

    // Convert dates if provided
    const documentData = {
      ...dto,
      issueDate: dto.issueDate ? new Date(dto.issueDate) : undefined,
      expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
    };

    return this.documentService.addDocument(tenantId, patientId, documentData);
  }

  /**
   * GET /patients/:patientId/documents - Get all documents
   */
  @Get()
  @Permissions(PATIENT_READ)
  async getDocuments(
    @Param('patientId') patientId: string,
    @Req() req: any
  ) {
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const tenantId = req.context.tenantId;
    return this.documentService.getPatientDocuments(tenantId, patientId);
  }

  /**
   * GET /patients/:patientId/documents/:documentId - Get document by ID
   */
  @Get(':documentId')
  @Permissions(PATIENT_READ)
  async getDocument(
    @Param('documentId') documentId: string,
    @Req() req: any
  ) {
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const tenantId = req.context.tenantId;
    return this.documentService.getDocumentById(tenantId, documentId);
  }

  /**
   * PUT /patients/:patientId/documents/:documentId/verify - Verify document
   */
  @Put(':documentId/verify')
  @Permissions(PATIENT_UPDATE)
  async verifyDocument(
    @Param('documentId') documentId: string,
    @Body() body: { status: 'verified' | 'rejected' },
    @Req() req: any
  ) {
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const tenantId = req.context.tenantId;
    const verifiedBy = req.context.userId;
    return this.documentService.verifyDocument(
      tenantId,
      documentId,
      verifiedBy,
      body.status
    );
  }

  /**
   * DELETE /patients/:patientId/documents/:documentId - Delete document
   */
  @Delete(':documentId')
  @Permissions(PATIENT_DELETE)
  async deleteDocument(
    @Param('documentId') documentId: string,
    @Req() req: any
  ) {
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const tenantId = req.context.tenantId;
    return this.documentService.deleteDocument(tenantId, documentId);
  }
}
