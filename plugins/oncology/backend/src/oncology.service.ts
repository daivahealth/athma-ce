import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { RequestContext } from '@zeal/shared-utils';

@Injectable()
export class OncologyService {
  private readonly logger = new Logger(OncologyService.name);

  constructor(private readonly prisma: PrismaService) {}

  private getTenantId(): string {
    const store = RequestContext.getStore();
    if (!store?.tenantId) throw new Error('Tenant context not available');
    return store.tenantId;
  }

  // ============================================
  // Tumor Staging
  // ============================================

  async listStagings(patientId?: string, page = 1, limit = 20) {
    const tenantId = this.getTenantId();
    const where: Record<string, unknown> = { tenantId };
    if (patientId) where.patientId = patientId;

    const [data, total] = await Promise.all([
      this.prisma.$queryRawUnsafe<any[]>(
        `SELECT * FROM plugin_oncology.tumor_staging WHERE tenant_id = $1 ${patientId ? 'AND patient_id = $2' : ''} ORDER BY staging_date DESC LIMIT $${patientId ? '3' : '2'} OFFSET $${patientId ? '4' : '3'}`,
        tenantId,
        ...(patientId ? [patientId] : []),
        limit,
        (page - 1) * limit,
      ),
      this.prisma.$queryRawUnsafe<[{ count: bigint }]>(
        `SELECT COUNT(*) as count FROM plugin_oncology.tumor_staging WHERE tenant_id = $1 ${patientId ? 'AND patient_id = $2' : ''}`,
        tenantId,
        ...(patientId ? [patientId] : []),
      ),
    ]);

    return {
      data,
      pagination: { page, limit, total: Number(total[0]?.count ?? 0) },
    };
  }

