import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { QueryObservationsDto, TrendsQueryDto } from './dto/query-observations.dto';

export interface ObservationRow {
  id: string;
  code: string;
  code_system: string;
  display_name: string;
  display_name_ar: string | null;
  category: string;
  value_numeric: number | null;
  value_string: string | null;
  value_code: string | null;
  unit: string | null;
  ref_range_low: number | null;
  ref_range_high: number | null;
  interpretation: string | null;
  observed_at: Date;
  observed_by: string | null;
  source_type: string | null;
}

export interface TrendBucket {
  bucket: Date;
  count: number;
  avg_value: number | null;
  min_value: number | null;
  max_value: number | null;
  unique_patients: number;
}

@Injectable()
export class ObservationQueryService {
  private readonly logger = new Logger(ObservationQueryService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Paginated observations for a patient, with optional filters.
   */
  async findByPatient(
    tenantId: string,
    patientId: string,
    query: QueryObservationsDto,
  ) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 50, 200);
    const offset = (page - 1) * limit;

    const conditions: string[] = ['co.tenant_id = $1', 'co.patient_id = $2'];
    const params: any[] = [tenantId, patientId];
    let paramIdx = 3;

    if (query.code) {
      conditions.push(`co.code = $${paramIdx}`);
      params.push(query.code);
      paramIdx++;
    }
    if (query.codes) {
      const codeList = query.codes.split(',').map((c) => c.trim());
      conditions.push(`co.code = ANY($${paramIdx}::varchar[])`);
      params.push(codeList);
      paramIdx++;
    }
    if (query.category) {
      conditions.push(`co.category = $${paramIdx}`);
      params.push(query.category);
      paramIdx++;
    }
    if (query.fromDate) {
      conditions.push(`co.observed_at >= $${paramIdx}::timestamptz`);
      params.push(query.fromDate);
      paramIdx++;
    }
    if (query.toDate) {
      conditions.push(`co.observed_at < $${paramIdx}::timestamptz`);
      params.push(query.toDate);
      paramIdx++;
    }
    if (query.interpretation) {
      conditions.push(`co.interpretation = $${paramIdx}`);
      params.push(query.interpretation);
      paramIdx++;
    }

    const where = conditions.join(' AND ');

    const countResult = await this.prisma.$queryRawUnsafe<[{ total: bigint }]>(
      `SELECT COUNT(*)::bigint AS total FROM clinical_observations co WHERE ${where}`,
      ...params,
    );
    const total = Number(countResult[0]?.total ?? 0);

    const rows = await this.prisma.$queryRawUnsafe<ObservationRow[]>(
      `SELECT co.id, co.code, co.code_system, co.display_name, co.display_name_ar,
              co.category, co.value_numeric, co.value_string, co.value_code,
              co.unit, co.ref_range_low, co.ref_range_high,
              co.interpretation, co.observed_at, co.observed_by, co.source_type
       FROM clinical_observations co
       WHERE ${where}
       ORDER BY co.observed_at DESC
       LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
      ...params,
      limit,
      offset,
    );

    return {
      data: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Latest observation value per LOINC code for a patient.
   */
  async findLatestPerCode(
    tenantId: string,
    patientId: string,
    category?: string,
    codes?: string[],
  ) {
    const conditions: string[] = ['co.tenant_id = $1', 'co.patient_id = $2'];
    const params: any[] = [tenantId, patientId];
    let paramIdx = 3;

    if (category) {
      conditions.push(`co.category = $${paramIdx}`);
      params.push(category);
      paramIdx++;
    }
    if (codes?.length) {
      conditions.push(`co.code = ANY($${paramIdx}::varchar[])`);
      params.push(codes);
      paramIdx++;
    }

    const where = conditions.join(' AND ');

    const rows = await this.prisma.$queryRawUnsafe<ObservationRow[]>(
      `SELECT DISTINCT ON (co.code)
              co.id, co.code, co.code_system, co.display_name, co.display_name_ar,
              co.category, co.value_numeric, co.value_string, co.value_code,
              co.unit, co.ref_range_low, co.ref_range_high,
              co.interpretation, co.observed_at, co.observed_by, co.source_type
       FROM clinical_observations co
       WHERE ${where}
       ORDER BY co.code, co.observed_at DESC`,
      ...params,
    );

    return rows;
  }

  /**
   * Time-series for a single LOINC code for a patient.
   */
  async findByCode(
    tenantId: string,
    patientId: string,
    code: string,
    fromDate?: string,
    toDate?: string,
  ) {
    const conditions: string[] = [
      'co.tenant_id = $1',
      'co.patient_id = $2',
      'co.code = $3',
    ];
    const params: any[] = [tenantId, patientId, code];
    let paramIdx = 4;

    if (fromDate) {
      conditions.push(`co.observed_at >= $${paramIdx}::timestamptz`);
      params.push(fromDate);
      paramIdx++;
    }
    if (toDate) {
      conditions.push(`co.observed_at < $${paramIdx}::timestamptz`);
      params.push(toDate);
      paramIdx++;
    }

    const where = conditions.join(' AND ');

    const rows = await this.prisma.$queryRawUnsafe<ObservationRow[]>(
      `SELECT co.id, co.code, co.code_system, co.display_name, co.display_name_ar,
              co.category, co.value_numeric, co.value_string, co.value_code,
              co.unit, co.ref_range_low, co.ref_range_high,
              co.interpretation, co.observed_at, co.observed_by, co.source_type
       FROM clinical_observations co
       WHERE ${where}
       ORDER BY co.observed_at ASC`,
      ...params,
    );

    return rows;
  }

  /**
   * All observations for an encounter.
   */
  async findByEncounter(tenantId: string, encounterId: string) {
    const rows = await this.prisma.$queryRawUnsafe<ObservationRow[]>(
      `SELECT co.id, co.code, co.code_system, co.display_name, co.display_name_ar,
              co.category, co.value_numeric, co.value_string, co.value_code,
              co.unit, co.ref_range_low, co.ref_range_high,
              co.interpretation, co.observed_at, co.observed_by, co.source_type
       FROM clinical_observations co
       WHERE co.tenant_id = $1 AND co.encounter_id = $2
       ORDER BY co.observed_at DESC`,
      tenantId,
      encounterId,
    );

    return rows;
  }

  /**
   * Aggregate trends: avg/min/max/count by time bucket for a LOINC code.
   */
  async getTrends(tenantId: string, query: TrendsQueryDto) {
    const bucket = query.bucket ?? 'month';
    const validBuckets = ['day', 'week', 'month'];
    if (!validBuckets.includes(bucket)) {
      throw new Error(`Invalid bucket: ${bucket}. Must be one of: ${validBuckets.join(', ')}`);
    }

    const rows = await this.prisma.$queryRawUnsafe<TrendBucket[]>(
      `SELECT
         date_trunc('${bucket}', co.observed_at) AS bucket,
         COUNT(*)::int AS count,
         AVG(co.value_numeric)::NUMERIC(12,4) AS avg_value,
         MIN(co.value_numeric)::NUMERIC(12,4) AS min_value,
         MAX(co.value_numeric)::NUMERIC(12,4) AS max_value,
         COUNT(DISTINCT co.patient_id)::int AS unique_patients
       FROM clinical_observations co
       WHERE co.tenant_id = $1 AND co.code = $2
         AND co.observed_at >= $3::timestamptz AND co.observed_at < $4::timestamptz
         AND co.value_numeric IS NOT NULL
       GROUP BY bucket
       ORDER BY bucket`,
      tenantId,
      query.code,
      query.fromDate,
      query.toDate,
    );

    return rows;
  }
}
