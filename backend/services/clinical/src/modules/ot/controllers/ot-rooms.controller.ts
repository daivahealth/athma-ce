import { Body, Controller, Get, Headers, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions, PermissionsGuard, JwtAuthGuard } from '@zeal/shared-utils';
import { OT_ROOM_MANAGE, OT_ROOM_READ } from '@zeal/contracts';
import { OtRoomsService } from '../services/ot-rooms.service';
import { UpdateOtRoomConfigDto, UpsertOtRoomConfigDto } from '../dto/ot-room.dto';

@ApiTags('OT Rooms')
@ApiBearerAuth()
@Controller('ot/rooms')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OtRoomsController {
  constructor(private readonly roomsService: OtRoomsService) {}

  @Get()
  @Permissions(OT_ROOM_READ)
  list(
    @Headers('x-tenant-id') tenantId: string,
    @Query('facilityId') facilityId?: string,
    @Query('includeInactive') includeInactive?: string,
  ) {
    return this.roomsService.list(tenantId, facilityId, includeInactive === 'true');
  }

  @Post('config')
  @Permissions(OT_ROOM_MANAGE)
  upsert(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string, @Body() dto: UpsertOtRoomConfigDto) {
    return this.roomsService.upsert(tenantId, userId, dto);
  }

  @Patch('config/:spaceId')
  @Permissions(OT_ROOM_MANAGE)
  update(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string, @Param('spaceId') spaceId: string, @Body() dto: UpdateOtRoomConfigDto) {
    return this.roomsService.update(tenantId, spaceId, userId, dto);
  }
}
