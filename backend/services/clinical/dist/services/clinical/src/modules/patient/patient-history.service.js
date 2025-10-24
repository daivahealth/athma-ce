"use strict";
/**
 * Patient History Service
 *
 * Handles tracking and querying patient data change history
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
exports.PatientHistoryService = void 0;
const common_1 = require("@nestjs/common");
const database_clinical_1 = require("@zeal/database-clinical");
let PatientHistoryService = class PatientHistoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Record multiple field changes in history
     */
    async recordChanges(options) {
        const historyEntries = options.changes.map((change) => ({
            tenantId: options.tenantId,
            patientId: options.patientId,
            fieldName: change.fieldName,
            oldValue: change.oldValue,
            newValue: change.newValue,
            changeType: options.changeType,
            changeReason: options.changeReason ?? null,
            changedBy: options.changedBy,
            changedAtFacility: options.changedAtFacility ?? null,
            approvedBy: options.approvedBy ?? null,
            patientConsent: options.patientConsent || false,
            consentDocUrl: options.consentDocUrl ?? null,
            supportingDocUrl: options.supportingDocUrl ?? null,
            ipAddress: options.ipAddress ?? null,
            userAgent: options.userAgent ?? null,
        }));
        // Batch insert for performance
        await this.prisma.patientHistory.createMany({
            data: historyEntries,
        });
    }
    /**
     * Get complete change history for a patient
     */
    async getPatientHistory(tenantId, patientId, options) {
        const where = {
            tenantId,
            patientId,
        };
        if (options?.fieldName) {
            where.fieldName = options.fieldName;
        }
        if (options?.changeType) {
            where.changeType = options.changeType;
        }
        return this.prisma.patientHistory.findMany({
            where,
            orderBy: {
                changedAt: 'desc',
            },
            take: options?.limit || 100,
            skip: options?.offset || 0,
        });
    }
    /**
     * Get history for a specific field
     */
    async getFieldHistory(tenantId, patientId, fieldName) {
        return this.prisma.patientHistory.findMany({
            where: {
                tenantId,
                patientId,
                fieldName,
            },
            orderBy: {
                changedAt: 'desc',
            },
        });
    }
    /**
     * Get all changes made by a specific user
     */
    async getChangesByUser(tenantId, userId, options) {
        const where = {
            tenantId,
            changedBy: userId,
        };
        if (options?.startDate || options?.endDate) {
            where.changedAt = {};
            if (options.startDate) {
                where.changedAt.gte = options.startDate;
            }
            if (options.endDate) {
                where.changedAt.lte = options.endDate;
            }
        }
        return this.prisma.patientHistory.findMany({
            where,
            orderBy: {
                changedAt: 'desc',
            },
            take: options?.limit || 100,
        });
    }
    /**
     * Get changes requiring approval
     */
    async getPendingApprovals(tenantId) {
        return this.prisma.patientHistory.findMany({
            where: {
                tenantId,
                approvedBy: null,
                changeType: {
                    in: ['patient_request', 'correction'],
                },
            },
            orderBy: {
                changedAt: 'asc',
            },
        });
    }
    /**
     * Approve a change
     */
    async approveChange(historyId, approvedBy) {
        return this.prisma.patientHistory.update({
            where: { id: historyId },
            data: { approvedBy },
        });
    }
    /**
     * Get change statistics
     */
    async getChangeStats(tenantId, options) {
        const where = { tenantId };
        if (options?.startDate || options?.endDate) {
            where.changedAt = {};
            if (options.startDate) {
                where.changedAt.gte = options.startDate;
            }
            if (options.endDate) {
                where.changedAt.lte = options.endDate;
            }
        }
        const groupByField = options?.groupBy || 'changeType';
        return this.prisma.patientHistory.groupBy({
            by: [groupByField],
            where,
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: 'desc',
                },
            },
        });
    }
    /**
     * Compare patient state at two points in time
     */
    async getPatientStateAt(tenantId, patientId, timestamp) {
        // Get current patient
        const currentPatient = await this.prisma.patient.findUnique({
            where: { id: patientId },
        });
        if (!currentPatient) {
            throw new Error('Patient not found');
        }
        // Get all changes after the specified timestamp
        const changesAfterTimestamp = await this.prisma.patientHistory.findMany({
            where: {
                tenantId,
                patientId,
                changedAt: {
                    gt: timestamp,
                },
            },
            orderBy: {
                changedAt: 'asc',
            },
        });
        // Start with current state
        const historicalState = { ...currentPatient };
        // Reverse the changes to get historical state
        changesAfterTimestamp.reverse().forEach((change) => {
            historicalState[change.fieldName] = change.oldValue;
        });
        return historicalState;
    }
    /**
     * Detect unusual change patterns (for fraud detection)
     */
    async detectUnusualPatterns(tenantId, options) {
        const threshold = options?.threshold || 5;
        const timeWindow = options?.timeWindow || 60;
        const cutoffTime = new Date(Date.now() - timeWindow * 60 * 1000);
        // Get recent rapid changes
        const rapidChanges = await this.prisma.$queryRaw `
      SELECT
        patient_id,
        changed_by,
        COUNT(*) as change_count,
        MIN(changed_at) as first_change,
        MAX(changed_at) as last_change
      FROM patient_history
      WHERE tenant_id = ${tenantId}
        AND changed_at >= ${cutoffTime}
      GROUP BY patient_id, changed_by
      HAVING COUNT(*) >= ${threshold}
      ORDER BY change_count DESC
    `;
        return rapidChanges;
    }
};
exports.PatientHistoryService = PatientHistoryService;
exports.PatientHistoryService = PatientHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_clinical_1.PrismaService])
], PatientHistoryService);
//# sourceMappingURL=patient-history.service.js.map