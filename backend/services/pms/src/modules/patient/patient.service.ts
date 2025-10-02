import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PatientRepository } from './patient.repository';
import {
  CreatePatientDto,
  UpdatePatientDto,
  PatientQueryDto,
  PatientSearchDto,
  PatientConsentDto,
  PatientTranslationDto,
  MergePatientsDto,
  DuplicateSearchDto,
} from './dto/patient.dto';
import { PaginatedResult, PatientWithTranslations, PatientMedicalHistory } from '@zeal/contracts';

@Injectable()
export class PatientService {
  constructor(private readonly patientRepository: PatientRepository) {}

  async createPatient(createPatientDto: any): Promise<any> {
    console.log('Service received:', createPatientDto);
    
    // Set default tenant if not provided
    if (!createPatientDto.tenantId) {
      createPatientDto.tenantId = 'b65c2761-d9fa-450b-b02e-b04af7855131'; // Default tenant
    }

    // Check if patient with Emirates ID already exists within the tenant
    const existingPatient = await this.patientRepository.findByEmiratesIdAndTenant(
      createPatientDto.emiratesId, 
      createPatientDto.tenantId
    );
    if (existingPatient) {
      throw new ConflictException('Patient with this Emirates ID already exists');
    }

    // Validate Emirates ID checksum
    this.validateEmiratesIdChecksum(createPatientDto.emiratesId);

    // Create patient
    const patient = await this.patientRepository.create(createPatientDto);
    
    return this.patientRepository.findByIdWithTranslations(patient.id);
  }

  async getPatients(query: PatientQueryDto): Promise<PaginatedResult<any>> {
    return this.patientRepository.findMany(query);
  }

  async searchPatients(searchDto: PatientSearchDto): Promise<any[]> {
    return this.patientRepository.search(searchDto);
  }

  async getPatientById(id: string): Promise<PatientWithTranslations> {
    const patient = await this.patientRepository.findByIdWithTranslations(id);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }

  async updatePatient(id: string, updatePatientDto: UpdatePatientDto): Promise<PatientWithTranslations> {
    // Check if patient exists
    const existingPatient = await this.patientRepository.findById(id);
    if (!existingPatient) {
      throw new NotFoundException('Patient not found');
    }

    // If Emirates ID is being updated, check for conflicts
    if (updatePatientDto.emiratesId && updatePatientDto.emiratesId !== existingPatient.emiratesId) {
      const conflictPatient = await this.patientRepository.findByEmiratesId(updatePatientDto.emiratesId);
      if (conflictPatient && conflictPatient.id !== id) {
        throw new ConflictException('Patient with this Emirates ID already exists');
      }
      this.validateEmiratesIdChecksum(updatePatientDto.emiratesId);
    }

    await this.patientRepository.update(id, updatePatientDto);
    return this.patientRepository.findByIdWithTranslations(id);
  }

  async deletePatient(id: string): Promise<void> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    await this.patientRepository.delete(id);
  }

  async getPatientAppointments(patientId: string, query: any): Promise<any> {
    return this.patientRepository.getPatientAppointments(patientId, query);
  }

  async getPatientEncounters(patientId: string, query: any): Promise<any> {
    return this.patientRepository.getPatientEncounters(patientId, query);
  }

  async getPatientMedicalHistory(patientId: string): Promise<PatientMedicalHistory> {
    const patient = await this.patientRepository.findById(patientId);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const [appointments, encounters, diagnoses, medications, allergies, immunizations, vitals] = await Promise.all([
      this.patientRepository.getPatientAppointments(patientId, { limit: 100 }),
      this.patientRepository.getPatientEncounters(patientId, { limit: 100 }),
      this.patientRepository.getPatientDiagnoses(patientId),
      this.patientRepository.getPatientMedications(patientId),
      this.patientRepository.getPatientAllergies(patientId),
      this.patientRepository.getPatientImmunizations(patientId),
      this.patientRepository.getPatientVitals(patientId),
    ]);

    // Generate summary
    const summary = this.generateMedicalHistorySummary({
      appointments,
      encounters,
      diagnoses,
      medications,
      allergies,
      immunizations,
    });

    return {
      patientId,
      appointments,
      encounters,
      diagnoses,
      medications,
      allergies,
      immunizations,
      vitals,
      summary,
    };
  }

  async mergePatients(primaryPatientId: string, secondaryPatientId: string): Promise<any> {
    const primaryPatient = await this.patientRepository.findById(primaryPatientId);
    const secondaryPatient = await this.patientRepository.findById(secondaryPatientId);

    if (!primaryPatient || !secondaryPatient) {
      throw new NotFoundException('One or both patients not found');
    }

    if (primaryPatient.tenantId !== secondaryPatient.tenantId) {
      throw new BadRequestException('Cannot merge patients from different tenants');
    }

    // Perform merge operation
    await this.patientRepository.mergePatients(primaryPatientId, secondaryPatientId);
    
    return this.patientRepository.findByIdWithTranslations(primaryPatientId);
  }

  async findDuplicatePatients(patientId: string): Promise<any[]> {
    const patient = await this.patientRepository.findById(patientId);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return this.patientRepository.findDuplicates(patient);
  }

  async updatePatientConsent(patientId: string, consentDto: PatientConsentDto): Promise<any> {
    const patient = await this.patientRepository.findById(patientId);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return this.patientRepository.updateConsent(patientId, consentDto);
  }

  async getPatientTranslations(patientId: string): Promise<any[]> {
    return this.patientRepository.getTranslations(patientId);
  }

  async updatePatientTranslations(patientId: string, translations: PatientTranslationDto[]): Promise<any[]> {
    const patient = await this.patientRepository.findById(patientId);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return this.patientRepository.updateTranslations(patientId, translations);
  }

  private validateEmiratesIdChecksum(emiratesId: string): void {
    // Remove hyphens and get the check digit
    const cleanId = emiratesId.replace(/-/g, '');
    const checkDigit = parseInt(cleanId.slice(-1));
    const idWithoutCheck = cleanId.slice(0, -1);

    // Calculate checksum using UAE Emirates ID algorithm
    let sum = 0;
    const weights = [7, 3, 1, 7, 3, 1, 7, 3, 1, 7, 3, 1, 7, 3, 1];

    for (let i = 0; i < idWithoutCheck.length; i++) {
      sum += parseInt(idWithoutCheck[i]) * weights[i];
    }

    const calculatedCheck = (10 - (sum % 10)) % 10;

    if (calculatedCheck !== checkDigit) {
      throw new BadRequestException('Invalid Emirates ID checksum');
    }
  }

  private generateMedicalHistorySummary(data: any): any {
    const { appointments, encounters, diagnoses, medications, allergies } = data;

    const totalVisits = appointments?.length || 0;
    const lastVisit = appointments?.length > 0 ? appointments[0].createdAt : null;

    // Extract unique primary diagnoses
    const primaryDiagnoses = [...new Set(
      diagnoses?.map((d: any) => d.primaryDiagnosis).filter(Boolean) || []
    )];

    // Get current medications
    const currentMedications = medications?.filter((m: any) => m.status === 'active')
      .map((m: any) => m.medicationName) || [];

    // Get known allergies
    const knownAllergies = allergies?.map((a: any) => a.allergen) || [];

    return {
      totalVisits,
      lastVisit,
      primaryDiagnoses,
      currentMedications,
      knownAllergies,
    };
  }
}
