import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { PLATFORM_ACCESS_REQUEST_MANAGE, PLATFORM_ACCESS_REQUEST_READ } from '@zeal/contracts';
import { Public } from '../auth/decorators/public.decorator';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { AccessRequestRateLimitedError, AccessRequestService } from './access-request.service';
import { CreateAccessRequestDto, ListAccessRequestsQueryDto, UpdateAccessRequestDto } from './dto/access-request.dto';

function clientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim();
  return first || req.ip || 'unknown';
}

/**
 * Production access requests. POST is public (the landing page form);
 * reading and reviewing need platform permissions (super_admin only).
 * See docs/api/ACCESS-REQUESTS-API.md.
 */
@ApiTags('Access requests')
@Controller('access-requests')
export class AccessRequestController {
  constructor(private readonly service: AccessRequestService) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Submit a production access request (public)' })
  async submit(@Body() dto: CreateAccessRequestDto, @Req() req: Request) {
    try {
      await this.service.submit(dto, clientIp(req));
    } catch (error) {
      if (error instanceof AccessRequestRateLimitedError) {
        throw new HttpException('Too many requests. Please try again later.', HttpStatus.TOO_MANY_REQUESTS);
      }
      throw error;
    }
    // Same answer whether stored or dropped by the honeypot.
    return { received: true };
  }

  @Get()
  @Permissions(PLATFORM_ACCESS_REQUEST_READ)
  @ApiOperation({ summary: 'List access requests, newest first, with counts by status' })
  list(@Query() query: ListAccessRequestsQueryDto) {
    return this.service.list(query.status);
  }

  @Patch(':id')
  @Permissions(PLATFORM_ACCESS_REQUEST_MANAGE)
  @ApiOperation({ summary: 'Change the status or notes of an access request' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateAccessRequestDto,
    @Req() req: Request & { user?: { userId?: string } },
  ) {
    return this.service.update(id, dto, req.user?.userId);
  }
}
