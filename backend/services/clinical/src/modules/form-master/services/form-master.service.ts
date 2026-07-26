import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService, FormMasterStatus } from '@zeal/database-clinical';
import { CreateFormMasterDto } from '../dto/create-form-master.dto';
import { UpdateFormMasterDto } from '../dto/update-form-master.dto';

interface RequestContext {
  tenantId: string;
  userId: string;
  facilityId?: string;
}

const REQUIRED_BUNDLE_KEYS = ['formCode', 'version', 'engine', 'dataSchema', 'uiSchema'];

@Injectable()
export class FormMasterService {
  private readonly logger = new Logger(FormMasterService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFormMasterDto, context: RequestContext) {
    const { tenantId, userId, facilityId } = context;
    const { bundle } = dto;

    const missingKeys = REQUIRED_BUNDLE_KEYS.filter((key) => bundle[key] === undefined);
    if (missingKeys.length > 0) {
      throw new BadRequestException(
        `Uploaded form bundle is missing required field(s): ${missingKeys.join(', ')}. ` +
          'Expected an OpenMedForm export bundle (formCode, version, engine, dataSchema, uiSchema).',
      );
    }

    const formCode = String(bundle.formCode);
    const formVersion = String(bundle.version);
    const engine = String(bundle.engine);
    const name = dto.name || String(bundle.name || formCode);
    const language = dto.language ?? (bundle.language ? String(bundle.language) : undefined);

    const existing = await this.prisma.formMaster.findFirst({
      where: { tenantId, formCode, formVersion },
    });
    if (existing) {
      throw new BadRequestException(
        `Form ${formCode} version ${formVersion} has already been uploaded for this tenant.`,
      );
    }

    const created = await this.prisma.formMaster.create({
      data: {
        tenantId,
        ...(facilityId ? { facilityId } : {}),
        formCode,
        formVersion,
        engine,
        name,
        ...(language ? { language } : {}),
        frequencyType: dto.frequencyType,
        ...(dto.frequencyValue !== undefined ? { frequencyValue: dto.frequencyValue } : {}),
        ...(dto.frequencyUnit !== undefined ? { frequencyUnit: dto.frequencyUnit } : {}),
        bundle,
        uploadedBy: userId,
      },
    });

    this.logger.log(`Created form master ${created.id} (${formCode} v${formVersion})`);
    return created;
  }

  async list(tenantId: string, status?: FormMasterStatus) {
    return this.prisma.formMaster.findMany({
      where: { tenantId, ...(status ? { status } : {}) },
      orderBy: [{ name: 'asc' }, { formVersion: 'desc' }],
      // Bundle can be large (schemas + translations + assets) — omit from list responses.
      select: {
        id: true,
        tenantId: true,
        facilityId: true,
        formCode: true,
        formVersion: true,
        engine: true,
        name: true,
        language: true,
        status: true,
        frequencyType: true,
        frequencyValue: true,
        frequencyUnit: true,
        uploadedBy: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findById(id: string, tenantId: string) {
    const formMaster = await this.prisma.formMaster.findFirst({ where: { id, tenantId } });
    if (!formMaster) {
      throw new NotFoundException(`Form master ${id} not found`);
    }
    return formMaster;
  }

  async update(id: string, dto: UpdateFormMasterDto, context: RequestContext) {
    const { tenantId } = context;
    await this.findById(id, tenantId);

    return this.prisma.formMaster.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.frequencyType !== undefined ? { frequencyType: dto.frequencyType } : {}),
        ...(dto.frequencyValue !== undefined ? { frequencyValue: dto.frequencyValue } : {}),
        ...(dto.frequencyUnit !== undefined ? { frequencyUnit: dto.frequencyUnit } : {}),
      },
    });
  }
}
