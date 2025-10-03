import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { EncounterRepository } from './encounter.repository';
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
export class EncounterService {
  constructor(private readonly encounterRepository: EncounterRepository) {}

  async createEncounter(createEncounterDto: CreateEncounterDto): Promise<any> {
    // Validate encounter data
    this.validateEncounterData(createEncounterDto);

    // Check if patient exists
    const patient = await this.encounterRepository.findPatient(createEncounterDto.patientId);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Check if staff exists
    const staff = await this.encounterRepository.findStaff(createEncounterDto.primaryStaffId);
    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    // Check if appointment exists (if provided)
    if (createEncounterDto.appointmentId) {
      const appointment = await this.encounterRepository.findAppointment(createEncounterDto.appointmentId);
      if (!appointment) {
        throw new NotFoundException('Appointment not found');
      }

      // Check if appointment is not already linked to another encounter
      const existingEncounter = await this.encounterRepository.findByAppointmentId(createEncounterDto.appointmentId);
      if (existingEncounter) {
        throw new ConflictException('Appointment is already linked to another encounter');
      }
    }

    // Create encounter
    const encounter = await this.encounterRepository.create(createEncounterDto);

    // Update appointment status if linked
    if (createEncounterDto.appointmentId) {
      await this.encounterRepository.updateAppointmentStatus(createEncounterDto.appointmentId, 'in_progress');
    }

    return this.encounterRepository.findByIdWithDetails(encounter.id);
  }

  async getEncounters(query: EncounterQueryDto): Promise<any> {
    return this.encounterRepository.findMany(query);
  }

  async searchEncounters(searchDto: EncounterSearchDto): Promise<any[]> {
    return this.encounterRepository.search(searchDto);
  }

  async getEncounterById(id: string): Promise<any> {
    const encounter = await this.encounterRepository.findByIdWithDetails(id);
    if (!encounter) {
      throw new NotFoundException('Encounter not found');
    }
    return encounter;
  }

  async updateEncounter(id: string, updateEncounterDto: UpdateEncounterDto): Promise<any> {
    const existingEncounter = await this.encounterRepository.findById(id);
    if (!existingEncounter) {
      throw new NotFoundException('Encounter not found');
    }

    // Validate staff if being updated
    if (updateEncounterDto.primaryStaffId) {
      const staff = await this.encounterRepository.findStaff(updateEncounterDto.primaryStaffId);
      if (!staff) {
        throw new NotFoundException('Staff member not found');
      }
    }

    await this.encounterRepository.update(id, updateEncounterDto);
    return this.encounterRepository.findByIdWithDetails(id);
  }

  async deleteEncounter(id: string): Promise<void> {
    const encounter = await this.encounterRepository.findById(id);
    if (!encounter) {
      throw new NotFoundException('Encounter not found');
    }

    // Check if encounter can be deleted
    if (encounter.status === 'finished') {
      throw new BadRequestException('Cannot delete finished encounter');
    }

    // Update linked appointment status if exists
    if (encounter.appointmentId) {
      await this.encounterRepository.updateAppointmentStatus(encounter.appointmentId, 'confirmed');
    }

    await this.encounterRepository.delete(id);
  }

  async startEncounter(id: string): Promise<any> {
    const encounter = await this.encounterRepository.findById(id);
    if (!encounter) {
      throw new NotFoundException('Encounter not found');
    }

    if (encounter.status !== 'planned') {
      throw new BadRequestException('Encounter must be in planned status to start');
    }

    await this.encounterRepository.update(id, {
      status: 'in_progress',
      startTime: new Date(),
    });

    return this.encounterRepository.findByIdWithDetails(id);
  }

  async completeEncounter(id: string): Promise<any> {
    const encounter = await this.encounterRepository.findById(id);
    if (!encounter) {
      throw new NotFoundException('Encounter not found');
    }

    if (!['in_progress', 'onleave'].includes(encounter.status)) {
      throw new BadRequestException('Encounter must be in progress or on leave to complete');
    }

    await this.encounterRepository.update(id, {
      status: 'finished',
      endTime: new Date(),
    });

    // Update linked appointment status if exists
    if (encounter.appointmentId) {
      await this.encounterRepository.updateAppointmentStatus(encounter.appointmentId, 'completed');
    }

    return this.encounterRepository.findByIdWithDetails(id);
  }

