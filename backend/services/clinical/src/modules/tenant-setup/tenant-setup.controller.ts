import { BadRequestException, Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import {
  assertSandboxTarget,
  copyTenantSetup,
  parseTenantSetupCopyRequest,
  purgeTenantData,
  TenantSetupRequestError,
  type CopyTableSpec,
  type TransactionalSqlClient,
} from '@zeal/shared-utils';
import { InternalApiKeyGuard } from '../../common/guards/internal-api-key.guard';

/**
 * Clinical setup a sandbox tenant gets from the template (demo) tenant:
 * tenant-owned catalogues, templates, schedules and oncology protocols, never
 * patients or other transactional data. Dependency order. Rows with
 * tenant_id NULL are global and shared, so they are not copied.
 * See docs/ADR/ADR-0017-sandbox-tenants.md.
 */
export const CLINICAL_SETUP_TABLES: readonly CopyTableSpec[] = [
  { table: 'administrative_services' },
  { table: 'biomarker_definitions' },
  { table: 'checklist_template' },
  { table: 'checklist_template_item' },
  { table: 'consent_templates' },
  { table: 'diagnosis_versions' },
  { table: 'diagnosis_master' },
  { table: 'equipment_schedules' },
  { table: 'form_master' },
  { table: 'imaging_study_master' },
  { table: 'lab_test_master' },
  { table: 'lab_test_result_templates' },
  { table: 'longevity_protocols' },
  { table: 'medication_master' },
  { table: 'membership_plans' },
  { table: 'note_templates' },
  { table: 'note_template_versions', parentColumn: 'template_id' },
  { table: 'observation_code_catalog' },
  { table: 'ot_room_configs' },
  { table: 'packages' },
  { table: 'package_items', parentColumn: 'package_id' },
  { table: 'procedure_master' },
  { table: 'screening_protocols' },
  { table: 'space_schedules' },
  { table: 'staff_schedules' },
  { table: 'tenant_value_set_overrides' },
  { table: 'vital_signs_templates' },
  { table: 'wellness_assessment_templates' },
  { table: 'wellness_program_templates' },
  { table: 'plugin_oncology.chemo_protocols', optional: true },
  { table: 'plugin_oncology.oncology_primary_site_master', optional: true },
  { table: 'plugin_oncology.oncology_histology_master', optional: true },
  { table: 'plugin_oncology.oncology_cancer_type_master', optional: true },
  { table: 'plugin_oncology.oncology_cancer_type_site_mapping', optional: true },
];

/** Internal: called by foundation's sandbox service with the internal API key. */
@Controller('internal/tenant-setup')
@UseGuards(InternalApiKeyGuard)
export class TenantSetupController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('copy')
  @HttpCode(200)
  async copy(@Body() body: unknown) {
    try {
      const request = parseTenantSetupCopyRequest(body);
      return await copyTenantSetup(this.prisma as unknown as TransactionalSqlClient, {
        ...request,
        tables: CLINICAL_SETUP_TABLES,
      });
    } catch (error) {
      if (error instanceof TenantSetupRequestError) throw new BadRequestException(error.message);
      throw error;
    }
  }

  @Post('purge')
  @HttpCode(200)
  async purge(@Body() body: { tenantId?: unknown }) {
    try {
      const tenantId = assertSandboxTarget(body?.tenantId);
      return { deleted: await purgeTenantData(this.prisma as unknown as TransactionalSqlClient, tenantId) };
    } catch (error) {
      if (error instanceof TenantSetupRequestError) throw new BadRequestException(error.message);
      throw error;
    }
  }
}
