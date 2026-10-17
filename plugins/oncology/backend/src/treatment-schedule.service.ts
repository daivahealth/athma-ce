import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { RequestContext } from '@zeal/shared-utils';
import { OncologyService } from './oncology.service';
import {
  addDays, buildDayItems, doseAdjustmentsFor, generateSchedule, resolveBsa,
  type PatientMeasures, type ProtocolSnapshot,
} from './treatment-schedule';

const PLAN_STATUSES = ['active', 'on_hold', 'completed', 'cancelled'];
// Day statuses a user may set directly; 'ordered' / 'given' follow the chemo order
const MANUAL_DAY_STATUSES = ['planned', 'held', 'skipped', 'cancelled'];
// Days that can still be moved or re-dosed
const OPEN_DAY_STATUSES = ['planned', 'held'];

const PATIENT_COLUMNS = `
  p.mrn as patient_mrn, p.first_name as patient_first_name, p.last_name as patient_last_name,
  p.display_name as patient_display_name, p.date_of_birth as patient_date_of_birth,
  p.gender as patient_gender`;

const num = (v: unknown) => (v === null || v === undefined || v === '' ? null : Number(v));
const isoDate = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10));

/**
 * Patient treatment schedules: a dated plan of cycles and treatment days
 * generated from a phased chemo protocol. See docs/features/oncology/ONCOLOGY-PLUGIN.md.
 */