  async cancelEncounter(id: string, reason: string): Promise<any> {
    const encounter = await this.encounterRepository.findById(id);
    if (!encounter) {
      throw new NotFoundException('Encounter not found');
    }

    if (encounter.status === 'finished') {
      throw new BadRequestException('Cannot cancel finished encounter');
    }

    await this.encounterRepository.update(id, {
      status: 'cancelled',
      notes: encounter.notes ? `${encounter.notes}\nCancellation reason: ${reason}` : `Cancellation reason: ${reason}`,
    });

    // Update linked appointment status if exists
    if (encounter.appointmentId) {
      await this.encounterRepository.updateAppointmentStatus(encounter.appointmentId, 'cancelled');
    }

    return this.encounterRepository.findByIdWithDetails(id);
  }

  // Clinical Notes Management
  async getClinicalNotes(encounterId: string): Promise<any[]> {
    return this.encounterRepository.getClinicalNotes(encounterId);
  }

  async createClinicalNote(createNoteDto: CreateClinicalNoteDto): Promise<any> {
    // Validate encounter exists
    const encounter = await this.encounterRepository.findById(createNoteDto.encounterId);
    if (!encounter) {
      throw new NotFoundException('Encounter not found');
    }

    // Validate author exists
    const author = await this.encounterRepository.findStaff(createNoteDto.authorStaffId);
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    return this.encounterRepository.createClinicalNote(createNoteDto);
  }

  async updateClinicalNote(noteId: string, updateNoteDto: UpdateClinicalNoteDto): Promise<any> {
    const note = await this.encounterRepository.findClinicalNote(noteId);
    if (!note) {
      throw new NotFoundException('Clinical note not found');
    }

    if (note.isSigned) {
      throw new BadRequestException('Cannot update signed note');
    }

    return this.encounterRepository.updateClinicalNote(noteId, updateNoteDto);
  }

  async deleteClinicalNote(noteId: string): Promise<void> {
    const note = await this.encounterRepository.findClinicalNote(noteId);
    if (!note) {
      throw new NotFoundException('Clinical note not found');
    }

    if (note.isSigned) {
      throw new BadRequestException('Cannot delete signed note');
    }

    await this.encounterRepository.deleteClinicalNote(noteId);
  }

  async signClinicalNote(noteId: string, signedBy: string): Promise<any> {
    const note = await this.encounterRepository.findClinicalNote(noteId);
    if (!note) {
      throw new NotFoundException('Clinical note not found');
    }

    if (note.isSigned) {
      throw new BadRequestException('Note is already signed');
    }

    return this.encounterRepository.updateClinicalNote(noteId, {
      isSigned: true,
      signedAt: new Date(),
      signedBy,
    });
  }

  // Vitals Management
  async getVitals(encounterId: string): Promise<any[]> {
    return this.encounterRepository.getVitals(encounterId);
  }

  async recordVitals(createVitalsDto: CreateVitalsDto): Promise<any> {
    // Validate encounter exists
    const encounter = await this.encounterRepository.findById(createVitalsDto.encounterId);
    if (!encounter) {
      throw new NotFoundException('Encounter not found');
    }

    // Validate recorded by exists
    const recorder = await this.encounterRepository.findStaff(createVitalsDto.recordedBy);
    if (!recorder) {
      throw new NotFoundException('Recorder not found');
    }

    // Calculate BMI if height and weight are provided
    if (createVitalsDto.height && createVitalsDto.weight) {
      const heightInMeters = createVitalsDto.height / 100;
      createVitalsDto.bmi = createVitalsDto.weight / (heightInMeters * heightInMeters);
    }

    return this.encounterRepository.createVitals(createVitalsDto);
  }

