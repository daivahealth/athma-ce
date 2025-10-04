export let PatientRepository: {
    new (prisma: any): {
        prisma: any;
        create(data: any): Promise<any>;
        findById(id: any): Promise<any>;
        findByIdWithTranslations(id: any): Promise<any>;
        findByEmiratesId(emiratesId: any): Promise<any>;
        findMany(query: any): Promise<{
            data: any;
            pagination: {
                page: any;
                limit: any;
                total: any;
                totalPages: number;
                hasNext: boolean;
                hasPrev: boolean;
            };
        }>;
        search(searchDto: any): Promise<any>;
        update(id: any, data: any): Promise<any>;
        delete(id: any): Promise<void>;
        getPatientAppointments(patientId: any, query: any): Promise<{
            data: any;
            pagination: {
                page: any;
                limit: any;
                total: any;
                totalPages: number;
                hasNext: boolean;
                hasPrev: boolean;
            };
        }>;
        getPatientEncounters(patientId: any, query: any): Promise<{
            data: any;
            pagination: {
                page: any;
                limit: any;
                total: any;
                totalPages: number;
                hasNext: boolean;
                hasPrev: boolean;
            };
        }>;
        getPatientDiagnoses(patientId: any): Promise<never[]>;
        getPatientMedications(patientId: any): Promise<never[]>;
        getPatientAllergies(patientId: any): Promise<never[]>;
        getPatientImmunizations(patientId: any): Promise<never[]>;
        getPatientVitals(patientId: any): Promise<any>;
        mergePatients(primaryPatientId: any, secondaryPatientId: any): Promise<void>;
        findDuplicates(patient: any): Promise<any>;
        updateConsent(patientId: any, consentDto: any): Promise<any>;
        getTranslations(patientId: any): Promise<any>;
        updateTranslations(patientId: any, translations: any): Promise<any>;
        calculateMatchScore(patient: any, query: any, fields: any): number;
        getMatchReason(patient: any, query: any, fields: any): string;
        calculateDuplicateScore(patient1: any, patient2: any): number;
    };
};
//# sourceMappingURL=patient.repository.d.ts.map