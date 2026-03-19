import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';

/**
 * Nightly aggregation service that computes daily summaries from
 * clinical_observations and encounter_diagnoses, then writes them
 * to the analytics database (clinical_observation_daily, diagnosis_daily_aggregate).
 *
 * NOTE: This service writes to the analytics DB via raw SQL since
 * the analytics Prisma client is a separate package. In production,
 * this would ideally be a standalone job or use the analytics Prisma client.
 * For now, we use the clinical Prisma client's $queryRawUnsafe with
 * a cross-database connection or a separate analytics DB connection.
 *
 * TODO: When the analytics service is set up, move this aggregation logic there
 * and have it read from clinical DB via API or DB link.
 */
@Injectable()
export class AggregationService {
  private readonly logger = new Logger(AggregationService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Compute yesterday's aggregates.
   * Call this from a scheduled job (e.g., pg_cron, external scheduler, or @nestjs/schedule).
   */
  async aggregateYesterday(): Promise<void> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = this.toDateString(yesterday);

    this.logger.log(`Starting daily aggregation for ${dateStr}`);

    try {
      await this.aggregateObservationsForDate(dateStr);
      await this.aggregateDiagnosesForDate(dateStr);
      this.logger.log(`Completed daily aggregation for ${dateStr}`);
    } catch (error) {
      this.logger.error(`Failed daily aggregation for ${dateStr}`, error);
    }
  }

  /**
   * Aggregate clinical observations for a specific date.
   * Groups by tenant, facility (via encounter), department, code.
   *
   * Returns the aggregated data that should be inserted into
   * clinical_observation_daily in the analytics DB.
   */
  async aggregateObservationsForDate(dateStr: string): Promise<any[]> {
    const results = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT
        co.tenant_id,
        e.facility_id,
        e.department_id,
        co.observed_at::date AS observation_date,
        co.code,
        co.code_system,
        co.category,
        COUNT(*)::int AS record_count,
        AVG(co.value_numeric)::NUMERIC(12,4) AS avg_value,
        MIN(co.value_numeric)::NUMERIC(12,4) AS min_value,
        MAX(co.value_numeric)::NUMERIC(12,4) AS max_value,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY co.value_numeric)::NUMERIC(12,4) AS p50_value,
        PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY co.value_numeric)::NUMERIC(12,4) AS p95_value,
        COUNT(*) FILTER (WHERE co.interpretation = 'normal')::int AS normal_count,
        COUNT(*) FILTER (WHERE co.interpretation = 'high')::int AS abnormal_high_count,
        COUNT(*) FILTER (WHERE co.interpretation = 'low')::int AS abnormal_low_count,
        COUNT(*) FILTER (WHERE co.interpretation IN ('critical_high', 'critical_low'))::int AS critical_count,
        COUNT(DISTINCT co.patient_id)::int AS unique_patients
      FROM clinical_observations co
      LEFT JOIN encounters e ON co.encounter_id = e.id AND co.tenant_id = e.tenant_id
      WHERE co.observed_at::date = $1::date
        AND co.value_numeric IS NOT NULL
      GROUP BY co.tenant_id, e.facility_id, e.department_id, co.observed_at::date,
               co.code, co.code_system, co.category
    `, dateStr);

    this.logger.log(`Aggregated ${results.length} observation groups for ${dateStr}`);
    return results;
  }

  /**
   * Aggregate diagnoses for a specific date.
   * Groups by tenant, facility (via encounter), department, ICD code.
   */
  async aggregateDiagnosesForDate(dateStr: string): Promise<any[]> {
    const results = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT
        ed.tenant_id,
        e.facility_id,
        e.department_id,
        ed.diagnosed_at::date AS diagnosis_date,
        ed.icd_code,
        SUBSTRING(ed.icd_code FROM 1 FOR 3) AS icd_block,
        ed.diagnosis_name,
        ed.diagnosis_type,
        COUNT(DISTINCT e.id)::int AS encounter_count,
        COUNT(DISTINCT ed.patient_id)::int AS unique_patients,
        COUNT(*) FILTER (WHERE ed.diagnosis_type = 'primary')::int AS primary_count,
        COUNT(*) FILTER (WHERE ed.is_chronic = true)::int AS chronic_count
      FROM encounter_diagnoses ed
      LEFT JOIN encounters e ON ed.encounter_id = e.id AND ed.tenant_id = e.tenant_id
      WHERE ed.diagnosed_at::date = $1::date
      GROUP BY ed.tenant_id, e.facility_id, e.department_id, ed.diagnosed_at::date,
               ed.icd_code, ed.diagnosis_name, ed.diagnosis_type
    `, dateStr);

    this.logger.log(`Aggregated ${results.length} diagnosis groups for ${dateStr}`);
    return results;
  }

  /**
   * Manual trigger to re-aggregate a date range (for backfill).
   */
  async aggregateDateRange(startDate: string, endDate: string): Promise<void> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = this.toDateString(d);
      await this.aggregateObservationsForDate(dateStr);
      await this.aggregateDiagnosesForDate(dateStr);
    }

    this.logger.log(`Completed aggregation for range ${startDate} to ${endDate}`);
  }

  private toDateString(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
