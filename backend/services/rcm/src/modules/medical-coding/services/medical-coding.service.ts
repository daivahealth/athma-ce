import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

/**
 * MedicalCodingService
 *
 * Handles automated medical coding workflow - the bridge between clinical documentation
 * and claim submission. Auto-seeds coding sessions when posting rules create charges,
 * allowing claims to proceed while enabling coders to review and enhance coding accuracy.
 *
 * Key responsibilities:
 * - Auto-create coding sessions when charges are generated
 * - Fetch encounter diagnoses from Clinical service and create CodingDiagnosis records
 * - Create CodingProcedure records from generated charges
 * - Link charges to coding procedures for audit trail
 *
 * Architecture note:
 * - Respects database isolation: calls Clinical API for cross-database data
 * - Non-blocking design: coding sessions created in 'auto_generated' status
 * - Claims can be generated from auto-seeded data without waiting for coder review
 */
@Injectable()
export class MedicalCodingService {
  private readonly logger = new Logger(MedicalCodingService.name);
  private readonly clinicalApiUrl = process.env.CLINICAL_API_URL || 'http://localhost:3011/api/v1';

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Auto-seed coding session after charges are created by posting rules
   *
   * This is called after the charge posting service processes an event.
   * It creates:
   * 1. A CodingSession in 'auto_generated' status
   * 2. CodingDiagnosis records sourced from Clinical DB (encounter_diagnosis)
   * 3. CodingProcedure records sourced from the charges just created
   * 4. Links charges to their corresponding coding procedures
   *
   * @param tenantId - Tenant UUID
   * @param encounterId - Encounter UUID from Clinical DB
   * @param charges - Array of charges created by posting rules
   * @param patientId - Patient UUID from Clinical DB
   * @returns Created coding session with counts of seeded records
   */
  async autoSeedCodingSession(
    tenantId: string,
    encounterId: string,
    charges: any[],
    patientId: string,
  ) {
    if (!encounterId) {
      this.logger.warn('No encounterId provided - skipping coding session auto-seeding');
      return null;
    }

    if (charges.length === 0) {
      this.logger.warn(`No charges created for encounter ${encounterId} - skipping coding session`);
      return null;
    }

    this.logger.log(
      `Auto-seeding coding session for encounter ${encounterId} with ${charges.length} charges`,
    );

    try {
      // Check if coding session already exists for this encounter
      const existingSession = await this.prisma.codingSession.findFirst({
        where: { tenantId, encounterId },
      });

      if (existingSession) {
        this.logger.log(
          `Coding session already exists for encounter ${encounterId} (${existingSession.id}). Appending new procedures.`,
        );
        // Append procedures to existing session
        const proceduresAdded = await this.addProceduresToSession(
          tenantId,
          existingSession.id,
          charges,
        );
        return {
          sessionId: existingSession.id,
          isNew: false,
          diagnosesAdded: 0,
          proceduresAdded,
        };
      }

      // 1. Create coding session
      const codingSession = await this.prisma.codingSession.create({
        data: {
          tenantId,
          encounterId,
          status: 'auto_generated', // Not yet reviewed by coder
          createdBy: 'SYSTEM',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      this.logger.log(`Created coding session ${codingSession.id} for encounter ${encounterId}`);

      // 2. Auto-seed diagnoses from Clinical DB
      const diagnosesAdded = await this.autoSeedDiagnoses(
        tenantId,
        codingSession.id,
        encounterId,
      );

      // 3. Auto-seed procedures from charges
      const proceduresAdded = await this.autoSeedProcedures(
        tenantId,
        codingSession.id,
        charges,
        encounterId,
      );

      this.logger.log(
        `Auto-seeding complete: ${diagnosesAdded} diagnoses, ${proceduresAdded} procedures`,
      );

      return {
        sessionId: codingSession.id,
        isNew: true,
        diagnosesAdded,
        proceduresAdded,
      };
    } catch (error) {
      this.logger.error(
        `Failed to auto-seed coding session for encounter ${encounterId}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      // Don't throw - we don't want coding failures to block charge creation
      return null;
    }
  }

  /**
   * Fetch encounter diagnoses from Clinical service and create CodingDiagnosis records
   */
  private async autoSeedDiagnoses(
    tenantId: string,
    codingSessionId: string,
    encounterId: string,
  ): Promise<number> {
    try {
      // Fetch encounter diagnoses from Clinical API
      // Uses internal API key to bypass user-context requirement (system-level call).
      // Route: GET /diagnoses/encounter/:encounterId (DiagnosisController)
      const response = await firstValueFrom(
        this.httpService.get<any[]>(`${this.clinicalApiUrl}/diagnoses/encounter/${encounterId}`, {
          headers: {
            'x-tenant-id': tenantId,
            'x-internal-api-key': process.env.INTERNAL_API_KEY ?? '',
          },
        }),
      );

      const clinicalDiagnoses = response?.data || [];

      if (clinicalDiagnoses.length === 0) {
        this.logger.warn(`No diagnoses found for encounter ${encounterId}`);
        return 0;
      }

      this.logger.log(`Found ${clinicalDiagnoses.length} diagnoses for encounter ${encounterId}`);

      // Create CodingDiagnosis records
      let count = 0;
      for (const [index, clinicalDx] of clinicalDiagnoses.entries()) {
        await this.prisma.codingDiagnosis.create({
          data: {
            tenantId,
            codingSessionId,
            sourceEncounterDiagnosisId: clinicalDx.id,
            diagnosisCode: clinicalDx.icd_code || clinicalDx.icdCode,
            diagnosisCodeType: clinicalDx.icd_version || clinicalDx.icdVersion || 'ICD10',
            diagnosisDisplay: clinicalDx.diagnosis_name || clinicalDx.diagnosisName,
            diagnosisDisplayAr: clinicalDx.diagnosis_name_ar || clinicalDx.diagnosisNameAr,
            diagnosisType: clinicalDx.diagnosis_type || clinicalDx.diagnosisType || 'secondary',
            sequence: index + 1,
            usedForBilling: true,
            createdBy: 'SYSTEM',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        count++;
      }

      this.logger.log(`Created ${count} CodingDiagnosis records`);
      return count;
    } catch (error) {
      this.logger.error(
        `Failed to fetch/seed diagnoses for encounter ${encounterId}: ${(error as Error).message}`,
      );
      // Return 0 instead of throwing - diagnoses not required for procedure coding
      return 0;
    }
  }

  /**
   * Create CodingProcedure records from charges and link charges to procedures
   */
  private async autoSeedProcedures(
    tenantId: string,
    codingSessionId: string,
    charges: any[],
    encounterId: string,
  ): Promise<number> {
    try {
      let count = 0;

      for (const [index, charge] of charges.entries()) {
        // Get billing item details
        const billingItem = await this.prisma.billingItem.findUnique({
          where: { id: charge.billingItemId },
        });

        if (!billingItem) {
          this.logger.warn(`Billing item ${charge.billingItemId} not found - skipping procedure`);
          continue;
        }

        // Create CodingProcedure
        const codingProcedure = await this.prisma.codingProcedure.create({
          data: {
            tenantId,
            codingSessionId,
            billingItemId: charge.billingItemId,
            procedureCode: billingItem.billingCode,
            procedureCodeType: billingItem.billingCodeType,
            procedureDisplay: billingItem.billingDescription,
            serviceDate: charge.chargeDate,
            sequence: index + 1,
            units: charge.quantity,
            createdBy: 'SYSTEM',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        // Link charge to coding procedure
        await this.prisma.charge.update({
          where: { id: charge.id },
          data: {
            codingProcedureId: codingProcedure.id,
            originalBillingItemId: charge.billingItemId, // Track what posting rules chose
            updatedAt: new Date(),
          },
        });

        count++;
      }

      this.logger.log(`Created ${count} CodingProcedure records and linked to charges`);
      return count;
    } catch (error) {
      this.logger.error(
        `Failed to seed procedures for session ${codingSessionId}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      // Don't throw - partial success is acceptable
      return 0;
    }
  }

  /**
   * Add procedures to existing coding session (when more charges are added later)
   */
  private async addProceduresToSession(
    tenantId: string,
    codingSessionId: string,
    charges: any[],
  ): Promise<number> {
    try {
      // Get current max sequence number
      const existingProcedures = await this.prisma.codingProcedure.findMany({
        where: { tenantId, codingSessionId },
        orderBy: { sequence: 'desc' },
        take: 1,
      });

      const startSequence = existingProcedures.length > 0 && existingProcedures[0]?.sequence
        ? existingProcedures[0].sequence + 1
        : 1;

      let count = 0;
      for (const [index, charge] of charges.entries()) {
        const billingItem = await this.prisma.billingItem.findUnique({
          where: { id: charge.billingItemId },
        });

        if (!billingItem) continue;

        const codingProcedure = await this.prisma.codingProcedure.create({
          data: {
            tenantId,
            codingSessionId,
            billingItemId: charge.billingItemId,
            procedureCode: billingItem.billingCode,
            procedureCodeType: billingItem.billingCodeType,
            procedureDisplay: billingItem.billingDescription,
            serviceDate: charge.chargeDate,
            sequence: startSequence + index,
            units: charge.quantity,
            createdBy: 'SYSTEM',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        await this.prisma.charge.update({
          where: { id: charge.id },
          data: {
            codingProcedureId: codingProcedure.id,
            originalBillingItemId: charge.billingItemId,
            updatedAt: new Date(),
          },
        });

        count++;
      }

      return count;
    } catch (error) {
      this.logger.error(
        `Failed to add procedures to session ${codingSessionId}: ${(error as Error).message}`,
      );
      return 0;
    }
  }

  /**
   * Get coding session for an encounter
   */
  async getCodingSessionByEncounter(tenantId: string, encounterId: string) {
    return this.prisma.codingSession.findFirst({
      where: { tenantId, encounterId },
      include: {
        diagnoses: {
          where: { usedForBilling: true },
          orderBy: { sequence: 'asc' },
        },
        procedures: {
          orderBy: { sequence: 'asc' },
          include: {
            billingItem: true,
            charges: true,
          },
        },
      },
    });
  }

  /**
   * Get coding sessions needing review (for coder inbox)
   */
  async getPendingCodingSessions(tenantId: string, limit: number = 50) {
    return this.prisma.codingSession.findMany({
      where: {
        tenantId,
        status: { in: ['auto_generated', 'in_progress'] },
      },
      include: {
        diagnoses: true,
        procedures: {
          include: {
            billingItem: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }

  /**
   * Find all coding sessions with filters
   */
  async findAllSessions(tenantId: string, filters: any) {
    const where: any = { tenantId };

    if (filters.status) where.status = filters.status;
    if (filters.encounterId) where.encounterId = filters.encounterId;
    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = new Date(filters.dateFrom);
      if (filters.dateTo) where.createdAt.lte = new Date(filters.dateTo);
    }

    return this.prisma.codingSession.findMany({
      where,
      include: {
        diagnoses: { where: { usedForBilling: true }, orderBy: { sequence: 'asc' } },
        procedures: { orderBy: { sequence: 'asc' }, include: { billingItem: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 100,
    });
  }

  /**
   * Find coding session by ID
   */
  async findSessionById(tenantId: string, sessionId: string) {
    return this.prisma.codingSession.findFirst({
      where: { tenantId, id: sessionId },
      include: {
        diagnoses: { orderBy: { sequence: 'asc' } },
        procedures: { orderBy: { sequence: 'asc' }, include: { billingItem: true, charges: true } },
      },
    });
  }

  /**
   * Start coder review (change status to in_progress)
   */
  async startReview(tenantId: string, sessionId: string, userId: string) {
    const session = await this.prisma.codingSession.update({
      where: { id: sessionId },
      data: {
        status: 'in_progress',
        assignedTo: userId,
        assignedAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        diagnoses: { orderBy: { sequence: 'asc' } },
        procedures: { orderBy: { sequence: 'asc' }, include: { billingItem: true } },
      },
    });

    // Create audit log
    await this.createAuditLog(tenantId, sessionId, userId, 'start_review', {
      previousStatus: 'auto_generated',
      newStatus: 'in_progress',
    });

    return session;
  }

  /**
   * Update coding session
   */
  async updateSession(tenantId: string, sessionId: string, dto: any, userId: string) {
    const updates: any = {
      updatedAt: new Date(),
      updatedBy: userId,
    };

    if (dto.status) updates.status = dto.status;
    if (dto.coderNotes) updates.codingNotes = dto.coderNotes;

    const session = await this.prisma.codingSession.update({
      where: { id: sessionId },
      data: updates,
      include: {
        diagnoses: { orderBy: { sequence: 'asc' } },
        procedures: { orderBy: { sequence: 'asc' }, include: { billingItem: true } },
      },
    });

    // Create audit log
    await this.createAuditLog(tenantId, sessionId, userId, 'update_session', { updates: dto });

    return session;
  }

  /**
   * Submit coding session for claim generation
   */
  async submitSession(tenantId: string, sessionId: string, dto: any, userId: string) {
    const session = await this.prisma.codingSession.update({
      where: { id: sessionId },
      data: {
        status: 'completed',
        codingNotes: dto.coderNotes || undefined,
        assignedTo: userId,
        completedAt: new Date(),
        updatedAt: new Date(),
        updatedBy: userId,
      },
      include: {
        diagnoses: { where: { usedForBilling: true }, orderBy: { sequence: 'asc' } },
        procedures: { orderBy: { sequence: 'asc' }, include: { billingItem: true, charges: true } },
      },
    });

    // Create audit log
    await this.createAuditLog(tenantId, sessionId, userId, 'submit_session', {
      generateClaim: dto.generateClaim,
    });

    // TODO: If dto.generateClaim is true, trigger claim generation workflow

    this.logger.log(`Coding session ${sessionId} submitted by ${userId}`);
    return session;
  }

  /**
   * Add diagnosis to coding session
   */
  async addDiagnosis(tenantId: string, sessionId: string, dto: any, userId: string) {
    const diagnosis = await this.prisma.codingDiagnosis.create({
      data: {
        tenantId,
        codingSessionId: sessionId,
        diagnosisCode: dto.diagnosisCode,
        diagnosisCodeType: dto.diagnosisCodeType,
        diagnosisDisplay: dto.diagnosisDisplay,
        diagnosisDisplayAr: dto.diagnosisDisplayAr,
        diagnosisType: dto.diagnosisType,
        sequence: dto.sequence,
        usedForBilling: dto.usedForBilling ?? true,
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create audit log
    await this.createAuditLog(tenantId, sessionId, userId, 'add_diagnosis', { diagnosis: dto });

    return diagnosis;
  }

  /**
   * Update diagnosis
   */
  async updateDiagnosis(diagnosisId: string, dto: any, userId: string) {
    const diagnosis = await this.prisma.codingDiagnosis.update({
      where: { id: diagnosisId },
      data: {
        ...dto,
        updatedAt: new Date(),
        updatedBy: userId,
      },
    });

    // Create audit log (get session ID first)
    const session = await this.prisma.codingSession.findFirst({
      where: { diagnoses: { some: { id: diagnosisId } } },
    });
    if (session) {
      await this.createAuditLog(session.tenantId, session.id, userId, 'update_diagnosis', {
        diagnosisId,
        updates: dto,
      });
    }

    return diagnosis;
  }

  /**
   * Delete diagnosis
   */
  async deleteDiagnosis(diagnosisId: string) {
    // Get session info for audit before deleting
    const diagnosis = await this.prisma.codingDiagnosis.findUnique({
      where: { id: diagnosisId },
      include: { codingSession: true },
    });

    await this.prisma.codingDiagnosis.delete({
      where: { id: diagnosisId },
    });

    // Create audit log
    if (diagnosis) {
      await this.createAuditLog(
        diagnosis.tenantId,
        diagnosis.codingSessionId,
        'SYSTEM',
        'delete_diagnosis',
        { diagnosisId, diagnosisCode: diagnosis.diagnosisCode },
      );
    }

    return { success: true };
  }

  /**
   * Add procedure to coding session
   */
  async addProcedure(tenantId: string, sessionId: string, dto: any, userId: string) {
    const procedure = await this.prisma.codingProcedure.create({
      data: {
        tenantId,
        codingSessionId: sessionId,
        billingItemId: dto.billingItemId,
        procedureCode: dto.procedureCode,
        procedureCodeType: dto.procedureCodeType,
        procedureDisplay: dto.procedureDisplay,
        procedureDisplayAr: dto.procedureDisplayAr,
        units: dto.units,
        sequence: dto.sequence,
        serviceDate: new Date(dto.serviceDate),
        modifier1: dto.modifier1,
        modifier2: dto.modifier2,
        modifier3: dto.modifier3,
        createdBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: { billingItem: true },
    });

    // Create audit log
    await this.createAuditLog(tenantId, sessionId, userId, 'add_procedure', { procedure: dto });

    return procedure;
  }

  /**
   * Update procedure
   */
  async updateProcedure(procedureId: string, dto: any, userId: string) {
    const updates: any = { ...dto, updatedAt: new Date(), updatedBy: userId };
    if (dto.serviceDate) updates.serviceDate = new Date(dto.serviceDate);

    const procedure = await this.prisma.codingProcedure.update({
      where: { id: procedureId },
      data: updates,
      include: { billingItem: true },
    });

    // Create audit log
    const session = await this.prisma.codingSession.findFirst({
      where: { procedures: { some: { id: procedureId } } },
    });
    if (session) {
      await this.createAuditLog(session.tenantId, session.id, userId, 'update_procedure', {
        procedureId,
        updates: dto,
      });
    }

    return procedure;
  }

  /**
   * Delete procedure
   */
  async deleteProcedure(procedureId: string) {
    // Get session info for audit before deleting
    const procedure = await this.prisma.codingProcedure.findUnique({
      where: { id: procedureId },
      include: { codingSession: true },
    });

    await this.prisma.codingProcedure.delete({
      where: { id: procedureId },
    });

    // Create audit log
    if (procedure) {
      await this.createAuditLog(
        procedure.tenantId,
        procedure.codingSessionId,
        'SYSTEM',
        'delete_procedure',
        { procedureId, procedureCode: procedure.procedureCode },
      );
    }

    return { success: true };
  }

  /**
   * Get audit trail for a coding session
   */
  async getSessionAudit(tenantId: string, sessionId: string) {
    return this.prisma.codingAuditLog.findMany({
      where: { tenantId, codingSessionId: sessionId },
      orderBy: { changedAt: 'desc' },
    });
  }

  /**
   * Get audit logs with filters
   */
  async getAuditLogs(tenantId: string, filters: any) {
    const where: any = { tenantId };

    if (filters.sessionId) where.codingSessionId = filters.sessionId;
    if (filters.userId) where.changedBy = filters.userId;
    if (filters.action) where.action = filters.action;
    if (filters.dateFrom || filters.dateTo) {
      where.changedAt = {};
      if (filters.dateFrom) where.changedAt.gte = filters.dateFrom;
      if (filters.dateTo) where.changedAt.lte = filters.dateTo;
    }

    return this.prisma.codingAuditLog.findMany({
      where,
      orderBy: { changedAt: 'desc' },
      take: 100,
    });
  }

  /**
   * Get coder productivity statistics
   */
  async getCoderProductivity(tenantId: string, filters: any) {
    const where: any = { tenantId, status: 'completed' };

    if (filters.userId) where.assignedTo = filters.userId;
    if (filters.dateFrom || filters.dateTo) {
      where.completedAt = {};
      if (filters.dateFrom) where.completedAt.gte = filters.dateFrom;
      if (filters.dateTo) where.completedAt.lte = filters.dateTo;
    }

    const sessions = await this.prisma.codingSession.findMany({
      where,
      include: {
        diagnoses: true,
        procedures: true,
      },
    });

    // Calculate statistics
    const stats: any = {
      totalSessions: sessions.length,
      totalDiagnoses: 0,
      totalProcedures: 0,
      byUser: {},
    };

    sessions.forEach((session) => {
      stats.totalDiagnoses += session.diagnoses.length;
      stats.totalProcedures += session.procedures.length;

      const userId = session.assignedTo || 'UNKNOWN';
      if (!stats.byUser[userId]) {
        stats.byUser[userId] = {
          sessionsCompleted: 0,
          diagnosesAdded: 0,
          proceduresAdded: 0,
        };
      }
      stats.byUser[userId].sessionsCompleted++;
      stats.byUser[userId].diagnosesAdded += session.diagnoses.length;
      stats.byUser[userId].proceduresAdded += session.procedures.length;
    });

    return stats;
  }

  /**
   * Get session statistics summary
   */
  async getSessionSummary(tenantId: string) {
    const [total, autoGenerated, inProgress, completed] = await Promise.all([
      this.prisma.codingSession.count({ where: { tenantId } }),
      this.prisma.codingSession.count({ where: { tenantId, status: 'auto_generated' } }),
      this.prisma.codingSession.count({ where: { tenantId, status: 'in_progress' } }),
      this.prisma.codingSession.count({ where: { tenantId, status: 'completed' } }),
    ]);

    return {
      total,
      byStatus: {
        auto_generated: autoGenerated,
        in_progress: inProgress,
        completed,
      },
      pending: autoGenerated + inProgress,
    };
  }

  /**
   * Create audit log entry
   */
  private async createAuditLog(
    tenantId: string,
    sessionId: string,
    userId: string,
    action: string,
    changes: any,
  ) {
    try {
      await this.prisma.codingAuditLog.create({
        data: {
          tenantId,
          codingSessionId: sessionId,
          entityType: 'session',
          entityId: sessionId,
          action,
          changedBy: userId,
          newValue: changes,
          changedAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create audit log: ${(error as Error).message}`);
      // Don't throw - audit logging should not block operations
    }
  }
}