  async updateVitals(vitalId: string, updates: any): Promise<any> {
    const vital = await this.encounterRepository.findVital(vitalId);
    if (!vital) {
      throw new NotFoundException('Vital signs not found');
    }

    // Recalculate BMI if height or weight changed
    if (updates.height || updates.weight) {
      const height = updates.height || vital.height;
      const weight = updates.weight || vital.weight;
      if (height && weight) {
        const heightInMeters = height / 100;
        updates.bmi = weight / (heightInMeters * heightInMeters);
      }
    }

    return this.encounterRepository.updateVitals(vitalId, updates);
  }

  // Orders Management
  async getOrders(encounterId: string): Promise<any[]> {
    return this.encounterRepository.getOrders(encounterId);
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<any> {
    // Validate encounter exists
    const encounter = await this.encounterRepository.findById(createOrderDto.encounterId);
    if (!encounter) {
      throw new NotFoundException('Encounter not found');
    }

    // Validate requested by exists
    const requester = await this.encounterRepository.findStaff(createOrderDto.requestedBy);
    if (!requester) {
      throw new NotFoundException('Requester not found');
    }

    return this.encounterRepository.createOrder(createOrderDto);
  }

  async updateOrder(orderId: string, updates: any): Promise<any> {
    const order = await this.encounterRepository.findOrder(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.encounterRepository.updateOrder(orderId, updates);
  }

  async cancelOrder(orderId: string, reason: string): Promise<any> {
    const order = await this.encounterRepository.findOrder(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === 'completed') {
      throw new BadRequestException('Cannot cancel completed order');
    }

    return this.encounterRepository.updateOrder(orderId, {
      status: 'cancelled',
      notes: order.notes ? `${order.notes}\nCancellation reason: ${reason}` : `Cancellation reason: ${reason}`,
    });
  }

  async getEncounterStats(query: any): Promise<any> {
    return this.encounterRepository.getEncounterStats(query);
  }

  private validateEncounterData(data: CreateEncounterDto): void {
    if (data.endTime && new Date(data.startTime) >= new Date(data.endTime)) {
      throw new BadRequestException('End time must be after start time');
    }

    if (new Date(data.startTime) > new Date()) {
      throw new BadRequestException('Cannot create encounter in the future');
    }

    // Validate vital signs ranges
    if (data.vitalSigns) {
      this.validateVitalSigns(data.vitalSigns);
    }
  }

  private validateVitalSigns(vitals: any): void {
    if (vitals.temperature && (vitals.temperature < 30 || vitals.temperature > 45)) {
      throw new BadRequestException('Temperature must be between 30°C and 45°C');
    }

    if (vitals.bloodPressure) {
      if (vitals.bloodPressure.systolic < 50 || vitals.bloodPressure.systolic > 250) {
        throw new BadRequestException('Systolic blood pressure must be between 50 and 250 mmHg');
      }
      if (vitals.bloodPressure.diastolic < 30 || vitals.bloodPressure.diastolic > 150) {
        throw new BadRequestException('Diastolic blood pressure must be between 30 and 150 mmHg');
      }
      if (vitals.bloodPressure.systolic <= vitals.bloodPressure.diastolic) {
        throw new BadRequestException('Systolic pressure must be higher than diastolic pressure');
      }
    }

    if (vitals.heartRate && (vitals.heartRate < 30 || vitals.heartRate > 250)) {
      throw new BadRequestException('Heart rate must be between 30 and 250 bpm');
    }

    if (vitals.respiratoryRate && (vitals.respiratoryRate < 5 || vitals.respiratoryRate > 60)) {
      throw new BadRequestException('Respiratory rate must be between 5 and 60 breaths per minute');
    }

    if (vitals.oxygenSaturation && (vitals.oxygenSaturation < 70 || vitals.oxygenSaturation > 100)) {
      throw new BadRequestException('Oxygen saturation must be between 70% and 100%');
    }

    if (vitals.painScore && (vitals.painScore < 0 || vitals.painScore > 10)) {
      throw new BadRequestException('Pain score must be between 0 and 10');
    }
  }
}



