import { IsString, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { PatientDisplayDto } from '@zeal/contracts';

export class GetStaffCalendarQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export interface CalendarEvent {
  id: string;
  type: 'appointment' | 'encounter';
  source: 'appointment' | 'walk-in' | 'emergency' | 'telemedicine';
  staffId: string;
  patientId: string;
  patientDisplay: PatientDisplayDto;
  startTime: string;
  endTime: string | null;
  status: string;
  
  // Appointment-specific fields
  appointmentId?: string | undefined;
  appointmentType?: string | undefined;
  appointmentStatus?: string | undefined;
  visitType?: string | undefined;
  duration?: number | undefined;
  notes?: string | undefined;
  
  // Encounter-specific fields
  encounterId?: string | undefined;
  encounterNumber?: string | undefined;
  encounterClass?: string | undefined;
  encounterType?: string | undefined;
  encounterStatus?: string | undefined;
  priority?: string | undefined;
  encounterSource?: string | undefined;
  
  // Link between appointment and encounter
  linkedAppointmentId?: string | undefined; // If encounter, link back to appointment
  linkedEncounterIds?: string[] | undefined; // If appointment, link to encounter(s)
  
  // Additional metadata
  createdAt: string;
  updatedAt: string;
}