@Injectable()
export class TreatmentScheduleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly oncology: OncologyService,
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

  private withPatient<T extends Record<string, any>>(row: T) {
    const patientDisplay = this.oncology.buildPatientDisplay(row);
    const clean: Record<string, unknown> = { ...row };
    for (const k of Object.keys(clean).filter((k) => k.startsWith('patient_'))) delete clean[k];
    return { ...clean, patientDisplay };
  }

  private measuresOf(plan: Record<string, any>): PatientMeasures {
    return {
      heightCm: num(plan.height_cm), weightKg: num(plan.weight_kg),
      bsa: num(plan.bsa), creatinineClearance: num(plan.creatinine_clearance),
    };
  }

  // ── Plans ──────────────────────────────────────────────────────────────

  async listPlans(filters: { patientId?: string; carePlanId?: string; cancerDiagnosisId?: string; status?: string } = {}) {
    const tenantId = this.getTenantId();
    const where: string[] = ['tp.tenant_id = $1::uuid'];
    const params: unknown[] = [tenantId];
    const add = (sql: string, v: unknown) => { params.push(v); where.push(sql.replace('?', `$${params.length}`)); };
    if (filters.patientId) add('tp.patient_id = ?::uuid', filters.patientId);
    if (filters.carePlanId) add('tp.oncology_care_plan_id = ?::uuid', filters.carePlanId);
    if (filters.cancerDiagnosisId) add('tp.cancer_diagnosis_id = ?::uuid', filters.cancerDiagnosisId);
    if (filters.status) add('tp.status = ?', filters.status);
    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT tp.id, tp.patient_id, tp.cancer_diagnosis_id, tp.oncology_care_plan_id, tp.protocol_id,
              tp.start_date, tp.bsa, tp.status, tp.created_at,
              tp.protocol_snapshot->>'code' AS protocol_code, tp.protocol_snapshot->>'name' AS protocol_name,
              cd.cancer_type,
              (SELECT COUNT(*)::int FROM plugin_oncology.treatment_cycles c WHERE c.treatment_plan_id = tp.id) AS total_cycles,
              (SELECT MAX(d.scheduled_date) FROM plugin_oncology.treatment_days d WHERE d.treatment_plan_id = tp.id AND d.status NOT IN ('skipped','cancelled')) AS end_date,
              (SELECT MIN(d.scheduled_date) FROM plugin_oncology.treatment_days d WHERE d.treatment_plan_id = tp.id AND d.status IN ('planned','ordered','held')) AS next_date,
              (SELECT COUNT(*)::int FROM plugin_oncology.treatment_days d WHERE d.treatment_plan_id = tp.id) AS total_days,
              (SELECT COUNT(*)::int FROM plugin_oncology.treatment_days d WHERE d.treatment_plan_id = tp.id AND d.status = 'given') AS given_days,
              ${PATIENT_COLUMNS}
       FROM plugin_oncology.treatment_plans tp
       LEFT JOIN plugin_oncology.cancer_diagnoses cd ON cd.id = tp.cancer_diagnosis_id
       LEFT JOIN public.patients p ON p.id = tp.patient_id
       WHERE ${where.join(' AND ')}
       ORDER BY tp.created_at DESC
       LIMIT 200`,
      ...params,
    );
    return { data: rows.map((r) => this.withPatient(r)) };
  }

  async getPlan(id: string) {
    const tenantId = this.getTenantId();
    const plans = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT tp.*, cd.cancer_type, cd.primary_site, ${PATIENT_COLUMNS}
       FROM plugin_oncology.treatment_plans tp
       LEFT JOIN plugin_oncology.cancer_diagnoses cd ON cd.id = tp.cancer_diagnosis_id
       LEFT JOIN public.patients p ON p.id = tp.patient_id
       WHERE tp.id = $1::uuid AND tp.tenant_id = $2::uuid`,
      id, tenantId,
    );
    if (!plans.length) throw new NotFoundException(`Treatment plan '${id}' not found`);
    const [cycles, days] = await Promise.all([
      this.prisma.$queryRawUnsafe<any[]>(
        `SELECT * FROM plugin_oncology.treatment_cycles WHERE treatment_plan_id = $1::uuid AND tenant_id = $2::uuid ORDER BY cycle_number`,
        id, tenantId,
      ),
      this.prisma.$queryRawUnsafe<any[]>(
        `SELECT d.*, co.status AS order_status
         FROM plugin_oncology.treatment_days d
         LEFT JOIN plugin_oncology.chemo_orders co ON co.id = d.chemo_order_id
         WHERE d.treatment_plan_id = $1::uuid AND d.tenant_id = $2::uuid
         ORDER BY d.scheduled_date, d.cycle_number, d.cycle_day`,
        id, tenantId,
      ),
    ]);
    return { ...this.withPatient(plans[0]), cycles, days };
  }

  /**
   * Generates the dated schedule from the protocol. Requires a start date and
   * either BSA or height + weight; CrCl is needed for AUC (carboplatin) dosing.
   */
  async createPlan(data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const startDate = typeof data.startDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.startDate) ? data.startDate : null;
    if (!startDate) throw new BadRequestException('startDate (YYYY-MM-DD) is required');
    if (!data.protocolId) throw new BadRequestException('protocolId is required');

    // Patient / diagnosis come from the care plan when one is given
    let patientId = data.patientId as string | undefined;
    let cancerDiagnosisId = data.cancerDiagnosisId as string | undefined;
    const carePlanId = (data.oncologyCarePlanId as string | undefined) || null;
    if (carePlanId) {
      const cp = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT patient_id, cancer_diagnosis_id FROM plugin_oncology.oncology_care_plans WHERE id = $1::uuid AND tenant_id = $2::uuid`,
        carePlanId, tenantId,
      );
      if (!cp.length) throw new NotFoundException(`Care plan '${carePlanId}' not found`);
      patientId = cp[0].patient_id;
      cancerDiagnosisId = cp[0].cancer_diagnosis_id;
    }
    if (!patientId || !cancerDiagnosisId) throw new BadRequestException('oncologyCarePlanId, or patientId + cancerDiagnosisId, is required');

    const measures: PatientMeasures = {
      heightCm: num(data.heightCm), weightKg: num(data.weightKg),
      bsa: num(data.bsa), creatinineClearance: num(data.creatinineClearance),
    };
    const bsa = resolveBsa(measures);
    if (!bsa) throw new BadRequestException('height and weight (or bsa) are required');
    measures.bsa = bsa;

    const protocol = await this.oncology.getProtocol(data.protocolId as string);
    if (!protocol.phases?.length) throw new BadRequestException('Protocol has no regimen');
    const snapshot: ProtocolSnapshot = {
      id: protocol.id, code: protocol.code, name: protocol.name, phases: protocol.phases,
      premedications: protocol.premedications ?? [], supportiveCare: protocol.supportive_care ?? [],
      hydration: protocol.hydration ?? [], labPrerequisites: protocol.lab_prerequisites ?? [],
      emetogenicRisk: protocol.emetogenic_risk ?? null,
    };
    const { cycles, days } = generateSchedule(snapshot, startDate, measures);

    const planId = await this.prisma.$transaction(async (tx) => {
      const rows = await tx.$queryRawUnsafe<any[]>(
        `INSERT INTO plugin_oncology.treatment_plans (
           id, tenant_id, patient_id, cancer_diagnosis_id, oncology_care_plan_id, protocol_id,
           protocol_snapshot, start_date, height_cm, weight_kg, bsa, creatinine_clearance,
           status, notes, created_by, created_at, updated_at
         ) VALUES (
           gen_random_uuid(), $1::uuid, $2::uuid, $3::uuid, $4::uuid, $5::uuid,
           $6::jsonb, $7::date, $8, $9, $10, $11,
           'active', $12, $13::uuid, NOW(), NOW()
         ) RETURNING id`,
        tenantId, patientId, cancerDiagnosisId, carePlanId, protocol.id,
        JSON.stringify(snapshot), startDate, measures.heightCm, measures.weightKg, bsa, measures.creatinineClearance,
        (data.notes as string) ?? null, this.getCurrentUserId(),
      );
      const id = rows[0].id as string;
      await tx.$executeRawUnsafe(
        `INSERT INTO plugin_oncology.treatment_cycles (
           id, tenant_id, treatment_plan_id, cycle_number, phase_index, phase_name, phase_cycle,
           planned_start_date, created_at, updated_at)
         SELECT gen_random_uuid(), $1::uuid, $2::uuid, c.cycle_number, c.phase_index, c.phase_name, c.phase_cycle,
                c.planned_start_date::date, NOW(), NOW()
         FROM jsonb_to_recordset($3::jsonb) AS c(cycle_number int, phase_index int, phase_name text, phase_cycle int, planned_start_date text)`,
        tenantId, id,
        JSON.stringify(cycles.map((c) => ({
          cycle_number: c.cycleNumber, phase_index: c.phaseIndex, phase_name: c.phaseName,
          phase_cycle: c.phaseCycle, planned_start_date: c.plannedStartDate,
        }))),
      );
      await tx.$executeRawUnsafe(
        `INSERT INTO plugin_oncology.treatment_days (
           id, tenant_id, treatment_plan_id, cycle_number, cycle_day, scheduled_date, status, items, created_at, updated_at)
         SELECT gen_random_uuid(), $1::uuid, $2::uuid, d.cycle_number, d.cycle_day, d.scheduled_date::date, 'planned', d.items, NOW(), NOW()
         FROM jsonb_to_recordset($3::jsonb) AS d(cycle_number int, cycle_day int, scheduled_date text, items jsonb)`,
        tenantId, id,
        JSON.stringify(days.map((d) => ({
          cycle_number: d.cycleNumber, cycle_day: d.cycleDay, scheduled_date: d.scheduledDate, items: d.items,
        }))),
      );
      return id;
    });
    return this.getPlan(planId);
  }

  /** Status / notes, and updated measurements (recalculates doses on open days). */
  async updatePlan(id: string, data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const plan = await this.getPlanRow(id, tenantId);
    if (data.status !== undefined && !PLAN_STATUSES.includes(data.status as string)) {
      throw new BadRequestException(`status must be one of ${PLAN_STATUSES.join(', ')}`);
    }
    const measuresChanged = ['heightCm', 'weightKg', 'bsa', 'creatinineClearance'].some((k) => data[k] !== undefined);
    const measures: PatientMeasures = {
      heightCm: data.heightCm !== undefined ? num(data.heightCm) : num(plan.height_cm),
      weightKg: data.weightKg !== undefined ? num(data.weightKg) : num(plan.weight_kg),
      bsa: data.bsa !== undefined ? num(data.bsa) : (data.heightCm !== undefined || data.weightKg !== undefined ? null : num(plan.bsa)),
      creatinineClearance: data.creatinineClearance !== undefined ? num(data.creatinineClearance) : num(plan.creatinine_clearance),
    };
    measures.bsa = resolveBsa(measures);

    await this.prisma.$executeRawUnsafe(
      `UPDATE plugin_oncology.treatment_plans SET
         status = COALESCE($3, status), notes = COALESCE($4, notes),
         height_cm = $5, weight_kg = $6, bsa = $7, creatinine_clearance = $8, updated_at = NOW()
       WHERE id = $1::uuid AND tenant_id = $2::uuid`,
      id, tenantId, (data.status as string) ?? null, (data.notes as string) ?? null,
      measures.heightCm, measures.weightKg, measures.bsa, measures.creatinineClearance,
    );
    if (measuresChanged) await this.recalculateOpenDays(id, tenantId, plan.protocol_snapshot, measures);
    return this.getPlan(id);
  }

  // ── Cycles ─────────────────────────────────────────────────────────────

  /** Pushes this cycle and every later cycle back by `days`. */
  async delayCycle(planId: string, cycleNumber: number, data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    await this.getPlanRow(planId, tenantId);
    const days = Number(data.days);
    if (!Number.isInteger(days) || days < 1 || days > 90) throw new BadRequestException('days must be a whole number from 1 to 90');
    const blocking = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT cycle_number, cycle_day, status FROM plugin_oncology.treatment_days
       WHERE treatment_plan_id = $1::uuid AND tenant_id = $2::uuid AND cycle_number >= $3 AND status NOT IN ('planned','held','skipped','cancelled')
       ORDER BY cycle_number, cycle_day LIMIT 1`,
      planId, tenantId, cycleNumber,
    );
    if (blocking.length) {
      const b = blocking[0];
      throw new BadRequestException(`C${b.cycle_number} D${b.cycle_day} is already ${b.status}; cancel its order before delaying`);
    }
    await this.prisma.$transaction([
      this.prisma.$executeRawUnsafe(
        `UPDATE plugin_oncology.treatment_days SET scheduled_date = scheduled_date + $4::int, updated_at = NOW()
         WHERE treatment_plan_id = $1::uuid AND tenant_id = $2::uuid AND cycle_number >= $3`,
        planId, tenantId, cycleNumber, days,
      ),
      this.prisma.$executeRawUnsafe(
        `UPDATE plugin_oncology.treatment_cycles SET planned_start_date = planned_start_date + $4::int,
           delay_days = delay_days + CASE WHEN cycle_number = $3 THEN $4::int ELSE 0 END,
           delay_reason = CASE WHEN cycle_number = $3 THEN COALESCE($5, delay_reason) ELSE delay_reason END,
           updated_at = NOW()
         WHERE treatment_plan_id = $1::uuid AND tenant_id = $2::uuid AND cycle_number >= $3`,
        planId, tenantId, cycleNumber, days, (data.reason as string) || null,
      ),
    ]);
    return this.getPlan(planId);
  }

  /** Sets the dose level for a cycle (and optionally all later cycles) and re-doses open days. */
  async setCycleDoseLevel(planId: string, cycleNumber: number, data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const plan = await this.getPlanRow(planId, tenantId);
    const level = Number(data.doseLevel);
    if (!Number.isInteger(level) || level > 0 || level < -3) throw new BadRequestException('doseLevel must be 0, -1, -2 or -3');
    const op = data.applyToLaterCycles ? '>=' : '=';
    await this.prisma.$executeRawUnsafe(
      `UPDATE plugin_oncology.treatment_cycles SET dose_level = $4, updated_at = NOW()
       WHERE treatment_plan_id = $1::uuid AND tenant_id = $2::uuid AND cycle_number ${op} $3`,
      planId, tenantId, cycleNumber, level,
    );
    await this.recalculateOpenDays(planId, tenantId, plan.protocol_snapshot, this.measuresOf(plan));
    return this.getPlan(planId);
  }

  // ── Days ───────────────────────────────────────────────────────────────

  async updateDay(dayId: string, data: Record<string, unknown>) {
    const tenantId = this.getTenantId();
    const day = await this.getDayRow(dayId, tenantId);
    if (data.status !== undefined) {
      if (!MANUAL_DAY_STATUSES.includes(data.status as string)) {
        throw new BadRequestException(`status must be one of ${MANUAL_DAY_STATUSES.join(', ')}`);
      }
      if (day.chemo_order_id && ['ordered', 'given'].includes(day.status)) {
        throw new BadRequestException(`This day is ${day.status}; change it through its chemo order`);
      }
    }
    await this.prisma.$executeRawUnsafe(
      `UPDATE plugin_oncology.treatment_days SET status = COALESCE($3, status), notes = COALESCE($4, notes), updated_at = NOW()
       WHERE id = $1::uuid AND tenant_id = $2::uuid`,
      dayId, tenantId, (data.status as string) ?? null, (data.notes as string) ?? null,
    );
    return this.getPlan(day.treatment_plan_id);
  }

  /** Creates the chemo order for a treatment day, pre-filled from the plan. */
  async createOrderForDay(dayId: string) {
    const tenantId = this.getTenantId();
    const day = await this.getDayRow(dayId, tenantId);
    if (day.chemo_order_id) throw new BadRequestException('An order already exists for this day');
    if (!OPEN_DAY_STATUSES.includes(day.status)) throw new BadRequestException(`Cannot order a ${day.status} day`);
    const plan = await this.getPlanRow(day.treatment_plan_id, tenantId);
    if (plan.status !== 'active') throw new BadRequestException(`Treatment plan is ${plan.status}`);
    const cycle = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT dose_level FROM plugin_oncology.treatment_cycles WHERE treatment_plan_id = $1::uuid AND cycle_number = $2`,
      plan.id, day.cycle_number,
    );
    const doseLevel = cycle[0]?.dose_level ?? 0;
    const order = await this.oncology.createChemoOrder({
      patientId: plan.patient_id,
      cancerDiagnosisId: plan.cancer_diagnosis_id,
      oncologyCarePlanId: plan.oncology_care_plan_id,
      protocolId: plan.protocol_id,
      cycleNumber: day.cycle_number,
      dayNumber: day.cycle_day,
      scheduledDate: isoDate(day.scheduled_date),
      bsa: num(plan.bsa), weight: num(plan.weight_kg), height: num(plan.height_cm),
      creatinineClearance: num(plan.creatinine_clearance),
      doseAdjustments: doseAdjustmentsFor(day.items ?? []),
      notes: `From treatment schedule${doseLevel ? ` · dose level ${doseLevel}` : ''}`,
    });
    await this.prisma.$executeRawUnsafe(
      `UPDATE plugin_oncology.treatment_days SET chemo_order_id = $3::uuid, status = 'ordered', updated_at = NOW()
       WHERE id = $1::uuid AND tenant_id = $2::uuid`,
      dayId, tenantId, order.id,
    );
    return { order, plan: await this.getPlan(plan.id) };
  }

  /** All treatment days on a date (or range) across patients — the day-care / pharmacy worklist. */
  async listDays(filters: { date?: string; from?: string; to?: string; status?: string }) {
    const tenantId = this.getTenantId();
    const from = filters.date ?? filters.from;
    const to = filters.date ?? filters.to ?? from;
    if (!from || !/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to!)) {
      throw new BadRequestException('date, or from/to (YYYY-MM-DD), is required');
    }
    if (addDays(from, 62) < to!) throw new BadRequestException('Range is limited to 62 days');
    const params: unknown[] = [tenantId, from, to];
    let statusSql = `AND d.status NOT IN ('skipped','cancelled')`;
    if (filters.status) { params.push(filters.status); statusSql = `AND d.status = $${params.length}`; }
    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT d.*, co.status AS order_status,
              tp.patient_id, tp.bsa, tp.weight_kg, tp.status AS plan_status,
              tp.protocol_snapshot->>'code' AS protocol_code, tp.protocol_snapshot->>'name' AS protocol_name,
              tc.phase_name, tc.dose_level,
              (SELECT COUNT(*)::int FROM plugin_oncology.treatment_cycles c2 WHERE c2.treatment_plan_id = tp.id) AS total_cycles,
              ${PATIENT_COLUMNS}
       FROM plugin_oncology.treatment_days d
       JOIN plugin_oncology.treatment_plans tp ON tp.id = d.treatment_plan_id
       LEFT JOIN plugin_oncology.treatment_cycles tc ON tc.treatment_plan_id = d.treatment_plan_id AND tc.cycle_number = d.cycle_number
       LEFT JOIN plugin_oncology.chemo_orders co ON co.id = d.chemo_order_id
       LEFT JOIN public.patients p ON p.id = tp.patient_id
       WHERE d.tenant_id = $1::uuid AND d.scheduled_date BETWEEN $2::date AND $3::date
         AND tp.status IN ('active','on_hold') ${statusSql}
       ORDER BY d.scheduled_date, patient_last_name, patient_first_name`,
      ...params,
    );
    return { data: rows.map((r) => this.withPatient(r)) };
  }

  // ── Helpers ────────────────────────────────────────────────────────────

  private async getPlanRow(id: string, tenantId: string) {
    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM plugin_oncology.treatment_plans WHERE id = $1::uuid AND tenant_id = $2::uuid`, id, tenantId,
    );
    if (!rows.length) throw new NotFoundException(`Treatment plan '${id}' not found`);
    return rows[0];
  }

  private async getDayRow(id: string, tenantId: string) {
    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM plugin_oncology.treatment_days WHERE id = $1::uuid AND tenant_id = $2::uuid`, id, tenantId,
    );
    if (!rows.length) throw new NotFoundException(`Treatment day '${id}' not found`);
    return rows[0];
  }

  /** Rebuilds items (doses) for days that are not yet ordered or given. */
  private async recalculateOpenDays(planId: string, tenantId: string, snapshot: ProtocolSnapshot, measures: PatientMeasures) {
    const [cycles, days] = await Promise.all([
      this.prisma.$queryRawUnsafe<any[]>(
        `SELECT cycle_number, phase_index, phase_cycle, dose_level FROM plugin_oncology.treatment_cycles WHERE treatment_plan_id = $1::uuid`, planId,
      ),
      this.prisma.$queryRawUnsafe<any[]>(
        `SELECT id, cycle_number, cycle_day FROM plugin_oncology.treatment_days
         WHERE treatment_plan_id = $1::uuid AND tenant_id = $2::uuid AND status = ANY($3::text[])`,
        planId, tenantId, OPEN_DAY_STATUSES,
      ),
    ]);
    const byCycle = new Map(cycles.map((c) => [c.cycle_number, c]));
    const updates = days.map((d) => {
      const c = byCycle.get(d.cycle_number);
      return {
        id: d.id,
        items: buildDayItems(snapshot, { phaseIndex: c.phase_index, phaseCycle: c.phase_cycle }, d.cycle_day, measures, c.dose_level),
      };
    });
    if (!updates.length) return;
    await this.prisma.$executeRawUnsafe(
      `UPDATE plugin_oncology.treatment_days d SET items = u.items, updated_at = NOW()
       FROM jsonb_to_recordset($2::jsonb) AS u(id uuid, items jsonb)
       WHERE d.id = u.id AND d.tenant_id = $1::uuid`,
      tenantId, JSON.stringify(updates),
    );
  }
}
