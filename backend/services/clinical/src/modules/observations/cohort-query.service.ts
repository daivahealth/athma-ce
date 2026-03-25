import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CohortQueryDto, CodingCriterionDto, ObservationCriterionDto } from './dto/cohort-query.dto';

const OPERATOR_MAP: Record<string, string> = {
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
  eq: '=',
};

export interface CohortResult {
  patients: { patientId: string }[];
  total: number;
  pagination: { page: number; limit: number; total: number; totalPages: number };
  observations?: Record<string, any[]>;
  codings?: Record<string, any[]>;
}

@Injectable()
export class CohortQueryService {
  private readonly logger = new Logger(CohortQueryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async execute(tenantId: string, dto: CohortQueryDto): Promise<CohortResult> {
    const codingCriteria = dto.codings ?? [];
    const obsCriteria = dto.observations ?? [];

    if (codingCriteria.length === 0 && obsCriteria.length === 0) {
      throw new BadRequestException('At least one coding or observation criterion is required');
    }

    const totalCriteria = codingCriteria.length + obsCriteria.length;
    if (totalCriteria > 10) {
      throw new BadRequestException('Maximum 10 criteria allowed');
    }

    const matchAll = dto.matchAll !== false;
    const page = dto.page ?? 1;
    const limit = Math.min(dto.limit ?? 50, 500);
    const offset = (page - 1) * limit;

    // Build CTEs and collect parameters
    const ctes: string[] = [];
    const cteNames: string[] = [];
    const params: any[] = [];
    // $1 is always tenantId
    params.push(tenantId);
    let paramIdx = 2;

    // Build coding CTEs
    for (let i = 0; i < codingCriteria.length; i++) {
      const c = codingCriteria[i]!;
      const cteName = `coding_${i}`;
      cteNames.push(cteName);

      const conditions: string[] = ['tenant_id = $1'];
      const codeSystem = c.codeSystem ?? 'ICD-10';
      conditions.push(`code_system = $${paramIdx}`);
      params.push(codeSystem);
      paramIdx++;

      // Support % wildcard via LIKE, exact match otherwise
      if (c.code.includes('%')) {
        conditions.push(`code LIKE $${paramIdx}`);
      } else {
        conditions.push(`code = $${paramIdx}`);
      }
      params.push(c.code);
      paramIdx++;

      const status = c.status ?? 'accepted';
      conditions.push(`status = $${paramIdx}`);
      params.push(status);
      paramIdx++;

      if (c.codingType) {
        conditions.push(`coding_type = $${paramIdx}`);
        params.push(c.codingType);
        paramIdx++;
      }

      ctes.push(
        `${cteName} AS (
          SELECT DISTINCT patient_id
          FROM encounter_clinical_codings
          WHERE ${conditions.join(' AND ')}
        )`,
      );
    }

    // Build observation CTEs
    for (let i = 0; i < obsCriteria.length; i++) {
      const o = obsCriteria[i]!;
      const cteName = `obs_${i}`;
      cteNames.push(cteName);

      const innerConditions: string[] = ['tenant_id = $1'];
      innerConditions.push(`code = $${paramIdx}`);
      params.push(o.code);
      paramIdx++;

      innerConditions.push('value_numeric IS NOT NULL');

      if (o.fromDate) {
        innerConditions.push(`observed_at >= $${paramIdx}::timestamptz`);
        params.push(o.fromDate);
        paramIdx++;
      }
      if (o.toDate) {
        innerConditions.push(`observed_at < $${paramIdx}::timestamptz`);
        params.push(o.toDate);
        paramIdx++;
      }

      const innerWhere = innerConditions.join(' AND ');
      const useLatest = o.latest !== false;

      let valueCondition: string;
      if (o.operator === 'between') {
        if (o.valueTo == null) {
          throw new BadRequestException('valueTo is required for "between" operator');
        }
        valueCondition = `value_numeric BETWEEN $${paramIdx} AND $${paramIdx + 1}`;
        params.push(o.value, o.valueTo);
        paramIdx += 2;
      } else {
        const sqlOp = OPERATOR_MAP[o.operator];
        valueCondition = `value_numeric ${sqlOp} $${paramIdx}`;
        params.push(o.value);
        paramIdx++;
      }

      if (useLatest) {
        // Use ROW_NUMBER to get latest observation per patient, then filter by value
        ctes.push(
          `${cteName} AS (
            SELECT patient_id FROM (
              SELECT patient_id, value_numeric,
                     ROW_NUMBER() OVER (PARTITION BY patient_id ORDER BY observed_at DESC) AS rn
              FROM clinical_observations
              WHERE ${innerWhere}
            ) ranked
            WHERE rn = 1 AND ${valueCondition}
          )`,
        );
      } else {
        // Any matching observation (not just latest)
        ctes.push(
          `${cteName} AS (
            SELECT DISTINCT patient_id
            FROM clinical_observations
            WHERE ${innerWhere} AND ${valueCondition}
          )`,
        );
      }
    }

    // Combine CTEs: INNER JOIN (AND) or UNION (OR)
    let combinedQuery: string;
    if (matchAll) {
      // INNER JOIN all CTEs on patient_id
      let fromClause = `${cteNames[0]} t0`;
      const joinClauses: string[] = [];
      for (let i = 1; i < cteNames.length; i++) {
        joinClauses.push(`INNER JOIN ${cteNames[i]} t${i} ON t0.patient_id = t${i}.patient_id`);
      }
      combinedQuery = `SELECT t0.patient_id FROM ${fromClause} ${joinClauses.join(' ')}`;
    } else {
      // UNION all CTEs
      const unionParts = cteNames.map((name) => `SELECT patient_id FROM ${name}`);
      combinedQuery = unionParts.join(' UNION ');
    }

    const fullSql = `
      SET LOCAL statement_timeout = '10s';
      WITH ${ctes.join(',\n')}
      ${combinedQuery}
      ORDER BY patient_id
      LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
    `;
    params.push(limit, offset);
    paramIdx += 2;

    // Count query
    const countSql = `
      WITH ${ctes.join(',\n')}
      SELECT COUNT(*)::int AS total FROM (${combinedQuery}) counted
    `;

    this.logger.debug(`Cohort query SQL:\n${fullSql}`);
    this.logger.debug(`Params: ${JSON.stringify(params.slice(0, -2))}`);

    try {
      // Execute count and data queries. Use separate calls since SET LOCAL
      // only affects the current transaction — run both in a transaction.
      const [countResult, patientRows] = await this.prisma.$transaction(async (tx) => {
        const count = await tx.$queryRawUnsafe<[{ total: number }]>(
          countSql,
          ...params.slice(0, -2), // exclude limit/offset
        );
        await tx.$queryRawUnsafe(`SET LOCAL statement_timeout = '10s'`);
        const rows = await tx.$queryRawUnsafe<{ patient_id: string }[]>(
          `WITH ${ctes.join(',\n')} ${combinedQuery} ORDER BY patient_id LIMIT $${paramIdx - 2} OFFSET $${paramIdx - 1}`,
          ...params,
        );
        return [count, rows];
      });

      const total = countResult[0]?.total ?? 0;
      const patientIds = patientRows.map((r) => r.patient_id);

      const result: CohortResult = {
        patients: patientIds.map((id) => ({ patientId: id })),
        total,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      };

      // Optional enrichment
      if (dto.includeLatestObservations && patientIds.length > 0 && obsCriteria.length > 0) {
        result.observations = await this.enrichWithObservations(tenantId, patientIds, obsCriteria);
      }
      if (dto.includeCodingSummary && patientIds.length > 0) {
        result.codings = await this.enrichWithCodings(tenantId, patientIds);
      }

      return result;
    } catch (error: any) {
      this.logger.error(`Cohort query failed: ${error?.message}`, error?.stack);
      throw error;
    }
  }

  /**
   * Attach latest observation values for the queried codes per matched patient.
   */
  private async enrichWithObservations(
    tenantId: string,
    patientIds: string[],
    obsCriteria: ObservationCriterionDto[],
  ): Promise<Record<string, any[]>> {
    const codes = obsCriteria.map((o) => o.code);

    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT DISTINCT ON (patient_id, code)
              patient_id, code, display_name, value_numeric, value_string, unit, observed_at
       FROM clinical_observations
       WHERE tenant_id = $1 AND patient_id = ANY($2::uuid[])
         AND code = ANY($3::varchar[])
       ORDER BY patient_id, code, observed_at DESC`,
      tenantId,
      patientIds,
      codes,
    );

    // Group by patient_id
    const grouped: Record<string, any[]> = {};
    for (const row of rows) {
      const pid = row.patient_id;
      if (!grouped[pid]) grouped[pid] = [];
      grouped[pid].push(row);
    }
    return grouped;
  }

  /**
   * Attach matched clinical codings per patient.
   */
  private async enrichWithCodings(
    tenantId: string,
    patientIds: string[],
  ): Promise<Record<string, any[]>> {
    const rows = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT patient_id, code, code_system, display_name, coding_type, created_at
       FROM encounter_clinical_codings
       WHERE tenant_id = $1 AND patient_id = ANY($2::uuid[])
         AND status = 'accepted'
       ORDER BY patient_id, created_at DESC`,
      tenantId,
      patientIds,
    );

    const grouped: Record<string, any[]> = {};
    for (const row of rows) {
      const pid = row.patient_id;
      if (!grouped[pid]) grouped[pid] = [];
      grouped[pid].push(row);
    }
    return grouped;
  }
}
