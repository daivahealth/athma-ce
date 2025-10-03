import { Injectable } from '@nestjs/common';
import { PrismaService } from '@zeal/shared-database';
import { CreatePatientDto, UpdatePatientDto, PatientQueryDto, PatientSearchDto, PatientConsentDto, PatientTranslationDto } from './dto/patient.dto';
// Temporary local interface until contracts package is fixed
interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class PatientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePatientDto): Promise<any> {
    console.log('PatientRepository.create() called with:', JSON.stringify(data, null, 2));
    
    // Create a properly typed data object for Prisma
    const processedData: any = {
      emiratesId: data.emiratesId,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: new Date(data.dateOfBirth),
      gender: data.gender,
      tenantId: data.tenantId || 'b65c2761-d9fa-450b-b02e-b04af7855131',
      nationality: data.nationality || 'UAE',
      preferredLanguage: data.preferredLanguage || 'en',
      // Handle optional fields - explicitly convert undefined to null
      middleName: data.middleName || null,
      maritalStatus: data.maritalStatus || null,
      phoneNumber: data.phoneNumber || null,
      email: data.email || null,
      addressLine1: data.addressLine1 || null,
      addressLine2: data.addressLine2 || null,
      city: data.city || null,
      emirate: data.emirate || null,
      postalCode: data.postalCode || null,
      emergencyContact: data.emergencyContact || null,
      insuranceInfo: data.insuranceInfo || null,
    };
    
    console.log('Processed data for Prisma:', JSON.stringify(processedData, null, 2));
    
    try {
      const result = await this.prisma.patient.create({ data: processedData });
      console.log('Patient created successfully:', result.id);
      return result;
    } catch (error: any) {
      console.error('Prisma patient.create() error:', {
        message: error.message,
        code: error.code,
        meta: error.meta,
        data: processedData,
      });
      throw error;
    }
  }

  async findById(id: string): Promise<any> {
    return this.prisma.patient.findUnique({
      where: { id },
    });
  }

  async findByIdWithTranslations(id: string): Promise<any> {
    return this.prisma.patient.findUnique({
      where: { id },
      // Include other relationships if they exist
    });
  }

  async findByEmiratesId(emiratesId: string): Promise<any> {
    return this.prisma.patient.findUnique({
      where: { emiratesId },
    });
  }

  async findByEmiratesIdAndTenant(emiratesId: string, tenantId: string): Promise<any> {
    return this.prisma.patient.findFirst({
      where: { 
        emiratesId,
        tenantId 
      },
    });
  }

  async findMany(query: PatientQueryDto): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 20, search, gender, status, emirate, ageRange, dateRange, sortBy = 'lastName', sortOrder = 'asc' } = query;
    
    // Ensure values are properly defined
    const safeLimit = limit || 20;
    const safePage = page || 1;
    const skip = (safePage - 1) * safeLimit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { emiratesId: { contains: search } },
        { phoneNumber: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (gender) {
      where.gender = gender;
    }

    if (status) {
      where.status = status;
    }

    if (emirate) {
      where.emirate = emirate;
    }

    if (ageRange) {
      const currentDate = new Date();
      if (ageRange.min !== undefined) {
        const maxBirthDate = new Date(currentDate.getFullYear() - ageRange.min, currentDate.getMonth(), currentDate.getDate());
        where.dateOfBirth = { ...where.dateOfBirth, lte: maxBirthDate };
      }
      if (ageRange.max !== undefined) {
        const minBirthDate = new Date(currentDate.getFullYear() - ageRange.max - 1, currentDate.getMonth(), currentDate.getDate());
        where.dateOfBirth = { ...where.dateOfBirth, gte: minBirthDate };
      }
    }

    if (dateRange) {
      if (dateRange.from || dateRange.to) {
        where.createdAt = {};
        if (dateRange.from) {
          where.createdAt.gte = new Date(dateRange.from);
        }
        if (dateRange.to) {
          where.createdAt.lte = new Date(dateRange.to);
        }
      }
    }

    // Build orderBy clause
    const orderBy: any = {};
    if (sortBy && sortOrder) {
      orderBy[sortBy] = sortOrder;
    }

    // Debug logging
    console.log('Prisma query params:', {
      skip,
      take: safeLimit,
      orderBy,
      where
    });

    const [patients, total] = await Promise.all([
      this.prisma.patient.findMany({
        where,
        skip,
        take: safeLimit,
        // Only include orderBy if it's not empty
        ...(Object.keys(orderBy).length > 0 && { orderBy }),
      }),
      this.prisma.patient.count({ where }),
    ]);

    const totalPages = Math.ceil(total / safeLimit);

    return {
      data: patients,
      total,
      page: safePage,
      limit: safeLimit,
      totalPages,
    };
  }

  async search(searchDto: PatientSearchDto): Promise<any[]> {
    const { q, fields = ['firstName', 'lastName', 'emiratesId'], limit } = searchDto;

    const searchConditions = fields.map(field => {
      switch (field) {
        case 'firstName':
          return { firstName: { contains: q, mode: 'insensitive' as const } };
        case 'lastName':
          return { lastName: { contains: q, mode: 'insensitive' as const } };
        case 'emiratesId':
          return { emiratesId: { contains: q } };
        case 'phoneNumber':
          return { phoneNumber: { contains: q } };
        case 'email':
          return { email: { contains: q, mode: 'insensitive' as const } };
        default:
          return {};
      }
    }).filter(condition => Object.keys(condition).length > 0);

    const patients = await this.prisma.patient.findMany({
      where: {
        OR: searchConditions,
      },
      take: limit,
      select: {
        id: true,
        emiratesId: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        gender: true,
        phoneNumber: true,
        email: true,
      },
    });

    // Calculate match scores (simplified implementation)
    return patients.map(patient => ({
      ...patient,
      matchScore: this.calculateMatchScore(patient, q, fields),
      matchReason: this.getMatchReason(patient, q, fields),
    }));
  }

  async update(id: string, data: UpdatePatientDto): Promise<any> {
    const updateData: any = { ...data };
    
    if (data.dateOfBirth) {
      updateData.dateOfBirth = new Date(data.dateOfBirth);
    }

    return this.prisma.patient.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.patient.update({
      where: { id },
      data: { status: 'deleted' },
    });
  }

  async getPatientAppointments(patientId: string, query: any): Promise<any> {
    const { limit = 20, page = 1 } = query;
    const skip = (page - 1) * limit;

    const [appointments, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where: { patientId },
        orderBy: { startTime: 'desc' },
        skip,
        take: limit,
        include: {
          staff: true,
          facility: true,
          space: true,
        },
      }),
      this.prisma.appointment.count({ where: { patientId } }),
    ]);

    return {
      data: appointments,
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

  async getPatientEncounters(patientId: string, query: any): Promise<any> {
    const { limit = 20, page = 1 } = query;
    const skip = (page - 1) * limit;

    const [encounters, total] = await Promise.all([
      this.prisma.encounter.findMany({
        where: { patientId },
        orderBy: { startTime: 'desc' },
        skip,
        take: limit,
        // Only include existing relationships
      }),
      this.prisma.encounter.count({ where: { patientId } }),
    ]);

    return {
      data: encounters,
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

  async getPatientDiagnoses(patientId: string): Promise<any[]> {
    // This would query from clinical notes or a separate diagnoses table
    // For now, return empty array as diagnoses table is not in the current schema
    return [];
  }

  async getPatientMedications(patientId: string): Promise<any[]> {
    // This would query from prescriptions or medication orders
    // For now, return empty array as medication tables are not in the current schema
    return [];
  }

  async getPatientAllergies(patientId: string): Promise<any[]> {
    // This would query from allergies table
    // For now, return empty array as allergies table is not in the current schema
    return [];
  }

  async getPatientImmunizations(patientId: string): Promise<any[]> {
    // This would query from immunizations table
    // For now, return empty array as immunizations table is not in the current schema
    return [];
  }

  async getPatientVitals(patientId: string): Promise<any[]> {
    // Temporarily return empty array until vitals schema is implemented
    return [];
  }

  async mergePatients(primaryPatientId: string, secondaryPatientId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // Update all related records to point to primary patient
      await tx.appointment.updateMany({
        where: { patientId: secondaryPatientId },
        data: { patientId: primaryPatientId },
      });

      await tx.encounter.updateMany({
        where: { patientId: secondaryPatientId },
        data: { patientId: primaryPatientId },
      });

      // Delete secondary patient
      await tx.patient.delete({
        where: { id: secondaryPatientId },
      });
    });
  }

  async findDuplicates(patient: any): Promise<any[]> {
    // Simple duplicate detection based on name and date of birth
    const potentialDuplicates = await this.prisma.patient.findMany({
      where: {
        AND: [
          { id: { not: patient.id } },
          { firstName: { equals: patient.firstName, mode: 'insensitive' } },
          { lastName: { equals: patient.lastName, mode: 'insensitive' } },
          { dateOfBirth: patient.dateOfBirth },
        ],
      },
      select: {
        id: true,
        emiratesId: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        gender: true,
        phoneNumber: true,
        email: true,
      },
    });

    return potentialDuplicates.map(dup => ({
      ...dup,
      matchScore: this.calculateDuplicateScore(patient, dup),
    }));
  }

  async updateConsent(patientId: string, consentDto: PatientConsentDto): Promise<any> {
    // Temporarily commented out until schema is updated
    throw new Error('Consent functionality not yet implemented in schema');
  }

  async getTranslations(patientId: string): Promise<any[]> {
    // Temporarily commented out until schema is updated
    return [];
  }

  async updateTranslations(patientId: string, translations: PatientTranslationDto[]): Promise<any[]> {
    // Temporarily commented out until schema is updated
    throw new Error('Translation functionality not yet implemented in schema');
  }

  private calculateMatchScore(patient: any, query: string, fields: string[]): number {
    let score = 0;
    const queryLower = query.toLowerCase();

    fields.forEach(field => {
      const value = patient[field]?.toLowerCase() || '';
      if (value.includes(queryLower)) {
        score += 0.3;
      }
      if (value === queryLower) {
        score += 0.7;
      }
    });

    return Math.min(score, 1);
  }

  private getMatchReason(patient: any, query: string, fields: string[]): string {
    const reasons: string[] = [];
    const queryLower = query.toLowerCase();

    fields.forEach(field => {
      const value = patient[field]?.toLowerCase() || '';
      if (value.includes(queryLower)) {
        reasons.push(`${field} contains "${query}"`);
      }
    });

    return reasons.join(', ');
  }

  private calculateDuplicateScore(patient1: any, patient2: any): number {
    let score = 0;

    // Name match (40% weight)
    if (patient1.firstName.toLowerCase() === patient2.firstName.toLowerCase()) score += 0.2;
    if (patient1.lastName.toLowerCase() === patient2.lastName.toLowerCase()) score += 0.2;

    // Date of birth match (30% weight)
    if (patient1.dateOfBirth.getTime() === patient2.dateOfBirth.getTime()) score += 0.3;

    // Gender match (10% weight)
    if (patient1.gender === patient2.gender) score += 0.1;

    // Phone/Email match (20% weight)
    if (patient1.phoneNumber && patient2.phoneNumber && 
        patient1.phoneNumber === patient2.phoneNumber) score += 0.1;
    if (patient1.email && patient2.email && 
        patient1.email.toLowerCase() === patient2.email.toLowerCase()) score += 0.1;

    return Math.min(score, 1);
  }
}
