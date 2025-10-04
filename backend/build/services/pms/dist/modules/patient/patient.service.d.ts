export let PatientService: {
    new (patientRepository: any): {
        patientRepository: any;
        createPatient(createPatientDto: any): Promise<any>;
        getPatients(query: any): Promise<any>;
        searchPatients(searchDto: any): Promise<any>;
        getPatientById(id: any): Promise<any>;
        updatePatient(id: any, updatePatientDto: any): Promise<any>;
        deletePatient(id: any): Promise<void>;
        getPatientAppointments(patientId: any, query: any): Promise<any>;
        getPatientEncounters(patientId: any, query: any): Promise<any>;
        getPatientMedicalHistory(patientId: any): Promise<{
            patientId: any;
            appointments: any;
            encounters: any;
            diagnoses: any;
            medications: any;
            allergies: any;
            immunizations: any;
            vitals: any;
            summary: {
                totalVisits: any;
                lastVisit: any;
                primaryDiagnoses: any[];
                currentMedications: any;
                knownAllergies: any;
            };
        }>;
        mergePatients(primaryPatientId: any, secondaryPatientId: any): Promise<any>;
        findDuplicatePatients(patientId: any): Promise<any>;
        updatePatientConsent(patientId: any, consentDto: any): Promise<any>;
        getPatientTranslations(patientId: any): Promise<any>;
        updatePatientTranslations(patientId: any, translations: any): Promise<any>;
        validateEmiratesIdChecksum(emiratesId: any): void;
        generateMedicalHistorySummary(data: any): {
            totalVisits: any;
            lastVisit: any;
            primaryDiagnoses: any[];
            currentMedications: any;
            knownAllergies: any;
        };
    };
};
//# sourceMappingURL=patient.service.d.ts.map