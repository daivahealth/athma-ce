import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PatientRepository } from './patient.repository';
import { PrismaService } from '@zeal/shared-database';
import { RequestContext } from '@zeal/shared-utils';
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
// Temporary local interfaces until contracts package is fixed
interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface PatientWithTranslations {
  id: string;
  emiratesId: string;
  firstName: string;
  lastName: string;
  // Add other patient fields as needed
}

interface PatientMedicalHistory {
  patientId: string;
  appointments: any;
  encounters: any;
  diagnoses: any[];
  medications: any[];
  allergies: any[];
  immunizations: any[];
  vitals: any[];
  summary: string;
}

@Injectable()
export class PatientService {
  constructor(
    private readonly patientRepository: PatientRepository,
    private readonly prisma: PrismaService,
  ) {}

  async createPatient(createPatientDto: CreatePatientDto): Promise<any> {
    console.log('PatientService.createPatient() called with:', JSON.stringify(createPatientDto, null, 2));
    
    try {
      return this.prisma.runWithRequestContext(async (tx) => {
        const tenantId = createPatientDto.tenantId ?? (await this.resolveTenantContext());
        const payload: CreatePatientDto = {
          ...createPatientDto,
          tenantId,
          nationality: createPatientDto.nationality ?? 'UAE',
          preferredLanguage: createPatientDto.preferredLanguage ?? 'en',
        };

        console.log('Service defaults applied:', JSON.stringify(payload, null, 2));

        console.log(`Checking if patient exists with Emirates ID: ${payload.emiratesId}, Tenant: ${payload.tenantId}`);
        const existingPatient = await this.patientRepository.findByEmiratesIdAndTenant(
          payload.emiratesId,
          payload.tenantId,
          tx,
        );

        if (existingPatient) {
          console.log('Conflict: Patient already exists');
          throw new ConflictException('Patient with with Emirates ID already exists');
        }

        console.log('Emirates ID checksum validation...');
        this.validateEmiratesIdChecksum(payload.emiratesId);

        console.log('Calling repository create...');
        const patient = await this.patientRepository.create(payload, tx);

        console.log('Patient created, fetching with translations...');
        return this.patientRepository.findByIdWithTranslations(patient.id, tx);
      });
    } catch (error: any) {
      console.error('PatientService.createPatient() error:', {
        message: error.message,
        stack: error.stack,
        input: createPatientDto,
      });
      throw error;
    }
  }

  async getPatients(query: PatientQueryDto): Promise<PaginatedResult<any>> {
    return this.prisma.runWithRequestContext((tx) => this.patientRepository.findMany(query, tx));
  }

  async searchPatients(searchDto: PatientSearchDto): Promise<any[]> {
    return this.prisma.runWithRequestContext((tx) => this.patientRepository.search(searchDto, tx));
  }

  async getPatientById(id: string): Promise<PatientWithTranslations> {
    return this.prisma.runWithRequestContext(async (tx) => {
      const patient = await this.patientRepository.findByIdWithTranslations(id, tx);
      if (!patient) {
        throw new NotFoundException('Patient not found');
      }
      return patient;
    });
  }

  async updatePatient(id: string, updatePatientDto: UpdatePatientDto): Promise<PatientWithTranslations> {
    return this.prisma.runWithRequestContext(async (tx) => {
      const existingPatient = await this.patientRepository.findById(id, tx);
      if (!existingPatient) {
        throw new NotFoundException('Patient not found');
      }

      if (updatePatientDto.emiratesId && updatePatientDto.emiratesId !== existingPatient.emiratesId) {
        const conflictPatient = await this.patientRepository.findByEmiratesId(updatePatientDto.emiratesId, tx);
        if (conflictPatient && conflictPatient.id !== id) {
          throw new ConflictException('Patient with this Emirates ID already exists');
        }
        this.validateEmiratesIdChecksum(updatePatientDto.emiratesId);
      }

      await this.patientRepository.update(id, updatePatientDto, tx);
      return this.patientRepository.findByIdWithTranslations(id, tx);
    });
  }

