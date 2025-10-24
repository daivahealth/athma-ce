/**
 * Patient Service - Example Implementation
 *
 * Shows how to integrate patient history tracking with patient updates
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
// import { IdentityValidationRegistry } from '@zeal/validators'; // TODO: Implement validators package
import { PatientHistoryService, RecordChangeOptions } from './patient-history.service';

export interface RequestContext {
  userId: string;
  tenantId: string;
  facilityId: string;
  userRole: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface CreatePatientDto {
  // Identity
  nationalId?: string;
  nationalIdType?: string;
  issuingCountry?: string;

  // Demographics
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  gender: string;
  maritalStatus?: string;
  nationality?: string;
  preferredLanguage?: string;

  // Contact
  phoneNumber?: string;
  email?: string;

  // Address
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;

  // Medical
  bloodGroup?: string;
  emergencyContact?: any;
  insuranceInfo?: any;

  // Registration
  registrationSource?: string;
  registrationNotes?: string;
}

export interface UpdatePatientDto {
  // Any field from CreatePatientDto can be updated
  [key: string]: any;

  // Additional metadata for updates
  changeReason?: string;
  supportingDocUrl?: string;
  patientConsent?: boolean;
  consentDocUrl?: string;
}

@Injectable()
export class PatientService {
  constructor(
    private prisma: PrismaService,
    private historyService: PatientHistoryService
  ) {}

  /**
   * Register a new patient
   */
  async registerPatient(dto: CreatePatientDto, context: RequestContext) {
    // Validate identity if provided
    // TODO: Uncomment when validators package is implemented
    // if (dto.nationalId && dto.nationalIdType && dto.issuingCountry) {
    //   const validationResult = IdentityValidationRegistry.validate(
    //     dto.issuingCountry,
    //     dto.nationalIdType,
    //     dto.nationalId
    //   );
    //
    //   if (!validationResult.isValid) {
    //     throw new BadRequestException({
    //       message: 'Invalid identity document',
    //       errors: validationResult.errors,
    //     });
    //   }
    //
    //   // Use normalized value
    //   dto.nationalId = validationResult.normalizedValue!;
    // }

    // Create patient
    const patient = await this.prisma.patient.create({
      data: {
        tenantId: context.tenantId,

        // Identity
        nationalId: dto.nationalId ?? null,
        nationalIdType: dto.nationalIdType ?? null,
        issuingCountry: dto.issuingCountry ?? null,

        // Demographics
        firstName: dto.firstName,
        lastName: dto.lastName,
        middleName: dto.middleName ?? null,
        dateOfBirth: dto.dateOfBirth,
        gender: dto.gender,
        maritalStatus: dto.maritalStatus ?? null,
        nationality: dto.nationality ?? null,
        preferredLanguage: dto.preferredLanguage || 'en',

        // Contact
        phoneNumber: dto.phoneNumber ?? null,
        email: dto.email ?? null,

        // Address
        addressLine1: dto.addressLine1 ?? null,
        addressLine2: dto.addressLine2 ?? null,
        city: dto.city ?? null,
        state: dto.state ?? null,
        postalCode: dto.postalCode ?? null,
        country: dto.country ?? null,

        // Medical
        bloodGroup: dto.bloodGroup ?? null,
        emergencyContact: dto.emergencyContact ?? null,
        insuranceInfo: dto.insuranceInfo ?? null,

        // Audit fields
        createdBy: context.userId,
        createdAtFacility: context.facilityId,
        registrationSource: dto.registrationSource || 'manual',
        registrationNotes: dto.registrationNotes ?? null,
      },
    });

    // Create primary identity document if provided
    if (dto.nationalId && dto.nationalIdType && dto.issuingCountry) {
      await this.prisma.patientDocument.create({
        data: {
          tenantId: context.tenantId,
          patientId: patient.id,
          documentType: dto.nationalIdType,
          documentNumber: dto.nationalId,
          issuingCountry: dto.issuingCountry,
          isPrimaryIdentity: true,
          verificationStatus: 'pending',
        },
      });
    }

    return patient;
  }

  /**
   * Search patients
   */
  async searchPatients(
    tenantId: string,
    options: {
      search?: string;
      query?: string;
      nationalId?: string;
      phoneNumber?: string;
      email?: string;
      page?: number;
      limit?: number;
    }
  ) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      tenantId,
      status: { not: 'deleted' },
    };

    // Support both 'search' and 'query' parameters
    const searchTerm = options.search || options.query;
    if (searchTerm) {
      where.OR = [
        { firstName: { contains: searchTerm, mode: 'insensitive' } },
        { lastName: { contains: searchTerm, mode: 'insensitive' } },
        { nationalId: { contains: searchTerm, mode: 'insensitive' } },
        { phoneNumber: { contains: searchTerm } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    if (options.nationalId) {
      where.nationalId = { contains: options.nationalId };
    }

    if (options.phoneNumber) {
      where.phoneNumber = { contains: options.phoneNumber };
    }

    if (options.email) {
      where.email = { contains: options.email, mode: 'insensitive' };
    }

    const [patients, total] = await Promise.all([
      this.prisma.patient.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.patient.count({ where }),
    ]);

    return {
      data: patients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get patient by ID
   */
  async getPatientById(patientId: string, tenantId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId, tenantId },
    });

    if (!patient) {
      throw new BadRequestException('Patient not found');
    }

    return patient;
  }

  /**
   * Update patient with change history tracking
   */
  async updatePatient(
    patientId: string,
    dto: UpdatePatientDto,
    context: RequestContext
  ) {
    // Get current patient state
    const currentPatient = await this.prisma.patient.findUnique({
      where: {
        id: patientId,
        tenantId: context.tenantId,
      },
    });

    if (!currentPatient) {
      throw new BadRequestException('Patient not found');
    }

    // Detect which fields changed
    const changes: Array<{
      fieldName: string;
      oldValue: string | null;
      newValue: string | null;
    }> = [];

    const trackableFields = [
      'firstName',
      'lastName',
      'middleName',
      'dateOfBirth',
      'gender',
      'maritalStatus',
      'nationality',
      'phoneNumber',
      'email',
      'addressLine1',
      'addressLine2',
      'city',
      'state',
      'postalCode',
      'country',
      'bloodGroup',
      'nationalId',
      'nationalIdType',
      'issuingCountry',
    ];

    for (const field of trackableFields) {
      const currentValue = (currentPatient as any)[field];
      if (dto[field] !== undefined && dto[field] !== currentValue) {
        changes.push({
          fieldName: field,
          oldValue: String(currentValue || ''),
          newValue: String(dto[field] || ''),
        });
      }
    }

    // If no changes, return current patient
    if (changes.length === 0) {
      return currentPatient;
    }

    // Validate identity changes if applicable
    // TODO: Uncomment when validators package is implemented
    // if (dto.nationalId || dto.nationalIdType || dto.issuingCountry) {
    //   const validationResult = IdentityValidationRegistry.validate(
    //     dto.issuingCountry || currentPatient.issuingCountry!,
    //     dto.nationalIdType || currentPatient.nationalIdType!,
    //     dto.nationalId || currentPatient.nationalId!
    //   );
    //
    //   if (!validationResult.isValid) {
    //     throw new BadRequestException({
    //       message: 'Invalid identity document',
    //       errors: validationResult.errors,
    //     });
    //   }
    //
    //   if (dto.nationalId) {
    //     dto.nationalId = validationResult.normalizedValue!;
    //   }
    // }

    // Determine change type
    const changeType = dto.changeReason?.includes('patient request')
      ? 'patient_request'
      : dto.changeReason?.includes('correction')
      ? 'correction'
      : 'update';

    // Use transaction to update patient and record history atomically
    const updatedPatient = await this.prisma.$transaction(async (tx) => {
      // Update patient
      const updated = await tx.patient.update({
        where: { id: patientId },
        data: {
          ...dto,
          updatedBy: context.userId,
          updatedAtFacility: context.facilityId,
        },
      });

      // Record history
      const historyEntries = changes.map((change) => ({
        tenantId: context.tenantId,
        patientId,
        fieldName: change.fieldName,
        oldValue: change.oldValue,
        newValue: change.newValue,
        changeType,
        changeReason: dto.changeReason ?? null,
        changedBy: context.userId,
        changedAtFacility: context.facilityId ?? null,
        patientConsent: dto.patientConsent || false,
        consentDocUrl: dto.consentDocUrl ?? null,
        supportingDocUrl: dto.supportingDocUrl ?? null,
        ipAddress: context.ipAddress ?? null,
        userAgent: context.userAgent ?? null,
      }));

      await tx.patientHistory.createMany({
        data: historyEntries,
      });

      return updated;
    });

    return updatedPatient;
  }

  /**
   * Get patient with history
   */
  async getPatientWithHistory(patientId: string, tenantId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId, tenantId },
      include: {
        documents: true,
        appointments: {
          take: 10,
          orderBy: { startTime: 'desc' },
        },
      },
    });

    if (!patient) {
      throw new BadRequestException('Patient not found');
    }

    // Get change history
    const history = await this.historyService.getPatientHistory(
      tenantId,
      patientId,
      { limit: 50 }
    );

    return {
      ...patient,
      history,
    };
  }

  /**
   * Patient-initiated change request
   * Requires approval before applying
   */
  async createChangeRequest(
    patientId: string,
    requestedChanges: UpdatePatientDto,
    context: RequestContext & { requestedBy: 'patient' | 'guardian' }
  ) {
    const currentPatient = await this.prisma.patient.findUnique({
      where: { id: patientId, tenantId: context.tenantId },
    });

    if (!currentPatient) {
      throw new BadRequestException('Patient not found');
    }

    // Detect changes
    const changes: Array<{
      fieldName: string;
      oldValue: string | null;
      newValue: string | null;
    }> = [];

    for (const [field, value] of Object.entries(requestedChanges)) {
      const currentValue = (currentPatient as any)[field];
      if (value !== undefined && value !== currentValue) {
        changes.push({
          fieldName: field,
          oldValue: String(currentValue || ''),
          newValue: String(value || ''),
        });
      }
    }

    // Record as pending change request (not approved yet)
    const recordOptions: RecordChangeOptions = {
      tenantId: context.tenantId,
      patientId,
      changes,
      changeType: 'patient_request',
      changeReason: requestedChanges.changeReason || 'Patient requested change',
      changedBy: context.userId, // Staff member who entered request
      changedAtFacility: context.facilityId,
      patientConsent: true,
    };

    if (requestedChanges.supportingDocUrl) {
      recordOptions.supportingDocUrl = requestedChanges.supportingDocUrl;
    }

    await this.historyService.recordChanges(recordOptions);

    return {
      message: 'Change request submitted. Awaiting approval.',
      pendingChanges: changes,
    };
  }

  /**
   * Approve and apply change request
   */
  async approveChangeRequest(
    historyId: string,
    context: RequestContext
  ) {
    const historyEntry = await this.prisma.patientHistory.findUnique({
      where: { id: historyId },
    });

    if (!historyEntry) {
      throw new BadRequestException('Change request not found');
    }

    if (historyEntry.approvedBy) {
      throw new BadRequestException('Change request already approved');
    }

    // Approve the change
    await this.historyService.approveChange(historyId, context.userId);

    // Apply the change to patient
    await this.prisma.patient.update({
      where: { id: historyEntry.patientId },
      data: {
        [historyEntry.fieldName]: historyEntry.newValue,
        updatedBy: context.userId,
        updatedAtFacility: context.facilityId,
      } as any,
    });

    return { message: 'Change approved and applied' };
  }

  /**
   * Get field change timeline
   */
  async getFieldTimeline(
    patientId: string,
    tenantId: string,
    fieldName: string
  ) {
    const history = await this.historyService.getFieldHistory(
      tenantId,
      patientId,
      fieldName
    );

    return {
      fieldName,
      currentValue: await this.prisma.patient
        .findUnique({
          where: { id: patientId },
          select: { [fieldName]: true } as any,
        })
        .then((p) => (p as any)?.[fieldName]),
      changes: history,
    };
  }

  /**
   * Get audit report for a patient
   */
  async getAuditReport(patientId: string, tenantId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId, tenantId },
    });

    if (!patient) {
      throw new BadRequestException('Patient not found');
    }

    const history = await this.historyService.getPatientHistory(
      tenantId,
      patientId
    );

    // Group changes by change type
    const changesByType = history.reduce((acc, change) => {
      if (!acc[change.changeType]) {
        acc[change.changeType] = [];
      }
      acc[change.changeType]!.push(change);
      return acc;
    }, {} as Record<string, typeof history>);

    return {
      patient: {
        id: patient.id,
        name: `${patient.firstName} ${patient.lastName}`,
        nationalId: patient.nationalId,
      },
      registeredBy: patient.createdBy ?? null,
      registeredAt: patient.createdAt,
      registeredAtFacility: patient.createdAtFacility ?? null,
      totalChanges: history.length,
      changesByType,
      recentChanges: history.slice(0, 10),
    };
  }
}
