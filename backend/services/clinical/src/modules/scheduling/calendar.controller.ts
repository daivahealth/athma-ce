/**
 * Calendar Controller
 *
 * REST API endpoints for unified calendar views
 */

import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { GetStaffCalendarQueryDto } from './dto/calendar.dto';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import { CALENDAR_READ } from '@zeal/contracts';

@Controller('scheduling/calendar')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  private getContext(req: any) {
    // Context is set by TenantContextMiddleware in req.context
    if (!req.context) {
      throw new Error('Request context not found. Ensure TenantContextMiddleware is applied.');
    }
    return req.context;
  }

  /**
   * GET /scheduling/calendar/staff/:staffId
   * Get unified calendar events for a staff member (appointments + encounters)
   */
  @Get('staff/:staffId')
  @Permissions(CALENDAR_READ)
  async getStaffCalendar(
    @Param('staffId') staffId: string,
    @Query() query: GetStaffCalendarQueryDto,
    @Req() req: any
  ) {
    const context = this.getContext(req);

    const startDate = query.startDate ? new Date(query.startDate) : undefined;
    const endDate = query.endDate ? new Date(query.endDate) : undefined;

    return this.calendarService.getStaffCalendar(staffId, context, startDate, endDate);
  }
}
