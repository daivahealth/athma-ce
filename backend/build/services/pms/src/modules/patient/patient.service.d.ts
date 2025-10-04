import { PatientRepository } from './patient.repository';
import { PrismaService } from '@zeal/shared-database';
import { CreatePatientDto, UpdatePatientDto, PatientQueryDto, PatientSearchDto, PatientConsentDto, PatientTranslationDto } from './dto/patient.dto';
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
export declare class PatientService {
    private readonly patientRepository;
    private readonly prisma;
    constructor(patientRepository: PatientRepository, prisma: PrismaService);
    createPatient(createPatientDto: CreatePatientDto): Promise<any>;
    getPatients(query: PatientQueryDto): Promise<PaginatedResult<any>>;
    searchPatients(searchDto: PatientSearchDto): Promise<any[]>;
    getPatientById(id: string): Promise<PatientWithTranslations>;
    updatePatient(id: string, updatePatientDto: UpdatePatientDto): Promise<PatientWithTranslations>;
    deletePatient(id: string): Promise<void>;
    getPatientAppointments(patientId: string, query: any): Promise<any>;
    getPatientEncounters(patientId: string, query: any): Promise<any>;
    getPatientMedicalHistory(patientId: string): Promise<PatientMedicalHistory>;
    mergePatients(primaryPatientId: string, secondaryPatientId: string): Promise<any>;
    findDuplicatePatients(patientId: string): Promise<any[]>;
    updatePatientConsent(patientId: string, consentDto: PatientConsentDto): Promise<any>;
    getPatientTranslations(patientId: string): Promise<any[]>;
    updatePatientTranslations(patientId: string, translations: PatientTranslationDto[]): Promise<any[]>;
    private resolveTenantContext;
    private validateEmiratesIdChecksum;
    private generateMedicalHistorySummary;
}
export {};
//# sourceMappingURL=patient.service.d.ts.map