/**
 * Patient History Service
 *
 * Handles tracking and querying patient data change history
 */

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@zeal/database-clinical';

export interface ChangeHistoryEntry {
  fieldName: string;
  oldValue: string | null;
  newValue: string | null;
}

export interface RecordChangeOptions {
  tenantId: string;
  patientId: string;
  changes: ChangeHistoryEntry[];
  changeType: 'update' | 'correction' | 'patient_request' | 'merge' | 'import';
  changeReason?: string;
  changedBy: string;
  changedAtFacility?: string;
  approvedBy?: string;
  patientConsent?: boolean;
  consentDocUrl?: string;
  supportingDocUrl?: string;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class PatientHistoryService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Record multiple field changes in history
   */
  async recordChanges(options: RecordChangeOptions): Promise<void> {
    const historyEntries = options.changes.map((change) => ({
      tenantId: options.tenantId,
      patientId: options.patientId,
      fieldName: change.fieldName,
      oldValue: change.oldValue,
      newValue: change.newValue,
      changeType: options.changeType,
      changeReason: options.changeReason,
      changedBy: options.changedBy,
      changedAtFacility: options.changedAtFacility,
      approvedBy: options.approvedBy,
      patientConsent: options.patientConsent || false,
      consentDocUrl: options.consentDocUrl,
      supportingDocUrl: options.supportingDocUrl,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
    }));

    // Batch insert for performance
    await this.prisma.patientHistory.createMany({
      data: historyEntries,
    });
  }

  /**
   * Get complete change history for a patient
   */
  async getPatientHistory(
    tenantId: string,
    patientId: string,
    options?: {
      fieldName?: string;
      changeType?: string;
      limit?: number;
      offset?: number;
    }
  ) {
    const where: any = {
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
  async getFieldHistory(
    tenantId: string,
    patientId: string,
    fieldName: string
  ) {
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
  async getChangesByUser(
    tenantId: string,
    userId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    }
  ) {
    const where: any = {
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
  async getPendingApprovals(tenantId: string) {
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
  async approveChange(
    historyId: string,
    approvedBy: string
  ) {
    return this.prisma.patientHistory.update({
      where: { id: historyId },
      data: { approvedBy },
    });
  }

  /**
   * Get change statistics
   */
  async getChangeStats(
    tenantId: string,
    options?: {
      startDate?: Date;
      endDate?: Date;
      groupBy?: 'changeType' | 'fieldName' | 'changedBy';
    }
  ) {
    const where: any = { tenantId };

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
      by: [groupByField as any],
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
  async getPatientStateAt(
    tenantId: string,
    patientId: string,
    timestamp: Date
  ): Promise<Record<string, any>> {
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
    const historicalState: Record<string, any> = { ...currentPatient };

    // Reverse the changes to get historical state
    changesAfterTimestamp.reverse().forEach((change) => {
      historicalState[change.fieldName] = change.oldValue;
    });

    return historicalState;
  }

  /**
   * Detect unusual change patterns (for fraud detection)
   */
  async detectUnusualPatterns(
    tenantId: string,
    options?: {
      threshold?: number; // Number of changes in short period
      timeWindow?: number; // Time window in minutes
    }
  ) {
    const threshold = options?.threshold || 5;
    const timeWindow = options?.timeWindow || 60;
    const cutoffTime = new Date(Date.now() - timeWindow * 60 * 1000);

    // Get recent rapid changes
    const rapidChanges = await this.prisma.$queryRaw`
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
}
