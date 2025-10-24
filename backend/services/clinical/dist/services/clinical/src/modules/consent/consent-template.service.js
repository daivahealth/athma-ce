"use strict";
/**
 * Consent Template Service
 *
 * Manages consent form templates with multi-language support
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsentTemplateService = void 0;
const common_1 = require("@nestjs/common");
const database_clinical_1 = require("@zeal/database-clinical");
const shared_types_1 = require("@zeal/shared-types");
let ConsentTemplateService = class ConsentTemplateService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Create a new consent template
     */
    async createTemplate(tenantId, dto) {
        // Check if template code already exists
        const existing = await this.prisma.consentTemplate.findUnique({
            where: { templateCode: dto.templateCode },
        });
        if (existing) {
            throw new common_1.BadRequestException(`Template with code ${dto.templateCode} already exists`);
        }
        // Determine category from consent type
        const consentCategory = this.getCategoryFromType(dto.consentType);
        const template = await this.prisma.consentTemplate.create({
            data: {
                tenantId,
                templateCode: dto.templateCode,
                consentType: dto.consentType,
                consentCategory,
                title: dto.title,
                description: dto.description,
                content: dto.content,
                ...(dto.legalText && { legalText: dto.legalText }),
                isRequired: dto.isRequired ?? false,
                requiresWitness: dto.requiresWitness ?? false,
                ...(dto.validityDays && { validityDays: dto.validityDays }),
                autoRenew: dto.autoRenew ?? false,
                metadata: dto.metadata || {},
            },
        });
        return template;
    }
    /**
     * Get template by code
     */
    async getTemplate(tenantId, templateCode, language = 'en') {
        const template = await this.prisma.consentTemplate.findUnique({
            where: { templateCode },
        });
        if (!template || template.tenantId !== tenantId) {
            throw new common_1.BadRequestException('Template not found');
        }
        const titleObj = template.title;
        const descObj = template.description;
        const contentObj = template.content;
        const legalTextObj = template.legalText;
        return {
            ...template,
            title: titleObj[language] || titleObj['en'],
            description: descObj[language] || descObj['en'],
            content: contentObj[language] || contentObj['en'],
            legalText: legalTextObj?.[language] || legalTextObj?.['en'],
        };
    }
    /**
     * Get all templates for a tenant
     */
    async getTemplates(tenantId, options) {
        const where = {
            tenantId,
            status: 'active',
        };
        if (options?.category) {
            where.consentCategory = options.category;
        }
        if (options?.consentType) {
            where.consentType = options.consentType;
        }
        if (options?.required !== undefined) {
            where.isRequired = options.required;
        }
        return this.prisma.consentTemplate.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
    /**
     * Update template
     */
    async updateTemplate(tenantId, templateCode, updates) {
        const template = await this.prisma.consentTemplate.findUnique({
            where: { templateCode },
        });
        if (!template || template.tenantId !== tenantId) {
            throw new common_1.BadRequestException('Template not found');
        }
        const updated = await this.prisma.consentTemplate.update({
            where: { templateCode },
            data: updates,
        });
        return updated;
    }
    /**
     * Create new version of template
     */
    async createTemplateVersion(tenantId, templateCode, updates) {
        const oldTemplate = await this.prisma.consentTemplate.findUnique({
            where: { templateCode },
        });
        if (!oldTemplate || oldTemplate.tenantId !== tenantId) {
            throw new common_1.BadRequestException('Template not found');
        }
        // Mark old template as superseded
        await this.prisma.consentTemplate.update({
            where: { templateCode },
            data: {
                status: 'superseded',
            },
        });
        // Create new version
        const newTemplate = await this.prisma.consentTemplate.create({
            data: {
                tenantId,
                templateCode: `${templateCode}_v${oldTemplate.version + 1}`,
                consentType: updates.consentType || oldTemplate.consentType,
                consentCategory: oldTemplate.consentCategory,
                title: (updates.title || oldTemplate.title),
                description: (updates.description || oldTemplate.description),
                content: (updates.content || oldTemplate.content),
                ...(updates.legalText || oldTemplate.legalText ? { legalText: (updates.legalText || oldTemplate.legalText) } : {}),
                isRequired: updates.isRequired ?? oldTemplate.isRequired,
                requiresWitness: updates.requiresWitness ?? oldTemplate.requiresWitness,
                ...(updates.validityDays || oldTemplate.validityDays ? { validityDays: updates.validityDays ?? oldTemplate.validityDays } : {}),
                autoRenew: updates.autoRenew ?? oldTemplate.autoRenew,
                version: oldTemplate.version + 1,
                supersedes: oldTemplate.id,
                metadata: (updates.metadata || oldTemplate.metadata),
            },
        });
        return newTemplate;
    }
    /**
     * Deactivate template
     */
    async deactivateTemplate(tenantId, templateCode) {
        const template = await this.prisma.consentTemplate.findUnique({
            where: { templateCode },
        });
        if (!template || template.tenantId !== tenantId) {
            throw new common_1.BadRequestException('Template not found');
        }
        return this.prisma.consentTemplate.update({
            where: { templateCode },
            data: { status: 'inactive' },
        });
    }
    /**
     * Get required templates for patient registration
     */
    async getRequiredTemplates(tenantId, language = 'en') {
        const templates = await this.getTemplates(tenantId, { required: true });
        return templates.map((t) => {
            const titleObj = t.title;
            const descObj = t.description;
            const contentObj = t.content;
            return {
                templateCode: t.templateCode,
                consentType: t.consentType,
                title: titleObj[language] || titleObj['en'],
                description: descObj[language] || descObj['en'],
                content: contentObj[language] || contentObj['en'],
                requiresWitness: t.requiresWitness,
            };
        });
    }
    /**
     * Helper: Get category from consent type
     */
    getCategoryFromType(consentType) {
        const typeToCategory = {
            general_data_processing: shared_types_1.ConsentCategory.DATA_PROCESSING,
            phi_storage: shared_types_1.ConsentCategory.DATA_PROCESSING,
            sensitive_data_processing: shared_types_1.ConsentCategory.DATA_PROCESSING,
            medical_treatment: shared_types_1.ConsentCategory.TREATMENT,
            surgical_procedure: shared_types_1.ConsentCategory.TREATMENT,
            sms_notifications: shared_types_1.ConsentCategory.COMMUNICATION,
            email_communications: shared_types_1.ConsentCategory.COMMUNICATION,
            share_with_insurance: shared_types_1.ConsentCategory.DATA_SHARING,
            anonymized_research: shared_types_1.ConsentCategory.RESEARCH,
            insurance_claim_processing: shared_types_1.ConsentCategory.FINANCIAL,
            marketing_communications: shared_types_1.ConsentCategory.MARKETING,
        };
        return typeToCategory[consentType] || shared_types_1.ConsentCategory.DATA_PROCESSING;
    }
    /**
     * Seed default consent templates
     */
    async seedDefaultTemplates(tenantId) {
        const defaultTemplates = [
            {
                templateCode: 'GENERAL_DATA_PROCESSING',
                consentType: shared_types_1.ConsentType.GENERAL_DATA_PROCESSING,
                title: {
                    en: 'General Data Processing Consent',
                    ar: 'موافقة معالجة البيانات العامة',
                },
                description: {
                    en: 'Consent to store and process your personal health information',
                    ar: 'الموافقة على تخزين ومعالجة معلومات الصحة الشخصية الخاصة بك',
                },
                content: {
                    en: `I consent to the collection, storage, and processing of my personal health information by ${tenantId} for the purpose of providing healthcare services. I understand that my data will be protected in accordance with applicable data protection laws and regulations.`,
                    ar: `أوافق على جمع وتخزين ومعالجة معلومات صحتي الشخصية من قبل ${tenantId} بغرض تقديم خدمات الرعاية الصحية. أفهم أن بياناتي ستكون محمية وفقًا لقوانين ولوائح حماية البيانات المعمول بها.`,
                },
                isRequired: true,
                requiresWitness: false,
            },
            {
                templateCode: 'SMS_NOTIFICATIONS',
                consentType: shared_types_1.ConsentType.SMS_NOTIFICATIONS,
                title: {
                    en: 'SMS Notification Consent',
                    ar: 'موافقة إشعارات الرسائل القصيرة',
                },
                description: {
                    en: 'Receive appointment reminders and health updates via SMS',
                    ar: 'تلقي تذكيرات المواعيد والتحديثات الصحية عبر الرسائل القصيرة',
                },
                content: {
                    en: 'I consent to receive SMS notifications including appointment reminders, test results, and health-related communications.',
                    ar: 'أوافق على تلقي إشعارات الرسائل القصيرة بما في ذلك تذكيرات المواعيد ونتائج الاختبارات والاتصالات المتعلقة بالصحة.',
                },
                isRequired: false,
                validityDays: 365,
                autoRenew: true,
            },
            {
                templateCode: 'EMAIL_COMMUNICATIONS',
                consentType: shared_types_1.ConsentType.EMAIL_COMMUNICATIONS,
                title: {
                    en: 'Email Communication Consent',
                    ar: 'موافقة التواصل عبر البريد الإلكتروني',
                },
                description: {
                    en: 'Receive health updates and appointment information via email',
                    ar: 'تلقي التحديثات الصحية ومعلومات المواعيد عبر البريد الإلكتروني',
                },
                content: {
                    en: 'I consent to receive email communications regarding my healthcare, including appointment confirmations, test results, and general health information.',
                    ar: 'أوافق على تلقي الاتصالات عبر البريد الإلكتروني المتعلقة برعايتي الصحية، بما في ذلك تأكيدات المواعيد ونتائج الاختبارات والمعلومات الصحية العامة.',
                },
                isRequired: false,
                validityDays: 365,
                autoRenew: true,
            },
        ];
        const createdTemplates = [];
        for (const templateDto of defaultTemplates) {
            try {
                const template = await this.createTemplate(tenantId, templateDto);
                createdTemplates.push(template);
            }
            catch (error) {
                // Template might already exist, skip
                console.warn(`Template ${templateDto.templateCode} already exists`);
            }
        }
        return createdTemplates;
    }
};
exports.ConsentTemplateService = ConsentTemplateService;
exports.ConsentTemplateService = ConsentTemplateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_clinical_1.PrismaService])
], ConsentTemplateService);
//# sourceMappingURL=consent-template.service.js.map