/**
 * Patient Service - Example Implementation
 *
 * Shows how to integrate patient history tracking with patient updates
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
// import { IdentityValidationRegistry } from '@zeal/validators'; // TODO: Implement validators package
import { PatientHistoryService, RecordChangeOptions } from './patient-history.service';
import { MrnGeneratorService } from './mrn-generator.service';
import { configClient } from '../../config';

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
    private historyService: PatientHistoryService,
    private mrnGenerator: MrnGeneratorService
  ) {}

  /**
   * Transform frontend DTO to match database schema
   * Handles field name aliases and nested object construction
   */
  private transformPatientDto(dto: any): any {
    const transformed = { ...dto };

    // Handle contactNumber -> phoneNumber transformation
    if (dto.contactNumber && !dto.phoneNumber) {
      transformed.phoneNumber = dto.contactNumber;
    }
    delete transformed.contactNumber;

    // Handle flat emergency contact fields -> emergencyContact object
    if (dto.emergencyContactName || dto.emergencyContactNumber || dto.emergencyContactRelation) {
      transformed.emergencyContact = {
        name: dto.emergencyContactName,
        phoneNumber: dto.emergencyContactNumber,
        relation: dto.emergencyContactRelation,
      };
      delete transformed.emergencyContactName;
      delete transformed.emergencyContactNumber;
      delete transformed.emergencyContactRelation;
    }

    // Handle nested address object -> flat fields
    // Prefer flat fields if already set, otherwise use address object values
    if (dto.address && typeof dto.address === 'object') {
      const address = dto.address as Record<string, string | undefined>;

      transformed.addressLine1 = transformed.addressLine1 ?? address.line1;
      transformed.addressLine2 = transformed.addressLine2 ?? address.line2;
      transformed.city = transformed.city ?? address.city;
      transformed.state = transformed.state ?? address.state;
      transformed.postalCode = transformed.postalCode ?? address.postalCode;
      transformed.country = transformed.country ?? address.country;

      delete transformed.address;
    }

    return transformed;
  }

  /**
   * Fetch default registration values (country, city, nationality)
   * honoring the config hierarchy (facility → tenant → instance → code defaults)
   */
  async getRegistrationDefaults(context: RequestContext) {
    try {
      const configs = await configClient.getMany(
        [
          'clinical.default_country_name',
          'clinical.default_country_iso',
          'clinical.default_city',
          'clinical.default_nationality_name',
          'clinical.default_nationality_iso',
        ],
        {
          tenantId: context.tenantId,
          facilityId: context.facilityId,
        }
      );

      return {
        country: {
          name: configs['clinical.default_country_name'],
          isoCode: configs['clinical.default_country_iso'],
        },
        city: configs['clinical.default_city'],
        nationality: {
          name: configs['clinical.default_nationality_name'],
          isoCode: configs['clinical.default_nationality_iso'],
        },
      };
    } catch (error) {
      console.error('Failed to fetch registration defaults:', error);

      // Return fallback defaults if config fetch fails
      return {
        country: {
          name: 'United Arab Emirates',
          isoCode: 'AE',
        },
        city: 'Dubai',
        nationality: {
          name: 'United Arab Emirates',
          isoCode: 'AE',
        },
      };
    }
  }

  /**
   * Register a new patient
   */
  async registerPatient(dto: CreatePatientDto, context: RequestContext) {
    // Transform frontend DTO to match database schema
    const transformedDto = this.transformPatientDto(dto);

    // Generate MRN
    const mrn = await this.mrnGenerator.generateMrn({
      tenantId: context.tenantId,
      facilityId: context.facilityId,
    });

    // Validate identity if provided
    // TODO: Uncomment when validators package is implemented
    // if (transformedDto.nationalId && transformedDto.nationalIdType && transformedDto.issuingCountry) {
    //   const validationResult = IdentityValidationRegistry.validate(
    //     transformedDto.issuingCountry,
    //     transformedDto.nationalIdType,
    //     transformedDto.nationalId
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
    //   transformedDto.nationalId = validationResult.normalizedValue!;
    // }

    // Create patient
    const patient = await this.prisma.patient.create({
      data: {
        mrn,
        tenantId: context.tenantId,

        // Identity
        nationalId: transformedDto.nationalId ?? null,
        nationalIdType: transformedDto.nationalIdType ?? null,
        issuingCountry: transformedDto.issuingCountry ?? null,

        // Demographics
        firstName: transformedDto.firstName,
        lastName: transformedDto.lastName,
        middleName: transformedDto.middleName ?? null,
        dateOfBirth: transformedDto.dateOfBirth,
        gender: transformedDto.gender,
        maritalStatus: transformedDto.maritalStatus ?? null,
        nationality: transformedDto.nationality ?? null,
        preferredLanguage: transformedDto.preferredLanguage || 'en',

        // Contact
        phoneNumber: transformedDto.phoneNumber ?? null,
        email: transformedDto.email ?? null,

        // Address
        addressLine1: transformedDto.addressLine1 ?? null,
        addressLine2: transformedDto.addressLine2 ?? null,
        city: transformedDto.city ?? null,
        state: transformedDto.state ?? null,
        postalCode: transformedDto.postalCode ?? null,
        country: transformedDto.country ?? null,

        // Medical
        bloodGroup: transformedDto.bloodGroup ?? null,
        emergencyContact: transformedDto.emergencyContact ?? null,
        insuranceInfo: transformedDto.insuranceInfo ?? null,

        // Audit fields
        createdBy: context.userId,
        createdAtFacility: context.facilityId,
        registrationSource: transformedDto.registrationSource || 'manual',
        registrationNotes: transformedDto.registrationNotes ?? null,
      },
    });

    // Create primary identity document if provided
    if (transformedDto.nationalId && transformedDto.nationalIdType && transformedDto.issuingCountry) {
      await this.prisma.patientDocument.create({
        data: {
          tenantId: context.tenantId,
          patientId: patient.id,
          documentType: transformedDto.nationalIdType,
          documentNumber: transformedDto.nationalId,
          issuingCountry: transformedDto.issuingCountry,
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
    // Transform frontend DTO to match database schema
    const transformedDto = this.transformPatientDto(dto);

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
      if (transformedDto[field] !== undefined && transformedDto[field] !== currentValue) {
        changes.push({
          fieldName: field,
          oldValue: String(currentValue || ''),
          newValue: String(transformedDto[field] || ''),
        });
      }
    }

    // If no changes, return current patient
    if (changes.length === 0) {
      return currentPatient;
    }

    // Validate identity changes if applicable
    // TODO: Uncomment when validators package is implemented
    // if (transformedDto.nationalId || transformedDto.nationalIdType || transformedDto.issuingCountry) {
    //   const validationResult = IdentityValidationRegistry.validate(
    //     transformedDto.issuingCountry || currentPatient.issuingCountry!,
    //     transformedDto.nationalIdType || currentPatient.nationalIdType!,
    //     transformedDto.nationalId || currentPatient.nationalId!
    //   );
    //
    //   if (!validationResult.isValid) {
    //     throw new BadRequestException({
    //       message: 'Invalid identity document',
    //       errors: validationResult.errors,
    //     });
    //   }
    //
    //   if (transformedDto.nationalId) {
    //     transformedDto.nationalId = validationResult.normalizedValue!;
    //   }
    // }

    // Determine change type
    const changeType = transformedDto.changeReason?.includes('patient request')
      ? 'patient_request'
      : transformedDto.changeReason?.includes('correction')
      ? 'correction'
      : 'update';

    // Use transaction to update patient and record history atomically
    const updatedPatient = await this.prisma.$transaction(async (tx) => {
      // Update patient
      const updated = await tx.patient.update({
        where: { id: patientId },
        data: {
          ...transformedDto,
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
        changeReason: transformedDto.changeReason ?? null,
        changedBy: context.userId,
        changedAtFacility: context.facilityId ?? null,
        patientConsent: transformedDto.patientConsent || false,
        consentDocUrl: transformedDto.consentDocUrl ?? null,
        supportingDocUrl: transformedDto.supportingDocUrl ?? null,
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
