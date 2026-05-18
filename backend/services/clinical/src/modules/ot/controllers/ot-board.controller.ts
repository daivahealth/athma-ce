import { Controller, Get, Headers, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OT_SCHEDULE_READ } from '@zeal/contracts';
import { JwtAuthGuard, Permissions, PermissionsGuard } from '@zeal/shared-utils';
import { GetOtBoardDto } from '../dto/ot-board.dto';
import { OtBoardService } from '../services/ot-board.service';

@ApiTags('OT Board')
@ApiBearerAuth()
@Controller('ot/board')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OtBoardController {
  constructor(private readonly otBoardService: OtBoardService) {}

  @Get()
  @Permissions(OT_SCHEDULE_READ)
  @ApiOperation({ summary: 'Get room-first OT utilization board for a single day' })
  getBoard(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-facility-id') facilityId: string | undefined,
    @Query() query: GetOtBoardDto,
  ) {
    return this.otBoardService.getBoard(tenantId, query.date, facilityId);
  }
}
