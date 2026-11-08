import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { PLATFORM_SANDBOX_MANAGE, PLATFORM_SANDBOX_READ } from '@zeal/contracts';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CreateSandboxDto, SwitchWorkspaceDto } from './dto/sandbox.dto';
import { SandboxService } from './sandbox.service';

type AuthedRequest = Request & { user?: { userId?: string; sub?: string; tenantId?: string } };

function caller(req: AuthedRequest): { userId: string; tenantId: string } {
  const userId = req.user?.userId || req.user?.sub;
  if (!userId || !req.user?.tenantId) throw new UnauthorizedException();
  return { userId, tenantId: req.user.tenantId };
}

/**
 * Self-serve sandbox tenants (ADR-0017). The /mine, POST and /switch routes
 * are open to any signed-in user, read-only demo visitors included (they are
 * on READ_ONLY_ALLOWED_PATHS); the service requires an external identity.
 * See docs/api/SANDBOXES-API.md.
 */
@ApiTags('Sandboxes')
@Controller('sandboxes')
export class SandboxController {
  constructor(private readonly service: SandboxService) {}

  @Get('mine')
  @ApiOperation({ summary: "The caller's sandbox and whether sandboxes are offered" })
  mine(@Req() req: AuthedRequest) {
    const { userId, tenantId } = caller(req);
    return this.service.status(userId, tenantId);
  }

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Create a sandbox (provisioned in the background)' })
  create(@Req() req: AuthedRequest, @Body() dto: CreateSandboxDto) {
    return this.service.create(caller(req).userId, dto);
  }

  @Post('switch')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a session for the sandbox or the demo hospital' })
  switchWorkspace(@Req() req: AuthedRequest, @Body() dto: SwitchWorkspaceDto) {
    return this.service.switchWorkspace(caller(req).userId, dto.target);
  }

  @Post('mine/extend')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Extend the caller’s sandbox once' })
  extend(@Req() req: AuthedRequest) {
    return this.service.extend(caller(req).userId);
  }

  @Delete('mine')
  @ApiOperation({ summary: 'Delete the caller’s sandbox and its data' })
  deleteMine(@Req() req: AuthedRequest) {
    return this.service.deleteMine(caller(req).userId);
  }

  @Get()
  @Permissions(PLATFORM_SANDBOX_READ)
  @ApiOperation({ summary: 'List all sandboxes (platform admin)' })
  list() {
    return this.service.list();
  }

  @Post(':id/extend')
  @HttpCode(HttpStatus.OK)
  @Permissions(PLATFORM_SANDBOX_MANAGE)
  @ApiOperation({ summary: 'Extend a sandbox (platform admin)' })
  adminExtend(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.adminExtend(id);
  }

  @Delete(':id')
  @Permissions(PLATFORM_SANDBOX_MANAGE)
  @ApiOperation({ summary: 'Delete a sandbox and its data (platform admin)' })
  adminDelete(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.adminDelete(id);
  }
}
