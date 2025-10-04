export let ClinicalController: {
    new (clinicalService: any): {
        clinicalService: any;
        getTemplates(query: any): Promise<any>;
        createTemplate(templateDto: any): Promise<any>;
        getMedications(query: any): Promise<any>;
        searchMedications(query: any): Promise<any>;
        getDiagnoses(query: any): Promise<any>;
        searchDiagnoses(query: any): Promise<any>;
    };
};
//# sourceMappingURL=clinical.controller.d.ts.map