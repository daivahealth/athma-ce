export let ClinicalService: {
    new (): {
        getTemplates(query: any): Promise<{
            data: {
                id: string;
                name: string;
                type: string;
                content: string;
            }[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
                hasNext: boolean;
                hasPrev: boolean;
            };
        }>;
        createTemplate(templateDto: any): Promise<any>;
        getMedications(query: any): Promise<{
            data: {
                id: string;
                name: string;
                genericName: string;
                dosageForm: string;
                strength: string;
                manufacturer: string;
            }[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
                hasNext: boolean;
                hasPrev: boolean;
            };
        }>;
        searchMedications(query: any): Promise<{
            id: string;
            name: string;
            genericName: string;
            dosageForm: string;
            strength: string;
            manufacturer: string;
            matchScore: number;
        }[]>;
        getDiagnoses(query: any): Promise<{
            data: {
                id: string;
                code: string;
                description: string;
                category: string;
            }[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
                hasNext: boolean;
                hasPrev: boolean;
            };
        }>;
        searchDiagnoses(query: any): Promise<{
            id: string;
            code: string;
            description: string;
            category: string;
            matchScore: number;
        }[]>;
    };
};
//# sourceMappingURL=clinical.service.d.ts.map