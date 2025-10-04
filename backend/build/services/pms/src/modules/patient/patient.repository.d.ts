import { PrismaService } from '@zeal/shared-database';
import type { Prisma } from '@prisma/client';
import { CreatePatientDto, UpdatePatientDto, PatientQueryDto, PatientSearchDto, PatientConsentDto, PatientTranslationDto } from './dto/patient.dto';
interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class PatientRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private resolveClient;
    create(data: CreatePatientDto, client?: Prisma.TransactionClient): Promise<any>;
    findById(id: string, client?: Prisma.TransactionClient): Promise<any>;
    findByIdWithTranslations(id: string, client?: Prisma.TransactionClient): Promise<any>;
    findByEmiratesId(emiratesId: string, client?: Prisma.TransactionClient): Promise<any>;
    findByEmiratesIdAndTenant(emiratesId: string, tenantId: string, client?: Prisma.TransactionClient): Promise<any>;
    findMany(query: PatientQueryDto, client?: Prisma.TransactionClient): Promise<PaginatedResult<any>>;
    search(searchDto: PatientSearchDto, client?: Prisma.TransactionClient): Promise<any[]>;
    update(id: string, data: UpdatePatientDto, client?: Prisma.TransactionClient): Promise<any>;
    delete(id: string, client?: Prisma.TransactionClient): Promise<void>;
    getPatientAppointments(patientId: string, query: any, client?: Prisma.TransactionClient): Promise<any>;
    getPatientEncounters(patientId: string, query: any, client?: Prisma.TransactionClient): Promise<any>;
    getPatientDiagnoses(patientId: string, _client?: Prisma.TransactionClient): Promise<any[]>;
    getPatientMedications(patientId: string, _client?: Prisma.TransactionClient): Promise<any[]>;
    getPatientAllergies(patientId: string, _client?: Prisma.TransactionClient): Promise<any[]>;
    getPatientImmunizations(patientId: string, _client?: Prisma.TransactionClient): Promise<any[]>;
    getPatientVitals(patientId: string, _client?: Prisma.TransactionClient): Promise<any[]>;
    mergePatients(primaryPatientId: string, secondaryPatientId: string, client?: Prisma.TransactionClient): Promise<void>;
    findDuplicates(patient: any, client?: Prisma.TransactionClient): Promise<any[]>;
    updateConsent(patientId: string, consentDto: PatientConsentDto, client?: Prisma.TransactionClient): Promise<any>;
    getTranslations(patientId: string, client?: Prisma.TransactionClient): Promise<any[]>;
    updateTranslations(patientId: string, translations: PatientTranslationDto[], client?: Prisma.TransactionClient): Promise<any[]>;
    private calculateMatchScore;
    private getMatchReason;
    private calculateDuplicateScore;
}
export {};
//# sourceMappingURL=patient.repository.d.ts.map