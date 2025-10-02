import { PatientRepository } from './patient.repository';
import { CreatePatientDto, UpdatePatientDto, PatientQueryDto, PatientSearchDto, PatientConsentDto, PatientTranslationDto } from './dto/patient.dto';
import { PaginatedResult, PatientWithTranslations, PatientMedicalHistory } from '@zeal/contracts';
export declare class PatientService {
    private readonly patientRepository;
    constructor(patientRepository: PatientRepository);
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
    private validateEmiratesIdChecksum;
    private generateMedicalHistorySummary;
}
//# sourceMappingURL=patient.service.d.ts.map