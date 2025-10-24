/**
 * Consent Template Controller
 *
 * REST API endpoints for consent template management
 */
import { ConsentTemplateService } from './consent-template.service';
export declare class ConsentTemplateController {
    private readonly templateService;
    constructor(templateService: ConsentTemplateService);
    /**
     * POST /consent-templates - Create template
     */
    createTemplate(dto: any, req: any): Promise<{
        id: string;
        tenantId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        metadata: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        consentType: string;
        consentCategory: string;
        description: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        version: number;
        templateCode: string;
        title: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        content: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        legalText: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        isRequired: boolean;
        requiresWitness: boolean;
        validityDays: number | null;
        autoRenew: boolean;
        supersedes: string | null;
    }>;
    /**
     * GET /consent-templates - Get all templates
     */
    getTemplates(category: string, consentType: string, required: string, req: any): Promise<{
        id: string;
        tenantId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        metadata: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        consentType: string;
        consentCategory: string;
        description: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        version: number;
        templateCode: string;
        title: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        content: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        legalText: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        isRequired: boolean;
        requiresWitness: boolean;
        validityDays: number | null;
        autoRenew: boolean;
        supersedes: string | null;
    }[]>;
    /**
     * GET /consent-templates/:templateCode - Get template by code
     */
    getTemplate(templateCode: string, language: string, req: any): Promise<{
        title: string | undefined;
        description: string | undefined;
        content: string | undefined;
        legalText: string | undefined;
        id: string;
        tenantId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        metadata: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        consentType: string;
        consentCategory: string;
        version: number;
        templateCode: string;
        isRequired: boolean;
        requiresWitness: boolean;
        validityDays: number | null;
        autoRenew: boolean;
        supersedes: string | null;
    }>;
    /**
     * PUT /consent-templates/:templateCode - Update template
     */
    updateTemplate(templateCode: string, dto: any, req: any): Promise<{
        id: string;
        tenantId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        metadata: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        consentType: string;
        consentCategory: string;
        description: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        version: number;
        templateCode: string;
        title: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        content: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        legalText: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        isRequired: boolean;
        requiresWitness: boolean;
        validityDays: number | null;
        autoRenew: boolean;
        supersedes: string | null;
    }>;
    /**
     * GET /consent-templates/required/list - Get required templates
     */
    getRequiredTemplates(language: string, req: any): Promise<{
        templateCode: string;
        consentType: string;
        title: string | undefined;
        description: string | undefined;
        content: string | undefined;
        requiresWitness: boolean;
    }[]>;
    /**
     * POST /consent-templates/seed - Seed default templates
     */
    seedTemplates(req: any): Promise<{
        id: string;
        tenantId: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        metadata: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        consentType: string;
        consentCategory: string;
        description: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        version: number;
        templateCode: string;
        title: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        content: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        legalText: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        isRequired: boolean;
        requiresWitness: boolean;
        validityDays: number | null;
        autoRenew: boolean;
        supersedes: string | null;
    }[]>;
}
//# sourceMappingURL=consent-template.controller.d.ts.map