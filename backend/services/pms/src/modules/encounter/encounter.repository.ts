import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/shared-database';
import {
  CreateEncounterDto,
  UpdateEncounterDto,
  EncounterQueryDto,
  EncounterSearchDto,
  CreateClinicalNoteDto,
  UpdateClinicalNoteDto,
  CreateVitalsDto,
  CreateOrderDto,
} from './dto/encounter.dto';

@Injectable()
export class EncounterRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateEncounterDto): Promise<any> {
    return this.prisma.encounter.create({
      data: {
        ...data,
        startTime: new Date(data.startTime),
        endTime: data.endTime ? new Date(data.endTime) : undefined,
      },
    });
  }

  async findById(id: string): Promise<any> {
    return this.prisma.encounter.findUnique({
      where: { id },
    });
  }

  async findByIdWithDetails(id: string): Promise<any> {
    return this.prisma.encounter.findUnique({
      where: { id },
      include: {
        patient: true,
        facility: true,
        appointment: true,
        primaryStaff: true,
      },
    });
  }

  async findPatient(patientId: string): Promise<any> {
    return this.prisma.patient.findUnique({
      where: { id: patientId },
    });
  }

  async findStaff(staffId: string): Promise<any> {
    return this.prisma.staff.findUnique({
      where: { id: staffId },
    });
  }

  async findAppointment(appointmentId: string): Promise<any> {
    return this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });
  }

  async findByAppointmentId(appointmentId: string): Promise<any> {
    return this.prisma.encounter.findUnique({
      where: { appointmentId },
    });
  }

  async findMany(query: EncounterQueryDto): Promise<any> {
    const {
      page,
      limit,
      patientId,
      facilityId,
      primaryStaffId,
      appointmentId,
      status,
      encounterClass,
      priority,
      encounterSource,
      dateRange,
      sortBy,
      sortOrder,
    } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (patientId) where.patientId = patientId;
    if (facilityId) where.facilityId = facilityId;
    if (primaryStaffId) where.primaryStaffId = primaryStaffId;
    if (appointmentId) where.appointmentId = appointmentId;
    if (status) where.status = status;
    if (encounterClass) where.encounterClass = encounterClass;
    if (priority) where.priority = priority;
    if (encounterSource) where.encounterSource = encounterSource;

    if (dateRange) {
      where.startTime = {};
      if (dateRange.from) {
        where.startTime.gte = new Date(dateRange.from);
      }
      if (dateRange.to) {
        where.startTime.lte = new Date(dateRange.to);
      }
    }

    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [encounters, total] = await Promise.all([
      this.prisma.encounter.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          patient: true,
          facility: true,
          appointment: true,
          primaryStaff: true,
        },
      }),
      this.prisma.encounter.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: encounters,
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

  async search(searchDto: EncounterSearchDto): Promise<any[]> {
    const { q, fields = ['chiefComplaint', 'presentingSymptoms'], dateRange, limit } = searchDto;

    const searchConditions = fields.map(field => {
      switch (field) {
        case 'chiefComplaint':
          return { chiefComplaint: { contains: q, mode: 'insensitive' as const } };
        case 'presentingSymptoms':
          return { presentingSymptoms: { contains: q, mode: 'insensitive' as const } };
        case 'notes':
          return { notes: { contains: q, mode: 'insensitive' as const } };
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
            primaryStaff: {
              OR: [
                { firstName: { contains: q, mode: 'insensitive' as const } },
                { lastName: { contains: q, mode: 'insensitive' as const } },
              ],
            },
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

    return this.prisma.encounter.findMany({
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
        primaryStaff: {
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

  async update(id: string, data: UpdateEncounterDto): Promise<any> {
    const updateData: any = { ...data };

    if (data.startTime) {
      updateData.startTime = new Date(data.startTime);
    }
    if (data.endTime) {
      updateData.endTime = new Date(data.endTime);
    }

    return this.prisma.encounter.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<any> {
    return this.prisma.encounter.delete({
      where: { id },
    });
  }

  async updateAppointmentStatus(appointmentId: string, status: string): Promise<any> {
    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
    });
  }

  // Clinical Notes
  async getClinicalNotes(encounterId: string): Promise<any[]> {
    return this.prisma.clinicalNote.findMany({
      where: { encounterId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async createClinicalNote(data: CreateClinicalNoteDto): Promise<any> {
    return this.prisma.clinicalNote.create({
      data: {
        ...data,
        signedAt: data.signedAt ? new Date(data.signedAt) : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findClinicalNote(noteId: string): Promise<any> {
    return this.prisma.clinicalNote.findUnique({
      where: { id: noteId },
    });
  }

  async updateClinicalNote(noteId: string, data: UpdateClinicalNoteDto): Promise<any> {
    const updateData: any = { ...data };

    if (data.signedAt) {
      updateData.signedAt = new Date(data.signedAt);
    }

    return this.prisma.clinicalNote.update({
      where: { id: noteId },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async deleteClinicalNote(noteId: string): Promise<any> {
    return this.prisma.clinicalNote.delete({
      where: { id: noteId },
    });
  }

  // Vitals
  async getVitals(encounterId: string): Promise<any[]> {
    return this.prisma.vitals.findMany({
      where: { encounterId },
      orderBy: { recordedAt: 'desc' },
      include: {
        recordedByStaff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async createVitals(data: CreateVitalsDto): Promise<any> {
    return this.prisma.vitals.create({
      data: {
        ...data,
        recordedAt: new Date(data.recordedAt),
      },
      include: {
        recordedByStaff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findVital(vitalId: string): Promise<any> {
    return this.prisma.vitals.findUnique({
      where: { id: vitalId },
    });
  }

  async updateVitals(vitalId: string, updates: any): Promise<any> {
    return this.prisma.vitals.update({
      where: { id: vitalId },
      data: updates,
      include: {
        recordedByStaff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  // Orders
  async getOrders(encounterId: string): Promise<any[]> {
    return this.prisma.order.findMany({
      where: { encounterId },
      orderBy: { createdAt: 'desc' },
      include: {
        requestedByStaff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async createOrder(data: CreateOrderDto): Promise<any> {
    return this.prisma.order.create({
      data,
      include: {
        requestedByStaff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findOrder(orderId: string): Promise<any> {
    return this.prisma.order.findUnique({
      where: { id: orderId },
    });
  }

  async updateOrder(orderId: string, updates: any): Promise<any> {
    return this.prisma.order.update({
      where: { id: orderId },
      data: updates,
      include: {
        requestedByStaff: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async getEncounterStats(query: any): Promise<any> {
    const { dateRange, facilityId, primaryStaffId } = query;

    const where: any = {};
    if (facilityId) where.facilityId = facilityId;
    if (primaryStaffId) where.primaryStaffId = primaryStaffId;

    if (dateRange) {
      where.startTime = {};
      if (dateRange.from) where.startTime.gte = new Date(dateRange.from);
      if (dateRange.to) where.startTime.lte = new Date(dateRange.to);
    }

    const [
      total,
      byStatus,
      byClass,
      bySource,
      byStaff,
      byFacility,
    ] = await Promise.all([
      this.prisma.encounter.count({ where }),
      this.prisma.encounter.groupBy({
        by: ['status'],
        where,
        _count: true,
      }),
      this.prisma.encounter.groupBy({
        by: ['encounterClass'],
        where,
        _count: true,
      }),
      this.prisma.encounter.groupBy({
        by: ['encounterSource'],
        where,
        _count: true,
      }),
      this.prisma.encounter.groupBy({
        by: ['primaryStaffId'],
        where,
        _count: true,
      }),
      this.prisma.encounter.groupBy({
        by: ['facilityId'],
        where,
        _count: true,
      }),
    ]);

    return {
      total,
      byStatus: this.groupByToRecord(byStatus),
      byClass: this.groupByToRecord(byClass),
      bySource: this.groupByToRecord(bySource),
      byStaff: this.groupByToRecord(byStaff),
      byFacility: this.groupByToRecord(byFacility),
      averageDuration: 45, // This would be calculated from actual data
      averageWaitTime: 15, // This would be calculated from actual data
      walkInRate: 0.1, // This would be calculated from actual data
    };
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