  async deletePatient(id: string): Promise<void> {
    await this.prisma.runWithRequestContext(async (tx) => {
      const patient = await this.patientRepository.findById(id, tx);
      if (!patient) {
        throw new NotFoundException('Patient not found');
      }

      await this.patientRepository.delete(id, tx);
    });
  }

  async getPatientAppointments(patientId: string, query: any): Promise<any> {
    return this.prisma.runWithRequestContext((tx) => this.patientRepository.getPatientAppointments(patientId, query, tx));
  }

  async getPatientEncounters(patientId: string, query: any): Promise<any> {
    return this.prisma.runWithRequestContext((tx) => this.patientRepository.getPatientEncounters(patientId, query, tx));
  }

  async getPatientMedicalHistory(patientId: string): Promise<PatientMedicalHistory> {
    return this.prisma.runWithRequestContext(async (tx) => {
      const patient = await this.patientRepository.findById(patientId, tx);
      if (!patient) {
        throw new NotFoundException('Patient not found');
      }

      const [appointments, encounters, diagnoses, medications, allergies, immunizations, vitals] = await Promise.all([
        this.patientRepository.getPatientAppointments(patientId, { limit: 100 }, tx),
        this.patientRepository.getPatientEncounters(patientId, { limit: 100 }, tx),
        this.patientRepository.getPatientDiagnoses(patientId, tx),
        this.patientRepository.getPatientMedications(patientId, tx),
        this.patientRepository.getPatientAllergies(patientId, tx),
        this.patientRepository.getPatientImmunizations(patientId, tx),
        this.patientRepository.getPatientVitals(patientId, tx),
      ]);

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
    });
  }

  async mergePatients(primaryPatientId: string, secondaryPatientId: string): Promise<any> {
    return this.prisma.runWithRequestContext(async (tx) => {
      const primaryPatient = await this.patientRepository.findById(primaryPatientId, tx);
      const secondaryPatient = await this.patientRepository.findById(secondaryPatientId, tx);

      if (!primaryPatient || !secondaryPatient) {
        throw new NotFoundException('One or both patients not found');
      }

      if (primaryPatient.tenantId !== secondaryPatient.tenantId) {
        throw new BadRequestException('Cannot merge patients from different tenants');
      }

      await this.patientRepository.mergePatients(primaryPatientId, secondaryPatientId, tx);

      return this.patientRepository.findByIdWithTranslations(primaryPatientId, tx);
    });
  }

  async findDuplicatePatients(patientId: string): Promise<any[]> {
    return this.prisma.runWithRequestContext(async (tx) => {
      const patient = await this.patientRepository.findById(patientId, tx);
      if (!patient) {
        throw new NotFoundException('Patient not found');
      }

      return this.patientRepository.findDuplicates(patient, tx);
    });
  }

  async updatePatientConsent(patientId: string, consentDto: PatientConsentDto): Promise<any> {
    return this.prisma.runWithRequestContext(async (tx) => {
      const patient = await this.patientRepository.findById(patientId, tx);
      if (!patient) {
        throw new NotFoundException('Patient not found');
      }

      return this.patientRepository.updateConsent(patientId, consentDto, tx);
    });
  }

  async getPatientTranslations(patientId: string): Promise<any[]> {
    return this.prisma.runWithRequestContext((tx) => this.patientRepository.getTranslations(patientId, tx));
  }

  async updatePatientTranslations(patientId: string, translations: PatientTranslationDto[]): Promise<any[]> {
    return this.prisma.runWithRequestContext(async (tx) => {
      const patient = await this.patientRepository.findById(patientId, tx);
      if (!patient) {
        throw new NotFoundException('Patient not found');
      }

      return this.patientRepository.updateTranslations(patientId, translations, tx);
    });
  }

  private async resolveTenantContext(): Promise<string> {
    const tenantId = RequestContext.getTenantId();
    if (!tenantId) {
      throw new BadRequestException('Tenant context not available');
    }

    return tenantId;
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
      const weight = weights[i] ?? 1; // Default to 1 if weight is undefined
      const digit = idWithoutCheck[i] || '0'; // Default to '0' if digit is undefined
      sum += parseInt(digit) * weight;
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
    const primaryDiagnoses = Array.from(new Set(
      diagnoses?.map((d: any) => d.primaryDiagnosis).filter(Boolean) || []
    ));

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
