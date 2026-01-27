/**
 * Calendar Service
 *
 * Provides unified calendar views combining appointments and encounters
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { PatientDisplayDto } from '@zeal/contracts';
import { STANDARD_PATIENT_SELECT } from '../common/constants/patient-select.constant';
import type { CalendarEvent } from './dto/calendar.dto';

export interface RequestContext {
  userId: string;
  tenantId: string;
  facilityId: string;
  userRole: string;
}

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calculate age from date of birth
   */
  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Build patient display info from patient record
   */
  private buildPatientDisplay(patient: any): PatientDisplayDto {
    return {
      patientId: patient.id,
      mrn: patient.mrn,
      firstName: patient.firstName,
      lastName: patient.lastName,
      displayName: patient.displayName || `${patient.firstName} ${patient.lastName}`,
      age: this.calculateAge(patient.dateOfBirth),
      dateOfBirth: patient.dateOfBirth.toISOString().split('T')[0], // YYYY-MM-DD format
      gender: patient.gender,
      nationalId: patient.nationalId || undefined,
      nationalIdType: patient.nationalIdType || undefined,
      phoneNumber: patient.phoneNumber || undefined,
      email: patient.email || undefined,
      nationality: patient.nationality || undefined,
      preferredLanguage: patient.preferredLanguage || undefined,
    };
  }

  /**
   * Get unified calendar events for a staff member
   * Combines appointments and encounters into a single calendar view
   */
  async getStaffCalendar(
    staffId: string,
    context: RequestContext,
    startDate?: Date,
    endDate?: Date
  ): Promise<CalendarEvent[]> {
    const { tenantId } = context;

    // Default to current month if no dates provided
    const start = startDate || new Date();
    const end = endDate || new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from start

    // Normalize dates to start/end of day
    const startOfDay = new Date(start);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(end);
    endOfDay.setHours(23, 59, 59, 999);

    // Query appointments
    const appointments = await this.prisma.appointment.findMany({
      where: {
        tenantId,
        staffId,
        status: { not: 'cancelled' },
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        patient: {
          select: STANDARD_PATIENT_SELECT,
        },
        encounters: {
          select: {
            id: true,
            encounterNumber: true,
            status: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    // Query encounters
    // Include encounters that:
    // 1. Start within the date range, OR
    // 2. Are ongoing (startTime before range but endTime is null or after range start)
    const encounters = await this.prisma.encounter.findMany({
      where: {
        tenantId,
        primaryStaffId: staffId,
        status: { not: 'cancelled' },
        OR: [
          {
            // Encounters starting within the date range
            startTime: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
          {
            // Ongoing encounters that started before but haven't ended or end after range start
            startTime: { lt: startOfDay },
            OR: [
              { endTime: null }, // Ongoing encounters
              { endTime: { gte: startOfDay } }, // Encounters ending after range start
            ],
          },
        ],
      },
      include: {
        patient: {
          select: STANDARD_PATIENT_SELECT,
        },
        appointment: {
          select: {
            id: true,
            appointmentType: true,
            status: true,
            visitType: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    // Build calendar events from appointments
    const appointmentEvents: CalendarEvent[] = appointments.map((appt) => {
      const linkedEncounterIds = appt.encounters.map((enc) => enc.id);

      return {
        id: appt.id,
        type: 'appointment',
        source: 'appointment',
        staffId: appt.staffId || staffId,
        patientId: appt.patientId,
        patientDisplay: this.buildPatientDisplay(appt.patient),
        startTime: appt.startTime.toISOString(),
        endTime: appt.endTime.toISOString(),
        status: appt.status,
        appointmentId: appt.id,
        appointmentType: appt.appointmentType,
        appointmentStatus: appt.status,
        visitType: appt.visitType ?? undefined,
        duration: appt.duration,
        notes: appt.notes ?? undefined,
        linkedEncounterIds: linkedEncounterIds.length > 0 ? linkedEncounterIds : undefined,
        createdAt: appt.createdAt.toISOString(),
        updatedAt: appt.updatedAt.toISOString(),
      };
    });

    // Build calendar events from encounters
    const encounterEvents: CalendarEvent[] = encounters.map((enc) => {
      // Determine source type
      let source: 'appointment' | 'walk-in' | 'emergency' | 'telemedicine' = 'walk-in';
      if (enc.encounterSource === 'appointment' && enc.appointmentId) {
        source = 'appointment';
      } else if (enc.encounterSource === 'emergency') {
        source = 'emergency';
      } else if (enc.encounterSource === 'telemedicine') {
        source = 'telemedicine';
      } else {
        source = 'walk-in';
      }

      return {
        id: enc.id,
        type: 'encounter',
        source,
        staffId: enc.primaryStaffId,
        patientId: enc.patientId,
        patientDisplay: this.buildPatientDisplay(enc.patient),
        startTime: enc.startTime.toISOString(),
        endTime: enc.endTime ? enc.endTime.toISOString() : null,
        status: enc.status,
        encounterId: enc.id,
        encounterNumber: enc.encounterNumber,
        encounterClass: enc.encounterClass,
        encounterType: enc.encounterType,
        encounterStatus: enc.status,
        priority: enc.priority,
        encounterSource: enc.encounterSource,
        linkedAppointmentId: enc.appointmentId ?? undefined,
        // Include appointment details if linked
        appointmentType: enc.appointment?.appointmentType ?? undefined,
        appointmentStatus: enc.appointment?.status ?? undefined,
        visitType: enc.appointment?.visitType ?? undefined,
        createdAt: enc.createdAt.toISOString(),
        updatedAt: enc.updatedAt.toISOString(),
      };
    });

    // Merge and deduplicate events
    // Strategy: If encounter has appointmentId, prioritize encounter (it's the active clinical record)
    // If appointment has no encounters yet, show appointment
    const eventMap = new Map<string, CalendarEvent>();

    // First, add all encounters (they take precedence)
    encounterEvents.forEach((event) => {
      eventMap.set(event.id, event);
    });

    // Then, add appointments that don't have linked encounters
    appointmentEvents.forEach((apptEvent) => {
      // Only add if no encounter exists for this appointment
      const hasLinkedEncounter = encounterEvents.some(
        (encEvent) => encEvent.linkedAppointmentId === apptEvent.appointmentId
      );

      if (!hasLinkedEncounter) {
        // Use appointment ID as key, but check if we already have an encounter with this appointmentId
        const key = `appt-${apptEvent.appointmentId}`;
        if (!eventMap.has(key)) {
          eventMap.set(key, apptEvent);
        }
      }
    });

    // Convert map to array and sort by start time
    const mergedEvents = Array.from(eventMap.values()).sort((a, b) => {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

    return mergedEvents;
  }
}
