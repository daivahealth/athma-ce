/**
 * Consent Template Service
 *
 * Manages consent form templates with multi-language support
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { ConsentType, ConsentCategory } from '@zeal/shared-types';

export interface CreateConsentTemplateDto {
  templateCode: string;
  consentType: ConsentType;
  title: Record<string, string>; // { en: '...', ar: '...' }
  description: Record<string, string>;
  content: Record<string, string>;
  legalText?: Record<string, string>;
  isRequired?: boolean;
  requiresWitness?: boolean;
  validityDays?: number;
  autoRenew?: boolean;
  metadata?: Record<string, any>;
}

@Injectable()
export class ConsentTemplateService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new consent template
   */
  async createTemplate(
    tenantId: string,
    dto: CreateConsentTemplateDto
  ) {
    // Check if template code already exists
    const existing = await this.prisma.consentTemplate.findUnique({
      where: { templateCode: dto.templateCode },
    });

    if (existing) {
      throw new BadRequestException(
        `Template with code ${dto.templateCode} already exists`
      );
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
  async getTemplate(
    tenantId: string,
    templateCode: string,
    language: string = 'en'
  ) {
    const template = await this.prisma.consentTemplate.findUnique({
      where: { templateCode },
    });

    if (!template || template.tenantId !== tenantId) {
      throw new BadRequestException('Template not found');
    }

    const titleObj = template.title as Record<string, string>;
    const descObj = template.description as Record<string, string>;
    const contentObj = template.content as Record<string, string>;
    const legalTextObj = template.legalText as Record<string, string> | null;

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
  async getTemplates(
    tenantId: string,
    options?: {
      category?: ConsentCategory;
      consentType?: ConsentType;
      required?: boolean;
    }
  ) {
    const where: any = {
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
  async updateTemplate(
    tenantId: string,
    templateCode: string,
    updates: Partial<CreateConsentTemplateDto>
  ) {
    const template = await this.prisma.consentTemplate.findUnique({
      where: { templateCode },
    });

    if (!template || template.tenantId !== tenantId) {
      throw new BadRequestException('Template not found');
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
  async createTemplateVersion(
    tenantId: string,
    templateCode: string,
    updates: Partial<CreateConsentTemplateDto>
  ) {
    const oldTemplate = await this.prisma.consentTemplate.findUnique({
      where: { templateCode },
    });

    if (!oldTemplate || oldTemplate.tenantId !== tenantId) {
      throw new BadRequestException('Template not found');
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
        title: (updates.title || oldTemplate.title) as any,
        description: (updates.description || oldTemplate.description) as any,
        content: (updates.content || oldTemplate.content) as any,
        ...(updates.legalText || oldTemplate.legalText ? { legalText: (updates.legalText || oldTemplate.legalText) as any } : {}),
        isRequired: updates.isRequired ?? oldTemplate.isRequired,
        requiresWitness: updates.requiresWitness ?? oldTemplate.requiresWitness,
        ...(updates.validityDays || oldTemplate.validityDays ? { validityDays: updates.validityDays ?? oldTemplate.validityDays } : {}),
        autoRenew: updates.autoRenew ?? oldTemplate.autoRenew,
        version: oldTemplate.version + 1,
        supersedes: oldTemplate.id,
        metadata: (updates.metadata || oldTemplate.metadata) as any,
      },
    });

    return newTemplate;
  }

  /**
   * Deactivate template
   */
  async deactivateTemplate(tenantId: string, templateCode: string) {
    const template = await this.prisma.consentTemplate.findUnique({
      where: { templateCode },
    });

    if (!template || template.tenantId !== tenantId) {
      throw new BadRequestException('Template not found');
    }

    return this.prisma.consentTemplate.update({
      where: { templateCode },
      data: { status: 'inactive' },
    });
  }

  /**
   * Get required templates for patient registration
   */
  async getRequiredTemplates(tenantId: string, language: string = 'en') {
    const templates = await this.getTemplates(tenantId, { required: true });

    return templates.map((t) => {
      const titleObj = t.title as Record<string, string>;
      const descObj = t.description as Record<string, string>;
      const contentObj = t.content as Record<string, string>;

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
  private getCategoryFromType(consentType: ConsentType): ConsentCategory {
    const typeToCategory: Record<string, ConsentCategory> = {
      general_data_processing: ConsentCategory.DATA_PROCESSING,
      phi_storage: ConsentCategory.DATA_PROCESSING,
      sensitive_data_processing: ConsentCategory.DATA_PROCESSING,
      medical_treatment: ConsentCategory.TREATMENT,
      surgical_procedure: ConsentCategory.TREATMENT,
      sms_notifications: ConsentCategory.COMMUNICATION,
      email_communications: ConsentCategory.COMMUNICATION,
      share_with_insurance: ConsentCategory.DATA_SHARING,
      anonymized_research: ConsentCategory.RESEARCH,
      insurance_claim_processing: ConsentCategory.FINANCIAL,
      marketing_communications: ConsentCategory.MARKETING,
    };

    return typeToCategory[consentType] || ConsentCategory.DATA_PROCESSING;
  }

  /**
   * Seed default consent templates
   */
  async seedDefaultTemplates(tenantId: string) {
    const defaultTemplates: CreateConsentTemplateDto[] = [
      {
        templateCode: 'GENERAL_DATA_PROCESSING',
        consentType: ConsentType.GENERAL_DATA_PROCESSING,
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
        consentType: ConsentType.SMS_NOTIFICATIONS,
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
        consentType: ConsentType.EMAIL_COMMUNICATIONS,
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
      } catch (error) {
        // Template might already exist, skip
        console.warn(`Template ${templateDto.templateCode} already exists`);
      }
    }

    return createdTemplates;
  }
}
