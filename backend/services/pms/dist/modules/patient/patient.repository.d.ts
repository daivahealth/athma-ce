import { PrismaService } from '@zeal/shared-database';
import { CreatePatientDto, UpdatePatientDto, PatientQueryDto, PatientSearchDto, PatientConsentDto, PatientTranslationDto } from './dto/patient.dto';
import { PaginatedResult } from '@zeal/contracts';
export declare class PatientRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: CreatePatientDto): Promise<any>;
    findById(id: string): Promise<any>;
    findByIdWithTranslations(id: string): Promise<any>;
    findByEmiratesId(emiratesId: string): Promise<any>;
    findMany(query: PatientQueryDto): Promise<PaginatedResult<any>>;
    search(searchDto: PatientSearchDto): Promise<any[]>;
    update(id: string, data: UpdatePatientDto): Promise<any>;
    delete(id: string): Promise<void>;
    getPatientAppointments(patientId: string, query: any): Promise<any>;
    getPatientEncounters(patientId: string, query: any): Promise<any>;
    getPatientDiagnoses(patientId: string): Promise<any[]>;
    getPatientMedications(patientId: string): Promise<any[]>;
    getPatientAllergies(patientId: string): Promise<any[]>;
    getPatientImmunizations(patientId: string): Promise<any[]>;
    getPatientVitals(patientId: string): Promise<any[]>;
    mergePatients(primaryPatientId: string, secondaryPatientId: string): Promise<void>;
    findDuplicates(patient: any): Promise<any[]>;
    updateConsent(patientId: string, consentDto: PatientConsentDto): Promise<any>;
    getTranslations(patientId: string): Promise<any[]>;
    updateTranslations(patientId: string, translations: PatientTranslationDto[]): Promise<any[]>;
    private calculateMatchScore;
    private getMatchReason;
    private calculateDuplicateScore;
}
//# sourceMappingURL=patient.repository.d.ts.map