import { Body, Controller, Get, Headers, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permissions, PermissionsGuard, JwtAuthGuard } from '@zeal/shared-utils';
import {
  OT_REQUEST_APPROVE,
  OT_REQUEST_CANCEL,
  OT_REQUEST_CREATE,
  OT_REQUEST_READ,
  OT_REQUEST_REVIEW,
  OT_REQUEST_UPDATE,
} from '@zeal/contracts';
import { OtRequestsService } from '../services/ot-requests.service';
import { CreateOtRequestDto, ListOtRequestsDto, TransitionOtRequestDto, UpdateOtRequestDto } from '../dto/ot-request.dto';

@ApiTags('OT Requests')
@ApiBearerAuth()
@Controller('ot/requests')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OtRequestsController {
  constructor(private readonly requestsService: OtRequestsService) {}

  @Post()
  @Permissions(OT_REQUEST_CREATE)
  @ApiOperation({ summary: 'Create an OT request in draft status' })
  create(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string, @Body() dto: CreateOtRequestDto) {
    return this.requestsService.create(tenantId, userId, dto);
  }

  @Get()
  @Permissions(OT_REQUEST_READ)
  @ApiOperation({ summary: 'List OT requests' })
  list(@Headers('x-tenant-id') tenantId: string, @Query() query: ListOtRequestsDto) {
    return this.requestsService.list(tenantId, query);
  }

  @Get(':id')
  @Permissions(OT_REQUEST_READ)
  @ApiOperation({ summary: 'Get OT request by ID' })
  findById(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.requestsService.findById(tenantId, id);
  }

  @Patch(':id')
  @Permissions(OT_REQUEST_UPDATE)
  @ApiOperation({ summary: 'Update a mutable OT request' })
  update(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string, @Param('id') id: string, @Body() dto: UpdateOtRequestDto) {
    return this.requestsService.update(tenantId, id, userId, dto);
  }

  @Post(':id/submit')
  @Permissions(OT_REQUEST_CREATE)
  submit(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string, @Param('id') id: string, @Body() dto: TransitionOtRequestDto) {
    return this.requestsService.submit(tenantId, id, userId, dto.reason, dto.remarks);
  }

  @Post(':id/review')
  @Permissions(OT_REQUEST_REVIEW)
  review(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string, @Param('id') id: string, @Body() dto: TransitionOtRequestDto) {
    return this.requestsService.markUnderReview(tenantId, id, userId, dto.reason, dto.remarks);
  }

  @Post(':id/approve')
  @Permissions(OT_REQUEST_APPROVE)
  approve(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string, @Param('id') id: string, @Body() dto: TransitionOtRequestDto) {
    return this.requestsService.approve(tenantId, id, userId, dto.reason, dto.remarks);
  }

  @Post(':id/reject')
  @Permissions(OT_REQUEST_APPROVE)
  reject(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string, @Param('id') id: string, @Body() dto: TransitionOtRequestDto) {
    return this.requestsService.reject(tenantId, id, userId, dto.reason, dto.remarks);
  }

  @Post(':id/cancel')
  @Permissions(OT_REQUEST_CANCEL)
  cancel(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string, @Param('id') id: string, @Body() dto: TransitionOtRequestDto) {
    return this.requestsService.cancel(tenantId, id, userId, dto.reason, dto.remarks);
  }

  @Post(':id/complete')
  @Permissions(OT_REQUEST_UPDATE)
  complete(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string, @Param('id') id: string, @Body() dto: TransitionOtRequestDto) {
    return this.requestsService.complete(tenantId, id, userId, dto.reason, dto.remarks);
  }

  @Get(':id/history')
  @Permissions(OT_REQUEST_READ)
  history(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.requestsService.getHistory(tenantId, id);
  }
}
