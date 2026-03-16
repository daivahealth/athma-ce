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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PatientDocumentService } from './patient-document.service';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import {
  PATIENT_READ,
  PATIENT_UPDATE,
  PATIENT_DELETE,
} from '@zeal/contracts';
import { StorageService } from '../../common/storage/storage.service';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/tiff',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

@Controller('patients/:patientId/documents')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PatientDocumentController {
  constructor(
    private readonly documentService: PatientDocumentService,
    private readonly storageService: StorageService,
  ) {}

  /**
   * POST /patients/:patientId/documents - Add document (JSON metadata only)
   */
  @Post()
  @Permissions(PATIENT_UPDATE)
  async addDocument(
    @Param('patientId') patientId: string,
    @Body() dto: any,
    @Req() req: any
  ) {
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const tenantId = req.context.tenantId;

    const documentData = {
      ...dto,
      issueDate: dto.issueDate ? new Date(dto.issueDate) : undefined,
      expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
    };

    return this.documentService.addDocument(tenantId, patientId, documentData);
  }

  /**
   * POST /patients/:patientId/documents/upload - Upload document file with metadata
   */
  @Post('upload')
  @Permissions(PATIENT_UPDATE)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (_req, file, callback) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          callback(
            new BadRequestException(
              `File type ${file.mimetype} is not allowed. Allowed types: PDF, JPEG, PNG, GIF, WebP, TIFF, DOC, DOCX`,
            ),
            false,
          );
          return;
        }
        callback(null, true);
      },
    }),
  )
  async uploadDocument(
    @Param('patientId') patientId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Req() req: any,
  ) {
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const tenantId = req.context.tenantId;

    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Upload file to storage
    const subDir = `patient-documents/${tenantId}/${patientId}`;
    const uploadResult = await this.storageService.upload(file, subDir);

    // Create document record with file URL
    const documentData = {
      documentType: body.documentType || 'other',
      documentNumber: body.documentNumber || '',
      issuingCountry: body.issuingCountry || '',
      issueDate: body.issueDate ? new Date(body.issueDate) : undefined,
      expiryDate: body.expiryDate ? new Date(body.expiryDate) : undefined,
      isPrimaryIdentity: body.isPrimaryIdentity === 'true',
      documentUrl: uploadResult.url,
      metadata: {
        originalName: uploadResult.originalName,
        mimeType: uploadResult.mimeType,
        size: uploadResult.size,
        filePath: uploadResult.filePath,
      },
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
    @Param('patientId') patientId: string,
    @Param('documentId') documentId: string,
    @Req() req: any
  ) {
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    const tenantId = req.context.tenantId;
    return this.documentService.deleteDocument(tenantId, documentId, this.storageService);
  }
}