  async getStaging(id: string) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM plugin_oncology.tumor_staging WHERE id = $1::uuid AND tenant_id = $2`,
      id,
      tenantId,
    );
    if (!results.length) throw new NotFoundException(`Staging '${id}' not found`);
    return results[0];
  }

  async createStaging(data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `INSERT INTO plugin_oncology.tumor_staging (
        id, tenant_id, patient_id, encounter_id, provider_id,
        cancer_type, icd_code, snomed_code, body_site,
        staging_system, stage_group, t_category, n_category, m_category,
        grade, histology, biomarkers, staging_date, diagnosis_date,
        is_recurrence, status, notes, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4,
        $5, $6, $7, $8,
        $9, $10, $11, $12, $13,
        $14, $15, $16::jsonb, $17::date, $18::date,
        $19, $20, $21, NOW(), NOW()
      ) RETURNING *`,
      tenantId,
      data.patientId,
      data.encounterId ?? null,
      data.providerId ?? null,
      data.cancerType,
      data.icdCode ?? null,
      data.snomedCode ?? null,
      data.bodySite ?? null,
      data.stagingSystem,
      data.stageGroup ?? null,
      data.tCategory ?? null,
      data.nCategory ?? null,
      data.mCategory ?? null,
      data.grade ?? null,
      data.histology ?? null,
      JSON.stringify(data.biomarkers ?? {}),
      data.stagingDate,
      data.diagnosisDate ?? null,
      data.isRecurrence ?? false,
      data.status ?? 'active',
      data.notes ?? null,
    );
    return results[0];
  }

  // ============================================
  // Chemo Protocols
  // ============================================

  async listProtocols(cancerType?: string, page = 1, limit = 20) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM plugin_oncology.chemo_protocols WHERE tenant_id = $1 ${cancerType ? 'AND cancer_type = $2' : ''} AND is_active = true ORDER BY name LIMIT $${cancerType ? '3' : '2'} OFFSET $${cancerType ? '4' : '3'}`,
      tenantId,
      ...(cancerType ? [cancerType] : []),
      limit,
      (page - 1) * limit,
    );
    return { data: results };
  }

  async getProtocol(id: string) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM plugin_oncology.chemo_protocols WHERE id = $1::uuid AND tenant_id = $2`,
      id,
      tenantId,
    );
    if (!results.length) throw new NotFoundException(`Protocol '${id}' not found`);
    return results[0];
  }

  async createProtocol(data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `INSERT INTO plugin_oncology.chemo_protocols (
        id, tenant_id, code, name, description, cancer_type, intent,
        regimen, total_cycles, cycle_duration_days, premedications,
        supportive_care, emetogenic_risk, is_active, created_at, updated_at, created_by
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, $6,
        $7::jsonb, $8, $9, $10::jsonb,
        $11::jsonb, $12, $13, NOW(), NOW(), $14
      ) RETURNING *`,
      tenantId,
      data.code,
      data.name,
      data.description ?? null,
      data.cancerType,
      data.intent,
      JSON.stringify(data.regimen),
      data.totalCycles,
      data.cycleDurationDays,
      JSON.stringify(data.premedications ?? []),
      JSON.stringify(data.supportiveCare ?? []),
      data.emetogenicRisk ?? null,
      data.isActive ?? true,
      data.createdBy ?? null,
    );
    return results[0];
  }

  // ============================================
  // Chemo Orders
  // ============================================

  async listChemoOrders(filters: { patientId?: string; status?: string; date?: string } = {}, page = 1, limit = 20) {
    const tenantId = this.getTenantId();
    let query = `SELECT co.*, cp.name as protocol_name, cp.code as protocol_code
      FROM plugin_oncology.chemo_orders co
      JOIN plugin_oncology.chemo_protocols cp ON co.protocol_id = cp.id
      WHERE co.tenant_id = $1`;
    const params: unknown[] = [tenantId];
    let paramIdx = 2;

    if (filters.patientId) {
      query += ` AND co.patient_id = $${paramIdx++}`;
      params.push(filters.patientId);
    }
    if (filters.status) {
      query += ` AND co.status = $${paramIdx++}`;
      params.push(filters.status);
    }
    if (filters.date) {
      query += ` AND co.scheduled_date = $${paramIdx++}::date`;
      params.push(filters.date);
    }

    query += ` ORDER BY co.scheduled_date DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
    params.push(limit, (page - 1) * limit);

    const results = await this.prisma.$queryRawUnsafe<any[]>(query, ...params);
    return { data: results };
  }

  async createChemoOrder(data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `INSERT INTO plugin_oncology.chemo_orders (
        id, tenant_id, patient_id, encounter_id, protocol_id, ordering_provider,
        cycle_number, day_number, scheduled_date,
        bsa, weight, height, creatinine_clearance,
        dose_adjustments, pre_chemo_checklist,
        status, notes, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4::uuid, $5,
        $6, $7, $8::date,
        $9, $10, $11, $12,
        $13::jsonb, $14::jsonb,
        $15, $16, NOW(), NOW()
      ) RETURNING *`,
      tenantId,
      data.patientId,
      data.encounterId ?? null,
      data.protocolId,
      data.orderingProvider,
      data.cycleNumber,
      data.dayNumber,
      data.scheduledDate,
      data.bsa ?? null,
      data.weight ?? null,
      data.height ?? null,
      data.creatinineClearance ?? null,
      JSON.stringify(data.doseAdjustments ?? []),
      JSON.stringify(data.preChemoChecklist ?? {}),
      data.status ?? 'pending',
      data.notes ?? null,
    );
    return results[0];
  }

  // ============================================
  // Tumor Board
  // ============================================

  async listTumorBoardCases(filters: { status?: string; date?: string } = {}, page = 1, limit = 20) {
    const tenantId = this.getTenantId();
    let query = `SELECT * FROM plugin_oncology.tumor_board_cases WHERE tenant_id = $1`;
    const params: unknown[] = [tenantId];
    let paramIdx = 2;

    if (filters.status) {
      query += ` AND status = $${paramIdx++}`;
      params.push(filters.status);
    }
    if (filters.date) {
      query += ` AND meeting_date = $${paramIdx++}::date`;
      params.push(filters.date);
    }

    query += ` ORDER BY meeting_date DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
    params.push(limit, (page - 1) * limit);

    const results = await this.prisma.$queryRawUnsafe<any[]>(query, ...params);
    return { data: results };
  }

  async createTumorBoardCase(data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `INSERT INTO plugin_oncology.tumor_board_cases (
        id, tenant_id, patient_id, staging_id,
        meeting_date, presented_by, attendees,
        clinical_summary, imaging_findings, pathology_report,
        recommendation, treatment_plan, decision,
        follow_up_actions, status, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), $1, $2, $3,
        $4::date, $5, $6::jsonb,
        $7, $8, $9,
        $10, $11::jsonb, $12,
        $13::jsonb, $14, NOW(), NOW()
      ) RETURNING *`,
      tenantId,
      data.patientId,
      data.stagingId ?? null,
      data.meetingDate,
      data.presentedBy,
      JSON.stringify(data.attendees ?? []),
      data.clinicalSummary ?? null,
      data.imagingFindings ?? null,
      data.pathologyReport ?? null,
      data.recommendation ?? null,
      JSON.stringify(data.treatmentPlan ?? {}),
      data.decision ?? null,
      JSON.stringify(data.followUpActions ?? []),
      data.status ?? 'scheduled',
    );
    return results[0];
  }
}
