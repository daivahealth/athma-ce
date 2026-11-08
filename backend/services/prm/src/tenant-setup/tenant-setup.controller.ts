import {
  BadRequestException,
  Body,
  CanActivate,
  Controller,
  ExecutionContext,
  HttpCode,
  Injectable,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { timingSafeEqual } from 'crypto';
import {
  assertSandboxTarget,
  copyTenantSetup,
  parseTenantSetupCopyRequest,
  purgeTenantData,
  TenantSetupRequestError,
  type CopyTableSpec,
  type TransactionalSqlClient,
} from '@zeal/shared-utils';
import { PrismaService } from '../database/prisma.service';

/** PRM setup a sandbox tenant gets from the template tenant. See docs/ADR/ADR-0017-sandbox-tenants.md. */
export const PRM_SETUP_TABLES: readonly CopyTableSpec[] = [
  { table: 'communication_templates' },
  { table: 'engagement_rules' },
];

@Injectable()
class InternalApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const provided = context.switchToHttp().getRequest().headers['x-internal-api-key'];
    const expected = process.env.INTERNAL_API_KEY;
    if (!expected || typeof provided !== 'string') throw new UnauthorizedException('Invalid or missing internal API key');
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) throw new UnauthorizedException('Invalid or missing internal API key');
    return true;
  }
}

/** Internal: called by foundation's sandbox service with the internal API key. */
@Controller('v1/internal/tenant-setup')
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
        tables: PRM_SETUP_TABLES,
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
