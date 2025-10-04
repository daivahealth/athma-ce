export let PatientController: {
    new (patientService: any): {
        patientService: any;
        createPatient(createPatientDto: any): Promise<any>;
        getPatients(query: any): Promise<any>;
        searchPatients(searchDto: any): Promise<any>;
        getPatient(id: any): Promise<any>;
        updatePatient(id: any, updatePatientDto: any): Promise<any>;
        deletePatient(id: any): Promise<any>;
        getPatientAppointments(id: any, query: any): Promise<any>;
        getPatientEncounters(id: any, query: any): Promise<any>;
        getPatientMedicalHistory(id: any): Promise<any>;
        mergePatients(primaryPatientId: any, body: any): Promise<any>;
        findDuplicatePatients(id: any): Promise<any>;
        updatePatientConsent(id: any, consentDto: any): Promise<any>;
        getPatientTranslations(id: any): Promise<any>;
        updatePatientTranslations(id: any, translations: any): Promise<any>;
    };
};
//# sourceMappingURL=patient.controller.d.ts.map