import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/shared-database';
import { CreateAppointmentDto, UpdateAppointmentDto, AppointmentQueryDto, AppointmentSearchDto, CheckAvailabilityDto, GetAvailabilityDto } from './dto/appointment.dto';

@Injectable()
export class AppointmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAppointmentDto): Promise<any> {
    return this.prisma.appointment.create({
      data: {
        ...data,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
      },
    });
  }

  async findById(id: string): Promise<any> {
    return this.prisma.appointment.findUnique({
      where: { id },
    });
  }

  async findByIdWithDetails(id: string): Promise<any> {
    return this.prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        staff: true,
        facility: true,
        space: true,
        encounter: true,
      },
    });
  }

  async findMany(query: AppointmentQueryDto): Promise<any> {
    const { page, limit, patientId, staffId, facilityId, spaceId, status, appointmentType, visitType, dateRange, timeRange, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (patientId) where.patientId = patientId;
    if (staffId) where.staffId = staffId;
    if (facilityId) where.facilityId = facilityId;
    if (spaceId) where.spaceId = spaceId;
    if (status) where.status = status;
    if (appointmentType) where.appointmentType = appointmentType;
    if (visitType) where.visitType = visitType;

    if (dateRange) {
      where.startTime = {};
      if (dateRange.from) {
        where.startTime.gte = new Date(dateRange.from);
      }
      if (dateRange.to) {
        where.startTime.lte = new Date(dateRange.to);
      }
    }

    if (timeRange) {
      // This would need more complex logic for time-only filtering
      // For now, we'll implement basic date filtering
    }

    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [appointments, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          patient: true,
          staff: true,
          facility: true,
          space: true,
        },
      }),
      this.prisma.appointment.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: appointments,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async search(searchDto: AppointmentSearchDto): Promise<any[]> {
    const { q, fields = ['patientName', 'staffName'], dateRange, limit } = searchDto;

    const searchConditions = fields.map(field => {
      switch (field) {
        case 'patientName':
          return {
            patient: {
              OR: [
                { firstName: { contains: q, mode: 'insensitive' as const } },
                { lastName: { contains: q, mode: 'insensitive' as const } },
              ],
            },
          };
        case 'staffName':
          return {
            staff: {
              OR: [
                { firstName: { contains: q, mode: 'insensitive' as const } },
                { lastName: { contains: q, mode: 'insensitive' as const } },
              ],
            },
          };
        case 'facilityName':
          return {
            facility: {
              name: { contains: q, mode: 'insensitive' as const },
            },
          };
        case 'notes':
          return {
            notes: { contains: q, mode: 'insensitive' as const },
          };
        default:
          return {};
      }
    }).filter(condition => Object.keys(condition).length > 0);

    const where: any = {
      OR: searchConditions,
    };

    if (dateRange) {
      where.startTime = {};
      if (dateRange.from) {
        where.startTime.gte = new Date(dateRange.from);
      }
      if (dateRange.to) {
        where.startTime.lte = new Date(dateRange.to);
      }
    }

    return this.prisma.appointment.findMany({
      where,
      take: limit,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            emiratesId: true,
          },
        },
        staff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        facility: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateAppointmentDto): Promise<any> {
    const updateData: any = { ...data };
    
    if (data.startTime) {
      updateData.startTime = new Date(data.startTime);
    }
    if (data.endTime) {
      updateData.endTime = new Date(data.endTime);
    }

    return this.prisma.appointment.update({
      where: { id },
      data: updateData,
    });
  }

  async checkConflicts(appointmentData: any, excludeId?: string): Promise<any[]> {
    const where: any = {
      AND: [
        {
          OR: [
            {
              AND: [
                { startTime: { lt: new Date(appointmentData.endTime) } },
                { endTime: { gt: new Date(appointmentData.startTime) } },
              ],
            },
          ],
        },
        {
          status: {
            notIn: ['cancelled', 'completed'],
          },
        },
      ],
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    if (appointmentData.staffId) {
      where.staffId = appointmentData.staffId;
    }

    if (appointmentData.spaceId) {
      where.spaceId = appointmentData.spaceId;
    }

    return this.prisma.appointment.findMany({
      where,
      include: {
        patient: true,
        staff: true,
        space: true,
      },
    });
  }

  async checkAvailability(checkAvailabilityDto: CheckAvailabilityDto): Promise<any> {
    const conflicts = await this.checkConflicts({
      startTime: checkAvailabilityDto.startTime,
      endTime: checkAvailabilityDto.endTime,
      staffId: checkAvailabilityDto.staffId,
      spaceId: checkAvailabilityDto.spaceId,
    }, checkAvailabilityDto.excludeAppointmentId);

    return {
      available: conflicts.length === 0,
      conflicts,
    };
  }

  async getAvailability(query: GetAvailabilityDto): Promise<any> {
    const { facilityId, staffId, spaceId, date, duration, includeWeekends } = query;
    
    const targetDate = new Date(date);
    const slots = [];

    // Get facility operating hours (this would come from facility configuration)
    const operatingHours = {
      open: '08:00',
      close: '17:00',
      breaks: [
        { start: '12:00', end: '13:00' },
      ],
    };

    // Generate time slots
    const openTime = this.parseTime(operatingHours.open);
    const closeTime = this.parseTime(operatingHours.close);

    let currentTime = new Date(targetDate);
    currentTime.setHours(openTime.hours, openTime.minutes, 0, 0);

    const endTime = new Date(targetDate);
    endTime.setHours(closeTime.hours, closeTime.minutes, 0, 0);

    while (currentTime < endTime) {
      const slotEndTime = new Date(currentTime.getTime() + duration * 60000);

      // Check if slot overlaps with break time
      const isBreakTime = operatingHours.breaks.some(breakTime => {
        const breakStart = this.parseTime(breakTime.start);
        const breakEnd = this.parseTime(breakTime.end);
        const breakStartTime = new Date(targetDate);
        breakStartTime.setHours(breakStart.hours, breakStart.minutes, 0, 0);
        const breakEndTime = new Date(targetDate);
        breakEndTime.setHours(breakEnd.hours, breakEnd.minutes, 0, 0);

        return (currentTime < breakEndTime && slotEndTime > breakStartTime);
      });

      // Check for conflicts
      const conflicts = await this.checkConflicts({
        startTime: currentTime.toISOString(),
        endTime: slotEndTime.toISOString(),
        staffId,
        spaceId,
        facilityId,
      });

      const isWeekend = currentTime.getDay() === 0 || currentTime.getDay() === 6;
      const available = !isBreakTime && conflicts.length === 0 && (includeWeekends || !isWeekend);

      slots.push({
        startTime: currentTime.toISOString(),
        endTime: slotEndTime.toISOString(),
        duration,
        available,
        reason: !available ? this.getUnavailabilityReason(isBreakTime, conflicts.length > 0, isWeekend) : undefined,
      });

      // Move to next slot
      currentTime = new Date(currentTime.getTime() + 30 * 60000); // 30-minute increments
    }

    return {
      date,
      facilityId,
      staffId,
      spaceId,
      slots,
      operatingHours,
    };
  }

  async cancelRecurringAppointments(seriesId: string, reason: string, cancelFutureOnly: boolean): Promise<any> {
    const where: any = { seriesId };
    
    if (cancelFutureOnly) {
      where.startTime = { gte: new Date() };
    }

    return this.prisma.appointment.updateMany({
      where,
      data: {
        status: 'cancelled',
        cancellationReason: reason,
      },
    });
  }

  async addToWaitlist(data: any): Promise<any> {
    return this.prisma.appointmentWaitlist.create({
      data,
    });
  }

  async getWaitlist(query: any): Promise<any> {
    const { page = 1, limit = 20, facilityId, staffId, status } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (facilityId) where.facilityId = facilityId;
    if (staffId) where.staffId = staffId;
    if (status) where.status = status;

    const [waitlist, total] = await Promise.all([
      this.prisma.appointmentWaitlist.findMany({
        where,
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
        include: {
          patient: true,
          staff: true,
          facility: true,
        },
      }),
      this.prisma.appointmentWaitlist.count({ where }),
    ]);

    return {
      data: waitlist,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async updateWaitlistItem(id: string, updates: any): Promise<any> {
    return this.prisma.appointmentWaitlist.update({
      where: { id },
      data: updates,
    });
  }

  async removeFromWaitlist(id: string): Promise<any> {
    return this.prisma.appointmentWaitlist.delete({
      where: { id },
    });
  }

  async getDayView(date: string, query: any): Promise<any> {
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const where: any = {
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };

    if (query.facilityId) where.facilityId = query.facilityId;
    if (query.staffId) where.staffId = query.staffId;

    return this.prisma.appointment.findMany({
      where,
      orderBy: { startTime: 'asc' },
      include: {
        patient: true,
        staff: true,
        facility: true,
        space: true,
      },
    });
  }

  async getWeekView(week: string, query: any): Promise<any> {
    // Implementation for week view
    return [];
  }

  async getMonthView(month: string, query: any): Promise<any> {
    // Implementation for month view
    return [];
  }

  async getStaffUtilization(staffId: string, query: any): Promise<any> {
    // Implementation for staff utilization
    return {};
  }

  async getSpaceUtilization(spaceId: string, query: any): Promise<any> {
    // Implementation for space utilization
    return {};
  }

  async getFacilityUtilization(facilityId: string, query: any): Promise<any> {
    // Implementation for facility utilization
    return {};
  }

  async getConflicts(query: any): Promise<any> {
    // Implementation for getting all conflicts
    return [];
  }

  async getAppointmentConflicts(id: string): Promise<any> {
    const appointment = await this.findById(id);
    if (!appointment) {
      return [];
    }

    return this.checkConflicts(appointment, id);
  }

  async getAppointmentTemplates(query: any): Promise<any> {
    // Implementation for appointment templates
    return [];
  }

  async createAppointmentTemplate(templateDto: any): Promise<any> {
    // Implementation for creating appointment templates
    return {};
  }

  async getAppointmentStats(query: any): Promise<any> {
    const { dateRange, facilityId, staffId } = query;

    const where: any = {};
    if (facilityId) where.facilityId = facilityId;
    if (staffId) where.staffId = staffId;

    if (dateRange) {
      where.startTime = {};
      if (dateRange.from) where.startTime.gte = new Date(dateRange.from);
      if (dateRange.to) where.startTime.lte = new Date(dateRange.to);
    }

    const [
      total,
      byStatus,
      byType,
      byStaff,
      byFacility,
    ] = await Promise.all([
      this.prisma.appointment.count({ where }),
      this.prisma.appointment.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      this.prisma.appointment.groupBy({
        by: ['appointmentType'],
        where,
        _count: true,
      }),
      this.prisma.appointment.groupBy({
        by: ['staffId'],
        where,
        _count: true,
      }),
      this.prisma.appointment.groupBy({
        by: ['facilityId'],
        where,
        _count: true,
      }),
    ]);

    return {
      total,
      byStatus: this.groupByToRecord(byStatus),
      byType: this.groupByToRecord(byType),
      byStaff: this.groupByToRecord(byStaff),
      byFacility: this.groupByToRecord(byFacility),
      averageDuration: 30, // This would be calculated from actual data
      noShowRate: 0.05, // This would be calculated from actual data
      cancellationRate: 0.1, // This would be calculated from actual data
      utilizationRate: 0.8, // This would be calculated from actual data
    };
  }

  async getAppointmentAnalytics(query: any): Promise<any> {
    // Implementation for appointment analytics
    return {};
  }

  private parseTime(timeString: string): { hours: number; minutes: number } {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
  }

  private getUnavailabilityReason(isBreakTime: boolean, hasConflicts: boolean, isWeekend: boolean): string {
    if (isBreakTime) return 'Break time';
    if (hasConflicts) return 'Conflicting appointment';
    if (isWeekend) return 'Weekend not included';
    return 'Unavailable';
  }

  private groupByToRecord(groupByResult: any[]): Record<string, number> {
    return groupByResult.reduce((acc, item) => {
      const key = Object.keys(item).find(key => key !== '_count');
      if (key) {
        acc[item[key]] = item._count;
      }
      return acc;
    }, {});
  }
}
