import { PatientService } from './patient.service';
import { CreatePatientDto, UpdatePatientDto, PatientQueryDto, PatientSearchDto } from './dto/patient.dto';
export declare class PatientController {
    private readonly patientService;
    constructor(patientService: PatientService);
    createPatient(createPatientDto: CreatePatientDto): Promise<any>;
    getPatients(query: PatientQueryDto): Promise<import("@zeal/contracts").PaginatedResult<any>>;
    searchPatients(searchDto: PatientSearchDto): Promise<any[]>;
    getPatient(id: string): Promise<PatientWithTranslations>;
    updatePatient(id: string, updatePatientDto: UpdatePatientDto): Promise<PatientWithTranslations>;
    deletePatient(id: string): Promise<void>;
    getPatientAppointments(id: string, query: any): Promise<any>;
    getPatientEncounters(id: string, query: any): Promise<any>;
    getPatientMedicalHistory(id: string): Promise<PatientMedicalHistory>;
    mergePatients(primaryPatientId: string, body: {
        secondaryPatientId: string;
    }): Promise<any>;
    findDuplicatePatients(id: string): Promise<any[]>;
    updatePatientConsent(id: string, consentDto: any): Promise<any>;
    getPatientTranslations(id: string): Promise<any[]>;
    updatePatientTranslations(id: string, translations: any): Promise<any[]>;
}
//# sourceMappingURL=patient.controller.d.ts.map