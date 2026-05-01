import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
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
  // Cancer Diagnosis
  // ============================================

  async listCancerDiagnoses(
    filters: { patientId?: string; clinicalStatus?: string; cancerType?: string } = {},
    page = 1,
    limit = 20,
  ) {
    const tenantId = this.getTenantId();
    let query = `SELECT * FROM plugin_oncology.cancer_diagnoses WHERE tenant_id = $1`;
    const params: unknown[] = [tenantId];
    let paramIdx = 2;

    if (filters.patientId) {
      query += ` AND patient_id = $${paramIdx++}`;
      params.push(filters.patientId);
    }
    if (filters.clinicalStatus) {
      query += ` AND clinical_status = $${paramIdx++}`;
      params.push(filters.clinicalStatus);
    }
    if (filters.cancerType) {
      query += ` AND cancer_type ILIKE $${paramIdx++}`;
      params.push(`%${filters.cancerType}%`);
    }

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count');

    query += ` ORDER BY diagnosis_date DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
    params.push(limit, (page - 1) * limit);

    const [data, total] = await Promise.all([
      this.prisma.$queryRawUnsafe<any[]>(query, ...params),
      this.prisma.$queryRawUnsafe<[{ count: bigint }]>(
        countQuery,
        ...params.slice(0, -2),
      ),
    ]);

    return {
      data,
      pagination: { page, limit, total: Number(total[0]?.count ?? 0) },
    };
  }

  async getCancerDiagnosis(id: string) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT cd.*,
        (SELECT json_agg(ts ORDER BY ts.staging_date DESC)
         FROM plugin_oncology.tumor_staging ts
         WHERE ts.cancer_diagnosis_id = cd.id AND ts.tenant_id = cd.tenant_id
        ) as stagings,
        (SELECT json_agg(cp ORDER BY cp.created_at DESC)
         FROM plugin_oncology.oncology_care_plans cp
         WHERE cp.cancer_diagnosis_id = cd.id AND cp.tenant_id = cd.tenant_id AND cp.status != 'revised'
        ) as care_plans
      FROM plugin_oncology.cancer_diagnoses cd
      WHERE cd.id = $1::uuid AND cd.tenant_id = $2`,
      id,
      tenantId,
    );
    if (!results.length) throw new NotFoundException(`Cancer diagnosis '${id}' not found`);
    return results[0];
  }

  async createCancerDiagnosis(data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `INSERT INTO plugin_oncology.cancer_diagnoses (
        id, tenant_id, patient_id, encounter_id, encounter_diagnosis_id,
        cancer_type, primary_site, primary_site_code, laterality,
        histology_morphology, morphology_code, icd_code, snomed_code,
        diagnosis_date, clinical_status, verification_status,
        grade, metastatic_status, is_recurrence,
        biomarkers, ecog_at_diagnosis, diagnosed_by, notes,
        created_at, updated_at
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4,
        $5, $6, $7, $8,
        $9, $10, $11, $12,
        $13::date, $14, $15,
        $16, $17, $18,
        $19::jsonb, $20, $21, $22,
        NOW(), NOW()
      ) RETURNING *`,
      tenantId,
      data.patientId,
      data.encounterId ?? null,
      data.encounterDiagnosisId ?? null,
      data.cancerType,
      data.primarySite,
      data.primarySiteCode ?? null,
      data.laterality ?? null,
      data.histologyMorphology ?? null,
      data.morphologyCode ?? null,
      data.icdCode ?? null,
      data.snomedCode ?? null,
      data.diagnosisDate,
      data.clinicalStatus ?? 'active',
      data.verificationStatus ?? 'confirmed',
      data.grade ?? null,
      data.metastaticStatus ?? 'unknown',
      data.isRecurrence ?? false,
      JSON.stringify(data.biomarkers ?? {}),
      data.ecogAtDiagnosis ?? null,
      data.diagnosedBy,
      data.notes ?? null,
    );
    return results[0];
  }

  async updateCancerDiagnosis(id: string, data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const existing = await this.getCancerDiagnosis(id);
    if (!existing) throw new NotFoundException(`Cancer diagnosis '${id}' not found`);

    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.cancer_diagnoses SET
        cancer_type = COALESCE($3, cancer_type),
        primary_site = COALESCE($4, primary_site),
        primary_site_code = COALESCE($5, primary_site_code),
        laterality = COALESCE($6, laterality),
        histology_morphology = COALESCE($7, histology_morphology),
        morphology_code = COALESCE($8, morphology_code),
        icd_code = COALESCE($9, icd_code),
        snomed_code = COALESCE($10, snomed_code),
        diagnosis_date = COALESCE($11::date, diagnosis_date),
        clinical_status = COALESCE($12, clinical_status),
        verification_status = COALESCE($13, verification_status),
        grade = COALESCE($14, grade),
        metastatic_status = COALESCE($15, metastatic_status),
        is_recurrence = COALESCE($16, is_recurrence),
        biomarkers = COALESCE($17::jsonb, biomarkers),
        ecog_at_diagnosis = COALESCE($18, ecog_at_diagnosis),
        notes = COALESCE($19, notes),
        updated_at = NOW()
      WHERE id = $1::uuid AND tenant_id = $2
      RETURNING *`,
      id,
      tenantId,
      data.cancerType ?? null,
      data.primarySite ?? null,
      data.primarySiteCode ?? null,
      data.laterality ?? null,
      data.histologyMorphology ?? null,
      data.morphologyCode ?? null,
      data.icdCode ?? null,
      data.snomedCode ?? null,
      data.diagnosisDate ?? null,
      data.clinicalStatus ?? null,
      data.verificationStatus ?? null,
      data.grade ?? null,
      data.metastaticStatus ?? null,
      data.isRecurrence ?? null,
      data.biomarkers ? JSON.stringify(data.biomarkers) : null,
      data.ecogAtDiagnosis ?? null,
      data.notes ?? null,
    );
    return results[0];
  }

  // ============================================
  // Oncology Registry
  // ============================================

  async listRegistry(
    filters: { cancerType?: string; clinicalStatus?: string; search?: string } = {},
    page = 1,
    limit = 20,
  ) {
    const tenantId = this.getTenantId();
    let query = `
      SELECT cd.*,
        (SELECT ts.stage_group FROM plugin_oncology.tumor_staging ts
         WHERE ts.cancer_diagnosis_id = cd.id AND ts.tenant_id = cd.tenant_id
         ORDER BY ts.staging_date DESC LIMIT 1
        ) as latest_stage,
        (SELECT ts.staging_system FROM plugin_oncology.tumor_staging ts
         WHERE ts.cancer_diagnosis_id = cd.id AND ts.tenant_id = cd.tenant_id
         ORDER BY ts.staging_date DESC LIMIT 1
        ) as latest_staging_system,
        (SELECT cp.status FROM plugin_oncology.oncology_care_plans cp
         WHERE cp.cancer_diagnosis_id = cd.id AND cp.tenant_id = cd.tenant_id
         AND cp.status IN ('draft', 'active', 'on_hold')
         ORDER BY cp.created_at DESC LIMIT 1
        ) as care_plan_status
      FROM plugin_oncology.cancer_diagnoses cd
      WHERE cd.tenant_id = $1`;
    const params: unknown[] = [tenantId];
    let paramIdx = 2;

    if (filters.cancerType) {
      query += ` AND cd.cancer_type ILIKE $${paramIdx++}`;
      params.push(`%${filters.cancerType}%`);
    }
    if (filters.clinicalStatus) {
      query += ` AND cd.clinical_status = $${paramIdx++}`;
      params.push(filters.clinicalStatus);
    }

    const countQuery = `SELECT COUNT(*) as count FROM plugin_oncology.cancer_diagnoses cd WHERE cd.tenant_id = $1`
      + (filters.cancerType ? ` AND cd.cancer_type ILIKE $2` : '')
      + (filters.clinicalStatus ? ` AND cd.clinical_status = $${filters.cancerType ? 3 : 2}` : '');

    query += ` ORDER BY cd.diagnosis_date DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
    params.push(limit, (page - 1) * limit);

    const [data, total] = await Promise.all([
      this.prisma.$queryRawUnsafe<any[]>(query, ...params),
      this.prisma.$queryRawUnsafe<[{ count: bigint }]>(
        countQuery,
        ...params.slice(0, -2),
      ),
    ]);

    return {
      data,
      pagination: { page, limit, total: Number(total[0]?.count ?? 0) },
    };
  }

  async getPatientCancerSummary(patientId: string) {
    const tenantId = this.getTenantId();

    const [diagnoses, stagings, tumorBoardCases, carePlans] = await Promise.all([
      this.prisma.$queryRawUnsafe<any[]>(
        `SELECT * FROM plugin_oncology.cancer_diagnoses WHERE tenant_id = $1 AND patient_id = $2 ORDER BY diagnosis_date DESC`,
        tenantId, patientId,
      ),
      this.prisma.$queryRawUnsafe<any[]>(
        `SELECT * FROM plugin_oncology.tumor_staging WHERE tenant_id = $1 AND patient_id = $2 ORDER BY staging_date DESC`,
        tenantId, patientId,
      ),
      this.prisma.$queryRawUnsafe<any[]>(
        `SELECT * FROM plugin_oncology.tumor_board_cases WHERE tenant_id = $1 AND patient_id = $2 ORDER BY meeting_date DESC`,
        tenantId, patientId,
      ),
      this.prisma.$queryRawUnsafe<any[]>(
        `SELECT * FROM plugin_oncology.oncology_care_plans WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC`,
        tenantId, patientId,
      ),
    ]);

    return { diagnoses, stagings, tumorBoardCases, carePlans };
  }

  // ============================================
  // Tumor Staging
  // ============================================

  async listStagings(filters: { patientId?: string; cancerDiagnosisId?: string } = {}, page = 1, limit = 20) {
    const tenantId = this.getTenantId();
    let query = `
      SELECT ts.*, cd.cancer_type, cd.primary_site
      FROM plugin_oncology.tumor_staging ts
      JOIN plugin_oncology.cancer_diagnoses cd ON ts.cancer_diagnosis_id = cd.id
      WHERE ts.tenant_id = $1`;
    const params: unknown[] = [tenantId];
    let paramIdx = 2;

    if (filters.patientId) {
      query += ` AND ts.patient_id = $${paramIdx++}`;
      params.push(filters.patientId);
    }
    if (filters.cancerDiagnosisId) {
      query += ` AND ts.cancer_diagnosis_id = $${paramIdx++}::uuid`;
      params.push(filters.cancerDiagnosisId);
    }

    const countParts = [`SELECT COUNT(*) as count FROM plugin_oncology.tumor_staging ts WHERE ts.tenant_id = $1`];
    if (filters.patientId) countParts.push(`AND ts.patient_id = $2`);
    if (filters.cancerDiagnosisId) countParts.push(`AND ts.cancer_diagnosis_id = $${filters.patientId ? 3 : 2}::uuid`);

    query += ` ORDER BY ts.staging_date DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
    params.push(limit, (page - 1) * limit);

    const [data, total] = await Promise.all([
      this.prisma.$queryRawUnsafe<any[]>(query, ...params),
      this.prisma.$queryRawUnsafe<[{ count: bigint }]>(
        countParts.join(' '),
        ...params.slice(0, -2),
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
      `SELECT ts.*, cd.cancer_type, cd.primary_site
       FROM plugin_oncology.tumor_staging ts
       JOIN plugin_oncology.cancer_diagnoses cd ON ts.cancer_diagnosis_id = cd.id
       WHERE ts.id = $1::uuid AND ts.tenant_id = $2`,
      id,
      tenantId,
    );
    if (!results.length) throw new NotFoundException(`Staging '${id}' not found`);
    return results[0];
  }

  async createStaging(data: Record<string, unknown>) {
    const tenantId = this.getTenantId();

    if (!data.cancerDiagnosisId) {
      throw new BadRequestException('cancerDiagnosisId is required');
    }

    const diagExists = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT id FROM plugin_oncology.cancer_diagnoses WHERE id = $1::uuid AND tenant_id = $2`,
      data.cancerDiagnosisId, tenantId,
    );
    if (!diagExists.length) {
      throw new NotFoundException(`Cancer diagnosis '${data.cancerDiagnosisId}' not found`);
    }

    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `INSERT INTO plugin_oncology.tumor_staging (
        id, tenant_id, cancer_diagnosis_id, patient_id, encounter_id, provider_id,
        staging_system, staging_edition, staging_type,
        stage_group, t_category, n_category, m_category,
        body_site, grade, histology,
        staging_date, status, notes, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), $1, $2::uuid, $3, $4, $5,
        $6, $7, $8,
        $9, $10, $11, $12,
        $13, $14, $15,
        $16::date, $17, $18, NOW(), NOW()
      ) RETURNING *`,
      tenantId,
      data.cancerDiagnosisId,
      data.patientId,
      data.encounterId ?? null,
      data.providerId ?? null,
      data.stagingSystem,
      data.stagingEdition ?? null,
      data.stagingType ?? 'clinical',
      data.stageGroup ?? null,
      data.tCategory ?? null,
      data.nCategory ?? null,
      data.mCategory ?? null,
      data.bodySite ?? null,
      data.grade ?? null,
      data.histology ?? null,
      data.stagingDate,
      data.status ?? 'active',
      data.notes ?? null,
    );
    return results[0];
  }

  // ============================================
  // Oncology Care Plans
  // ============================================

  async listCarePlans(
    filters: { patientId?: string; status?: string; treatmentIntent?: string; cancerDiagnosisId?: string } = {},
    page = 1,
    limit = 20,
  ) {
    const tenantId = this.getTenantId();
    let query = `
      SELECT cp.*, cd.cancer_type, cd.primary_site
      FROM plugin_oncology.oncology_care_plans cp
      JOIN plugin_oncology.cancer_diagnoses cd ON cp.cancer_diagnosis_id = cd.id
      WHERE cp.tenant_id = $1`;
    const params: unknown[] = [tenantId];
    let paramIdx = 2;

    if (filters.patientId) {
      query += ` AND cp.patient_id = $${paramIdx++}`;
      params.push(filters.patientId);
    }
    if (filters.status) {
      query += ` AND cp.status = $${paramIdx++}`;
      params.push(filters.status);
    }
    if (filters.treatmentIntent) {
      query += ` AND cp.treatment_intent = $${paramIdx++}`;
      params.push(filters.treatmentIntent);
    }
    if (filters.cancerDiagnosisId) {
      query += ` AND cp.cancer_diagnosis_id = $${paramIdx++}::uuid`;
      params.push(filters.cancerDiagnosisId);
    }

    query += ` ORDER BY cp.created_at DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
    params.push(limit, (page - 1) * limit);

    const data = await this.prisma.$queryRawUnsafe<any[]>(query, ...params);
    return { data };
  }

  async getCarePlan(id: string) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT cp.*, cd.cancer_type, cd.primary_site
       FROM plugin_oncology.oncology_care_plans cp
       JOIN plugin_oncology.cancer_diagnoses cd ON cp.cancer_diagnosis_id = cd.id
       WHERE cp.id = $1::uuid AND cp.tenant_id = $2`,
      id,
      tenantId,
    );
    if (!results.length) throw new NotFoundException(`Care plan '${id}' not found`);
    return results[0];
  }

  async createCarePlan(data: Record<string, unknown>) {
    const tenantId = this.getTenantId();

    if (!data.cancerDiagnosisId) {
      throw new BadRequestException('cancerDiagnosisId is required');
    }

    const diagExists = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT id FROM plugin_oncology.cancer_diagnoses WHERE id = $1::uuid AND tenant_id = $2`,
      data.cancerDiagnosisId, tenantId,
    );
    if (!diagExists.length) {
      throw new NotFoundException(`Cancer diagnosis '${data.cancerDiagnosisId}' not found`);
    }

    const planNumber = await this.generatePlanNumber(tenantId);

    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `INSERT INTO plugin_oncology.oncology_care_plans (
        id, tenant_id, patient_id, cancer_diagnosis_id, tumor_board_case_id,
        plan_number, version, parent_plan_id,
        treatment_intent, oncology_subspecialty,
        planned_modalities, planned_cycles, cycle_duration_days,
        milestones, follow_up_schedule,
        status, start_date, end_date,
        created_by, notes, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), $1, $2, $3::uuid, $4,
        $5, $6, $7,
        $8, $9,
        $10::jsonb, $11, $12,
        $13::jsonb, $14::jsonb,
        $15, $16::date, $17::date,
        $18, $19, NOW(), NOW()
      ) RETURNING *`,
      tenantId,
      data.patientId,
      data.cancerDiagnosisId,
      data.tumorBoardCaseId ?? null,
      planNumber,
      data.version ?? 1,
      data.parentPlanId ?? null,
      data.treatmentIntent,
      data.oncologySubspecialty ?? null,
      JSON.stringify(data.plannedModalities ?? []),
      data.plannedCycles ?? null,
      data.cycleDurationDays ?? null,
      JSON.stringify(data.milestones ?? []),
      JSON.stringify(data.followUpSchedule ?? []),
      data.status ?? 'draft',
      data.startDate ?? null,
      data.endDate ?? null,
      data.createdBy,
      data.notes ?? null,
    );
    return results[0];
  }

  async updateCarePlan(id: string, data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const existing = await this.getCarePlan(id);
    if (!existing) throw new NotFoundException(`Care plan '${id}' not found`);

    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.oncology_care_plans SET
        treatment_intent = COALESCE($3, treatment_intent),
        oncology_subspecialty = COALESCE($4, oncology_subspecialty),
        planned_modalities = COALESCE($5::jsonb, planned_modalities),
        planned_cycles = COALESCE($6, planned_cycles),
        cycle_duration_days = COALESCE($7, cycle_duration_days),
        milestones = COALESCE($8::jsonb, milestones),
        follow_up_schedule = COALESCE($9::jsonb, follow_up_schedule),
        status = COALESCE($10, status),
        start_date = COALESCE($11::date, start_date),
        end_date = COALESCE($12::date, end_date),
        notes = COALESCE($13, notes),
        updated_at = NOW()
      WHERE id = $1::uuid AND tenant_id = $2
      RETURNING *`,
      id,
      tenantId,
      data.treatmentIntent ?? null,
      data.oncologySubspecialty ?? null,
      data.plannedModalities ? JSON.stringify(data.plannedModalities) : null,
      data.plannedCycles ?? null,
      data.cycleDurationDays ?? null,
      data.milestones ? JSON.stringify(data.milestones) : null,
      data.followUpSchedule ? JSON.stringify(data.followUpSchedule) : null,
      data.status ?? null,
      data.startDate ?? null,
      data.endDate ?? null,
      data.notes ?? null,
    );
    return results[0];
  }

  async approveCarePlan(id: string, approvedBy: string) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.oncology_care_plans SET
        status = 'active',
        approved_by = $3,
        approved_at = NOW(),
        updated_at = NOW()
      WHERE id = $1::uuid AND tenant_id = $2 AND status = 'draft'
      RETURNING *`,
      id,
      tenantId,
      approvedBy,
    );
    if (!results.length) throw new NotFoundException(`Care plan '${id}' not found or not in draft status`);
    return results[0];
  }

  async reviseCarePlan(id: string, data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const existing = await this.getCarePlan(id);
    if (!existing) throw new NotFoundException(`Care plan '${id}' not found`);

    await this.prisma.$queryRawUnsafe(
      `UPDATE plugin_oncology.oncology_care_plans SET status = 'revised', updated_at = NOW() WHERE id = $1::uuid AND tenant_id = $2`,
      id, tenantId,
    );

    return this.createCarePlan({
      ...data,
      patientId: existing.patient_id,
      cancerDiagnosisId: existing.cancer_diagnosis_id,
      tumorBoardCaseId: data.tumorBoardCaseId ?? existing.tumor_board_case_id,
      parentPlanId: id,
      version: (existing.version ?? 1) + 1,
      createdBy: data.createdBy,
    });
  }

  private async generatePlanNumber(tenantId: string): Promise<string> {
    const now = new Date();
    const prefix = `OCP-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const result = await this.prisma.$queryRawUnsafe<[{ count: bigint }]>(
      `SELECT COUNT(*) as count FROM plugin_oncology.oncology_care_plans WHERE tenant_id = $1 AND plan_number LIKE $2`,
      tenantId, `${prefix}%`,
    );
    const seq = Number(result[0]?.count ?? 0) + 1;
    return `${prefix}-${String(seq).padStart(5, '0')}`;
  }

  // ============================================
  // Tumor Board
  // ============================================

  async listTumorBoardCases(filters: { status?: string; date?: string; patientId?: string } = {}, page = 1, limit = 20) {
    const tenantId = this.getTenantId();
    let query = `
      SELECT tbc.*, cd.cancer_type, cd.primary_site
      FROM plugin_oncology.tumor_board_cases tbc
      JOIN plugin_oncology.cancer_diagnoses cd ON tbc.cancer_diagnosis_id = cd.id
      WHERE tbc.tenant_id = $1`;
    const params: unknown[] = [tenantId];
    let paramIdx = 2;

    if (filters.status) {
      query += ` AND tbc.status = $${paramIdx++}`;
      params.push(filters.status);
    }
    if (filters.date) {
      query += ` AND tbc.meeting_date = $${paramIdx++}::date`;
      params.push(filters.date);
    }
    if (filters.patientId) {
      query += ` AND tbc.patient_id = $${paramIdx++}`;
      params.push(filters.patientId);
    }

    query += ` ORDER BY tbc.meeting_date DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
    params.push(limit, (page - 1) * limit);

    const results = await this.prisma.$queryRawUnsafe<any[]>(query, ...params);
    return { data: results };
  }

  async createTumorBoardCase(data: Record<string, unknown>) {
    const tenantId = this.getTenantId();

    if (!data.cancerDiagnosisId) {
      throw new BadRequestException('cancerDiagnosisId is required');
    }

    const diagExists = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT id FROM plugin_oncology.cancer_diagnoses WHERE id = $1::uuid AND tenant_id = $2`,
      data.cancerDiagnosisId, tenantId,
    );
    if (!diagExists.length) {
      throw new NotFoundException(`Cancer diagnosis '${data.cancerDiagnosisId}' not found`);
    }

    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `INSERT INTO plugin_oncology.tumor_board_cases (
        id, tenant_id, patient_id, cancer_diagnosis_id, staging_id,
        meeting_date, presented_by, attendees,
        clinical_summary, imaging_findings, pathology_report, molecular_profile,
        mdt_recommendation, treatment_intent, recommended_pathway,
        treatment_plan, decision, review_outcome,
        follow_up_actions, status, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), $1, $2, $3::uuid, $4,
        $5::date, $6, $7::jsonb,
        $8, $9, $10, $11,
        $12, $13, $14::jsonb,
        $15::jsonb, $16, $17,
        $18::jsonb, $19, NOW(), NOW()
      ) RETURNING *`,
      tenantId,
      data.patientId,
      data.cancerDiagnosisId,
      data.stagingId ?? null,
      data.meetingDate,
      data.presentedBy,
      JSON.stringify(data.attendees ?? []),
      data.clinicalSummary ?? null,
      data.imagingFindings ?? null,
      data.pathologyReport ?? null,
      data.molecularProfile ?? null,
      data.mdtRecommendation ?? null,
      data.treatmentIntent ?? null,
      JSON.stringify(data.recommendedPathway ?? []),
      JSON.stringify(data.treatmentPlan ?? {}),
      data.decision ?? null,
      data.reviewOutcome ?? null,
      JSON.stringify(data.followUpActions ?? []),
      data.status ?? 'scheduled',
    );
    return results[0];
  }

  // ============================================
  // Chemo Protocols (Phase 2 — kept for backward compat)
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
  // Chemo Orders (Phase 2 — kept for backward compat)
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
}
