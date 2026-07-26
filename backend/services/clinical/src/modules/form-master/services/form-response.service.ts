import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService, FormResponseStatus } from '@zeal/database-clinical';
import Ajv2020 from 'ajv/dist/2020';
import { CreateFormResponseDto } from '../dto/create-form-response.dto';
import { SaveFormResponseDto } from '../dto/save-form-response.dto';

// Same Ajv 2020-12 dialect @openmedform/form-core uses. We validate directly
// with Ajv rather than that package, since @openmedform/form-core@0.2.0 ships
// raw ESM with no CJS build and fails to load under this service's
// ts-node/CommonJS runtime (see note below).
const ajv = new Ajv2020({ allErrors: true, strict: false });

interface RequestContext {
  tenantId: string;
  userId: string;
  facilityId?: string;
}

@Injectable()
export class FormResponseService {
  private readonly logger = new Logger(FormResponseService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFormResponseDto, context: RequestContext) {
    const { tenantId, userId, facilityId } = context;

    const formMaster = await this.prisma.formMaster.findFirst({
      where: { id: dto.formMasterId, tenantId },
    });
    if (!formMaster) {
      throw new NotFoundException(`Form master ${dto.formMasterId} not found`);
    }

    const created = await this.prisma.formResponse.create({
      data: {
        tenantId,
        ...(facilityId ? { facilityId } : {}),
        formMasterId: formMaster.id,
        formCode: formMaster.formCode,
        formVersion: formMaster.formVersion,
        engine: formMaster.engine,
        patientId: dto.patientId,
        encounterId: dto.encounterId,
        status: FormResponseStatus.DRAFT,
        data: {},
        createdBy: userId,
      },
    });

    this.logger.log(`Started form response ${created.id} for form ${formMaster.formCode}`);
    return created;
  }

  async findById(id: string, tenantId: string) {
    const response = await this.prisma.formResponse.findFirst({
      where: { id, tenantId },
      include: { formMaster: true },
    });
    if (!response) {
      throw new NotFoundException(`Form response ${id} not found`);
    }
    return response;
  }

  async findByEncounter(encounterId: string, tenantId: string) {
    return this.prisma.formResponse.findMany({
      where: { tenantId, encounterId },
      include: { formMaster: { select: { id: true, name: true, formCode: true, formVersion: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByPatient(patientId: string, tenantId: string) {
    return this.prisma.formResponse.findMany({
      where: { tenantId, patientId },
      include: { formMaster: { select: { id: true, name: true, formCode: true, formVersion: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async save(id: string, dto: SaveFormResponseDto, context: RequestContext) {
    const { tenantId, userId } = context;
    const existing = await this.findById(id, tenantId);

    if (existing.status === FormResponseStatus.FINAL && dto.status !== FormResponseStatus.AMENDED) {
      throw new BadRequestException(
        'This response has already been submitted as final. Save again with status AMENDED to revise it.',
      );
    }

    const nextStatus = dto.status ?? existing.status;
    const isCompleting = nextStatus === FormResponseStatus.FINAL && existing.status !== FormResponseStatus.FINAL;

    // Re-validate against the master form's dataSchema before accepting a
    // final submission — the client already validates, but the guide
    // recommends server-side validation too. Uses Ajv directly (see the
    // module-level comment on why, not @openmedform/form-core's wrapper).
    if (nextStatus === FormResponseStatus.FINAL) {
      const bundle = existing.formMaster.bundle as any;
      const dataSchema = bundle?.dataSchema;
      if (dataSchema) {
        const validate = ajv.compile(dataSchema);
        const valid = validate(dto.data);
        if (!valid) {
          throw new BadRequestException({
            message: 'Form response does not satisfy the form definition.',
            errors: validate.errors,
          });
        }
      }
    }

    const updated = await this.prisma.formResponse.update({
      where: { id },
      data: {
        data: dto.data,
        status: nextStatus,
        ...(isCompleting ? { completedBy: userId, completedAt: new Date() } : {}),
      },
    });

    this.logger.log(`Saved form response ${id} (status: ${nextStatus})`);
    return updated;
  }
}
