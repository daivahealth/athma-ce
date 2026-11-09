import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { RequestContext } from '@zeal/shared-utils';
import { deriveLegacyColumns, normalizeProtocolRow, parsePhases, regimenForCycle } from './protocol-phases';
import {
  ChemoOrderRuleError,
  ChemoOrderSnapshot,
  assertCanApprove,
  assertCanCancel,
  assertCanEdit,
  assertCanHold,
  assertCanResume,
  assertCanStart,
  assertCanSubmit,
  assertCanVerify,
  resolveInitialStatus,
} from './chemo-order-rules';
import { OncologySettingsService } from './oncology-settings';
import {
  CandidateEvidence,
  CandidateSourceType,
  classifyImaging,
  classifyPathology,
  groupByPatient,
  isCancerIcdCode,
  isCandidateSourceType,
} from './registry-candidates';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Matches PatientDisplayDto from @zeal/contracts — defined locally because the plugin
// directory is outside backend/node_modules and cannot resolve @zeal/contracts at runtime.
interface PatientDisplayDto {
  patientId: string;
  mrn: string;
  firstName: string;
  lastName: string;
  displayName: string;
  age: number;
  dateOfBirth: string;
  gender: string;
  phoneNumber?: string;
  email?: string;
  nationalId?: string;
  nationalIdType?: string;
  nationality?: string;
  preferredLanguage?: string;
}

@Injectable()
export class OncologyService {
  private readonly logger = new Logger(OncologyService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly settings: OncologySettingsService,
  ) {}

  private getTenantId(): string {
    const store = RequestContext.getStore();
    if (!store?.tenantId) throw new Error('Tenant context not available');
    return store.tenantId;
  }

