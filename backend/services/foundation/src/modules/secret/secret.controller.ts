import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SecretService } from './secret.service';
import { PutSecretDto, SecretScopeQueryDto, InternalSecretQueryDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { InternalApiKeyGuard } from '../../common/guards/internal-api-key.guard';
import { SECRET_READ, SECRET_MANAGE } from '@zeal/contracts';
import type { JwtClaims } from '@zeal/contracts';

const KEY_PATTERN = /^[a-z][a-z0-9_.]*$/;

interface AuthedRequest {
  user?: JwtClaims;
}

/**
 * Admin surface for tenant secrets. Write-only: values are accepted here but
 * never returned by any route — reads are metadata only. Internal service
 * consumers fetch values through SecretInternalController.
 */
@Controller('secrets')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class SecretController {
  constructor(private readonly secretService: SecretService) {}

  @Get('tenant/:tenantId')
  @Permissions(SECRET_READ)
  async list(
    @Param('tenantId') tenantId: string,
    @Req() req: AuthedRequest,
    @Query('ownerId') ownerId?: string,
  ) {
    this.assertTenantScope(req, tenantId);
    return { success: true, data: await this.secretService.list(tenantId, ownerId) };
  }

  @Put('tenant/:tenantId/:key')
  @Permissions(SECRET_MANAGE)
  async put(
    @Param('tenantId') tenantId: string,
    @Param('key') key: string,
    @Body() dto: PutSecretDto,
    @Req() req: AuthedRequest,
  ) {
    this.assertTenantScope(req, tenantId);
    this.assertKey(key);
    const data = await this.secretService.put(
      { tenantId, facilityId: dto.facilityId, ownerId: dto.ownerId, key },
      dto.value,
      req.user?.userId,
    );
    return { success: true, data };
  }

  @Delete('tenant/:tenantId/:key')
  @Permissions(SECRET_MANAGE)
  async remove(
    @Param('tenantId') tenantId: string,
    @Param('key') key: string,
    @Query() query: SecretScopeQueryDto,
    @Req() req: AuthedRequest,
  ) {
    this.assertTenantScope(req, tenantId);
    this.assertKey(key);
    const data = await this.secretService.delete(
      { tenantId, facilityId: query.facilityId, ownerId: query.ownerId, key },
      req.user?.userId,
    );
    return { success: true, data };
  }

  /** Re-wraps all stored data keys onto the current master key version. */
  @Post('rotate')
  @Permissions(SECRET_MANAGE)
  async rotate(@Req() req: AuthedRequest) {
    if (!this.isInstanceAdmin(req)) {
      throw new ForbiddenException('Master key rotation is an instance-level operation');
    }
    return { success: true, data: await this.secretService.rotate(req.user?.userId) };
  }

  /**
   * A tenant-scoped user may only manage secrets of their own tenant;
   * instance-level admins may manage any.
   */
  private assertTenantScope(req: AuthedRequest, tenantId: string): void {
    if (this.isInstanceAdmin(req)) return;
    if (req.user?.tenantId && req.user.tenantId === tenantId) return;
    throw new ForbiddenException('Cannot manage secrets of another tenant');
  }

  private isInstanceAdmin(req: AuthedRequest): boolean {
    return (req.user?.roles ?? []).includes('super_admin');
  }

  private assertKey(key: string): void {
    if (!KEY_PATTERN.test(key)) {
      throw new BadRequestException(
        'Secret key must be lowercase dot/underscore-separated (e.g. abdm.client_secret)',
      );
    }
  }
}

/**
 * Value release for internal service consumers only (shared internal API
 * key). Every read is audited with the consumer name from x-service-name.
 */
@Controller('secrets/internal')
@UseGuards(InternalApiKeyGuard)
export class SecretInternalController {
  constructor(private readonly secretService: SecretService) {}

  @Get('value')
  async getValue(
    @Query() query: InternalSecretQueryDto,
    @Req() req: { headers: Record<string, string | undefined> },
  ) {
    const consumer = req.headers['x-service-name'] ?? 'unknown';
    const value = await this.secretService.getValue(
      {
        tenantId: query.tenantId,
        facilityId: query.facilityId,
        ownerId: query.ownerId,
        key: query.key,
      },
      consumer,
    );
    return { success: true, data: { value } };
  }
}
