import { ClinicalService } from './clinical.service';
export declare class ClinicalController {
    private readonly clinicalService;
    constructor(clinicalService: ClinicalService);
    getTemplates(query: Record<string, string>): Promise<any>;
    createTemplate(templateDto: Record<string, unknown>): Promise<any>;
    getMedications(query: Record<string, string>): Promise<any>;
    searchMedications(query: Record<string, string>): Promise<any[]>;
    getDiagnoses(query: Record<string, string>): Promise<any>;
    searchDiagnoses(query: Record<string, string>): Promise<any[]>;
}
//# sourceMappingURL=clinical.controller.d.ts.map