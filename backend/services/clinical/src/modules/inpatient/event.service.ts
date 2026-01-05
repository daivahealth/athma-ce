/**
 * Event Service
 *
 * Business logic for inpatient event logging
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get events for an admission
   */
  async getAdmissionEvents(admissionId: string, tenantId: string) {
    // Verify admission exists
    const admission = await this.prisma.inpatientAdmission.findUnique({
      where: { id: admissionId, tenantId },
    });

    if (!admission) {
      throw new NotFoundException(`Admission with ID ${admissionId} not found`);
    }

    // Get events
    const events = await this.prisma.inpatientEvent.findMany({
      where: {
        tenantId,
        admissionId,
      },
      orderBy: {
        performedAt: 'desc',
      },
    });

    return events;
  }

  /**
   * Create an event
   */
  async createEvent(
    admissionId: string,
    dto: CreateEventDto,
    context: any
  ) {
    const { tenantId, userId } = context;

    // Verify admission exists
    const admission = await this.prisma.inpatientAdmission.findUnique({
      where: { id: admissionId, tenantId },
    });

    if (!admission) {
      throw new NotFoundException(`Admission with ID ${admissionId} not found`);
    }

    // Create event
    const event = await this.prisma.inpatientEvent.create({
      data: {
        tenantId,
        admissionId,
        patientId: admission.patientId,
        eventType: dto.eventType,
        eventCategory: dto.eventCategory,
        eventData: dto.eventData,
        performedBy: userId,
        performedAt: new Date(),
        notes: dto.notes || null,
      },
    });

    return event;
  }
}
