"use strict";
/**
 * Patient Document Service
 *
 * Manages patient identity documents and attachments
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientDocumentService = void 0;
const common_1 = require("@nestjs/common");
const database_clinical_1 = require("@zeal/database-clinical");
let PatientDocumentService = class PatientDocumentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Add a document to a patient
     */
    async addDocument(tenantId, patientId, dto) {
        // Check if patient exists
        const patient = await this.prisma.patient.findUnique({
            where: { id: patientId, tenantId },
        });
        if (!patient) {
            throw new common_1.BadRequestException('Patient not found');
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
    async getPatientDocuments(tenantId, patientId) {
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
    async getDocumentById(tenantId, documentId) {
        const document = await this.prisma.patientDocument.findUnique({
            where: { id: documentId },
        });
        if (!document || document.tenantId !== tenantId) {
            throw new common_1.BadRequestException('Document not found');
        }
        return document;
    }
    /**
     * Update document verification status
     */
    async verifyDocument(tenantId, documentId, verifiedBy, status) {
        const document = await this.prisma.patientDocument.findUnique({
            where: { id: documentId },
        });
        if (!document || document.tenantId !== tenantId) {
            throw new common_1.BadRequestException('Document not found');
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
    async deleteDocument(tenantId, documentId) {
        const document = await this.prisma.patientDocument.findUnique({
            where: { id: documentId },
        });
        if (!document || document.tenantId !== tenantId) {
            throw new common_1.BadRequestException('Document not found');
        }
        await this.prisma.patientDocument.delete({
            where: { id: documentId },
        });
        return { message: 'Document deleted successfully' };
    }
};
exports.PatientDocumentService = PatientDocumentService;
exports.PatientDocumentService = PatientDocumentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_clinical_1.PrismaService])
], PatientDocumentService);
//# sourceMappingURL=patient-document.service.js.map