  private getCurrentUserId(): string | null {
    const id = RequestContext.getUserId();
    return id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) ? id : null;
  }

  /** Runs a chemo-order rule guard, surfacing rule violations as 400s. */
  private rule<T>(fn: () => T): T {
    try {
      return fn();
    } catch (err) {
      if (err instanceof ChemoOrderRuleError) throw new BadRequestException(err.message);
      throw err;
    }
  }

  /** Loads the columns the chemo-order rule guards need. */
  private async getOrderSnapshot(id: string, tenantId: string): Promise<ChemoOrderSnapshot & { id: string }> {
    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT id, status, ordering_provider, approved_by, verified_by, second_verified_by, pre_chemo_checklist
       FROM plugin_oncology.chemo_orders WHERE id = $1::uuid AND tenant_id = $2::uuid`,
      id, tenantId,
    );
    if (!rows.length) throw new NotFoundException(`Chemo order '${id}' not found`);
    return rows[0];
  }

  private calculateAge(dateOfBirth: Date | string): number {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  /** Keeps a treatment-schedule day in step with its chemo order (no-op for unscheduled orders). */
  private async syncTreatmentDay(orderId: string, orderOutcome: 'ordered' | 'given' | 'held' | 'cancelled') {
    // A cancelled order frees the day so it can be ordered again
    await this.prisma.$executeRawUnsafe(
      orderOutcome === 'cancelled'
        ? `UPDATE plugin_oncology.treatment_days SET status = 'planned', chemo_order_id = NULL, updated_at = NOW() WHERE chemo_order_id = $1::uuid`
        : `UPDATE plugin_oncology.treatment_days SET status = $2, updated_at = NOW() WHERE chemo_order_id = $1::uuid`,
      ...(orderOutcome === 'cancelled' ? [orderId] : [orderId, orderOutcome]),
    );
  }

  buildPatientDisplay(row: Record<string, any>): PatientDisplayDto | null {
    if (!row.patient_mrn) return null;
    return {
      patientId: row.patient_id,
      mrn: row.patient_mrn,
      firstName: row.patient_first_name,
      lastName: row.patient_last_name,
      displayName: row.patient_display_name || `${row.patient_first_name} ${row.patient_last_name}`,
      age: row.patient_date_of_birth ? this.calculateAge(row.patient_date_of_birth) : 0,
      dateOfBirth: row.patient_date_of_birth
        ? new Date(row.patient_date_of_birth).toISOString().substring(0, 10)
        : '',
      gender: row.patient_gender,
      phoneNumber: row.patient_phone_number || undefined,
      email: row.patient_email || undefined,
      nationalId: row.patient_national_id || undefined,
      nationalIdType: row.patient_national_id_type || undefined,
      nationality: row.patient_nationality || undefined,
      preferredLanguage: row.patient_preferred_language || undefined,
    };
  }

  private async logTimelineEvent(event: {
    patientId: string;
    cancerDiagnosisId?: string | null;
    eventType: string;
    eventDate: Date | string;
    title: string;
    description?: string;
    sourceEntity?: string;
    sourceId?: string;
    metadata?: Record<string, unknown>;
    severity?: 'milestone' | 'info' | 'warning' | 'adverse';
  }): Promise<void> {
    try {
      const tenantId = this.getTenantId();
      const userId = this.getCurrentUserId();
      await this.prisma.$queryRawUnsafe(
        `INSERT INTO plugin_oncology.cancer_timeline_events
          (id, tenant_id, patient_id, cancer_diagnosis_id, event_type, event_date,
           title, description, source_entity, source_id, metadata, severity, created_by, created_at)
         VALUES (gen_random_uuid(), $1::uuid, $2::uuid, $3::uuid, $4, $5::timestamptz,
                 $6, $7, $8, $9::uuid, $10::jsonb, $11, $12::uuid, NOW())`,
        tenantId,
        event.patientId,
        event.cancerDiagnosisId ?? null,
        event.eventType,
        event.eventDate instanceof Date ? event.eventDate.toISOString() : event.eventDate,
        event.title,
        event.description ?? null,
        event.sourceEntity ?? null,
        event.sourceId ?? null,
        JSON.stringify(event.metadata ?? {}),
        event.severity ?? 'info',
        userId,
      );
    } catch {
      // Timeline logging is non-blocking — do not fail the primary operation
    }
  }

  /** Used to enrich chemo timeline event metadata with the protocol's planned cycle count. */
  private async getProtocolTotalCycles(tenantId: string, protocolId: string | null | undefined): Promise<number | null> {
    if (!protocolId) return null;
    try {
      const rows = await this.prisma.$queryRawUnsafe<{ total_cycles: number }[]>(
        `SELECT total_cycles FROM plugin_oncology.chemo_protocols WHERE id = $1::uuid AND tenant_id = $2::uuid`,
        protocolId, tenantId,
      );
      return rows[0]?.total_cycles ?? null;
    } catch {
      return null;
    }
  }

  // ============================================
  // Cancer Diagnosis
  // ============================================

  async listCancerDiagnoses(
    filters: { patientId?: string | undefined; clinicalStatus?: string | undefined; cancerType?: string | undefined } = {},
    page = 1,
    limit = 20,
  ) {
    const tenantId = this.getTenantId();
    let baseFilter = `WHERE cd.tenant_id = $1::uuid`;
    const params: unknown[] = [tenantId];
    let paramIdx = 2;

    if (filters.patientId) {
      baseFilter += ` AND cd.patient_id = $${paramIdx++}::uuid`;
      params.push(filters.patientId);
    }
    if (filters.clinicalStatus) {
      baseFilter += ` AND cd.clinical_status = $${paramIdx++}`;
      params.push(filters.clinicalStatus);
    }
    if (filters.cancerType) {
      baseFilter += ` AND cd.cancer_type ILIKE $${paramIdx++}`;
      params.push(`%${filters.cancerType}%`);
    }

    const countQuery = `SELECT COUNT(*) as count FROM plugin_oncology.cancer_diagnoses cd ${baseFilter}`;

    const dataQuery = `
      SELECT cd.*,
        p.mrn as patient_mrn, p.first_name as patient_first_name,
        p.last_name as patient_last_name, p.display_name as patient_display_name,
        p.gender as patient_gender, p.date_of_birth as patient_date_of_birth,
        p.phone_number as patient_phone_number, p.email as patient_email,
        p.national_id as patient_national_id, p.national_id_type as patient_national_id_type,
        p.nationality as patient_nationality, p.preferred_language as patient_preferred_language
      FROM plugin_oncology.cancer_diagnoses cd
      LEFT JOIN public.patients p ON p.id = cd.patient_id
      ${baseFilter}
      ORDER BY cd.diagnosis_date DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
    params.push(limit, (page - 1) * limit);

    const [rows, total] = await Promise.all([
      this.prisma.$queryRawUnsafe<any[]>(dataQuery, ...params),
      this.prisma.$queryRawUnsafe<[{ count: bigint }]>(countQuery, ...params.slice(0, -2)),
    ]);

    const data = rows.map((row) => {
      const patientDisplay = this.buildPatientDisplay(row);
      const { patient_mrn, patient_first_name, patient_last_name, patient_display_name,
        patient_gender, patient_date_of_birth, patient_phone_number, patient_email,
        patient_national_id, patient_national_id_type, patient_nationality,
        patient_preferred_language, ...rest } = row;
      return { ...rest, patientDisplay };
    });

    return {
      data,
      pagination: { page, limit, total: Number(total[0]?.count ?? 0) },
    };
  }

  async getCancerDiagnosis(id: string) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT cd.*,
        p.mrn AS patient_mrn, p.display_name AS patient_display_name,
        p.first_name AS patient_first_name, p.last_name AS patient_last_name,
        p.date_of_birth AS patient_date_of_birth, p.gender AS patient_gender,
        p.phone_number AS patient_phone_number,
        (SELECT json_agg(ts ORDER BY ts.staging_date DESC)
         FROM plugin_oncology.tumor_staging ts
         WHERE ts.cancer_diagnosis_id = cd.id AND ts.tenant_id = cd.tenant_id
        ) as stagings,
        (SELECT json_agg(cp ORDER BY cp.created_at DESC)
         FROM plugin_oncology.oncology_care_plans cp
         WHERE cp.cancer_diagnosis_id = cd.id AND cp.tenant_id = cd.tenant_id AND cp.status != 'revised'
        ) as care_plans
      FROM plugin_oncology.cancer_diagnoses cd
      LEFT JOIN public.patients p ON p.id = cd.patient_id
      WHERE cd.id = $1::uuid AND cd.tenant_id = $2::uuid`,
      id,
      tenantId,
    );
    if (!results.length) throw new NotFoundException(`Cancer diagnosis '${id}' not found`);
    return results[0];
  }

  async createCancerDiagnosis(data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    // Results from the candidate queue that led to this registration (optional).
    const candidateSources = this.parseCandidateSources(data.candidateSources);
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
        gen_random_uuid(), $1::uuid, $2::uuid, $3::uuid, $4::uuid,
        $5, $6, $7, $8,
        $9, $10, $11, $12,
        $13::date, $14, $15,
        $16, $17, $18,
        $19::jsonb, $20, $21::uuid, $22,
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
      (data.diagnosedBy as string) || this.getCurrentUserId(),
      data.notes ?? null,
    );
    const r = results[0];
    if (candidateSources.length > 0) {
      await this.recordCandidateDecisions(tenantId, r.patient_id, candidateSources, 'added', null, r.id);
    }
    await this.logTimelineEvent({
      patientId: r.patient_id,
      cancerDiagnosisId: r.id,
      eventType: 'diagnosis',
      eventDate: r.diagnosis_date ?? r.created_at,
      title: `Diagnosed: ${r.cancer_type}`,
      sourceEntity: 'cancer_diagnosis',
      sourceId: r.id,
      metadata: {
        cancerType: r.cancer_type,
        primarySite: r.primary_site,
        clinicalStatus: r.clinical_status,
        metastaticStatus: r.metastatic_status,
        grade: r.grade,
      },
      severity: 'milestone',
    });
    return r;
  }

  async updateCancerDiagnosis(id: string, data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    await this.getCancerDiagnosis(id);

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
      WHERE id = $1::uuid AND tenant_id = $2::uuid
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
    filters: { cancerType?: string | undefined; clinicalStatus?: string | undefined; search?: string | undefined } = {},
    page = 1,
    limit = 20,
  ) {
    const tenantId = this.getTenantId();
    let query = `
      SELECT cd.*,
        p.mrn                    as patient_mrn,
        p.first_name             as patient_first_name,
        p.last_name              as patient_last_name,
        p.display_name           as patient_display_name,
        p.gender                 as patient_gender,
        p.date_of_birth          as patient_date_of_birth,
        p.phone_number           as patient_phone_number,
        p.email                  as patient_email,
        p.national_id            as patient_national_id,
        p.national_id_type       as patient_national_id_type,
        p.nationality            as patient_nationality,
        p.preferred_language     as patient_preferred_language,
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
         AND cp.status <> 'cancelled'
         ORDER BY (cp.status IN ('draft', 'active', 'on_hold')) DESC, cp.created_at DESC LIMIT 1
        ) as care_plan_status
      FROM plugin_oncology.cancer_diagnoses cd
      LEFT JOIN public.patients p ON p.id = cd.patient_id
      WHERE cd.tenant_id = $1::uuid`;
    const filterParams: unknown[] = [tenantId];
    let filterIdx = 2;
    let filterClause = '';

    if (filters.cancerType) {
      filterClause += ` AND cd.cancer_type ILIKE $${filterIdx++}`;
      filterParams.push(`%${filters.cancerType}%`);
    }
    if (filters.clinicalStatus) {
      filterClause += ` AND cd.clinical_status = $${filterIdx++}`;
      filterParams.push(filters.clinicalStatus);
    }
    if (filters.search) {
      filterClause += ` AND (p.first_name ILIKE $${filterIdx} OR p.last_name ILIKE $${filterIdx} OR p.mrn ILIKE $${filterIdx} OR CONCAT(p.first_name, ' ', p.last_name) ILIKE $${filterIdx})`;
      filterParams.push(`%${filters.search}%`);
      filterIdx++;
    }

    query += filterClause;
    const countQuery = `
      SELECT COUNT(*) as count
      FROM plugin_oncology.cancer_diagnoses cd
      LEFT JOIN public.patients p ON p.id = cd.patient_id
      WHERE cd.tenant_id = $1::uuid` + filterClause;

    query += ` ORDER BY cd.diagnosis_date DESC LIMIT $${filterIdx++} OFFSET $${filterIdx++}`;
    const allParams = [...filterParams, limit, (page - 1) * limit];

    const [rows, total] = await Promise.all([
      this.prisma.$queryRawUnsafe<any[]>(query, ...allParams),
      this.prisma.$queryRawUnsafe<[{ count: bigint }]>(countQuery, ...filterParams),
    ]);

    const PATIENT_COLS = [
      'patient_mrn', 'patient_first_name', 'patient_last_name', 'patient_display_name',
      'patient_gender', 'patient_date_of_birth', 'patient_phone_number', 'patient_email',
      'patient_national_id', 'patient_national_id_type', 'patient_nationality',
      'patient_preferred_language',
    ];

    const data = rows.map((row) => {
      const patientDisplay = this.buildPatientDisplay(row);
      const clean = { ...row, patientDisplay };
      PATIENT_COLS.forEach((k) => delete clean[k]);
      return clean;
    });

    return {
      data,
      pagination: { page, limit, total: Number(total[0]?.count ?? 0) },
    };
  }

  // ============================================
  // Registry Candidate Queue
  // ============================================

  /**
   * Patients not yet in the registry whose recent finalised results point to
   * cancer: malignant pathology, suspicious imaging, a coded C00–C97/D00–D09
   * diagnosis, or an abnormal oncology tumour marker. Computed on read from
   * clinical results (tenant-scoped); results a clinician has already acted on
   * (registry_candidate_decisions) are left out. See registry-candidates.ts.
   */
  async listRegistryCandidates(
    filters: { days?: number | undefined; search?: string | undefined; strength?: string | undefined; patientId?: string | undefined } = {},
  ) {
    const tenantId = this.getTenantId();
    const days = Math.min(Math.max(filters.days ?? 180, 1), 730);
    const patientFilter = filters.patientId ? ` AND x.patient_id = $3::uuid` : '';
    const params: unknown[] = [tenantId, days, ...(filters.patientId ? [filters.patientId] : [])];

    // Shared exclusions: patient already registered, or this result already decided.
    const notDecided = (type: string, idCol: string) => `
      AND NOT EXISTS (SELECT 1 FROM plugin_oncology.cancer_diagnoses cd
                      WHERE cd.tenant_id = x.tenant_id AND cd.patient_id = x.patient_id)
      AND NOT EXISTS (SELECT 1 FROM plugin_oncology.registry_candidate_decisions d
                      WHERE d.tenant_id = x.tenant_id AND d.source_type = '${type}' AND d.source_id = ${idCol})`;

    const [pathology, imaging, diagnoses, markers] = await Promise.all([
      this.prisma.$queryRawUnsafe<any[]>(
        `SELECT x.id, x.patient_id, x.order_id, x.diagnosis, x.comment, x.specimen_type, co.order_name,
                COALESCE(x.verified_at, x.reported_at, x.updated_at) AS result_at
         FROM pathology_reports x
         LEFT JOIN clinical_orders co ON co.id = x.order_id
         WHERE x.tenant_id = $1::uuid AND x.report_status IN ('FINAL', 'AMENDED')
           AND COALESCE(x.verified_at, x.reported_at, x.updated_at) >= NOW() - ($2::int * INTERVAL '1 day')
           ${patientFilter} ${notDecided('pathology', 'x.id')}
         ORDER BY result_at DESC LIMIT 500`,
        ...params,
      ),
      this.prisma.$queryRawUnsafe<any[]>(
        `SELECT x.id, x.patient_id, x.order_id, x.impression, x.findings, x.modality, x.body_part, co.order_name,
                COALESCE(x.reviewed_at, x.reported_at, x.updated_at) AS result_at
         FROM imaging_reports x
         LEFT JOIN clinical_orders co ON co.id = x.order_id
         WHERE x.tenant_id = $1::uuid AND x.report_status IN ('FINAL', 'AMENDED')
           AND COALESCE(x.reviewed_at, x.reported_at, x.updated_at) >= NOW() - ($2::int * INTERVAL '1 day')
           ${patientFilter} ${notDecided('imaging', 'x.id')}
         ORDER BY result_at DESC LIMIT 500`,
        ...params,
      ),
      this.prisma.$queryRawUnsafe<any[]>(
        `SELECT x.id, x.patient_id, x.icd_code, x.diagnosis_name, x.diagnosis_type, x.diagnosed_at AS result_at
         FROM encounter_diagnoses x
         WHERE x.tenant_id = $1::uuid
           AND x.diagnosis_type IN ('primary', 'secondary')
           AND (x.icd_code ~* '^C[0-9]{2}' OR x.icd_code ~* '^D0[0-9]')
           AND x.diagnosed_at >= NOW() - ($2::int * INTERVAL '1 day')
           ${patientFilter} ${notDecided('diagnosis', 'x.id')}
         ORDER BY result_at DESC LIMIT 500`,
        ...params,
      ),
      this.prisma.$queryRawUnsafe<any[]>(
        `SELECT lri.id, x.patient_id, x.order_id, lri.test_name, lri.value_numeric, lri.value_string, lri.unit,
                lri.ref_range_high, lri.ref_range_text, lri.interpretation,
                COALESCE(x.verified_at, x.reported_at, x.updated_at) AS result_at
         FROM lab_result_items lri
         JOIN lab_reports x ON x.id = lri.lab_report_id
         WHERE x.tenant_id = $1::uuid AND x.report_status IN ('FINAL', 'AMENDED')
           AND (lri.abnormal_flag = true OR lri.critical_flag = true OR lri.interpretation IN ('high', 'critical_high', 'abnormal'))
           -- Catalogue rows are tenant-specific or global (tenant_id NULL, as 02-lab-test-catalog.sql seeds them).
           AND lri.test_code IN (SELECT loinc_code FROM lab_test_master
                                 WHERE (tenant_id = x.tenant_id OR tenant_id IS NULL) AND test_category = 'Oncology')
           AND COALESCE(x.verified_at, x.reported_at, x.updated_at) >= NOW() - ($2::int * INTERVAL '1 day')
           ${patientFilter} ${notDecided('tumor_marker', 'lri.id')}
         ORDER BY result_at DESC LIMIT 500`,
        ...params,
      ),
    ]);

    const iso = (d: unknown) => (d ? new Date(d as string).toISOString() : null);
    const evidence: Array<CandidateEvidence & { patientId: string }> = [];

    for (const r of pathology) {
      const m = classifyPathology(r);
      if (!m) continue;
      evidence.push({
        patientId: r.patient_id, sourceType: 'pathology', sourceId: r.id, strength: 'high',
        title: r.order_name || (r.specimen_type ? `Pathology — ${r.specimen_type}` : 'Pathology report'),
        excerpt: m.excerpt, matchedTerms: m.matchedTerms, resultAt: iso(r.result_at), orderId: r.order_id,
      });
    }
    for (const r of imaging) {
      const m = classifyImaging(r);
      if (!m) continue;
      evidence.push({
        patientId: r.patient_id, sourceType: 'imaging', sourceId: r.id, strength: 'medium',
        title: r.order_name || [r.modality, r.body_part].filter(Boolean).join(' ') || 'Imaging report',
        excerpt: m.excerpt, matchedTerms: m.matchedTerms, resultAt: iso(r.result_at), orderId: r.order_id,
      });
    }
    for (const r of diagnoses) {
      if (!isCancerIcdCode(r.icd_code)) continue;
      evidence.push({
        patientId: r.patient_id, sourceType: 'diagnosis', sourceId: r.id, strength: 'high',
        title: 'Coded diagnosis', excerpt: `${r.icd_code} — ${r.diagnosis_name}`,
        matchedTerms: [r.icd_code], resultAt: iso(r.result_at), icdCode: r.icd_code, orderId: null,
      });
    }
    for (const r of markers) {
      const value = r.value_numeric != null ? String(Number(r.value_numeric)) : (r.value_string ?? '');
      const ref = r.ref_range_high != null ? ` (ref ≤ ${Number(r.ref_range_high)})` : r.ref_range_text ? ` (ref ${r.ref_range_text})` : '';
      evidence.push({
        patientId: r.patient_id, sourceType: 'tumor_marker', sourceId: r.id, strength: 'low',
        title: r.test_name, excerpt: `${value}${r.unit ? ` ${r.unit}` : ''}${ref} — above normal`,
        matchedTerms: [r.test_name], resultAt: iso(r.result_at), orderId: r.order_id,
      });
    }

    let groups = groupByPatient(evidence);
    if (filters.strength) groups = groups.filter((g) => g.strength === filters.strength);
    if (groups.length === 0) return { data: [], total: 0 };

    const patients = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT p.id as patient_id, p.mrn as patient_mrn, p.first_name as patient_first_name,
              p.last_name as patient_last_name, p.display_name as patient_display_name,
              p.gender as patient_gender, p.date_of_birth as patient_date_of_birth
       FROM public.patients p
       WHERE p.tenant_id = $1::uuid AND p.id = ANY($2::uuid[])`,
      tenantId, groups.map((g) => g.patientId),
    );
    const byId = new Map(patients.map((p) => [p.patient_id, this.buildPatientDisplay(p)]));

    let data = groups.map((g) => ({ ...g, patientDisplay: byId.get(g.patientId) ?? null }));
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter((d) => {
        const p = d.patientDisplay;
        return !!p && [p.displayName, p.mrn, `${p.firstName} ${p.lastName}`].some((s) => s?.toLowerCase().includes(q));
      });
    }
    return { data, total: data.length };
  }

  /** Records a clinician's decision on candidate evidence so it leaves the queue. */
  private async recordCandidateDecisions(
    tenantId: string,
    patientId: string,
    sources: Array<{ sourceType: CandidateSourceType; sourceId: string }>,
    decision: 'added' | 'dismissed',
    reason: string | null,
    cancerDiagnosisId: string | null,
  ) {
    const userId = this.getCurrentUserId();
    for (const s of sources) {
      await this.prisma.$executeRawUnsafe(
        `INSERT INTO plugin_oncology.registry_candidate_decisions
           (id, tenant_id, patient_id, source_type, source_id, decision, reason, cancer_diagnosis_id, decided_by, decided_at)
         VALUES (gen_random_uuid(), $1::uuid, $2::uuid, $3, $4::uuid, $5, $6, $7::uuid, $8::uuid, NOW())
         ON CONFLICT (tenant_id, source_type, source_id) DO UPDATE SET
           decision = EXCLUDED.decision, reason = EXCLUDED.reason,
           cancer_diagnosis_id = EXCLUDED.cancer_diagnosis_id,
           decided_by = EXCLUDED.decided_by, decided_at = NOW()`,
        tenantId, patientId, s.sourceType, s.sourceId, decision, reason, cancerDiagnosisId, userId,
      );
    }
  }

  private parseCandidateSources(raw: unknown): Array<{ sourceType: CandidateSourceType; sourceId: string }> {
    if (raw == null) return [];
    if (!Array.isArray(raw)) throw new BadRequestException('candidateSources must be an array');
    return raw.map((s) => {
      const { sourceType, sourceId } = (s ?? {}) as Record<string, unknown>;
      if (!isCandidateSourceType(sourceType) || typeof sourceId !== 'string' || !UUID_RE.test(sourceId)) {
        throw new BadRequestException('Each candidate source needs a valid sourceType and sourceId');
      }
      return { sourceType, sourceId };
    });
  }

  /** Dismisses a candidate: the listed results are marked reviewed and leave the queue. */
  async dismissRegistryCandidate(patientId: string, body: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    if (!UUID_RE.test(patientId)) throw new BadRequestException('Invalid patientId');
    const sources = this.parseCandidateSources(body.sources);
    if (sources.length === 0) throw new BadRequestException('sources is required');
    const reason = typeof body.reason === 'string' && body.reason.trim() ? body.reason.trim() : null;
    if (!reason) throw new BadRequestException('A reason is required to dismiss a candidate');
    await this.recordCandidateDecisions(tenantId, patientId, sources, 'dismissed', reason, null);
    return { patientId, dismissed: sources.length };
  }

  // ============================================
  // Oncology Dashboard
  // ============================================

  /**
   * One-call summary for the Oncology Dashboard: caseload, the day's chemo and
   * radiation work, approvals waiting across the service, tumour board and
   * care-pathway gaps. Every query is tenant-scoped; `date` is the board day.
   */
  async getDashboard(date?: string) {
    const tenantId = this.getTenantId();
    const day = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : new Date().toISOString().slice(0, 10);
    const n = (v: unknown) => Number(v ?? 0);
    const ACTIVE_DISEASE = `('active','recurrence','relapsed')`;

    const [caseload, statusRows, cancerTypeRows, gaps, chemo, dayCare, radiation, tumorBoard, plans, boardCases, actionOrders] =
      await Promise.all([
        this.prisma.$queryRawUnsafe<any[]>(
          `SELECT
             COUNT(DISTINCT patient_id) FILTER (WHERE clinical_status IN ${ACTIVE_DISEASE}) AS active_patients,
             COUNT(DISTINCT patient_id) AS registered_patients,
             COUNT(*) FILTER (WHERE diagnosis_date > $2::date - INTERVAL '30 days' AND diagnosis_date <= $2::date) AS new_last_30,
             COUNT(*) FILTER (WHERE clinical_status IN ${ACTIVE_DISEASE} AND metastatic_status = 'distant') AS metastatic
           FROM plugin_oncology.cancer_diagnoses WHERE tenant_id = $1::uuid`,
          tenantId, day,
        ),
        this.prisma.$queryRawUnsafe<any[]>(
          `SELECT clinical_status AS key, COUNT(*) AS count FROM plugin_oncology.cancer_diagnoses
           WHERE tenant_id = $1::uuid GROUP BY clinical_status`,
          tenantId,
        ),
        this.prisma.$queryRawUnsafe<any[]>(
          `SELECT cancer_type AS key, COUNT(*) AS count FROM plugin_oncology.cancer_diagnoses
           WHERE tenant_id = $1::uuid AND clinical_status IN ${ACTIVE_DISEASE}
           GROUP BY cancer_type ORDER BY COUNT(*) DESC, cancer_type LIMIT 8`,
          tenantId,
        ),
        this.prisma.$queryRawUnsafe<any[]>(
          `SELECT
             COUNT(*) FILTER (WHERE NOT EXISTS (
               SELECT 1 FROM plugin_oncology.tumor_staging ts
               WHERE ts.cancer_diagnosis_id = cd.id AND ts.tenant_id = cd.tenant_id)) AS unstaged,
             COUNT(*) FILTER (WHERE NOT EXISTS (
               SELECT 1 FROM plugin_oncology.oncology_care_plans cp
               WHERE cp.cancer_diagnosis_id = cd.id AND cp.tenant_id = cd.tenant_id
                 AND cp.status IN ('draft','active','on_hold'))) AS without_care_plan,
             COUNT(*) FILTER (WHERE NOT EXISTS (
               SELECT 1 FROM plugin_oncology.tumor_board_cases tb
               WHERE tb.cancer_diagnosis_id = cd.id AND tb.tenant_id = cd.tenant_id)) AS not_discussed
           FROM plugin_oncology.cancer_diagnoses cd
           WHERE cd.tenant_id = $1::uuid AND cd.clinical_status IN ${ACTIVE_DISEASE}`,
          tenantId,
        ),
        this.prisma.$queryRawUnsafe<any[]>(
          `SELECT
             COUNT(*) FILTER (WHERE scheduled_date = $2::date AND status <> 'cancelled') AS today_total,
             COUNT(*) FILTER (WHERE scheduled_date = $2::date AND status = 'in_progress') AS today_in_progress,
             COUNT(*) FILTER (WHERE scheduled_date = $2::date AND status = 'completed') AS today_completed,
             COUNT(*) FILTER (WHERE status = 'pending') AS awaiting_approval,
             COUNT(*) FILTER (WHERE status = 'approved') AS awaiting_verification,
             COUNT(*) FILTER (WHERE status = 'held') AS held
           FROM plugin_oncology.chemo_orders WHERE tenant_id = $1::uuid`,
          tenantId, day,
        ),
        this.prisma.$queryRawUnsafe<any[]>(
          `SELECT
             COUNT(*) FILTER (WHERE status NOT IN ('skipped','cancelled')) AS total,
             COUNT(*) FILTER (WHERE status = 'planned') AS planned,
             COUNT(*) FILTER (WHERE status = 'ordered') AS ordered,
             COUNT(*) FILTER (WHERE status = 'given') AS given,
             COUNT(*) FILTER (WHERE status = 'held') AS held
           FROM plugin_oncology.treatment_days WHERE tenant_id = $1::uuid AND scheduled_date = $2::date`,
          tenantId, day,
        ),
        this.prisma.$queryRawUnsafe<any[]>(
          `SELECT
             (SELECT COUNT(*) FROM plugin_oncology.radiation_prescriptions
               WHERE tenant_id = $1::uuid AND status = 'ACTIVE') AS active_courses,
             (SELECT COUNT(*) FROM plugin_oncology.radiation_prescriptions
               WHERE tenant_id = $1::uuid AND status = 'DRAFT') AS awaiting_approval,
             (SELECT COUNT(*) FROM plugin_oncology.radiation_fractions
               WHERE tenant_id = $1::uuid AND planned_date = $2::date AND status <> 'CANCELLED') AS fractions_today,
             (SELECT COUNT(*) FROM plugin_oncology.radiation_fractions
               WHERE tenant_id = $1::uuid AND planned_date = $2::date AND status = 'DELIVERED') AS fractions_delivered,
             (SELECT COUNT(*) FROM plugin_oncology.radiation_fractions
               WHERE tenant_id = $1::uuid AND planned_date = $2::date AND status = 'MISSED') AS fractions_missed`,
          tenantId, day,
        ),
        this.prisma.$queryRawUnsafe<any[]>(
          `SELECT
             COUNT(*) FILTER (WHERE meeting_date = $2::date) AS today,
             COUNT(*) FILTER (WHERE meeting_date >= $2::date AND meeting_date < $2::date + 7
                              AND status IN ('scheduled','in_review')) AS next_7_days,
             COUNT(*) FILTER (WHERE meeting_date < $2::date AND status IN ('scheduled','in_review')) AS overdue
           FROM plugin_oncology.tumor_board_cases WHERE tenant_id = $1::uuid`,
          tenantId, day,
        ),
        this.prisma.$queryRawUnsafe<any[]>(
          `SELECT
             (SELECT COUNT(*) FROM plugin_oncology.oncology_care_plans
               WHERE tenant_id = $1::uuid AND status = 'draft') AS care_plans_draft,
             (SELECT COUNT(*) FROM plugin_oncology.oncology_care_plans
               WHERE tenant_id = $1::uuid AND status = 'active') AS care_plans_active,
             (SELECT COUNT(*) FROM plugin_oncology.treatment_plans
               WHERE tenant_id = $1::uuid AND status = 'active') AS schedules_active,
             (SELECT COUNT(*) FROM plugin_oncology.treatment_plans
               WHERE tenant_id = $1::uuid AND status = 'on_hold') AS schedules_on_hold`,
          tenantId,
        ),
        this.prisma.$queryRawUnsafe<any[]>(
          `SELECT tbc.id, tbc.patient_id, tbc.meeting_date, tbc.status, cd.cancer_type, cd.primary_site,
             p.mrn AS patient_mrn, p.first_name AS patient_first_name, p.last_name AS patient_last_name,
             p.display_name AS patient_display_name, p.gender AS patient_gender, p.date_of_birth AS patient_date_of_birth
           FROM plugin_oncology.tumor_board_cases tbc
           JOIN plugin_oncology.cancer_diagnoses cd ON cd.id = tbc.cancer_diagnosis_id AND cd.tenant_id = tbc.tenant_id
           LEFT JOIN public.patients p ON p.id = tbc.patient_id
           WHERE tbc.tenant_id = $1::uuid AND tbc.status IN ('scheduled','in_review')
             AND tbc.meeting_date >= $2::date - 30
           ORDER BY tbc.meeting_date ASC LIMIT 6`,
          tenantId, day,
        ),
        this.prisma.$queryRawUnsafe<any[]>(
          `SELECT co.id, co.patient_id, co.scheduled_date, co.status, co.cycle_number,
             cp.code AS protocol_code, cp.name AS protocol_name,
             p.mrn AS patient_mrn, p.first_name AS patient_first_name, p.last_name AS patient_last_name,
             p.display_name AS patient_display_name, p.gender AS patient_gender, p.date_of_birth AS patient_date_of_birth
           FROM plugin_oncology.chemo_orders co
           JOIN plugin_oncology.chemo_protocols cp ON cp.id = co.protocol_id
           LEFT JOIN public.patients p ON p.id = co.patient_id
           WHERE co.tenant_id = $1::uuid AND co.status IN ('pending','approved','held')
           ORDER BY co.scheduled_date ASC LIMIT 8`,
          tenantId,
        ),
      ]);

    const counts = (rows: any[]) => rows.map((r) => ({ key: String(r.key ?? 'unknown'), count: n(r.count) }));
    const patient = (r: any) => {
      const display = this.buildPatientDisplay(r);
      return display
        ? { patientId: display.patientId, mrn: display.mrn, displayName: display.displayName, gender: display.gender, age: display.age }
        : null;
    };
    const isoDate = (v: unknown) => (v ? new Date(v as string).toISOString().slice(0, 10) : null);
    const [c, g, ch, dc, rt, tb, pl] = [caseload[0], gaps[0], chemo[0], dayCare[0], radiation[0], tumorBoard[0], plans[0]];

    return {
      date: day,
      generatedAt: new Date().toISOString(),
      caseload: {
        activePatients: n(c?.active_patients),
        registeredPatients: n(c?.registered_patients),
        newDiagnosesLast30Days: n(c?.new_last_30),
        metastatic: n(c?.metastatic),
        byClinicalStatus: counts(statusRows),
        byCancerType: counts(cancerTypeRows),
      },
      pathwayGaps: {
        unstaged: n(g?.unstaged),
        withoutCarePlan: n(g?.without_care_plan),
        notDiscussedAtTumorBoard: n(g?.not_discussed),
      },
      chemo: {
        ordersToday: n(ch?.today_total),
        inProgressToday: n(ch?.today_in_progress),
        completedToday: n(ch?.today_completed),
        awaitingApproval: n(ch?.awaiting_approval),
        awaitingVerification: n(ch?.awaiting_verification),
        held: n(ch?.held),
      },
      dayCare: {
        scheduled: n(dc?.total),
        notYetOrdered: n(dc?.planned),
        ordered: n(dc?.ordered),
        given: n(dc?.given),
        held: n(dc?.held),
      },
      radiation: {
        activeCourses: n(rt?.active_courses),
        prescriptionsAwaitingApproval: n(rt?.awaiting_approval),
        fractionsToday: n(rt?.fractions_today),
        fractionsDelivered: n(rt?.fractions_delivered),
        fractionsMissed: n(rt?.fractions_missed),
      },
      tumorBoard: {
        today: n(tb?.today),
        next7Days: n(tb?.next_7_days),
        overdue: n(tb?.overdue),
        upcoming: boardCases.map((r) => ({
          id: r.id,
          meetingDate: isoDate(r.meeting_date),
          status: r.status,
          cancerType: r.cancer_type,
          primarySite: r.primary_site,
          patient: patient(r),
        })),
      },
      plans: {
        carePlansDraft: n(pl?.care_plans_draft),
        carePlansActive: n(pl?.care_plans_active),
        schedulesActive: n(pl?.schedules_active),
        schedulesOnHold: n(pl?.schedules_on_hold),
      },
      ordersNeedingAction: actionOrders.map((r) => ({
        id: r.id,
        scheduledDate: isoDate(r.scheduled_date),
        status: r.status,
        cycleNumber: r.cycle_number,
        protocolCode: r.protocol_code,
        protocolName: r.protocol_name,
        patient: patient(r),
      })),
    };
  }

  /**
   * Population health view of the cancer registry: who is affected (age,
   * gender, place), how they present (stage at diagnosis), how quickly they
   * reach treatment and how they are doing. The cohort is every diagnosis
   * dated within `months` of today (0 = all time), tenant-scoped.
   */
  async getPopulationHealth(months = 0) {
    const tenantId = this.getTenantId();
    const window = Number.isInteger(months) && months > 0 && months <= 240 ? months : 0;

    // One set-based pass: the cohort joined to pre-aggregated lookups (first
    // staging, first care-plan intent, earliest chemo / schedule / RT start),
    // returning one small row per diagnosis. Every breakdown below is grouped
    // in memory from these rows, so the cohort is computed once.
    const rows = await this.prisma.$queryRawUnsafe<
      Array<{
        patient_id: string;
        cancer_type: string;
        dx_month: string;
        clinical_status: string;
        metastatic_status: string;
        is_recurrence: boolean;
        gender: string | null;
        city: string | null;
        age_at_dx: number | null;
        stage_raw: string | null;
        intent: string | null;
        days_to_treatment: number | null;
      }>
    >(
      `WITH cohort AS (
         SELECT cd.id, cd.patient_id, cd.cancer_type, cd.diagnosis_date, cd.clinical_status,
           cd.metastatic_status, cd.is_recurrence
         FROM plugin_oncology.cancer_diagnoses cd
         WHERE cd.tenant_id = $1::uuid
           AND ($2::int = 0 OR cd.diagnosis_date > CURRENT_DATE - make_interval(months => $2::int))
       ),
       first_stage AS (
         SELECT DISTINCT ON (ts.cancer_diagnosis_id) ts.cancer_diagnosis_id AS id, ts.stage_group
         FROM plugin_oncology.tumor_staging ts JOIN cohort c ON c.id = ts.cancer_diagnosis_id
         WHERE ts.tenant_id = $1::uuid
         ORDER BY ts.cancer_diagnosis_id, ts.staging_date ASC, ts.created_at ASC
       ),
       first_intent AS (
         SELECT DISTINCT ON (cp.cancer_diagnosis_id) cp.cancer_diagnosis_id AS id, cp.treatment_intent
         FROM plugin_oncology.oncology_care_plans cp JOIN cohort c ON c.id = cp.cancer_diagnosis_id
         WHERE cp.tenant_id = $1::uuid AND cp.status <> 'cancelled'
         ORDER BY cp.cancer_diagnosis_id, cp.created_at ASC
       ),
       starts AS (
         SELECT id, MIN(start_date) AS first_treatment FROM (
           SELECT co.cancer_diagnosis_id AS id, co.scheduled_date AS start_date
           FROM plugin_oncology.chemo_orders co
           WHERE co.tenant_id = $1::uuid AND co.status NOT IN ('draft','cancelled')
           UNION ALL
           SELECT tp.cancer_diagnosis_id, tp.start_date
           FROM plugin_oncology.treatment_plans tp
           WHERE tp.tenant_id = $1::uuid AND tp.status <> 'cancelled'
           UNION ALL
           SELECT rp.cancer_profile_id, rp.planned_start_date
           FROM plugin_oncology.radiation_prescriptions rp
           WHERE rp.tenant_id = $1::uuid AND rp.status <> 'CANCELLED'
         ) s WHERE id IS NOT NULL AND start_date IS NOT NULL GROUP BY id
       )
       SELECT c.patient_id, c.cancer_type, to_char(c.diagnosis_date, 'YYYY-MM') AS dx_month,
         c.clinical_status, c.metastatic_status, c.is_recurrence,
         p.gender, NULLIF(TRIM(p.city), '') AS city,
         EXTRACT(YEAR FROM age(c.diagnosis_date, p.date_of_birth))::int AS age_at_dx,
         fs.stage_group AS stage_raw, fi.treatment_intent AS intent,
         CASE WHEN st.first_treatment >= c.diagnosis_date
              THEN (st.first_treatment - c.diagnosis_date)::int END AS days_to_treatment
       FROM cohort c
       LEFT JOIN public.patients p ON p.id = c.patient_id
       LEFT JOIN first_stage fs ON fs.id = c.id
       LEFT JOIN first_intent fi ON fi.id = c.id
       LEFT JOIN starts st ON st.id = c.id`,
      tenantId,
      window,
    );

    // Stage at diagnosis folded to 0, I–IV or Unstaged (IIIB → III, is/Tis → 0).
    const stageOf = (raw: string | null): string => {
      const s = (raw ?? '').trim().replace(/^stage\s*/i, '');
      if (!s) return 'Unstaged';
      if (/^(0|is|tis)/i.test(s)) return '0';
      if (/^IV/i.test(s)) return 'IV';
      if (/^III/i.test(s)) return 'III';
      if (/^II/i.test(s)) return 'II';
      if (/^I/i.test(s)) return 'I';
      return 'Unstaged';
    };
    // Cancers with population screening programmes (breast, cervix, oral cavity, colorectum).
    const screenableOf = (type: string): string | null =>
      /breast/i.test(type) ? 'Breast'
        : /cervi/i.test(type) ? 'Cervical'
          : /(oral|mouth|tongue|buccal|lip)/i.test(type) ? 'Oral'
            : /(colorectal|colon|rect)/i.test(type) ? 'Colorectal'
              : null;
    const bandOf = (age: number | null): string =>
      age === null ? 'Unknown' : age < 18 ? '0-17' : age < 40 ? '18-39' : age < 50 ? '40-49' : age < 60 ? '50-59' : age < 70 ? '60-69' : '70+';
    const genderOf = (g: string | null): 'male' | 'female' | 'other' => {
      const v = (g ?? '').toLowerCase();
      return v === 'male' || v === 'm' ? 'male' : v === 'female' || v === 'f' ? 'female' : 'other';
    };
    /** Same as PERCENTILE_CONT(0.5): linear interpolation, nulls ignored, one decimal. */
    const median = (values: Array<number | null>): number | null => {
      const v = values.filter((x): x is number => x !== null).sort((a, b) => a - b);
      if (v.length === 0) return null;
      const mid = (v.length - 1) / 2;
      const m = v[Math.floor(mid)] + (v[Math.ceil(mid)] - v[Math.floor(mid)]) * (mid - Math.floor(mid));
      return Math.round(m * 10) / 10;
    };
    const pct = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 100) : null);
    const byCount = <T extends { count: number }>(a: T & { key: string }, b: T & { key: string }) =>
      b.count - a.count || a.key.localeCompare(b.key);
    const tally = (keys: string[]) => {
      const m = new Map<string, number>();
      for (const k of keys) m.set(k, (m.get(k) ?? 0) + 1);
      return [...m.entries()].map(([key, count]) => ({ key, count })).sort(byCount);
    };

    const cohort = rows.map((r) => ({
      ...r,
      stage: stageOf(r.stage_raw),
      age: r.age_at_dx === null ? null : Number(r.age_at_dx),
      days: r.days_to_treatment === null ? null : Number(r.days_to_treatment),
    }));
    const STAGED = new Set(['0', 'I', 'II', 'III', 'IV']);
    const LATE = new Set(['III', 'IV']);
    const groupStats = (items: typeof cohort) => {
      const staged = items.filter((r) => STAGED.has(r.stage)).length;
      return {
        staged,
        late: items.filter((r) => LATE.has(r.stage)).length,
        remission: items.filter((r) => r.clinical_status === 'remission' || r.clinical_status === 'resolved').length,
      };
    };

    const all = groupStats(cohort);
    const withDays = cohort.filter((r) => r.days !== null);
    const withIntent = cohort.filter((r) => r.intent !== null);

    // Last 12 calendar months (server time), zero-filled.
    const now = new Date();
    const monthKeys = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11 + i, 1));
      return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
    });
    const perMonth = new Map(tally(cohort.map((r) => r.dx_month)).map((x) => [x.key, x.count]));

    const BANDS = ['0-17', '18-39', '40-49', '50-59', '60-69', '70+', 'Unknown'];
    const STAGES = ['0', 'I', 'II', 'III', 'IV', 'Unstaged'];
    const types = new Map<string, typeof cohort>();
    for (const r of cohort) types.set(r.cancer_type, [...(types.get(r.cancer_type) ?? []), r]);
    const screen = new Map<string, typeof cohort>();
    for (const r of cohort) {
      const programme = screenableOf(r.cancer_type);
      if (programme) screen.set(programme, [...(screen.get(programme) ?? []), r]);
    }
    const cityPatients = new Map<string, Set<string>>();
    for (const r of cohort) {
      const key = r.city ?? 'Not recorded';
      cityPatients.set(key, (cityPatients.get(key) ?? new Set()).add(r.patient_id));
    }

    return {
      months: window,
      generatedAt: new Date().toISOString(),
      summary: {
        diagnoses: cohort.length,
        patients: new Set(cohort.map((r) => r.patient_id)).size,
        medianAgeAtDiagnosis: median(cohort.map((r) => r.age)),
        lateStagePercent: pct(all.late, all.staged),
        stagedPercent: pct(all.staged, cohort.length),
        metastaticPercent: pct(cohort.filter((r) => r.metastatic_status === 'distant').length, cohort.length),
        medianDaysToTreatment: median(cohort.map((r) => r.days)),
        treatedWithin30DaysPercent: pct(withDays.filter((r) => (r.days as number) <= 30).length, withDays.length),
        withTreatmentDate: withDays.length,
        recurrencePercent: pct(
          cohort.filter((r) => r.clinical_status === 'recurrence' || r.clinical_status === 'relapsed' || r.is_recurrence).length,
          cohort.length,
        ),
        remissionPercent: pct(all.remission, cohort.length),
        curativeIntentPercent: pct(withIntent.filter((r) => r.intent === 'curative').length, withIntent.length),
      },
      incidenceByMonth: monthKeys.map((month) => ({ month, count: perMonth.get(month) ?? 0 })),
      ageGender: BANDS.map((band) => {
        const inBand = cohort.filter((r) => bandOf(r.age) === band);
        return {
          band,
          male: inBand.filter((r) => genderOf(r.gender) === 'male').length,
          female: inBand.filter((r) => genderOf(r.gender) === 'female').length,
          other: inBand.filter((r) => genderOf(r.gender) === 'other').length,
        };
      }).filter((r) => r.band !== 'Unknown' || r.male + r.female + r.other > 0),
      stageAtDiagnosis: STAGES.map((stage) => ({ stage, count: cohort.filter((r) => r.stage === stage).length })),
      byCancerType: [...types.entries()]
        .map(([key, items]) => ({ key, count: items.length, items }))
        .sort(byCount)
        .slice(0, 10)
        .map(({ key, items }) => {
          const g = groupStats(items);
          return {
            cancerType: key,
            diagnoses: items.length,
            medianAge: median(items.map((r) => r.age)),
            lateStagePercent: pct(g.late, g.staged),
            medianDaysToTreatment: median(items.map((r) => r.days)),
            remissionPercent: pct(g.remission, items.length),
          };
        }),
      byCity: [...cityPatients.entries()].map(([key, ids]) => ({ key, count: ids.size })).sort(byCount).slice(0, 8),
      byClinicalStatus: tally(cohort.map((r) => r.clinical_status)),
      byTreatmentIntent: tally(cohort.map((r) => r.intent ?? 'not_set')),
      screenableCancers: [...screen.entries()]
        .map(([key, items]) => ({ key, count: items.length, items }))
        .sort(byCount)
        .map(({ key, items }) => {
          const g = groupStats(items);
          return { programme: key, diagnoses: items.length, lateStagePercent: pct(g.late, g.staged) };
        }),
    };
  }

  async getPatientCancerSummary(patientId: string) {
    const tenantId = this.getTenantId();

    const [diagnosisRows, stagings, tumorBoardCases, carePlans] = await Promise.all([
      this.prisma.$queryRawUnsafe<any[]>(
        `SELECT cd.*,
           p.mrn as patient_mrn, p.first_name as patient_first_name,
           p.last_name as patient_last_name, p.display_name as patient_display_name,
           p.gender as patient_gender, p.date_of_birth as patient_date_of_birth
         FROM plugin_oncology.cancer_diagnoses cd
         LEFT JOIN public.patients p ON p.id = cd.patient_id
         WHERE cd.tenant_id = $1::uuid AND cd.patient_id = $2::uuid ORDER BY cd.diagnosis_date DESC`,
        tenantId, patientId,
      ),
      this.prisma.$queryRawUnsafe<any[]>(
        `SELECT * FROM plugin_oncology.tumor_staging WHERE tenant_id = $1::uuid AND patient_id = $2::uuid ORDER BY staging_date DESC`,
        tenantId, patientId,
      ),
      this.prisma.$queryRawUnsafe<any[]>(
        `SELECT * FROM plugin_oncology.tumor_board_cases WHERE tenant_id = $1::uuid AND patient_id = $2::uuid ORDER BY meeting_date DESC`,
        tenantId, patientId,
      ),
      this.prisma.$queryRawUnsafe<any[]>(
        `SELECT * FROM plugin_oncology.oncology_care_plans WHERE tenant_id = $1::uuid AND patient_id = $2::uuid ORDER BY created_at DESC`,
        tenantId, patientId,
      ),
    ]);

    // Same patient shape as the diagnosis list (patientDisplay, no flat patient_* columns).
    const diagnoses = diagnosisRows.map((row) => {
      const patientDisplay = this.buildPatientDisplay(row);
      const { patient_mrn, patient_first_name, patient_last_name, patient_display_name,
        patient_gender, patient_date_of_birth, ...rest } = row;
      return { ...rest, patientDisplay };
    });

    return { diagnoses, stagings, tumorBoardCases, carePlans };
  }

  /**
   * Most recent FINAL/AMENDED result for each oncology tumor-marker test the
   * patient has on file, matched against the lab catalog (lab_test_master)
   * rather than a hardcoded LOINC list so new oncology tests are picked up
   * automatically. Read-only display only - not used for any safety gating.
   */
  async getRelevantLabs(patientId: string) {
    const tenantId = this.getTenantId();

    return this.prisma.$queryRawUnsafe<any[]>(
      `SELECT DISTINCT ON (lri.test_code)
         lri.test_code, lri.test_name, lri.value_numeric, lri.value_string, lri.value_code,
         lri.unit, lri.ref_range_low, lri.ref_range_high, lri.ref_range_text,
         lri.interpretation, lri.abnormal_flag, lri.critical_flag, lr.reported_at
       FROM lab_result_items lri
       JOIN lab_reports lr ON lr.id = lri.lab_report_id
       WHERE lr.patient_id = $1::uuid AND lr.tenant_id = $2::uuid
         AND lr.report_status IN ('FINAL', 'AMENDED')
         AND lri.test_code IN (SELECT loinc_code FROM lab_test_master WHERE test_category = 'Oncology')
       ORDER BY lri.test_code, lr.reported_at DESC`,
      patientId, tenantId,
    );
  }

  /**
   * Every FINAL/AMENDED result of the patient's oncology tumour-marker tests
   * (lab catalog category 'Oncology'), oldest first — for trend charts.
   * Read-only display; not used for safety gating.
   */
  async getLabHistory(patientId: string) {
    const tenantId = this.getTenantId();

    return this.prisma.$queryRawUnsafe<any[]>(
      `SELECT lri.test_code, lri.test_name, lri.value_numeric, lri.unit,
              lri.ref_range_low, lri.ref_range_high, lri.abnormal_flag,
              COALESCE(lr.collection_date, lr.reported_at) AS observed_at
       FROM lab_result_items lri
       JOIN lab_reports lr ON lr.id = lri.lab_report_id
       WHERE lr.patient_id = $1::uuid AND lr.tenant_id = $2::uuid
         AND lr.report_status IN ('FINAL', 'AMENDED')
         AND lri.value_numeric IS NOT NULL
         AND lri.test_code IN (SELECT loinc_code FROM lab_test_master WHERE test_category = 'Oncology')
       ORDER BY lri.test_code, observed_at`,
      patientId, tenantId,
    );
  }

  // ============================================
  // Tumor Staging
  // ============================================

  async listStagings(filters: { patientId?: string | undefined; cancerDiagnosisId?: string | undefined } = {}, page = 1, limit = 20) {
    const tenantId = this.getTenantId();
    let query = `
      SELECT ts.*, cd.cancer_type, cd.primary_site,
        p.mrn as patient_mrn, p.first_name as patient_first_name,
        p.last_name as patient_last_name, p.display_name as patient_display_name,
        p.gender as patient_gender, p.date_of_birth as patient_date_of_birth,
        p.phone_number as patient_phone_number, p.email as patient_email,
        p.national_id as patient_national_id, p.national_id_type as patient_national_id_type,
        p.nationality as patient_nationality, p.preferred_language as patient_preferred_language
      FROM plugin_oncology.tumor_staging ts
      JOIN plugin_oncology.cancer_diagnoses cd ON ts.cancer_diagnosis_id = cd.id
      LEFT JOIN public.patients p ON p.id = ts.patient_id
      WHERE ts.tenant_id = $1::uuid`;
    const params: unknown[] = [tenantId];
    let paramIdx = 2;

    if (filters.patientId) {
      query += ` AND ts.patient_id = $${paramIdx++}::uuid`;
      params.push(filters.patientId);
    }
    if (filters.cancerDiagnosisId) {
      query += ` AND ts.cancer_diagnosis_id = $${paramIdx++}::uuid`;
      params.push(filters.cancerDiagnosisId);
    }

    const countParts = [`SELECT COUNT(*) as count FROM plugin_oncology.tumor_staging ts WHERE ts.tenant_id = $1::uuid`];
    if (filters.patientId) countParts.push(`AND ts.patient_id = $2::uuid`);
    if (filters.cancerDiagnosisId) countParts.push(`AND ts.cancer_diagnosis_id = $${filters.patientId ? 3 : 2}::uuid`);

    query += ` ORDER BY ts.staging_date DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
    params.push(limit, (page - 1) * limit);

    const [rows, total] = await Promise.all([
      this.prisma.$queryRawUnsafe<any[]>(query, ...params),
      this.prisma.$queryRawUnsafe<[{ count: bigint }]>(countParts.join(' '), ...params.slice(0, -2)),
    ]);

    const data = rows.map((row) => {
      const patientDisplay = this.buildPatientDisplay(row);
      const { patient_mrn, patient_first_name, patient_last_name, patient_display_name,
        patient_gender, patient_date_of_birth, patient_phone_number, patient_email,
        patient_national_id, patient_national_id_type, patient_nationality,
        patient_preferred_language, ...rest } = row;
      return { ...rest, patientDisplay };
    });

    return {
      data,
      pagination: { page, limit, total: Number(total[0]?.count ?? 0) },
    };
  }

  async getStaging(id: string) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT ts.*,
              cd.cancer_type, cd.primary_site, cd.primary_site_code,
              cd.laterality, cd.clinical_status, cd.diagnosis_date,
              cd.metastatic_status, cd.icd_code,
              cd.grade AS diagnosis_grade,
              cd.histology_morphology AS diagnosis_histology,
              p.mrn AS patient_mrn, p.display_name AS patient_display_name,
              p.first_name AS patient_first_name, p.last_name AS patient_last_name,
              p.date_of_birth AS patient_date_of_birth, p.gender AS patient_gender,
              p.phone_number AS patient_phone_number
       FROM plugin_oncology.tumor_staging ts
       JOIN plugin_oncology.cancer_diagnoses cd ON ts.cancer_diagnosis_id = cd.id
       LEFT JOIN public.patients p ON p.id = ts.patient_id
       WHERE ts.id = $1::uuid AND ts.tenant_id = $2::uuid`,
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
      `SELECT id, patient_id FROM plugin_oncology.cancer_diagnoses WHERE id = $1::uuid AND tenant_id = $2::uuid`,
      data.cancerDiagnosisId, tenantId,
    );
    if (!diagExists.length) {
      throw new NotFoundException(`Cancer diagnosis '${data.cancerDiagnosisId}' not found`);
    }

    // patient_id is always derived from the linked diagnosis — never sent by the client
    const patientId = data.patientId ?? diagExists[0].patient_id;

    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `INSERT INTO plugin_oncology.tumor_staging (
        id, tenant_id, cancer_diagnosis_id, patient_id, encounter_id, provider_id,
        staging_system, staging_edition, staging_type,
        stage_group, t_category, n_category, m_category,
        body_site, grade, histology,
        staging_date, status, notes, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), $1::uuid, $2::uuid, $3::uuid, $4::uuid, $5::uuid,
        $6, $7, $8,
        $9, $10, $11, $12,
        $13, $14, $15,
        $16::date, $17, $18, NOW(), NOW()
      ) RETURNING *`,
      tenantId,
      data.cancerDiagnosisId,
      patientId,
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
    const r = results[0];
    const stageLabel = [r.stage_group, r.t_category && `T${r.t_category}`, r.n_category && `N${r.n_category}`, r.m_category && `M${r.m_category}`].filter(Boolean).join(' ');
    await this.logTimelineEvent({
      patientId: r.patient_id,
      cancerDiagnosisId: r.cancer_diagnosis_id,
      eventType: 'staging',
      eventDate: r.staging_date ?? r.created_at,
      title: `Staged: ${r.staging_system}${stageLabel ? ` — ${stageLabel}` : ''}`,
      sourceEntity: 'tumor_staging',
      sourceId: r.id,
      metadata: {
        stagingSystem: r.staging_system,
        stagingType: r.staging_type,
        stageGroup: r.stage_group,
        tCategory: r.t_category,
        nCategory: r.n_category,
        mCategory: r.m_category,
      },
      severity: 'info',
    });
    return r;
  }

  async updateStaging(id: string, data: Record<string, unknown>) {
    const tenantId = this.getTenantId();

    const existing = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT id FROM plugin_oncology.tumor_staging WHERE id = $1::uuid AND tenant_id = $2::uuid`,
      id, tenantId,
    );
    if (!existing.length) throw new NotFoundException(`Staging record '${id}' not found`);

    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.tumor_staging SET
        staging_system   = COALESCE($3, staging_system),
        staging_edition  = COALESCE($4, staging_edition),
        staging_type     = COALESCE($5, staging_type),
        stage_group      = COALESCE($6, stage_group),
        t_category       = COALESCE($7, t_category),
        n_category       = COALESCE($8, n_category),
        m_category       = COALESCE($9, m_category),
        body_site        = COALESCE($10, body_site),
        grade            = COALESCE($11, grade),
        histology        = COALESCE($12, histology),
        staging_date     = COALESCE($13::date, staging_date),
        status           = COALESCE($14, status),
        notes            = COALESCE($15, notes),
        updated_at       = NOW()
      WHERE id = $1::uuid AND tenant_id = $2::uuid
      RETURNING *`,
      id,
      tenantId,
      data.stagingSystem ?? null,
      data.stagingEdition ?? null,
      data.stagingType ?? null,
      data.stageGroup ?? null,
      data.tCategory ?? null,
      data.nCategory ?? null,
      data.mCategory ?? null,
      data.bodySite ?? null,
      data.grade ?? null,
      data.histology ?? null,
      data.stagingDate ?? null,
      data.status ?? null,
      data.notes ?? null,
    );
    return results[0];
  }

  // ============================================
  // Oncology Care Plans
  // ============================================

  async listCarePlans(
    filters: { patientId?: string | undefined; status?: string | undefined; treatmentIntent?: string | undefined; cancerDiagnosisId?: string | undefined } = {},
    page = 1,
    limit = 20,
  ) {
    const tenantId = this.getTenantId();
    let query = `
      SELECT cp.*, cd.cancer_type, cd.primary_site,
             p.mrn AS patient_mrn, p.display_name AS patient_display_name,
             p.first_name AS patient_first_name, p.last_name AS patient_last_name,
             p.date_of_birth AS patient_date_of_birth, p.gender AS patient_gender
      FROM plugin_oncology.oncology_care_plans cp
      JOIN plugin_oncology.cancer_diagnoses cd ON cp.cancer_diagnosis_id = cd.id
      LEFT JOIN public.patients p ON p.id = cp.patient_id
      WHERE cp.tenant_id = $1::uuid`;
    const params: unknown[] = [tenantId];
    let paramIdx = 2;

    if (filters.patientId) {
      query += ` AND cp.patient_id = $${paramIdx++}::uuid`;
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

    const rows = await this.prisma.$queryRawUnsafe<any[]>(query, ...params);
    const data = rows.map((row) => {
      const patientDisplay = this.buildPatientDisplay(row);
      const clean = { ...row };
      for (const k of Object.keys(clean).filter((k) => k.startsWith('patient_') && k !== 'patient_id')) delete clean[k];
      return { ...clean, patientDisplay };
    });
    return { data };
  }

  async getCarePlan(id: string) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT cp.*, cd.cancer_type, cd.primary_site, cd.primary_site_code, cd.laterality,
              cd.clinical_status, cd.diagnosis_date, cd.metastatic_status, cd.icd_code,
              cd.grade AS diagnosis_grade, cd.histology_morphology AS diagnosis_histology,
              p.mrn AS patient_mrn, p.display_name AS patient_display_name,
              p.first_name AS patient_first_name, p.last_name AS patient_last_name,
              p.date_of_birth AS patient_date_of_birth, p.gender AS patient_gender,
              p.phone_number AS patient_phone_number
       FROM plugin_oncology.oncology_care_plans cp
       JOIN plugin_oncology.cancer_diagnoses cd ON cp.cancer_diagnosis_id = cd.id
       LEFT JOIN public.patients p ON p.id = cp.patient_id
       WHERE cp.id = $1::uuid AND cp.tenant_id = $2::uuid`,
      id,
      tenantId,
    );
    if (!results.length) throw new NotFoundException(`Care plan '${id}' not found`);
    const r = results[0];
    const pd = this.buildPatientDisplay(r);
    const clean = { ...r };
    for (const k of Object.keys(clean).filter((k) => k.startsWith('patient_'))) delete clean[k];
    return { ...clean, patientDisplay: pd };
  }

  async createCarePlan(data: Record<string, unknown>) {
    const tenantId = this.getTenantId();

    if (!data.cancerDiagnosisId) {
      throw new BadRequestException('cancerDiagnosisId is required');
    }

    const diagExists = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT id, patient_id FROM plugin_oncology.cancer_diagnoses WHERE id = $1::uuid AND tenant_id = $2::uuid`,
      data.cancerDiagnosisId, tenantId,
    );
    if (!diagExists.length) {
      throw new NotFoundException(`Cancer diagnosis '${data.cancerDiagnosisId}' not found`);
    }

    // patient_id is always derived from the linked diagnosis — never sent by the client
    const patientId = data.patientId ?? diagExists[0].patient_id;

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
        gen_random_uuid(), $1::uuid, $2::uuid, $3::uuid, $4::uuid,
        $5, $6, $7::uuid,
        $8, $9,
        $10::jsonb, $11, $12,
        $13::jsonb, $14::jsonb,
        $15, $16::date, $17::date,
        $18::uuid, $19, NOW(), NOW()
      ) RETURNING *`,
      tenantId,
      patientId,
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
      (data.createdBy as string) || this.getCurrentUserId(),
      data.notes ?? null,
    );
    const r = results[0];
    await this.logTimelineEvent({
      patientId: r.patient_id,
      cancerDiagnosisId: r.cancer_diagnosis_id,
      eventType: 'care_plan_created',
      eventDate: r.created_at,
      title: `Care Plan Created: ${r.treatment_intent ?? 'Unspecified'}`,
      sourceEntity: 'oncology_care_plan',
      sourceId: r.id,
      metadata: {
        planNumber: r.plan_number,
        treatmentIntent: r.treatment_intent,
        subspecialty: r.oncology_subspecialty,
      },
      severity: 'info',
    });
    return r;
  }

  async updateCarePlan(id: string, data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    await this.getCarePlan(id);

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
      WHERE id = $1::uuid AND tenant_id = $2::uuid
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

  async approveCarePlan(id: string) {
    const tenantId = this.getTenantId();
    // The approver is always the signed-in user; it is never taken from the request body.
    const approvedBy = this.getCurrentUserId();
    if (!approvedBy) throw new BadRequestException('A signed-in user is required to approve a care plan');
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.oncology_care_plans SET
        status = 'active',
        approved_by = $3::uuid,
        approved_at = NOW(),
        updated_at = NOW()
      WHERE id = $1::uuid AND tenant_id = $2::uuid AND status = 'draft'
      RETURNING *`,
      id,
      tenantId,
      approvedBy,
    );
    if (!results.length) throw new NotFoundException(`Care plan '${id}' not found or not in draft status`);
    const r = results[0];
    await this.logTimelineEvent({
      patientId: r.patient_id,
      cancerDiagnosisId: r.cancer_diagnosis_id,
      eventType: 'care_plan_approved',
      eventDate: r.approved_at ?? r.updated_at,
      title: `Care Plan Approved: ${r.treatment_intent ?? r.plan_number}`,
      sourceEntity: 'oncology_care_plan',
      sourceId: r.id,
      metadata: { planNumber: r.plan_number, treatmentIntent: r.treatment_intent },
      severity: 'milestone',
    });
    return r;
  }

  async reviseCarePlan(id: string, data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const existing = await this.getCarePlan(id);

    await this.prisma.$queryRawUnsafe(
      `UPDATE plugin_oncology.oncology_care_plans SET status = 'revised', updated_at = NOW() WHERE id = $1::uuid AND tenant_id = $2::uuid`,
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
      `SELECT COUNT(*) as count FROM plugin_oncology.oncology_care_plans WHERE tenant_id = $1::uuid AND plan_number LIKE $2`,
      tenantId, `${prefix}%`,
    );
    const seq = Number(result[0]?.count ?? 0) + 1;
    return `${prefix}-${String(seq).padStart(5, '0')}`;
  }

  // ============================================
  // Tumor Board
  // ============================================

  async listTumorBoardCases(filters: { status?: string | undefined; date?: string | undefined; patientId?: string | undefined } = {}, page = 1, limit = 20) {
    const tenantId = this.getTenantId();
    let query = `
      SELECT tbc.*, cd.cancer_type, cd.primary_site,
        p.mrn as patient_mrn, p.first_name as patient_first_name,
        p.last_name as patient_last_name, p.display_name as patient_display_name,
        p.gender as patient_gender, p.date_of_birth as patient_date_of_birth,
        p.phone_number as patient_phone_number, p.email as patient_email,
        p.national_id as patient_national_id, p.national_id_type as patient_national_id_type,
        p.nationality as patient_nationality, p.preferred_language as patient_preferred_language
      FROM plugin_oncology.tumor_board_cases tbc
      JOIN plugin_oncology.cancer_diagnoses cd ON tbc.cancer_diagnosis_id = cd.id
      LEFT JOIN public.patients p ON p.id = tbc.patient_id
      WHERE tbc.tenant_id = $1::uuid`;
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
      query += ` AND tbc.patient_id = $${paramIdx++}::uuid`;
      params.push(filters.patientId);
    }

    query += ` ORDER BY tbc.meeting_date DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
    params.push(limit, (page - 1) * limit);

    const rows = await this.prisma.$queryRawUnsafe<any[]>(query, ...params);

    const data = rows.map((row) => {
      const patientDisplay = this.buildPatientDisplay(row);
      const { patient_mrn, patient_first_name, patient_last_name, patient_display_name,
        patient_gender, patient_date_of_birth, patient_phone_number, patient_email,
        patient_national_id, patient_national_id_type, patient_nationality,
        patient_preferred_language, ...rest } = row;
      return { ...rest, patientDisplay };
    });

    return { data };
  }

  async getTumorBoardCase(id: string) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT tbc.*, cd.cancer_type, cd.primary_site, cd.primary_site_code,
              cd.laterality, cd.clinical_status, cd.diagnosis_date,
              cd.metastatic_status, cd.icd_code,
              cd.grade AS diagnosis_grade,
              cd.histology_morphology AS diagnosis_histology,
              p.mrn AS patient_mrn, p.display_name AS patient_display_name,
              p.first_name AS patient_first_name, p.last_name AS patient_last_name,
              p.date_of_birth AS patient_date_of_birth, p.gender AS patient_gender,
              p.phone_number AS patient_phone_number
       FROM plugin_oncology.tumor_board_cases tbc
       JOIN plugin_oncology.cancer_diagnoses cd ON tbc.cancer_diagnosis_id = cd.id
       LEFT JOIN public.patients p ON p.id = tbc.patient_id
       WHERE tbc.id = $1::uuid AND tbc.tenant_id = $2::uuid`,
      id,
      tenantId,
    );
    if (!results.length) throw new NotFoundException(`Tumor board case '${id}' not found`);
    return results[0];
  }

  async createTumorBoardCase(data: Record<string, unknown>) {
    const tenantId = this.getTenantId();

    if (!data.cancerDiagnosisId) {
      throw new BadRequestException('cancerDiagnosisId is required');
    }

    const diagExists = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT id, patient_id FROM plugin_oncology.cancer_diagnoses WHERE id = $1::uuid AND tenant_id = $2::uuid`,
      data.cancerDiagnosisId, tenantId,
    );
    if (!diagExists.length) {
      throw new NotFoundException(`Cancer diagnosis '${data.cancerDiagnosisId}' not found`);
    }

    // patient_id is always derived from the linked diagnosis
    const patientId = data.patientId ?? diagExists[0].patient_id;
    const presentedBy = data.presentedBy ?? this.getCurrentUserId();

    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `INSERT INTO plugin_oncology.tumor_board_cases (
        id, tenant_id, patient_id, cancer_diagnosis_id, staging_id,
        meeting_date, presented_by, attendees,
        clinical_summary, imaging_findings, pathology_report, molecular_profile,
        mdt_recommendation, treatment_intent, recommended_pathway,
        treatment_plan, decision, review_outcome,
        follow_up_actions, status, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), $1::uuid, $2::uuid, $3::uuid, $4::uuid,
        $5::date, $6::uuid, $7::jsonb,
        $8, $9, $10, $11,
        $12, $13, $14::jsonb,
        $15::jsonb, $16, $17,
        $18::jsonb, $19, NOW(), NOW()
      ) RETURNING *`,
      tenantId,
      patientId,
      data.cancerDiagnosisId,
      data.stagingId ?? null,
      data.meetingDate,
      presentedBy,
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
    const r = results[0];
    await this.logTimelineEvent({
      patientId: r.patient_id,
      cancerDiagnosisId: r.cancer_diagnosis_id,
      eventType: 'tumor_board',
      eventDate: r.meeting_date ?? r.created_at,
      title: 'MDT Case Presented',
      sourceEntity: 'tumor_board_case',
      sourceId: r.id,
      metadata: { treatmentIntent: r.treatment_intent, status: r.status },
      severity: 'info',
    });
    return r;
  }

  async updateTumorBoardCase(id: string, data: Record<string, unknown>) {
    const tenantId = this.getTenantId();

    const existing = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT id FROM plugin_oncology.tumor_board_cases WHERE id = $1::uuid AND tenant_id = $2::uuid`,
      id, tenantId,
    );
    if (!existing.length) throw new NotFoundException(`Tumor board case '${id}' not found`);

    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.tumor_board_cases SET
        meeting_date        = COALESCE($3::date, meeting_date),
        presented_by        = COALESCE($4, presented_by),
        attendees           = COALESCE($5::jsonb, attendees),
        clinical_summary    = COALESCE($6, clinical_summary),
        imaging_findings    = COALESCE($7, imaging_findings),
        pathology_report    = COALESCE($8, pathology_report),
        molecular_profile   = COALESCE($9, molecular_profile),
        mdt_recommendation  = COALESCE($10, mdt_recommendation),
        treatment_intent    = COALESCE($11, treatment_intent),
        recommended_pathway = COALESCE($12::jsonb, recommended_pathway),
        review_outcome      = COALESCE($13, review_outcome),
        status              = COALESCE($14, status),
        updated_at          = NOW()
      WHERE id = $1::uuid AND tenant_id = $2::uuid
      RETURNING *`,
      id,
      tenantId,
      data.meetingDate ?? null,
      data.presentedBy ?? null,
      data.attendees != null ? JSON.stringify(data.attendees) : null,
      data.clinicalSummary ?? null,
      data.imagingFindings ?? null,
      data.pathologyReport ?? null,
      data.molecularProfile ?? null,
      data.mdtRecommendation ?? null,
      data.treatmentIntent ?? null,
      data.recommendedPathway != null ? JSON.stringify(data.recommendedPathway) : null,
      data.reviewOutcome ?? null,
      data.status ?? null,
    );
    const r = results[0];
    if (r.status === 'completed' && r.treatment_intent) {
      await this.logTimelineEvent({
        patientId: r.patient_id,
        cancerDiagnosisId: r.cancer_diagnosis_id,
        eventType: 'tumor_board_decision',
        eventDate: r.meeting_date ?? r.updated_at,
        title: `MDT Decision: ${r.treatment_intent}`,
        sourceEntity: 'tumor_board_case',
        sourceId: r.id,
        metadata: { treatmentIntent: r.treatment_intent, mdtRecommendation: r.mdt_recommendation },
        severity: 'milestone',
      });
    }
    return r;
  }

  // ============================================
  // Chemo Protocols (Phase 2 — kept for backward compat)
  // ============================================

  async listProtocols(cancerType?: string, page = 1, limit = 20) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM plugin_oncology.chemo_protocols WHERE tenant_id = $1::uuid ${cancerType ? 'AND cancer_type ILIKE $2' : ''} AND is_active = true ORDER BY name LIMIT $${cancerType ? '3' : '2'} OFFSET $${cancerType ? '4' : '3'}`,
      tenantId,
      ...(cancerType ? [`%${cancerType}%`] : []),
      limit,
      (page - 1) * limit,
    );
    return { data: results.map(normalizeProtocolRow) };
  }

  async getProtocol(id: string) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM plugin_oncology.chemo_protocols WHERE id = $1::uuid AND tenant_id = $2::uuid`,
      id,
      tenantId,
    );
    if (!results.length) throw new NotFoundException(`Protocol '${id}' not found`);
    return normalizeProtocolRow(results[0]);
  }

  async createProtocol(data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    // v2: phases are the source of truth; legacy columns are derived from them
    const phases = data.phases !== undefined ? parsePhases(data.phases) : null;
    if (phases) Object.assign(data, deriveLegacyColumns(phases));
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `INSERT INTO plugin_oncology.chemo_protocols (
        id, tenant_id, code, name, description, cancer_type, intent,
        regimen, total_cycles, cycle_duration_days, premedications,
        "supportiveCare", emetogenic_risk, dose_formula, lab_prerequisites, hydration,
        is_active, created_at, updated_at, created_by, phases
      ) VALUES (
        gen_random_uuid(), $1::uuid, $2, $3, $4, $5, $6,
        $7::jsonb, $8, $9, $10::jsonb,
        $11::jsonb, $12, $13, $14::jsonb, $15::jsonb,
        $16, NOW(), NOW(), $17::uuid, $18::jsonb
      ) RETURNING *`,
      tenantId,
      data.code,
      data.name,
      data.description ?? null,
      data.cancerType,
      data.intent,
      JSON.stringify(data.regimen ?? []),
      data.totalCycles,
      data.cycleDurationDays,
      JSON.stringify(data.premedications ?? []),
      JSON.stringify(data.supportiveCare ?? []),
      data.emetogenicRisk ?? null,
      data.doseFormula ?? 'bsa',
      JSON.stringify(data.labPrerequisites ?? []),
      JSON.stringify(data.hydration ?? []),
      data.isActive ?? true,
      this.getCurrentUserId(),
      JSON.stringify(phases ?? []),
    );
    return normalizeProtocolRow(results[0]);
  }

  async updateProtocol(id: string, data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const existing = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT id FROM plugin_oncology.chemo_protocols WHERE id = $1::uuid AND tenant_id = $2::uuid`,
      id, tenantId,
    );
    if (!existing.length) throw new NotFoundException(`Protocol '${id}' not found`);

    const phases = data.phases !== undefined ? parsePhases(data.phases) : null;
    if (phases) Object.assign(data, deriveLegacyColumns(phases));

    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.chemo_protocols SET
        name                = COALESCE($3, name),
        description         = COALESCE($4, description),
        cancer_type         = COALESCE($5, cancer_type),
        intent              = COALESCE($6, intent),
        regimen             = COALESCE($7::jsonb, regimen),
        total_cycles        = COALESCE($8, total_cycles),
        cycle_duration_days = COALESCE($9, cycle_duration_days),
        premedications      = COALESCE($10::jsonb, premedications),
        "supportiveCare"    = COALESCE($11::jsonb, "supportiveCare"),
        emetogenic_risk     = COALESCE($12, emetogenic_risk),
        dose_formula        = COALESCE($13, dose_formula),
        lab_prerequisites   = COALESCE($14::jsonb, lab_prerequisites),
        hydration           = COALESCE($15::jsonb, hydration),
        phases              = COALESCE($16::jsonb, phases),
        updated_at          = NOW()
      WHERE id = $1::uuid AND tenant_id = $2::uuid
      RETURNING *`,
      id,
      tenantId,
      data.name ?? null,
      data.description ?? null,
      data.cancerType ?? null,
      data.intent ?? null,
      data.regimen ? JSON.stringify(data.regimen) : null,
      data.totalCycles ?? null,
      data.cycleDurationDays ?? null,
      data.premedications ? JSON.stringify(data.premedications) : null,
      data.supportiveCare ? JSON.stringify(data.supportiveCare) : null,
      data.emetogenicRisk ?? null,
      data.doseFormula ?? null,
      data.labPrerequisites ? JSON.stringify(data.labPrerequisites) : null,
      data.hydration ? JSON.stringify(data.hydration) : null,
      phases ? JSON.stringify(phases) : null,
    );
    return normalizeProtocolRow(results[0]);
  }

  async deactivateProtocol(id: string) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.chemo_protocols SET is_active = false, updated_at = NOW()
       WHERE id = $1::uuid AND tenant_id = $2::uuid RETURNING *`,
      id, tenantId,
    );
    if (!results.length) throw new NotFoundException(`Protocol '${id}' not found`);
    return results[0];
  }

  // ============================================
  // Chemo Orders
  // ============================================

  async listChemoOrders(filters: { patientId?: string; status?: string; date?: string; cancerDiagnosisId?: string } = {}, page = 1, limit = 20) {
    const tenantId = this.getTenantId();
    const baseJoin = `
      SELECT co.*, cp.name as protocol_name, cp.code as protocol_code,
        cd.cancer_type, cd.primary_site,
        p.mrn as patient_mrn, p.first_name as patient_first_name, p.last_name as patient_last_name,
        p.display_name as patient_display_name, p.date_of_birth as patient_date_of_birth,
        p.gender as patient_gender, p.phone_number as patient_phone_number,
        p.email as patient_email, p.national_id as patient_national_id,
        p.national_id_type as patient_national_id_type, p.nationality as patient_nationality,
        p.preferred_language as patient_preferred_language
      FROM plugin_oncology.chemo_orders co
      JOIN plugin_oncology.chemo_protocols cp ON co.protocol_id = cp.id
      LEFT JOIN plugin_oncology.cancer_diagnoses cd ON cd.id = co.cancer_diagnosis_id
      LEFT JOIN public.patients p ON p.id = co.patient_id
      WHERE co.tenant_id = $1::uuid`;
    const params: unknown[] = [tenantId];
    let paramIdx = 2;
    let filterClause = '';

    if (filters.patientId) { filterClause += ` AND co.patient_id = $${paramIdx++}::uuid`; params.push(filters.patientId); }
    if (filters.status) { filterClause += ` AND co.status = $${paramIdx++}`; params.push(filters.status); }
    if (filters.date) { filterClause += ` AND co.scheduled_date = $${paramIdx++}::date`; params.push(filters.date); }
    if (filters.cancerDiagnosisId) { filterClause += ` AND co.cancer_diagnosis_id = $${paramIdx++}::uuid`; params.push(filters.cancerDiagnosisId); }

    const dataQuery = baseJoin + filterClause + ` ORDER BY co.scheduled_date DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
    params.push(limit, (page - 1) * limit);

    const rows = await this.prisma.$queryRawUnsafe<any[]>(dataQuery, ...params);
    const results = rows.map((r) => {
      const pd = this.buildPatientDisplay(r);
      const clean = { ...r };
      for (const k of Object.keys(clean).filter((k) => k.startsWith('patient_'))) delete clean[k];
      return { ...clean, patientDisplay: pd };
    });
    return { data: results };
  }

  async getChemoOrder(id: string) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT co.*, cp.name as protocol_name, cp.code as protocol_code,
        cp.regimen as protocol_regimen, cp.phases as protocol_phases, cp.premedications as protocol_premedications,
        cp.hydration as protocol_hydration, cp.lab_prerequisites as protocol_lab_prerequisites,
        cp.emetogenic_risk as protocol_emetogenic_risk, cp.total_cycles as protocol_total_cycles,
        cp.cycle_duration_days as protocol_cycle_duration_days, cp.dose_formula as protocol_dose_formula,
        cd.cancer_type, cd.primary_site, cd.primary_site_code, cd.laterality,
        cd.clinical_status, cd.diagnosis_date, cd.metastatic_status, cd.icd_code,
        cd.grade AS diagnosis_grade, cd.histology_morphology AS diagnosis_histology,
        p.mrn as patient_mrn, p.first_name as patient_first_name, p.last_name as patient_last_name,
        p.display_name as patient_display_name, p.date_of_birth as patient_date_of_birth,
        p.gender as patient_gender, p.phone_number as patient_phone_number,
        p.email as patient_email, p.national_id as patient_national_id,
        p.national_id_type as patient_national_id_type, p.nationality as patient_nationality,
        p.preferred_language as patient_preferred_language
      FROM plugin_oncology.chemo_orders co
      JOIN plugin_oncology.chemo_protocols cp ON co.protocol_id = cp.id
      LEFT JOIN plugin_oncology.cancer_diagnoses cd ON cd.id = co.cancer_diagnosis_id
      LEFT JOIN public.patients p ON p.id = co.patient_id
      WHERE co.id = $1::uuid AND co.tenant_id = $2::uuid`,
      id, tenantId,
    );
    if (!results.length) throw new NotFoundException(`Chemo order '${id}' not found`);
    const r = results[0];
    // Phased protocols: show only what this order's cycle gives, with its
    // cycle-specific doses/days. Legacy protocols keep the flat regimen.
    if (Array.isArray(r.protocol_phases) && r.protocol_phases.length) {
      r.protocol_regimen = regimenForCycle(r.protocol_phases, r.cycle_number) ?? r.protocol_regimen;
    }
    const pd = this.buildPatientDisplay(r);
    const clean = { ...r };
    for (const k of Object.keys(clean).filter((k) => k.startsWith('patient_'))) delete clean[k];
    return { ...clean, patientDisplay: pd };
  }

  async createChemoOrder(data: Record<string, unknown>) {
    const tenantId = this.getTenantId();

    // Derive patientId from cancerDiagnosis if not provided
    let patientId = data.patientId as string | undefined;
    if (!patientId && data.cancerDiagnosisId) {
      const diag = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT patient_id FROM plugin_oncology.cancer_diagnoses WHERE id = $1::uuid AND tenant_id = $2::uuid`,
        data.cancerDiagnosisId, tenantId,
      );
      if (diag.length) patientId = diag[0].patient_id;
    }
    if (!patientId) throw new BadRequestException('patientId or cancerDiagnosisId is required');

    // The ordering provider is always the signed-in user (never client-supplied), so the
    // approve step can enforce that a different clinician signs off.
    const orderingProvider = this.getCurrentUserId();
    if (!orderingProvider) throw new BadRequestException('A signed-in user is required to create a chemo order');
    const initialStatus = this.rule(() => resolveInitialStatus(data.status));

    if (!data.protocolId) throw new BadRequestException('protocolId is required');
    const cycleNumber = Number(data.cycleNumber);
    const dayNumber = Number(data.dayNumber);
    if (!Number.isInteger(cycleNumber) || cycleNumber < 1) throw new BadRequestException('cycleNumber must be a positive integer');
    if (!Number.isInteger(dayNumber) || dayNumber < 1) throw new BadRequestException('dayNumber must be a positive integer');
    if (!data.scheduledDate) throw new BadRequestException('scheduledDate is required');
    const protocol = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT is_active FROM plugin_oncology.chemo_protocols WHERE id = $1::uuid AND tenant_id = $2::uuid`,
      data.protocolId, tenantId,
    );
    if (!protocol.length) throw new BadRequestException(`Chemo protocol '${String(data.protocolId)}' not found`);
    if (!protocol[0].is_active) throw new BadRequestException('Chemo protocol is inactive; choose an active protocol');

    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `INSERT INTO plugin_oncology.chemo_orders (
        id, tenant_id, patient_id, encounter_id, protocol_id, ordering_provider,
        cancer_diagnosis_id, oncology_care_plan_id,
        cycle_number, day_number, scheduled_date,
        bsa, weight, height, creatinine_clearance,
        hepatic_adjustment_grade, renal_adjustment_grade,
        dose_adjustments, pre_chemo_checklist,
        status, notes, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), $1::uuid, $2::uuid, $3::uuid, $4::uuid, $5::uuid,
        $6::uuid, $7::uuid,
        $8, $9, $10::date,
        $11, $12, $13, $14,
        $15, $16,
        $17::jsonb, $18::jsonb,
        $19, $20, NOW(), NOW()
      ) RETURNING *`,
      tenantId,
      patientId,
      data.encounterId ?? null,
      data.protocolId,
      orderingProvider,
      data.cancerDiagnosisId ?? null,
      data.oncologyCarePlanId ?? null,
      cycleNumber,
      dayNumber,
      data.scheduledDate,
      data.bsa ?? null,
      data.weight ?? null,
      data.height ?? null,
      data.creatinineClearance ?? null,
      data.hepaticAdjustmentGrade ?? null,
      data.renalAdjustmentGrade ?? null,
      JSON.stringify(data.doseAdjustments ?? []),
      JSON.stringify(data.preChemoChecklist ?? {}),
      initialStatus,
      data.notes ?? null,
    );
    const r = results[0];
    const protocolTotalCycles = await this.getProtocolTotalCycles(tenantId, r.protocol_id);
    await this.logTimelineEvent({
      patientId: r.patient_id,
      cancerDiagnosisId: r.cancer_diagnosis_id ?? null,
      eventType: 'chemo_ordered',
      eventDate: r.scheduled_date ?? r.created_at,
      title: `Chemo Ordered: ${r.protocol_name ?? r.protocol_code ?? 'Protocol'} C${r.cycle_number}D${r.day_number}`,
      sourceEntity: 'chemo_order',
      sourceId: r.id,
      metadata: { protocol: r.protocol_name ?? r.protocol_code, cycleNumber: r.cycle_number, dayNumber: r.day_number, scheduledDate: r.scheduled_date, protocolTotalCycles },
      severity: 'info',
    });
    return r;
  }

  async updateChemoOrder(id: string, data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const existing = await this.getOrderSnapshot(id, tenantId);
    this.rule(() => assertCanEdit(existing));

    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.chemo_orders SET
        scheduled_date          = COALESCE($3::date, scheduled_date),
        cycle_number            = COALESCE($4, cycle_number),
        day_number              = COALESCE($5, day_number),
        bsa                     = COALESCE($6, bsa),
        weight                  = COALESCE($7, weight),
        height                  = COALESCE($8, height),
        creatinine_clearance    = COALESCE($9, creatinine_clearance),
        hepatic_adjustment_grade = COALESCE($10, hepatic_adjustment_grade),
        renal_adjustment_grade  = COALESCE($11, renal_adjustment_grade),
        dose_adjustments        = COALESCE($12::jsonb, dose_adjustments),
        pre_chemo_checklist     = COALESCE($13::jsonb, pre_chemo_checklist),
        notes                   = COALESCE($14, notes),
        updated_at              = NOW()
      WHERE id = $1::uuid AND tenant_id = $2::uuid AND status IN ('draft','pending')
      RETURNING *`,
      id, tenantId,
      data.scheduledDate ?? null,
      data.cycleNumber ?? null,
      data.dayNumber ?? null,
      data.bsa ?? null,
      data.weight ?? null,
      data.height ?? null,
      data.creatinineClearance ?? null,
      data.hepaticAdjustmentGrade ?? null,
      data.renalAdjustmentGrade ?? null,
      data.doseAdjustments ? JSON.stringify(data.doseAdjustments) : null,
      data.preChemoChecklist ? JSON.stringify(data.preChemoChecklist) : null,
      data.notes ?? null,
    );
    if (!results.length) throw new BadRequestException('Order status changed; reload and try again');
    return results[0];
  }

  /** draft → pending: hands a draft order over for approval. */
  async submitChemoOrder(id: string) {
    const tenantId = this.getTenantId();
    const existing = await this.getOrderSnapshot(id, tenantId);
    this.rule(() => assertCanSubmit(existing));
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.chemo_orders SET status = 'pending', updated_at = NOW()
      WHERE id = $1::uuid AND tenant_id = $2::uuid AND status = 'draft' RETURNING *`,
      id, tenantId,
    );
    if (!results.length) throw new BadRequestException('Order status changed; reload and try again');
    return results[0];
  }

  async approveChemoOrder(id: string) {
    const tenantId = this.getTenantId();
    const existing = await this.getOrderSnapshot(id, tenantId);
    const approver = this.rule(() => assertCanApprove(existing, this.getCurrentUserId()));

    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.chemo_orders SET
        status = 'approved', approved_by = $3::uuid, approved_at = NOW(), updated_at = NOW()
      WHERE id = $1::uuid AND tenant_id = $2::uuid AND status = 'pending' RETURNING *`,
      id, tenantId, approver,
    );
    if (!results.length) throw new BadRequestException('Order status changed; reload and try again');
    const r = results[0];
    const protocolTotalCycles = await this.getProtocolTotalCycles(tenantId, r.protocol_id);
    await this.logTimelineEvent({
      patientId: r.patient_id,
      cancerDiagnosisId: r.cancer_diagnosis_id ?? null,
      eventType: 'chemo_approved',
      eventDate: r.approved_at ?? r.updated_at,
      title: `Chemo Approved: ${r.protocol_name ?? r.protocol_code ?? 'Protocol'} C${r.cycle_number}D${r.day_number}`,
      sourceEntity: 'chemo_order',
      sourceId: r.id,
      metadata: { protocol: r.protocol_name ?? r.protocol_code, cycleNumber: r.cycle_number, dayNumber: r.day_number, protocolTotalCycles },
      severity: 'info',
    });
    return r;
  }

  async verifyChemoOrder(id: string, secondVerifiedBy?: string, nurseVerificationChecklist?: Record<string, unknown>, drugPreparationDetails?: unknown[]) {
    const tenantId = this.getTenantId();
    const existing = await this.getOrderSnapshot(id, tenantId);
    const requireDualSign = await this.settings.requireDualSign(tenantId);
    const { verifier, secondVerifier } = this.rule(() =>
      assertCanVerify(existing, this.getCurrentUserId(), secondVerifiedBy, requireDualSign),
    );

    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.chemo_orders SET
        status = 'verified', verified_by = $3::uuid, verified_at = NOW(),
        second_verified_by = $4::uuid,
        nurse_verification_checklist = $5::jsonb,
        drug_preparation_details = $6::jsonb,
        updated_at = NOW()
      WHERE id = $1::uuid AND tenant_id = $2::uuid AND status = 'approved' RETURNING *`,
      id, tenantId, verifier, secondVerifier,
      JSON.stringify(nurseVerificationChecklist ?? {}),
      JSON.stringify(drugPreparationDetails ?? []),
    );
    if (!results.length) throw new BadRequestException('Order status changed; reload and try again');
    return results[0];
  }

  async updateAdministrationProgress(id: string, data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const existing = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT id, status FROM plugin_oncology.chemo_orders WHERE id = $1::uuid AND tenant_id = $2::uuid`,
      id, tenantId,
    );
    if (!existing.length) throw new NotFoundException(`Chemo order '${id}' not found`);
    if (existing[0].status !== 'in_progress') throw new BadRequestException('Order must be in progress to update administration');

    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.chemo_orders SET
        administration_details = $3::jsonb,
        adverse_reactions = $4::jsonb,
        updated_at = NOW()
      WHERE id = $1::uuid AND tenant_id = $2::uuid RETURNING *`,
      id, tenantId,
      JSON.stringify(data.administrationDetails ?? []),
      JSON.stringify(data.adverseReactions ?? []),
    );
    return results[0];
  }

  async startAdministration(id: string) {
    const tenantId = this.getTenantId();
    const existing = await this.getOrderSnapshot(id, tenantId);
    const requireDualSign = await this.settings.requireDualSign(tenantId);
    const administrator = this.rule(() => assertCanStart(existing, this.getCurrentUserId(), requireDualSign));

    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.chemo_orders SET
        status = 'in_progress', administered_at = NOW(), administered_by = $3::uuid, updated_at = NOW()
      WHERE id = $1::uuid AND tenant_id = $2::uuid AND status = $4 RETURNING *`,
      id, tenantId, administrator, existing.status,
    );
    if (!results.length) throw new BadRequestException('Order status changed; reload and try again');
    const r = results[0];
    const protocolTotalCycles = await this.getProtocolTotalCycles(tenantId, r.protocol_id);
    await this.logTimelineEvent({
      patientId: r.patient_id,
      cancerDiagnosisId: r.cancer_diagnosis_id ?? null,
      eventType: 'chemo_started',
      eventDate: r.administered_at ?? r.updated_at,
      title: `Chemo Started: ${r.protocol_name ?? r.protocol_code ?? 'Protocol'} C${r.cycle_number}D${r.day_number}`,
      sourceEntity: 'chemo_order',
      sourceId: r.id,
      metadata: { protocol: r.protocol_name ?? r.protocol_code, cycleNumber: r.cycle_number, dayNumber: r.day_number, bsa: r.bsa, protocolTotalCycles },
      severity: 'milestone',
    });
    return r;
  }

  async completeAdministration(id: string, data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const existing = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT id, status FROM plugin_oncology.chemo_orders WHERE id = $1::uuid AND tenant_id = $2::uuid`,
      id, tenantId,
    );
    if (!existing.length) throw new NotFoundException(`Chemo order '${id}' not found`);
    if (existing[0].status !== 'in_progress') throw new BadRequestException('Order must be in progress to complete');

    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.chemo_orders SET
        status = 'completed',
        administration_details = $3::jsonb,
        adverse_reactions = $4::jsonb,
        notes = COALESCE($5, notes),
        updated_at = NOW()
      WHERE id = $1::uuid AND tenant_id = $2::uuid RETURNING *`,
      id, tenantId,
      JSON.stringify(data.administrationDetails ?? []),
      JSON.stringify(data.adverseReactions ?? []),
      data.notes ?? null,
    );
    const r = results[0];
    await this.syncTreatmentDay(r.id, 'given');
    const protocolTotalCycles = await this.getProtocolTotalCycles(tenantId, r.protocol_id);
    await this.logTimelineEvent({
      patientId: r.patient_id,
      cancerDiagnosisId: r.cancer_diagnosis_id ?? null,
      eventType: 'chemo_completed',
      eventDate: r.updated_at,
      title: `Chemo Completed: ${r.protocol_name ?? r.protocol_code ?? 'Protocol'} C${r.cycle_number}D${r.day_number}`,
      sourceEntity: 'chemo_order',
      sourceId: r.id,
      metadata: { protocol: r.protocol_name ?? r.protocol_code, cycleNumber: r.cycle_number, dayNumber: r.day_number, protocolTotalCycles },
      severity: 'milestone',
    });
    return r;
  }

  async holdChemoOrder(id: string, reason: string) {
    const tenantId = this.getTenantId();
    const existing = await this.getOrderSnapshot(id, tenantId);
    this.rule(() => assertCanHold(existing));
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.chemo_orders SET
        status = 'held',
        notes = CONCAT(COALESCE(notes, ''), $3),
        updated_at = NOW()
      WHERE id = $1::uuid AND tenant_id = $2::uuid AND status = $4 RETURNING *`,
      id, tenantId,
      reason ? `\n[HELD] ${reason}` : '\n[HELD]',
      existing.status,
    );
    if (!results.length) throw new BadRequestException('Order status changed; reload and try again');
    const r = results[0];
    await this.syncTreatmentDay(r.id, 'held');
    const protocolTotalCycles = await this.getProtocolTotalCycles(tenantId, r.protocol_id);
    await this.logTimelineEvent({
      patientId: r.patient_id,
      cancerDiagnosisId: r.cancer_diagnosis_id ?? null,
      eventType: 'chemo_held',
      eventDate: r.updated_at,
      title: `Chemo Held: ${r.protocol_name ?? r.protocol_code ?? 'Protocol'} C${r.cycle_number}D${r.day_number}`,
      sourceEntity: 'chemo_order',
      sourceId: r.id,
      metadata: { protocol: r.protocol_name ?? r.protocol_code, cycleNumber: r.cycle_number, dayNumber: r.day_number, reason, protocolTotalCycles },
      severity: 'warning',
    });
    return r;
  }

  async cancelChemoOrder(id: string, reason: string) {
    const tenantId = this.getTenantId();
    const existing = await this.getOrderSnapshot(id, tenantId);
    this.rule(() => assertCanCancel(existing));
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.chemo_orders SET
        status = 'cancelled',
        notes = CONCAT(COALESCE(notes, ''), $3),
        updated_at = NOW()
      WHERE id = $1::uuid AND tenant_id = $2::uuid AND status = $4 RETURNING *`,
      id, tenantId,
      reason ? `\n[CANCELLED] ${reason}` : '\n[CANCELLED]',
      existing.status,
    );
    if (!results.length) throw new BadRequestException('Order status changed; reload and try again');
    const r = results[0];
    await this.syncTreatmentDay(r.id, 'cancelled');
    const protocolTotalCycles = await this.getProtocolTotalCycles(tenantId, r.protocol_id);
    await this.logTimelineEvent({
      patientId: r.patient_id,
      cancerDiagnosisId: r.cancer_diagnosis_id ?? null,
      eventType: 'chemo_cancelled',
      eventDate: r.updated_at,
      title: `Chemo Cancelled: ${r.protocol_name ?? r.protocol_code ?? 'Protocol'} C${r.cycle_number}D${r.day_number}`,
      sourceEntity: 'chemo_order',
      sourceId: r.id,
      metadata: { protocol: r.protocol_name ?? r.protocol_code, cycleNumber: r.cycle_number, dayNumber: r.day_number, reason, protocolTotalCycles },
      severity: 'warning',
    });
    return r;
  }

  /**
   * held → pending. Earlier approval and verification are cleared because whatever caused
   * the hold (labs, patient condition) means the order must be signed off again.
   */
  async resumeChemoOrder(id: string, reason: string) {
    const tenantId = this.getTenantId();
    const existing = await this.getOrderSnapshot(id, tenantId);
    this.rule(() => assertCanResume(existing));
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.chemo_orders SET
        status = 'pending',
        approved_by = NULL, approved_at = NULL,
        verified_by = NULL, verified_at = NULL, second_verified_by = NULL,
        administered_by = NULL, administered_at = NULL,
        notes = CONCAT(COALESCE(notes, ''), $3),
        updated_at = NOW()
      WHERE id = $1::uuid AND tenant_id = $2::uuid AND status = 'held' RETURNING *`,
      id, tenantId,
      reason ? `\n[RESUMED] ${reason}` : '\n[RESUMED]',
    );
    if (!results.length) throw new BadRequestException('Order status changed; reload and try again');
    const r = results[0];
    await this.syncTreatmentDay(r.id, 'ordered');
    const protocolTotalCycles = await this.getProtocolTotalCycles(tenantId, r.protocol_id);
    await this.logTimelineEvent({
      patientId: r.patient_id,
      cancerDiagnosisId: r.cancer_diagnosis_id ?? null,
      eventType: 'chemo_resumed',
      eventDate: r.updated_at,
      title: `Chemo Resumed: ${r.protocol_name ?? r.protocol_code ?? 'Protocol'} C${r.cycle_number}D${r.day_number}`,
      sourceEntity: 'chemo_order',
      sourceId: r.id,
      metadata: { protocol: r.protocol_name ?? r.protocol_code, cycleNumber: r.cycle_number, dayNumber: r.day_number, reason, protocolTotalCycles },
      severity: 'info',
    });
    return r;
  }

  // ============================================================
  // Catalog: Cancer Types
  // ============================================================

  async listCancerTypes(
    filters: { search?: string | undefined; active?: string | undefined } = {},
    page = 1,
    limit = 50,
  ) {
    const tenantId = this.getTenantId();
    const offset = (page - 1) * limit;
    const conditions: string[] = ['tenant_id = $1::uuid'];
    const params: unknown[] = [tenantId];

    if (filters.active !== undefined) {
      params.push(filters.active === 'false' ? false : true);
      conditions.push(`active = $${params.length}`);
    }
    if (filters.search) {
      params.push(`%${filters.search}%`);
      conditions.push(`(name ILIKE $${params.length} OR code ILIKE $${params.length})`);
    }

    const where = conditions.join(' AND ');
    const [rows, countRows] = await Promise.all([
      this.prisma.$queryRawUnsafe<any[]>(
        `SELECT * FROM plugin_oncology.oncology_cancer_type_master
         WHERE ${where} ORDER BY name ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        ...params, limit, offset,
      ),
      this.prisma.$queryRawUnsafe<any[]>(
        `SELECT COUNT(*)::int AS total FROM plugin_oncology.oncology_cancer_type_master WHERE ${where}`,
        ...params,
      ),
    ]);
    return { data: rows, total: countRows[0]?.total ?? 0, page, limit };
  }

  async getCancerType(id: string) {
    const tenantId = this.getTenantId();
    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM plugin_oncology.oncology_cancer_type_master
       WHERE id = $1::uuid AND tenant_id = $2::uuid`,
      id, tenantId,
    );
    if (!rows.length) throw new NotFoundException(`Cancer type '${id}' not found`);
    return rows[0];
  }

  async createCancerType(data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `INSERT INTO plugin_oncology.oncology_cancer_type_master
         (id, tenant_id, code, name, category, description, active, created_at, updated_at)
       VALUES (gen_random_uuid(), $1::uuid, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
      tenantId,
      data.code,
      data.name,
      data.category ?? null,
      data.description ?? null,
      data.active ?? true,
    );
    return results[0];
  }

  async updateCancerType(id: string, data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.oncology_cancer_type_master SET
        name        = COALESCE($3, name),
        category    = COALESCE($4, category),
        description = COALESCE($5, description),
        active      = COALESCE($6, active),
        updated_at  = NOW()
       WHERE id = $1::uuid AND tenant_id = $2::uuid RETURNING *`,
      id, tenantId,
      data.name ?? null,
      data.category ?? null,
      data.description ?? null,
      data.active ?? null,
    );
    if (!results.length) throw new NotFoundException(`Cancer type '${id}' not found`);
    return results[0];
  }

  // ============================================================
  // Catalog: Primary Sites
  // ============================================================

  async listPrimarySites(
    filters: { search?: string | undefined; bodySystem?: string | undefined; active?: string | undefined } = {},
    page = 1,
    limit = 50,
  ) {
    const tenantId = this.getTenantId();
    const offset = (page - 1) * limit;
    const conditions: string[] = ['tenant_id = $1::uuid'];
    const params: unknown[] = [tenantId];

    if (filters.active !== undefined) {
      params.push(filters.active === 'false' ? false : true);
      conditions.push(`active = $${params.length}`);
    }
    if (filters.bodySystem) {
      params.push(filters.bodySystem);
      conditions.push(`body_system = $${params.length}`);
    }
    if (filters.search) {
      params.push(`%${filters.search}%`);
      conditions.push(`(icdo_site_name ILIKE $${params.length} OR icdo_site_code ILIKE $${params.length})`);
    }

    const where = conditions.join(' AND ');
    const [rows, countRows] = await Promise.all([
      this.prisma.$queryRawUnsafe<any[]>(
        `SELECT * FROM plugin_oncology.oncology_primary_site_master
         WHERE ${where} ORDER BY icdo_site_name ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        ...params, limit, offset,
      ),
      this.prisma.$queryRawUnsafe<any[]>(
        `SELECT COUNT(*)::int AS total FROM plugin_oncology.oncology_primary_site_master WHERE ${where}`,
        ...params,
      ),
    ]);
    return { data: rows, total: countRows[0]?.total ?? 0, page, limit };
  }

  async getPrimarySite(id: string) {
    const tenantId = this.getTenantId();
    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM plugin_oncology.oncology_primary_site_master
       WHERE id = $1::uuid AND tenant_id = $2::uuid`,
      id, tenantId,
    );
    if (!rows.length) throw new NotFoundException(`Primary site '${id}' not found`);
    return rows[0];
  }

  async createPrimarySite(data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `INSERT INTO plugin_oncology.oncology_primary_site_master
         (id, tenant_id, icdo_site_code, icdo_site_name, body_system, laterality_applicable, mapping_type, active, created_at, updated_at)
       VALUES (gen_random_uuid(), $1::uuid, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      tenantId,
      data.icdoSiteCode,
      data.icdoSiteName,
      data.bodySystem ?? null,
      data.lateralityApplicable ?? false,
      data.mappingType ?? null,
      data.active ?? true,
    );
    return results[0];
  }

  async updatePrimarySite(id: string, data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.oncology_primary_site_master SET
        icdo_site_name       = COALESCE($3, icdo_site_name),
        body_system          = COALESCE($4, body_system),
        laterality_applicable = COALESCE($5, laterality_applicable),
        mapping_type         = COALESCE($6, mapping_type),
        active               = COALESCE($7, active),
        updated_at           = NOW()
       WHERE id = $1::uuid AND tenant_id = $2::uuid RETURNING *`,
      id, tenantId,
      data.icdoSiteName ?? null,
      data.bodySystem ?? null,
      data.lateralityApplicable ?? null,
      data.mappingType ?? null,
      data.active ?? null,
    );
    if (!results.length) throw new NotFoundException(`Primary site '${id}' not found`);
    return results[0];
  }

  // ============================================================
  // Catalog: Cancer Type ↔ Primary Site Mappings
  // ============================================================

  async listSiteMappings(
    filters: { cancerTypeId?: string | undefined; primarySiteId?: string | undefined; active?: string | undefined } = {},
    page = 1,
    limit = 100,
  ) {
    const tenantId = this.getTenantId();
    const offset = (page - 1) * limit;
    const conditions: string[] = ['m.tenant_id = $1::uuid'];
    const params: unknown[] = [tenantId];

    if (filters.active !== undefined) {
      params.push(filters.active === 'false' ? false : true);
      conditions.push(`m.active = $${params.length}`);
    }
    if (filters.cancerTypeId) {
      params.push(filters.cancerTypeId);
      conditions.push(`m.cancer_type_id = $${params.length}::uuid`);
    }
    if (filters.primarySiteId) {
      params.push(filters.primarySiteId);
      conditions.push(`m.primary_site_id = $${params.length}::uuid`);
    }

    const where = conditions.join(' AND ');
    const [rows, countRows] = await Promise.all([
      this.prisma.$queryRawUnsafe<any[]>(
        `SELECT m.*,
                ct.code AS cancer_type_code, ct.name AS cancer_type_name,
                ps.icdo_site_code, ps.icdo_site_name
         FROM plugin_oncology.oncology_cancer_type_site_mapping m
         JOIN plugin_oncology.oncology_cancer_type_master ct ON ct.id = m.cancer_type_id
         JOIN plugin_oncology.oncology_primary_site_master ps ON ps.id = m.primary_site_id
         WHERE ${where}
         ORDER BY ct.name ASC, ps.icdo_site_name ASC
         LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        ...params, limit, offset,
      ),
      this.prisma.$queryRawUnsafe<any[]>(
        `SELECT COUNT(*)::int AS total
         FROM plugin_oncology.oncology_cancer_type_site_mapping m
         WHERE ${where}`,
        ...params,
      ),
    ]);
    return { data: rows, total: countRows[0]?.total ?? 0, page, limit };
  }

  async createSiteMapping(data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `INSERT INTO plugin_oncology.oncology_cancer_type_site_mapping
         (id, tenant_id, cancer_type_id, primary_site_id, is_default, active, created_at, updated_at)
       VALUES (gen_random_uuid(), $1::uuid, $2::uuid, $3::uuid, $4, $5, NOW(), NOW())
       RETURNING *`,
      tenantId,
      data.cancerTypeId,
      data.primarySiteId,
      data.isDefault ?? false,
      data.active ?? true,
    );
    return results[0];
  }

  async updateSiteMapping(id: string, data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.oncology_cancer_type_site_mapping SET
        is_default = COALESCE($3, is_default),
        active     = COALESCE($4, active),
        updated_at = NOW()
       WHERE id = $1::uuid AND tenant_id = $2::uuid RETURNING *`,
      id, tenantId,
      data.isDefault ?? null,
      data.active ?? null,
    );
    if (!results.length) throw new NotFoundException(`Site mapping '${id}' not found`);
    return results[0];
  }

  async deleteSiteMapping(id: string) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `DELETE FROM plugin_oncology.oncology_cancer_type_site_mapping
       WHERE id = $1::uuid AND tenant_id = $2::uuid RETURNING id`,
      id, tenantId,
    );
    if (!results.length) throw new NotFoundException(`Site mapping '${id}' not found`);
    return { deleted: true, id };
  }

  // ============================================================
  // Catalog: Histologies
  // ============================================================

  async listHistologies(
    filters: { search?: string | undefined; behaviorCode?: string | undefined; active?: string | undefined } = {},
    page = 1,
    limit = 50,
  ) {
    const tenantId = this.getTenantId();
    const offset = (page - 1) * limit;
    const conditions: string[] = ['tenant_id = $1::uuid'];
    const params: unknown[] = [tenantId];

    if (filters.active !== undefined) {
      params.push(filters.active === 'false' ? false : true);
      conditions.push(`active = $${params.length}`);
    }
    if (filters.behaviorCode) {
      params.push(filters.behaviorCode);
      conditions.push(`behavior_code = $${params.length}`);
    }
    if (filters.search) {
      params.push(`%${filters.search}%`);
      conditions.push(`(morphology_name ILIKE $${params.length} OR morphology_code ILIKE $${params.length})`);
    }

    const where = conditions.join(' AND ');
    const [rows, countRows] = await Promise.all([
      this.prisma.$queryRawUnsafe<any[]>(
        `SELECT * FROM plugin_oncology.oncology_histology_master
         WHERE ${where} ORDER BY morphology_name ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        ...params, limit, offset,
      ),
      this.prisma.$queryRawUnsafe<any[]>(
        `SELECT COUNT(*)::int AS total FROM plugin_oncology.oncology_histology_master WHERE ${where}`,
        ...params,
      ),
    ]);
    return { data: rows, total: countRows[0]?.total ?? 0, page, limit };
  }

  async getHistology(id: string) {
    const tenantId = this.getTenantId();
    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM plugin_oncology.oncology_histology_master
       WHERE id = $1::uuid AND tenant_id = $2::uuid`,
      id, tenantId,
    );
    if (!rows.length) throw new NotFoundException(`Histology '${id}' not found`);
    return rows[0];
  }

  async createHistology(data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `INSERT INTO plugin_oncology.oncology_histology_master
         (id, tenant_id, morphology_code, morphology_name, behavior_code, behavior_name, description, active, created_at, updated_at)
       VALUES (gen_random_uuid(), $1::uuid, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      tenantId,
      data.morphologyCode,
      data.morphologyName,
      data.behaviorCode ?? null,
      data.behaviorName ?? null,
      data.description ?? null,
      data.active ?? true,
    );
    return results[0];
  }

  async updateHistology(id: string, data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.oncology_histology_master SET
        morphology_name = COALESCE($3, morphology_name),
        behavior_code   = COALESCE($4, behavior_code),
        behavior_name   = COALESCE($5, behavior_name),
        description     = COALESCE($6, description),
        active          = COALESCE($7, active),
        updated_at      = NOW()
       WHERE id = $1::uuid AND tenant_id = $2::uuid RETURNING *`,
      id, tenantId,
      data.morphologyName ?? null,
      data.behaviorCode ?? null,
      data.behaviorName ?? null,
      data.description ?? null,
      data.active ?? null,
    );
    if (!results.length) throw new NotFoundException(`Histology '${id}' not found`);
    return results[0];
  }

  // ============================================================
  // Radiation Oncology — Prescriptions
  // ============================================================

  async listRadiationPrescriptions(
    filters: { patientId?: string; status?: string } = {},
    page = 1,
    limit = 20,
  ) {
    const tenantId = this.getTenantId();
    let where = `WHERE rp.tenant_id = $1::uuid`;
    const params: unknown[] = [tenantId];
    let idx = 2;

    if (filters.patientId) {
      where += ` AND rp.patient_id = $${idx++}::uuid`;
      params.push(filters.patientId);
    }
    if (filters.status) {
      where += ` AND rp.status = $${idx++}`;
      params.push(filters.status);
    }

    const countQuery = `SELECT COUNT(*) as count FROM plugin_oncology.radiation_prescriptions rp ${where}`;
    const dataQuery = `
      SELECT rp.*,
        (SELECT COUNT(*)::int FROM plugin_oncology.radiation_fractions f
           JOIN plugin_oncology.radiation_treatment_plans tp ON tp.id = f.treatment_plan_id
          WHERE tp.prescription_id = rp.id AND f.status = 'DELIVERED') as delivered_fractions,
        p.mrn as patient_mrn, p.first_name as patient_first_name,
        p.last_name as patient_last_name, p.display_name as patient_display_name,
        p.gender as patient_gender, p.date_of_birth as patient_date_of_birth,
        p.phone_number as patient_phone_number, p.email as patient_email
      FROM plugin_oncology.radiation_prescriptions rp
      LEFT JOIN public.patients p ON p.id = rp.patient_id
      ${where}
      ORDER BY rp.created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
    params.push(limit, (page - 1) * limit);

    const [rows, total] = await Promise.all([
      this.prisma.$queryRawUnsafe<any[]>(dataQuery, ...params),
      this.prisma.$queryRawUnsafe<[{ count: bigint }]>(countQuery, ...params.slice(0, -2)),
    ]);

    const data = rows.map((row) => {
      const patientDisplay = this.buildPatientDisplay(row);
      const { patient_mrn, patient_first_name, patient_last_name, patient_display_name,
        patient_gender, patient_date_of_birth, patient_phone_number, patient_email, ...rest } = row;
      return { ...rest, patientDisplay };
    });

    return { data, pagination: { page, limit, total: Number(total[0]?.count ?? 0) } };
  }

  async getRadiationPrescription(id: string) {
    const tenantId = this.getTenantId();
    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT rp.*,
        cd.cancer_type, cd.primary_site, cd.primary_site_code,
        cd.clinical_status, cd.diagnosis_date, cd.metastatic_status, cd.icd_code,
        cd.grade AS diagnosis_grade, cd.histology_morphology AS diagnosis_histology,
        cd.laterality AS diagnosis_laterality,
        p.mrn as patient_mrn, p.first_name as patient_first_name,
        p.last_name as patient_last_name, p.display_name as patient_display_name,
        p.gender as patient_gender, p.date_of_birth as patient_date_of_birth,
        p.phone_number as patient_phone_number,
        (SELECT json_agg(s ORDER BY s.simulation_date)
         FROM plugin_oncology.radiation_simulations s WHERE s.prescription_id = rp.id) as simulations,
        (SELECT json_agg(tp ORDER BY tp.created_at)
         FROM plugin_oncology.radiation_treatment_plans tp WHERE tp.prescription_id = rp.id) as treatment_plans,
        (SELECT json_agg(r ORDER BY r.review_date)
         FROM plugin_oncology.radiation_on_treatment_reviews r WHERE r.prescription_id = rp.id) as reviews,
        (SELECT row_to_json(cs) FROM plugin_oncology.radiation_completion_summaries cs
         WHERE cs.prescription_id = rp.id LIMIT 1) as completion_summary
      FROM plugin_oncology.radiation_prescriptions rp
      LEFT JOIN plugin_oncology.cancer_diagnoses cd ON cd.id = rp.cancer_profile_id
      LEFT JOIN public.patients p ON p.id = rp.patient_id
      WHERE rp.id = $1::uuid AND rp.tenant_id = $2::uuid`,
      id, tenantId,
    );
    if (!rows.length) throw new NotFoundException(`Radiation prescription '${id}' not found`);
    const row = rows[0];
    const pd = this.buildPatientDisplay(row);
    const { patient_mrn, patient_first_name, patient_last_name, patient_display_name,
      patient_gender, patient_date_of_birth, patient_phone_number, ...rest } = row;
    return { ...rest, patientDisplay: pd };
  }

  async createRadiationPrescription(data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const userId = this.getCurrentUserId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `INSERT INTO plugin_oncology.radiation_prescriptions (
        id, tenant_id, patient_id, encounter_id, cancer_profile_id,
        prescription_number, treatment_intent, treatment_site_id, laterality,
        modality, technique, total_dose_gy, dose_per_fraction_gy, planned_fractions,
        concurrent_chemo, planned_start_date, planned_end_date,
        prescription_notes, prescribed_by, prescribed_at, status,
        created_at, updated_at
      ) VALUES (
        gen_random_uuid(), $1::uuid, $2::uuid, $3::uuid, $4::uuid,
        $5, $6, $7::uuid, $8,
        $9, $10, $11::numeric, $12::numeric, $13,
        $14, $15::date, $16::date,
        $17, $18::uuid, NOW(), $19,
        NOW(), NOW()
      ) RETURNING *`,
      tenantId,
      data.patientId,
      data.encounterId,
      data.cancerProfileId ?? null,
      data.prescriptionNumber ?? null,
      data.treatmentIntent ?? null,
      data.treatmentSiteId ?? null,
      data.laterality ?? null,
      data.modality ?? null,
      data.technique ?? null,
      data.totalDoseGy ?? null,
      data.dosePerFractionGy ?? null,
      data.plannedFractions ?? null,
      data.concurrentChemo ?? false,
      data.plannedStartDate ?? null,
      data.plannedEndDate ?? null,
      data.prescriptionNotes ?? null,
      (data.prescribedBy as string) || userId,
      data.status ?? 'DRAFT',
    );
    const r = results[0];
    await this.logTimelineEvent({
      patientId: r.patient_id,
      cancerDiagnosisId: r.cancer_profile_id ?? null,
      eventType: 'radiation_prescribed',
      eventDate: r.created_at,
      title: `Radiation Prescribed: ${r.total_dose_gy != null ? `${r.total_dose_gy} Gy` : ''}${r.planned_fractions != null ? ` / ${r.planned_fractions} fx` : ''}`.trim() || 'Radiation Prescribed',
      sourceEntity: 'radiation_prescription',
      sourceId: r.id,
      metadata: {
        totalDoseGy: r.total_dose_gy,
        plannedFractions: r.planned_fractions,
        modality: r.modality,
        technique: r.technique,
        treatmentIntent: r.treatment_intent,
      },
      severity: 'info',
    });
    return r;
  }

  async updateRadiationPrescription(id: string, data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    await this.getRadiationPrescription(id);
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.radiation_prescriptions SET
        treatment_intent    = COALESCE($3, treatment_intent),
        laterality          = COALESCE($4, laterality),
        modality            = COALESCE($5, modality),
        technique           = COALESCE($6, technique),
        total_dose_gy       = COALESCE($7::numeric, total_dose_gy),
        dose_per_fraction_gy = COALESCE($8::numeric, dose_per_fraction_gy),
        planned_fractions   = COALESCE($9, planned_fractions),
        concurrent_chemo    = COALESCE($10, concurrent_chemo),
        planned_start_date  = COALESCE($11::date, planned_start_date),
        planned_end_date    = COALESCE($12::date, planned_end_date),
        prescription_notes  = COALESCE($13, prescription_notes),
        status              = COALESCE($14, status),
        updated_at          = NOW()
      WHERE id = $1::uuid AND tenant_id = $2::uuid RETURNING *`,
      id, tenantId,
      data.treatmentIntent ?? null,
      data.laterality ?? null,
      data.modality ?? null,
      data.technique ?? null,
      data.totalDoseGy ?? null,
      data.dosePerFractionGy ?? null,
      data.plannedFractions ?? null,
      data.concurrentChemo ?? null,
      data.plannedStartDate ?? null,
      data.plannedEndDate ?? null,
      data.prescriptionNotes ?? null,
      data.status ?? null,
    );
    return results[0];
  }

  async approveRadiationPrescription(id: string) {
    const tenantId = this.getTenantId();
    // Approval is recorded separately so the original prescriber (prescribed_by) is preserved.
    const userId = this.getCurrentUserId();
    if (!userId) throw new BadRequestException('A signed-in user is required to approve a prescription');
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.radiation_prescriptions SET
        status = 'APPROVED', approved_by = $3::uuid, approved_at = NOW(), updated_at = NOW()
      WHERE id = $1::uuid AND tenant_id = $2::uuid AND status = 'DRAFT' RETURNING *`,
      id, tenantId, userId,
    );
    if (!results.length) throw new BadRequestException('Prescription not found or not in DRAFT status');
    return results[0];
  }

  async activateRadiationPrescription(id: string) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.radiation_prescriptions SET
        status = 'ACTIVE', updated_at = NOW()
      WHERE id = $1::uuid AND tenant_id = $2::uuid AND status = 'APPROVED' RETURNING *`,
      id, tenantId,
    );
    if (!results.length) throw new BadRequestException('Prescription not found or not in APPROVED status');
    const r = results[0];
    await this.logTimelineEvent({
      patientId: r.patient_id,
      cancerDiagnosisId: r.cancer_profile_id ?? null,
      eventType: 'radiation_started',
      eventDate: r.updated_at,
      title: `Radiation Started: ${r.modality ? `${r.modality} ` : ''}${r.total_dose_gy != null ? `${r.total_dose_gy} Gy` : ''}`.trim() || 'Radiation Started',
      sourceEntity: 'radiation_prescription',
      sourceId: r.id,
      metadata: {
        totalDoseGy: r.total_dose_gy,
        plannedFractions: r.planned_fractions,
        modality: r.modality,
        technique: r.technique,
      },
      severity: 'milestone',
    });
    return r;
  }

  // ============================================================
  // Radiation Oncology — Simulations
  // ============================================================

  async listRadiationSimulations(prescriptionId: string, page = 1, limit = 20) {
    const tenantId = this.getTenantId();
    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM plugin_oncology.radiation_simulations
       WHERE prescription_id = $1::uuid AND tenant_id = $2::uuid
       ORDER BY simulation_date DESC LIMIT $3 OFFSET $4`,
      prescriptionId, tenantId, limit, (page - 1) * limit,
    );
    return { data: rows };
  }

  async getRadiationSimulation(id: string) {
    const tenantId = this.getTenantId();
    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT s.*,
        (SELECT json_agg(tp ORDER BY tp.created_at)
         FROM plugin_oncology.radiation_treatment_plans tp WHERE tp.simulation_id = s.id) as treatment_plans
       FROM plugin_oncology.radiation_simulations s
       WHERE s.id = $1::uuid AND s.tenant_id = $2::uuid`,
      id, tenantId,
    );
    if (!rows.length) throw new NotFoundException(`Radiation simulation '${id}' not found`);
    return rows[0];
  }

  async createRadiationSimulation(data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const userId = this.getCurrentUserId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `INSERT INTO plugin_oncology.radiation_simulations (
        id, tenant_id, prescription_id, simulation_date, patient_position,
        immobilization_device, contrast_used, scan_region, setup_reference,
        tattoo_marking_done, simulation_notes, performed_by, status,
        created_at, updated_at
      ) VALUES (
        gen_random_uuid(), $1::uuid, $2::uuid, $3::timestamptz, $4,
        $5, $6, $7, $8,
        $9, $10, $11::uuid, $12,
        NOW(), NOW()
      ) RETURNING *`,
      tenantId,
      data.prescriptionId,
      data.simulationDate ?? null,
      data.patientPosition ?? null,
      data.immobilizationDevice ?? null,
      data.contrastUsed ?? false,
      data.scanRegion ?? null,
      data.setupReference ?? null,
      data.tattooMarkingDone ?? false,
      data.simulationNotes ?? null,
      (data.performedBy as string) || userId,
      data.status ?? 'COMPLETED',
    );
    const r = results[0];
    // Get patient_id from the linked prescription for the timeline event
    const rxRows = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT patient_id, cancer_profile_id FROM plugin_oncology.radiation_prescriptions WHERE id = $1::uuid AND tenant_id = $2::uuid`,
      data.prescriptionId, this.getTenantId(),
    );
    if (rxRows.length) {
      await this.logTimelineEvent({
        patientId: rxRows[0].patient_id,
        cancerDiagnosisId: rxRows[0].cancer_profile_id ?? null,
        eventType: 'simulation',
        eventDate: r.simulation_date ?? r.created_at,
        title: `CT Simulation Performed${r.scan_region ? `: ${r.scan_region}` : ''}`,
        sourceEntity: 'radiation_prescription',
        sourceId: r.prescription_id,
        metadata: {
          patientPosition: r.patient_position,
          immobilizationDevice: r.immobilization_device,
          contrastUsed: r.contrast_used,
          scanRegion: r.scan_region,
          tattooMarkingDone: r.tattoo_marking_done,
        },
        severity: 'info',
      });
    }
    return r;
  }

  async updateRadiationSimulation(id: string, data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.radiation_simulations SET
        simulation_date      = COALESCE($3::timestamptz, simulation_date),
        patient_position     = COALESCE($4, patient_position),
        immobilization_device = COALESCE($5, immobilization_device),
        contrast_used        = COALESCE($6, contrast_used),
        scan_region          = COALESCE($7, scan_region),
        setup_reference      = COALESCE($8, setup_reference),
        tattoo_marking_done  = COALESCE($9, tattoo_marking_done),
        simulation_notes     = COALESCE($10, simulation_notes),
        status               = COALESCE($11, status),
        updated_at           = NOW()
      WHERE id = $1::uuid AND tenant_id = $2::uuid RETURNING *`,
      id, tenantId,
      data.simulationDate ?? null,
      data.patientPosition ?? null,
      data.immobilizationDevice ?? null,
      data.contrastUsed ?? null,
      data.scanRegion ?? null,
      data.setupReference ?? null,
      data.tattooMarkingDone ?? null,
      data.simulationNotes ?? null,
      data.status ?? null,
    );
    if (!results.length) throw new NotFoundException(`Radiation simulation '${id}' not found`);
    return results[0];
  }

  // ============================================================
  // Radiation Oncology — Treatment Plans
  // ============================================================

  async listRadiationPlans(filters: { prescriptionId?: string; status?: string } = {}, page = 1, limit = 20) {
    const tenantId = this.getTenantId();
    let where = `WHERE tp.tenant_id = $1::uuid`;
    const params: unknown[] = [tenantId];
    let idx = 2;

    if (filters.prescriptionId) {
      where += ` AND tp.prescription_id = $${idx++}::uuid`;
      params.push(filters.prescriptionId);
    }
    if (filters.status) {
      where += ` AND tp.status = $${idx++}`;
      params.push(filters.status);
    }

    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT tp.*, rp.patient_id, rp.total_dose_gy, rp.planned_fractions
       FROM plugin_oncology.radiation_treatment_plans tp
       JOIN plugin_oncology.radiation_prescriptions rp ON rp.id = tp.prescription_id
       ${where} ORDER BY tp.created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
      ...params, limit, (page - 1) * limit,
    );
    return { data: rows };
  }

  async getRadiationPlan(id: string) {
    const tenantId = this.getTenantId();
    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT tp.*,
        (SELECT json_agg(f ORDER BY f.fraction_number)
         FROM plugin_oncology.radiation_fractions f WHERE f.treatment_plan_id = tp.id) as fractions,
        row_to_json(rp.*) as prescription
       FROM plugin_oncology.radiation_treatment_plans tp
       JOIN plugin_oncology.radiation_prescriptions rp ON rp.id = tp.prescription_id
       WHERE tp.id = $1::uuid AND tp.tenant_id = $2::uuid`,
      id, tenantId,
    );
    if (!rows.length) throw new NotFoundException(`Radiation treatment plan '${id}' not found`);
    return rows[0];
  }

  async createRadiationPlan(data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const userId = this.getCurrentUserId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `INSERT INTO plugin_oncology.radiation_treatment_plans (
        id, tenant_id, prescription_id, simulation_id,
        external_plan_reference, planning_system, planning_status,
        planner_id, physicist_id, radiation_oncologist_id,
        contouring_completed, physics_qa_completed,
        treatment_machine, plan_notes, status,
        created_at, updated_at
      ) VALUES (
        gen_random_uuid(), $1::uuid, $2::uuid, $3::uuid,
        $4, $5, $6,
        $7::uuid, $8::uuid, $9::uuid,
        $10, $11,
        $12, $13, $14,
        NOW(), NOW()
      ) RETURNING *`,
      tenantId,
      data.prescriptionId,
      data.simulationId ?? null,
      data.externalPlanReference ?? null,
      data.planningSystem ?? null,
      data.planningStatus ?? 'NOT_STARTED',
      (data.plannerId as string) || userId,
      data.physicistId ?? null,
      data.radiationOncologistId ?? null,
      data.contouringCompleted ?? false,
      data.physicsQaCompleted ?? false,
      data.treatmentMachine ?? null,
      data.planNotes ?? null,
      data.status ?? 'ACTIVE',
    );
    return results[0];
  }

  async updateRadiationPlan(id: string, data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.radiation_treatment_plans SET
        simulation_id           = COALESCE($3::uuid, simulation_id),
        external_plan_reference = COALESCE($4, external_plan_reference),
        planning_system         = COALESCE($5, planning_system),
        planning_status         = COALESCE($6, planning_status),
        planner_id              = COALESCE($7::uuid, planner_id),
        physicist_id            = COALESCE($8::uuid, physicist_id),
        radiation_oncologist_id = COALESCE($9::uuid, radiation_oncologist_id),
        contouring_completed    = COALESCE($10, contouring_completed),
        physics_qa_completed    = COALESCE($11, physics_qa_completed),
        treatment_machine       = COALESCE($12, treatment_machine),
        plan_notes              = COALESCE($13, plan_notes),
        status                  = COALESCE($14, status),
        updated_at              = NOW()
      WHERE id = $1::uuid AND tenant_id = $2::uuid RETURNING *`,
      id, tenantId,
      data.simulationId ?? null,
      data.externalPlanReference ?? null,
      data.planningSystem ?? null,
      data.planningStatus ?? null,
      data.plannerId ?? null,
      data.physicistId ?? null,
      data.radiationOncologistId ?? null,
      data.contouringCompleted ?? null,
      data.physicsQaCompleted ?? null,
      data.treatmentMachine ?? null,
      data.planNotes ?? null,
      data.status ?? null,
    );
    if (!results.length) throw new NotFoundException(`Radiation treatment plan '${id}' not found`);
    return results[0];
  }

  async approveRadiationPlan(id: string) {
    const tenantId = this.getTenantId();
    const userId = this.getCurrentUserId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.radiation_treatment_plans SET
        planning_status = 'APPROVED', approved_by = $3::uuid, approved_at = NOW(), updated_at = NOW()
      WHERE id = $1::uuid AND tenant_id = $2::uuid AND planning_status != 'APPROVED' RETURNING *`,
      id, tenantId, userId,
    );
    if (!results.length) throw new BadRequestException('Plan not found or already approved');
    return results[0];
  }

  // ============================================================
  // Radiation Oncology — Fractions
  // ============================================================

  async listRadiationFractions(planId: string) {
    const tenantId = this.getTenantId();
    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM plugin_oncology.radiation_fractions
       WHERE treatment_plan_id = $1::uuid AND tenant_id = $2::uuid
       ORDER BY fraction_number`,
      planId, tenantId,
    );
    return { data: rows };
  }

  async bulkCreateFractions(data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const planId = data.treatmentPlanId as string;
    const count = data.fractionCount as number;
    const dosePerFraction = data.dosePerFractionGy ?? null;
    const startDate = data.startDate ? new Date(data.startDate as string) : null;
    const machine = data.treatmentMachine ?? null;

    const insertValues: string[] = [];
    const params: unknown[] = [tenantId, planId];
    let idx = 3;

    for (let i = 1; i <= count; i++) {
      let plannedDate: string | null = null;
      if (startDate) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + (i - 1));
        plannedDate = d.toISOString().substring(0, 10);
      }
      insertValues.push(
        `(gen_random_uuid(), $1::uuid, $2::uuid, $${idx++}, $${idx++}::date, $${idx++}::numeric, $${idx++}, 'SCHEDULED', NOW(), NOW())`,
      );
      params.push(i, plannedDate, dosePerFraction, machine);
    }

    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `INSERT INTO plugin_oncology.radiation_fractions
         (id, tenant_id, treatment_plan_id, fraction_number, planned_date, planned_dose_gy, treatment_machine, status, created_at, updated_at)
       VALUES ${insertValues.join(', ')}
       ON CONFLICT (treatment_plan_id, fraction_number) DO NOTHING
       RETURNING *`,
      ...params,
    );
    return results;
  }

  async updateRadiationFraction(id: string, data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.radiation_fractions SET
        planned_date          = COALESCE($3::date, planned_date),
        actual_date           = COALESCE($4::timestamptz, actual_date),
        planned_dose_gy       = COALESCE($5::numeric, planned_dose_gy),
        delivered_dose_gy     = COALESCE($6::numeric, delivered_dose_gy),
        treatment_machine     = COALESCE($7, treatment_machine),
        radiation_therapist_id = COALESCE($8::uuid, radiation_therapist_id),
        status                = COALESCE($9, status),
        interruption_reason   = COALESCE($10, interruption_reason),
        verification_completed = COALESCE($11, verification_completed),
        updated_at            = NOW()
      WHERE id = $1::uuid AND tenant_id = $2::uuid RETURNING *`,
      id, tenantId,
      data.plannedDate ?? null,
      data.actualDate ?? null,
      data.plannedDoseGy ?? null,
      data.deliveredDoseGy ?? null,
      data.treatmentMachine ?? null,
      data.radiationTherapistId ?? null,
      data.status ?? null,
      data.interruptionReason ?? null,
      data.verificationCompleted ?? null,
    );
    if (!results.length) throw new NotFoundException(`Radiation fraction '${id}' not found`);
    return results[0];
  }

  async deliverFraction(id: string, data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const userId = this.getCurrentUserId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.radiation_fractions SET
        status                  = 'DELIVERED',
        actual_date             = COALESCE($3::timestamptz, NOW()),
        delivered_dose_gy       = $4::numeric,
        treatment_machine       = COALESCE($5, treatment_machine),
        radiation_therapist_id  = COALESCE($6::uuid, $7::uuid),
        verification_completed  = COALESCE($8, verification_completed),
        updated_at              = NOW()
      WHERE id = $1::uuid AND tenant_id = $2::uuid AND status IN ('SCHEDULED','RESCHEDULED') RETURNING *`,
      id, tenantId,
      data.actualDate ?? null,
      data.deliveredDoseGy,
      data.treatmentMachine ?? null,
      data.radiationTherapistId ?? null,
      userId,
      data.verificationCompleted ?? null,
    );
    if (!results.length) throw new BadRequestException('Fraction not found or not in SCHEDULED/RESCHEDULED status');
    return results[0];
  }

  // ============================================================
  // Radiation Oncology — On-Treatment Reviews
  // ============================================================

  async listOnTreatmentReviews(prescriptionId: string, page = 1, limit = 50) {
    const tenantId = this.getTenantId();
    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM plugin_oncology.radiation_on_treatment_reviews
       WHERE prescription_id = $1::uuid AND tenant_id = $2::uuid
       ORDER BY review_date DESC LIMIT $3 OFFSET $4`,
      prescriptionId, tenantId, limit, (page - 1) * limit,
    );
    return { data: rows };
  }

  async getOnTreatmentReview(id: string) {
    const tenantId = this.getTenantId();
    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM plugin_oncology.radiation_on_treatment_reviews
       WHERE id = $1::uuid AND tenant_id = $2::uuid`,
      id, tenantId,
    );
    if (!rows.length) throw new NotFoundException(`On-treatment review '${id}' not found`);
    return rows[0];
  }

  async createOnTreatmentReview(data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const userId = this.getCurrentUserId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `INSERT INTO plugin_oncology.radiation_on_treatment_reviews (
        id, tenant_id, prescription_id, review_date, week_number,
        toxicity_grade, pain_score, weight_kg,
        treatment_break_required, review_notes, reviewed_by,
        created_at, updated_at
      ) VALUES (
        gen_random_uuid(), $1::uuid, $2::uuid, $3::timestamptz, $4,
        $5, $6, $7::numeric,
        $8, $9, $10::uuid,
        NOW(), NOW()
      ) RETURNING *`,
      tenantId,
      data.prescriptionId,
      data.reviewDate,
      data.weekNumber ?? null,
      data.toxicityGrade ?? null,
      data.painScore ?? null,
      data.weightKg ?? null,
      data.treatmentBreakRequired ?? false,
      data.reviewNotes ?? null,
      (data.reviewedBy as string) || userId,
    );
    return results[0];
  }

  async updateOnTreatmentReview(id: string, data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `UPDATE plugin_oncology.radiation_on_treatment_reviews SET
        review_date              = COALESCE($3::timestamptz, review_date),
        week_number              = COALESCE($4, week_number),
        toxicity_grade           = COALESCE($5, toxicity_grade),
        pain_score               = COALESCE($6, pain_score),
        weight_kg                = COALESCE($7::numeric, weight_kg),
        treatment_break_required = COALESCE($8, treatment_break_required),
        review_notes             = COALESCE($9, review_notes),
        updated_at               = NOW()
      WHERE id = $1::uuid AND tenant_id = $2::uuid RETURNING *`,
      id, tenantId,
      data.reviewDate ?? null,
      data.weekNumber ?? null,
      data.toxicityGrade ?? null,
      data.painScore ?? null,
      data.weightKg ?? null,
      data.treatmentBreakRequired ?? null,
      data.reviewNotes ?? null,
    );
    if (!results.length) throw new NotFoundException(`On-treatment review '${id}' not found`);
    return results[0];
  }

  // ============================================================
  // Radiation Oncology — Completion Summaries
  // ============================================================

  async getCompletionSummary(prescriptionId: string) {
    const tenantId = this.getTenantId();
    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM plugin_oncology.radiation_completion_summaries
       WHERE prescription_id = $1::uuid AND tenant_id = $2::uuid`,
      prescriptionId, tenantId,
    );
    if (!rows.length) throw new NotFoundException(`Completion summary for prescription '${prescriptionId}' not found`);
    return rows[0];
  }

  async createCompletionSummary(data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const userId = this.getCurrentUserId();
    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `INSERT INTO plugin_oncology.radiation_completion_summaries (
        id, tenant_id, prescription_id, completion_date,
        planned_total_dose_gy, delivered_total_dose_gy,
        planned_fractions, delivered_fractions,
        interruptions, interruption_notes,
        acute_toxicity_summary, response_assessment_plan, followup_plan,
        completed_by, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), $1::uuid, $2::uuid, $3::date,
        $4::numeric, $5::numeric,
        $6, $7,
        $8, $9,
        $10, $11, $12,
        $13::uuid, NOW(), NOW()
      ) ON CONFLICT (prescription_id) DO UPDATE SET
        completion_date          = EXCLUDED.completion_date,
        planned_total_dose_gy    = EXCLUDED.planned_total_dose_gy,
        delivered_total_dose_gy  = EXCLUDED.delivered_total_dose_gy,
        planned_fractions        = EXCLUDED.planned_fractions,
        delivered_fractions      = EXCLUDED.delivered_fractions,
        interruptions            = EXCLUDED.interruptions,
        interruption_notes       = EXCLUDED.interruption_notes,
        acute_toxicity_summary   = EXCLUDED.acute_toxicity_summary,
        response_assessment_plan = EXCLUDED.response_assessment_plan,
        followup_plan            = EXCLUDED.followup_plan,
        completed_by             = EXCLUDED.completed_by,
        updated_at               = NOW()
      RETURNING *`,
      tenantId,
      data.prescriptionId,
      data.completionDate ?? null,
      data.plannedTotalDoseGy ?? null,
      data.deliveredTotalDoseGy ?? null,
      data.plannedFractions ?? null,
      data.deliveredFractions ?? null,
      data.interruptions ?? false,
      data.interruptionNotes ?? null,
      data.acuteToxicitySummary ?? null,
      data.responseAssessmentPlan ?? null,
      data.followupPlan ?? null,
      (data.completedBy as string) || userId,
    );

    // Also mark prescription as COMPLETED
    await this.prisma.$queryRawUnsafe(
      `UPDATE plugin_oncology.radiation_prescriptions SET status = 'COMPLETED', updated_at = NOW()
       WHERE id = $1::uuid AND tenant_id = $2::uuid AND status != 'CANCELLED'`,
      data.prescriptionId, tenantId,
    );

    const r = results[0];
    // Get patient_id and cancer_profile_id from the linked prescription
    const rxRows2 = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT patient_id, cancer_profile_id, modality, total_dose_gy, planned_fractions FROM plugin_oncology.radiation_prescriptions WHERE id = $1::uuid AND tenant_id = $2::uuid`,
      data.prescriptionId, this.getTenantId(),
    );
    if (rxRows2.length) {
      const rx = rxRows2[0];
      const doseLabel = r.delivered_total_dose_gy != null ? `${r.delivered_total_dose_gy} Gy` : rx.total_dose_gy != null ? `${rx.total_dose_gy} Gy` : '';
      const fxLabel = r.delivered_fractions != null ? `${r.delivered_fractions} fx` : rx.planned_fractions != null ? `${rx.planned_fractions} fx` : '';
      await this.logTimelineEvent({
        patientId: rx.patient_id,
        cancerDiagnosisId: rx.cancer_profile_id ?? null,
        eventType: 'radiation_completed',
        eventDate: r.completion_date ?? r.created_at,
        title: `Radiation Completed: ${[doseLabel, fxLabel ? `${fxLabel} delivered` : ''].filter(Boolean).join(' / ')}` || 'Radiation Completed',
        sourceEntity: 'radiation_prescription',
        sourceId: r.prescription_id,
        metadata: {
          deliveredTotalDoseGy: r.delivered_total_dose_gy,
          deliveredFractions: r.delivered_fractions,
          plannedTotalDoseGy: r.planned_total_dose_gy,
          plannedFractions: r.planned_fractions,
          interruptions: r.interruptions,
        },
        severity: 'milestone',
      });
    }
    return r;
  }

  // ============================================================
  // Cancer Timeline
  // ============================================================

  async listTimeline(
    patientId: string,
    filters: { eventType?: string; fromDate?: string; toDate?: string; cancerDiagnosisId?: string } = {},
  ) {
    const tenantId = this.getTenantId();
    let query = `SELECT * FROM plugin_oncology.cancer_timeline_events
      WHERE tenant_id = $1::uuid AND patient_id = $2::uuid`;
    const params: unknown[] = [tenantId, patientId];
    let idx = 3;

    if (filters.cancerDiagnosisId) {
      query += ` AND cancer_diagnosis_id = $${idx++}::uuid`;
      params.push(filters.cancerDiagnosisId);
    }
    if (filters.eventType) {
      query += ` AND event_type = $${idx++}`;
      params.push(filters.eventType);
    }
    if (filters.fromDate) {
      query += ` AND event_date >= $${idx++}::timestamptz`;
      params.push(filters.fromDate);
    }
    if (filters.toDate) {
      query += ` AND event_date <= $${idx++}::timestamptz`;
      params.push(filters.toDate);
    }

    query += ` ORDER BY event_date ASC, created_at ASC`;
    const rows = await this.prisma.$queryRawUnsafe<any[]>(query, ...params);
    return { data: rows };
  }

  // Manual timeline entries can only claim categories that don't have a
  // structured clinical workflow of their own — 'diagnosis'/'staging'/
  // 'chemotherapy'/'radiation'/'care_plan'/'tumor_board' are always
  // derived from real records, never spoofable via a free-text note.
  private static readonly MANUAL_TIMELINE_CATEGORIES = new Set(['custom', 'surgery', 'response', 'follow_up']);
  private static readonly TIMELINE_SEVERITIES = new Set(['milestone', 'info', 'warning', 'adverse']);

  async createCustomTimelineEvent(data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const userId = this.getCurrentUserId();

    if (!data.patientId) throw new BadRequestException('patientId is required');
    if (!data.title) throw new BadRequestException('title is required');
    if (!data.eventDate) throw new BadRequestException('eventDate is required');

    const category = typeof data.category === 'string' && OncologyService.MANUAL_TIMELINE_CATEGORIES.has(data.category)
      ? data.category
      : undefined;
    const severity = typeof data.severity === 'string' && OncologyService.TIMELINE_SEVERITIES.has(data.severity)
      ? data.severity
      : 'info';
    const metadata = category ? { category } : {};

    const results = await this.prisma.$queryRawUnsafe<any[]>(
      `INSERT INTO plugin_oncology.cancer_timeline_events
        (id, tenant_id, patient_id, cancer_diagnosis_id, event_type, event_date,
         title, description, source_entity, source_id, metadata, severity, created_by, created_at)
       VALUES (gen_random_uuid(), $1::uuid, $2::uuid, $3::uuid, 'custom', $4::timestamptz,
               $5, $6, 'manual', NULL, $7::jsonb, $8, $9::uuid, NOW())
       RETURNING *`,
      tenantId,
      data.patientId,
      data.cancerDiagnosisId ?? null,
      data.eventDate,
      data.title,
      data.description ?? null,
      JSON.stringify(metadata),
      severity,
      userId,
    );
    return results[0];
  }

  async deleteTimelineEvent(id: string) {
    const tenantId = this.getTenantId();
    const existing = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT id, source_entity FROM plugin_oncology.cancer_timeline_events WHERE id = $1::uuid AND tenant_id = $2::uuid`,
      id, tenantId,
    );
    if (!existing.length) throw new NotFoundException(`Timeline event '${id}' not found`);
    if (existing[0].source_entity !== 'manual') {
      throw new BadRequestException('Only manually-added timeline events can be deleted');
    }
    await this.prisma.$queryRawUnsafe(
      `DELETE FROM plugin_oncology.cancer_timeline_events WHERE id = $1::uuid AND tenant_id = $2::uuid`,
      id, tenantId,
    );
    return { success: true };
  }
}
