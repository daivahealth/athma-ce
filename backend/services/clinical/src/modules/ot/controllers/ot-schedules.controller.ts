import { Body, Controller, Get, Headers, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permissions, PermissionsGuard, JwtAuthGuard } from '@zeal/shared-utils';
import {
  OT_SCHEDULE_ADVANCE,
  OT_SCHEDULE_CANCEL,
  OT_SCHEDULE_CREATE,
  OT_SCHEDULE_READ,
  OT_SCHEDULE_UPDATE,
} from '@zeal/contracts';
import { OtSchedulesService } from '../services/ot-schedules.service';
import { CheckOtScheduleConflictsDto, CreateOtScheduleDto, ListOtSchedulesDto, TransitionOtScheduleDto, UpdateOtScheduleDto } from '../dto/ot-schedule.dto';
import { OtScheduleStatus } from '../ot.constants';

@ApiTags('OT Schedules')
@ApiBearerAuth()
@Controller('ot/schedules')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OtSchedulesController {
  constructor(private readonly schedulesService: OtSchedulesService) {}

  @Post()
  @Permissions(OT_SCHEDULE_CREATE)
  @ApiOperation({ summary: 'Create or reschedule an OT schedule' })
  create(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string, @Body() dto: CreateOtScheduleDto) {
    return this.schedulesService.create(tenantId, userId, dto);
  }

  @Get()
  @Permissions(OT_SCHEDULE_READ)
  list(@Headers('x-tenant-id') tenantId: string, @Query() query: ListOtSchedulesDto) {
    return this.schedulesService.list(tenantId, query);
  }

  @Get(':id')
  @Permissions(OT_SCHEDULE_READ)
  findById(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.schedulesService.findById(tenantId, id);
  }

  @Patch(':id')
  @Permissions(OT_SCHEDULE_UPDATE)
  update(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string, @Param('id') id: string, @Body() dto: UpdateOtScheduleDto) {
    return this.schedulesService.update(tenantId, id, userId, dto);
  }

  @Post(':id/confirm')
  @Permissions(OT_SCHEDULE_ADVANCE)
  confirm(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string, @Param('id') id: string, @Body() dto: TransitionOtScheduleDto) {
    return this.schedulesService.transition(tenantId, id, userId, OtScheduleStatus.CONFIRMED, dto);
  }

  @Post(':id/patient-ready')
  @Permissions(OT_SCHEDULE_ADVANCE)
  patientReady(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string, @Param('id') id: string, @Body() dto: TransitionOtScheduleDto) {
    return this.schedulesService.transition(tenantId, id, userId, OtScheduleStatus.PATIENT_READY, dto);
  }

  @Post(':id/patient-in-ot')
  @Permissions(OT_SCHEDULE_ADVANCE)
  patientInOt(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string, @Param('id') id: string, @Body() dto: TransitionOtScheduleDto) {
    return this.schedulesService.transition(tenantId, id, userId, OtScheduleStatus.PATIENT_IN_OT, dto);
  }

  @Post(':id/anaesthesia-started')
  @Permissions(OT_SCHEDULE_ADVANCE)
  anaesthesiaStarted(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string, @Param('id') id: string, @Body() dto: TransitionOtScheduleDto) {
    return this.schedulesService.transition(tenantId, id, userId, OtScheduleStatus.ANAESTHESIA_STARTED, dto);
  }

  @Post(':id/surgery-started')
  @Permissions(OT_SCHEDULE_ADVANCE)
  surgeryStarted(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string, @Param('id') id: string, @Body() dto: TransitionOtScheduleDto) {
    return this.schedulesService.transition(tenantId, id, userId, OtScheduleStatus.SURGERY_STARTED, dto);
  }

  @Post(':id/surgery-completed')
  @Permissions(OT_SCHEDULE_ADVANCE)
  surgeryCompleted(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string, @Param('id') id: string, @Body() dto: TransitionOtScheduleDto) {
    return this.schedulesService.transition(tenantId, id, userId, OtScheduleStatus.SURGERY_COMPLETED, dto);
  }

  @Post(':id/shift-to-recovery')
  @Permissions(OT_SCHEDULE_ADVANCE)
  shiftToRecovery(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string, @Param('id') id: string, @Body() dto: TransitionOtScheduleDto) {
    return this.schedulesService.transition(tenantId, id, userId, OtScheduleStatus.PATIENT_SHIFTED_TO_RECOVERY, dto);
  }

  @Post(':id/postpone')
  @Permissions(OT_SCHEDULE_CANCEL)
  postpone(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string, @Param('id') id: string, @Body() dto: TransitionOtScheduleDto) {
    return this.schedulesService.transition(tenantId, id, userId, OtScheduleStatus.POSTPONED, dto);
  }

  @Post(':id/cancel')
  @Permissions(OT_SCHEDULE_CANCEL)
  cancel(@Headers('x-tenant-id') tenantId: string, @Headers('x-user-id') userId: string, @Param('id') id: string, @Body() dto: TransitionOtScheduleDto) {
    return this.schedulesService.transition(tenantId, id, userId, OtScheduleStatus.CANCELLED, dto);
  }

  @Get(':id/history')
  @Permissions(OT_SCHEDULE_READ)
  history(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.schedulesService.getHistory(tenantId, id);
  }

  @Post('conflicts/check')
  @Permissions(OT_SCHEDULE_READ)
  checkConflicts(@Headers('x-tenant-id') tenantId: string, @Body() dto: CheckOtScheduleConflictsDto) {
    return this.schedulesService.checkConflicts(tenantId, dto);
  }
}
