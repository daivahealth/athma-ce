import { BadRequestException, Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';
import {
  Public,
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
 * RCM setup a sandbox tenant gets from the template (demo) tenant: payers,
 * billing items, price lists, contracts, charge rules, catalogue mappings,
 * membership plans and pharmacy stock. Never invoices, claims or payments.
 * Dependency order. See docs/ADR/ADR-0017-sandbox-tenants.md.
 */
export const RCM_SETUP_TABLES: readonly CopyTableSpec[] = [
  { table: 'payers' },
  { table: 'billing_items' },
  { table: 'fee_schedules' },
  { table: 'fee_schedule_items', parentColumn: 'fee_schedule_id' },
  { table: 'payer_contracts' },
  { table: 'payer_contract_adjustments', parentColumn: 'contract_id' },
  { table: 'charge_posting_rules' },
  { table: 'catalog_item_mappings' },
  { table: 'membership_plans' },
  { table: 'plan_benefits' },
  { table: 'pharmacy_stocks' },
];

/** Internal: called by foundation's sandbox service with the internal API key. */
@Controller('internal/tenant-setup')
@Public()
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
        tables: RCM_SETUP_TABLES,
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
