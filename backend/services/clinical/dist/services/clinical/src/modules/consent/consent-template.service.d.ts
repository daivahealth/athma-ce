/**
 * Consent Template Service
 *
 * Manages consent form templates with multi-language support
 */
import { PrismaService } from '@zeal/database-clinical';
import { ConsentType, ConsentCategory } from '@zeal/shared-types';
export interface CreateConsentTemplateDto {
    templateCode: string;
    consentType: ConsentType;
    title: Record<string, string>;
    description: Record<string, string>;
    content: Record<string, string>;
    legalText?: Record<string, string>;
    isRequired?: boolean;
    requiresWitness?: boolean;
    validityDays?: number;
    autoRenew?: boolean;
    metadata?: Record<string, any>;
}
export declare class ConsentTemplateService {
    private prisma;
    constructor(prisma: PrismaService);
    /**
     * Create a new consent template
     */
    createTemplate(tenantId: string, dto: CreateConsentTemplateDto): Promise<{
        id: string;
        tenantId: string;
        title: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        metadata: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        consentType: string;
        consentCategory: string;
        description: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        version: number;
        templateCode: string;
        content: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        legalText: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        isRequired: boolean;
        requiresWitness: boolean;
        validityDays: number | null;
        autoRenew: boolean;
        supersedes: string | null;
    }>;
    /**
     * Get template by code
     */
    getTemplate(tenantId: string, templateCode: string, language?: string): Promise<{
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
     * Get all templates for a tenant
     */
    getTemplates(tenantId: string, options?: {
        category?: ConsentCategory;
        consentType?: ConsentType;
        required?: boolean;
    }): Promise<{
        id: string;
        tenantId: string;
        title: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        metadata: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        consentType: string;
        consentCategory: string;
        description: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        version: number;
        templateCode: string;
        content: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        legalText: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        isRequired: boolean;
        requiresWitness: boolean;
        validityDays: number | null;
        autoRenew: boolean;
        supersedes: string | null;
    }[]>;
    /**
     * Update template
     */
    updateTemplate(tenantId: string, templateCode: string, updates: Partial<CreateConsentTemplateDto>): Promise<{
        id: string;
        tenantId: string;
        title: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        metadata: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        consentType: string;
        consentCategory: string;
        description: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        version: number;
        templateCode: string;
        content: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        legalText: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        isRequired: boolean;
        requiresWitness: boolean;
        validityDays: number | null;
        autoRenew: boolean;
        supersedes: string | null;
    }>;
    /**
     * Create new version of template
     */
    createTemplateVersion(tenantId: string, templateCode: string, updates: Partial<CreateConsentTemplateDto>): Promise<{
        id: string;
        tenantId: string;
        title: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        metadata: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        consentType: string;
        consentCategory: string;
        description: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        version: number;
        templateCode: string;
        content: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        legalText: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        isRequired: boolean;
        requiresWitness: boolean;
        validityDays: number | null;
        autoRenew: boolean;
        supersedes: string | null;
    }>;
    /**
     * Deactivate template
     */
    deactivateTemplate(tenantId: string, templateCode: string): Promise<{
        id: string;
        tenantId: string;
        title: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        metadata: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        consentType: string;
        consentCategory: string;
        description: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        version: number;
        templateCode: string;
        content: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        legalText: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        isRequired: boolean;
        requiresWitness: boolean;
        validityDays: number | null;
        autoRenew: boolean;
        supersedes: string | null;
    }>;
    /**
     * Get required templates for patient registration
     */
    getRequiredTemplates(tenantId: string, language?: string): Promise<{
        templateCode: string;
        consentType: string;
        title: string | undefined;
        description: string | undefined;
        content: string | undefined;
        requiresWitness: boolean;
    }[]>;
    /**
     * Helper: Get category from consent type
     */
    private getCategoryFromType;
    /**
     * Seed default consent templates
     */
    seedDefaultTemplates(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        title: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        metadata: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        consentType: string;
        consentCategory: string;
        description: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        version: number;
        templateCode: string;
        content: import("@zeal/database-clinical/generated/runtime/library").JsonValue;
        legalText: import("@zeal/database-clinical/generated/runtime/library").JsonValue | null;
        isRequired: boolean;
        requiresWitness: boolean;
        validityDays: number | null;
        autoRenew: boolean;
        supersedes: string | null;
    }[]>;
}
//# sourceMappingURL=consent-template.service.d.ts.map