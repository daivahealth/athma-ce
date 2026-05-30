import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@zeal/database-clinical';
import { PatientDisplayDto } from '@zeal/contracts';
import { STANDARD_PATIENT_SELECT, StandardPatientData } from '../../common/constants/patient-select.constant';
import { LabReportsService } from '../../reporting/services/lab-reports.service';
import { PathologyReportsService } from '../../reporting/services/pathology-reports.service';
import {
  AccessionLabSpecimenDto,
  PrepareLabSpecimenDto,
  CollectLabSpecimenDto,
  CompleteLabResultEntryDto,
  CreateLabProcessingRunDto,
  LabAccessionStatus,
  LabProcessingRunType,
  LabProcessingStatus,
  LabSpecimenEventType,
  LabSpecimenStatus,
  LabWorklistQueryDto,
  PrintLabSpecimenLabelDto,
  ReceiveLabSpecimenDto,
  RejectLabSpecimenDto,
  StartLabResultEntryDto,
} from '../dto/lab-operations.dto';

type TxClient = any;

@Injectable()
export class LabOperationsService {
  private readonly specimenInclude = {
    order: {
      select: {
        id: true,
        encounterId: true,
        patientId: true,
        orderName: true,
        orderCode: true,
        priority: true,
        status: true,
      },
    },
    specimenTests: {
      include: {
        labOrderTest: true,
      },
      orderBy: {
        createdAt: 'asc' as const,
      },
    },
    accessions: {
      orderBy: {
        createdAt: 'desc' as const,
      },
    },
    events: {
      orderBy: {
        eventTime: 'desc' as const,
      },
    },
    processingRuns: {
      orderBy: {
        createdAt: 'desc' as const,
      },
    },
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly labReportsService: LabReportsService,
    private readonly pathologyReportsService: PathologyReportsService,
  ) {}

  private async getLabTestReportConfigTx(
    tx: TxClient,
    labTestMasterId?: string | null,
  ): Promise<{ reportStyle: string; labDiscipline: string | null }> {
    if (!labTestMasterId) {
      return { reportStyle: 'structured', labDiscipline: null };
    }

    const master = await tx.labTestMaster.findUnique({
      where: { id: labTestMasterId },
      select: {
        reportStyle: true,
        labDiscipline: true,
      },
    });

    return {
      reportStyle: master?.reportStyle ?? 'structured',
      labDiscipline: master?.labDiscipline ?? null,
    };
  }

  private isNarrativeReportStyle(reportStyle?: string | null) {
    return reportStyle === 'narrative';
  }

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  private buildPatientDisplay(patient: StandardPatientData): PatientDisplayDto {
    const patientDisplay: PatientDisplayDto = {
      patientId: patient.id,
      mrn: patient.mrn,
      firstName: patient.firstName,
      lastName: patient.lastName,
      displayName: patient.displayName || `${patient.firstName} ${patient.lastName}`,
      age: this.calculateAge(patient.dateOfBirth),
      dateOfBirth: patient.dateOfBirth.toISOString().slice(0, 10),
      gender: patient.gender,
    };

    if (patient.nationalId) patientDisplay.nationalId = patient.nationalId;
    if (patient.nationalIdType) patientDisplay.nationalIdType = patient.nationalIdType;
    if (patient.phoneNumber) patientDisplay.phoneNumber = patient.phoneNumber;
    if (patient.email) patientDisplay.email = patient.email;
    if (patient.nationality) patientDisplay.nationality = patient.nationality;
    if (patient.preferredLanguage) patientDisplay.preferredLanguage = patient.preferredLanguage;

    return patientDisplay;
  }

  private normalizeCollectionValue(value: string | null | undefined, fallback = 'Unspecified') {
    const trimmed = value?.trim();
    return trimmed && trimmed.length > 0 ? trimmed : fallback;
  }

  private deriveCollectionProfile(
    orderTest: {
      labTestMasterId?: string | null;
      specimenType?: string | null;
      collectionMethod?: string | null;
      fastingRequired?: boolean;
      fastingDurationHours?: number | null;
    },
    master?: {
      specimenType: string;
      collectionMethod?: string | null;
      fastingRequired: boolean;
      fastingDurationHours?: number | null;
    } | null,
  ) {
    const specimenType = this.normalizeCollectionValue(
      master?.specimenType ?? orderTest.specimenType,
    );
    const collectionMethod = this.normalizeCollectionValue(
      master?.collectionMethod ?? orderTest.collectionMethod,
    );
    const fastingRequired = Boolean(master?.fastingRequired ?? orderTest.fastingRequired ?? false);
    const fastingDurationHours =
      master?.fastingDurationHours ?? orderTest.fastingDurationHours ?? null;

    return {
      specimenType,
      collectionMethod,
      fastingRequired,
      fastingDurationHours,
      groupingKey: [
        specimenType.toLowerCase(),
        collectionMethod.toLowerCase(),
      ].join(':'),
    };
  }

  async getWorklist(tenantId: string, stage: string, query: LabWorklistQueryDto) {
    switch (stage) {
      case 'collection':
        return this.getCollectionWorklist(tenantId, query);
      case 'receiving':
        return this.getReceivingWorklist(tenantId, query);
      case 'accessioning':
        return this.getAccessioningWorklist(tenantId, query);
      case 'processing':
        return this.getProcessingWorklist(tenantId, query);
      case 'result-entry':
        return this.getResultEntryWorklist(tenantId, query);
      default:
        throw new BadRequestException(`Unsupported lab worklist stage: ${stage}`);
    }
  }

  async getSpecimenById(tenantId: string, specimenId: string) {
    const specimen = await this.prisma.labSpecimen.findFirst({
      where: { tenantId, id: specimenId },
      include: this.specimenInclude,
    });

    if (!specimen) {
      throw new NotFoundException(`Lab specimen with ID ${specimenId} not found`);
    }

    return specimen;
  }

  async prepareSpecimen(tenantId: string, userId: string, dto: PrepareLabSpecimenDto) {
    return this.prisma.$transaction(async (tx) => {
      return this.prepareSpecimenTx(tx, tenantId, userId, dto);
    });
  }

  private async prepareSpecimenTx(tx: TxClient, tenantId: string, userId: string, dto: PrepareLabSpecimenDto): Promise<any> {
      const {
        anchorOrder,
        selectedOrderTests,
        canonicalProfile,
        profiles,
        fastingRequired,
      } = await this.resolveSelectedOrderTests(tx, tenantId, dto.orderId, dto.labOrderTestIds);

      const existingPreparedLinks = await tx.labSpecimenTest.findMany({
        where: {
          tenantId,
          labOrderTestId: {
            in: selectedOrderTests.map((test: any) => test.id),
          },
          specimen: {
            status: LabSpecimenStatus.PENDING_COLLECTION,
          },
        },
        include: {
          specimen: true,
        },
      });

      let specimen = existingPreparedLinks[0]?.specimen ?? null;
      const uniquePreparedSpecimenIds = new Set(existingPreparedLinks.map((link: any) => link.specimenId));
      if (uniquePreparedSpecimenIds.size > 1) {
        throw new BadRequestException('Selected lab tests are already linked to multiple prepared specimens');
      }
      if (existingPreparedLinks.length > 0 && existingPreparedLinks.length !== selectedOrderTests.length) {
        throw new BadRequestException('Selected lab tests are only partially prepared. Please re-open the original prepared specimen.');
      }

      if (!specimen) {
        const barcode = dto.barcode ?? this.generateBarcode();
        specimen = await tx.labSpecimen.create({
          data: {
            tenantId,
            orderId: anchorOrder.id,
            specimenType: dto.specimenType ?? canonicalProfile?.specimenType ?? null,
            containerType: dto.containerType ?? null,
            collectionSite: dto.collectionSite ?? null,
            barcode,
            status: LabSpecimenStatus.PENDING_COLLECTION,
          },
        });

        await tx.labSpecimenTest.createMany({
          data: selectedOrderTests.map((orderTest: any) => ({
            tenantId,
            specimenId: specimen!.id,
            labOrderTestId: orderTest.id,
            status: LabSpecimenStatus.PENDING_COLLECTION,
          })),
        });

        await tx.labOrderTest.updateMany({
          where: {
            tenantId,
            id: {
              in: selectedOrderTests.map((orderTest: any) => orderTest.id),
            },
          },
          data: {
            status: LabSpecimenStatus.PENDING_COLLECTION,
          },
        });

        await this.recordEvent(
          tx,
          tenantId,
          specimen.id,
          LabSpecimenEventType.LABEL_PREPARED,
          userId,
          dto.notes,
          {
            barcode,
            labOrderTestIds: selectedOrderTests.map((orderTest: any) => orderTest.id),
            orderIds: Array.from(new Set(selectedOrderTests.map((orderTest: any) => orderTest.orderId))),
            collectionMethod: canonicalProfile?.collectionMethod ?? null,
            fastingRequired,
            fastingDurationHours: fastingRequired
              ? Math.max(...profiles.map((profile: any) => profile.fastingDurationHours ?? 0))
              : null,
          },
        );
      }

      await this.recordEvent(
        tx,
        tenantId,
        specimen.id,
        LabSpecimenEventType.LABEL_PRINT_REQUESTED,
        userId,
        dto.notes,
        {
          barcode: specimen.barcode,
          template: 'lab-specimen-zpl-v1',
        },
      );

      const labelPayload = await this.buildPreparedLabelPayload(tx, tenantId, specimen.id);

      return {
        specimen: await tx.labSpecimen.findUniqueOrThrow({
          where: { id: specimen.id },
          include: this.specimenInclude,
        }),
        label: labelPayload,
      };
  }

  async collectSpecimen(tenantId: string, userId: string, dto: CollectLabSpecimenDto): Promise<any> {
    return this.prisma.$transaction(async (tx) => {
      if (dto.specimenId) {
        return this.finalizePreparedSpecimenTx(tx, tenantId, userId, dto.specimenId, dto);
      }

      if (!dto.orderId || !dto.labOrderTestIds?.length) {
        throw new BadRequestException('specimenId or manual order/test selection is required for collection');
      }

      const preparePayload: PrepareLabSpecimenDto = {
        orderId: dto.orderId,
        labOrderTestIds: dto.labOrderTestIds,
      };
      if (dto.specimenType !== undefined) preparePayload.specimenType = dto.specimenType;
      if (dto.containerType !== undefined) preparePayload.containerType = dto.containerType;
      if (dto.collectionSite !== undefined) preparePayload.collectionSite = dto.collectionSite;
      if (dto.barcode !== undefined) preparePayload.barcode = dto.barcode;
      if (dto.notes !== undefined) preparePayload.notes = dto.notes;

      const prepared = await this.prepareSpecimenTx(tx, tenantId, userId, preparePayload);
      return this.finalizePreparedSpecimenTx(tx, tenantId, userId, prepared.specimen.id, dto);
    });
  }

  async getSpecimenLabel(tenantId: string, specimenId: string, userId: string, dto: PrintLabSpecimenLabelDto) {
    return this.prisma.$transaction(async (tx) => {
      const specimen = await this.requireSpecimenTx(tx, tenantId, specimenId);
      if (specimen.status !== LabSpecimenStatus.PENDING_COLLECTION) {
        throw new BadRequestException('Only prepared specimens can regenerate a collection label');
      }

      await this.recordEvent(
        tx,
        tenantId,
        specimen.id,
        LabSpecimenEventType.LABEL_PRINT_REQUESTED,
        userId,
        dto.notes,
        {
          barcode: specimen.barcode,
          template: 'lab-specimen-zpl-v1',
        },
      );

      return this.buildPreparedLabelPayload(tx, tenantId, specimen.id);
    });
  }

  private async finalizePreparedSpecimenTx(
    tx: TxClient,
    tenantId: string,
    userId: string,
    specimenId: string,
    dto: CollectLabSpecimenDto,
  ) {
    const specimen = await this.requireSpecimenTx(tx, tenantId, specimenId);
    if (specimen.status !== LabSpecimenStatus.PENDING_COLLECTION) {
      throw new BadRequestException('Only prepared specimens can be finalized as collected');
    }

    const collectedAt = dto.collectedAt ? new Date(dto.collectedAt) : new Date();
    const collectedBy = dto.collectedBy ?? userId;

    await tx.labSpecimen.update({
      where: { id: specimen.id },
      data: {
        specimenType: dto.specimenType ?? specimen.specimenType,
        containerType: dto.containerType ?? specimen.containerType,
        collectionSite: dto.collectionSite ?? specimen.collectionSite,
        barcode: dto.barcode ?? specimen.barcode,
        collectedAt,
        collectedBy,
        status: LabSpecimenStatus.COLLECTED,
      },
    });

    await tx.labSpecimenTest.updateMany({
      where: { tenantId, specimenId: specimen.id },
      data: {
        status: LabSpecimenStatus.COLLECTED,
      },
    });

    const linkedSpecimenTests = await tx.labSpecimenTest.findMany({
      where: { tenantId, specimenId: specimen.id },
    });

    await tx.labOrderTest.updateMany({
      where: {
        tenantId,
        id: {
          in: linkedSpecimenTests.map((link: any) => link.labOrderTestId),
        },
      },
      data: {
        status: LabSpecimenStatus.COLLECTED,
      },
    });

    const linkedOrders = await tx.labOrderTest.findMany({
      where: {
        tenantId,
        id: {
          in: linkedSpecimenTests.map((link: any) => link.labOrderTestId),
        },
      },
      select: { orderId: true },
    });

    await tx.clinicalOrder.updateMany({
      where: {
        tenantId,
        id: {
          in: [...new Set(linkedOrders.map((test: any) => test.orderId))],
        },
      },
      data: {
        status: 'in_progress',
      },
    });

    await this.recordEvent(
      tx,
      tenantId,
      specimen.id,
      LabSpecimenEventType.COLLECTED,
      collectedBy,
      dto.notes,
      {
        barcode: dto.barcode ?? specimen.barcode,
        labOrderTestIds: linkedSpecimenTests.map((link: any) => link.labOrderTestId),
      },
      collectedAt,
    );

    return tx.labSpecimen.findUniqueOrThrow({
      where: { id: specimen.id },
      include: this.specimenInclude,
    });
  }

  async receiveSpecimen(tenantId: string, specimenId: string, userId: string, dto: ReceiveLabSpecimenDto) {
    return this.prisma.$transaction(async (tx) => {
      const specimen = await this.requireSpecimenTx(tx, tenantId, specimenId);
      this.ensureSpecimenActionable(specimen);

      const receivedAt = dto.receivedAt ? new Date(dto.receivedAt) : new Date();
      const receivedBy = dto.receivedBy ?? userId;

      await tx.labSpecimen.update({
        where: { id: specimen.id },
        data: {
          status: LabSpecimenStatus.RECEIVED,
        },
      });

      await tx.labSpecimenTest.updateMany({
        where: { tenantId, specimenId: specimen.id },
        data: {
          status: LabSpecimenStatus.RECEIVED,
        },
      });

      await tx.labOrderTest.updateMany({
        where: {
          tenantId,
          specimenTests: {
            some: {
              specimenId: specimen.id,
            },
          },
        },
        data: {
          status: LabSpecimenStatus.RECEIVED,
        },
      });

      const existingAccession = await tx.labAccession.findFirst({
        where: { tenantId, specimenId: specimen.id },
        orderBy: { createdAt: 'desc' },
      });

      if (existingAccession) {
        await tx.labAccession.update({
          where: { id: existingAccession.id },
          data: {
            receivedAt,
            receivedBy,
            receivingLocation: dto.receivingLocation ?? existingAccession.receivingLocation,
            status: LabAccessionStatus.RECEIVED,
          },
        });
      } else {
        await tx.labAccession.create({
          data: {
            tenantId,
            specimenId: specimen.id,
            accessionNumber: this.generateAccessionNumber(),
            receivedAt,
            receivedBy,
            receivingLocation: dto.receivingLocation ?? null,
            status: LabAccessionStatus.RECEIVED,
          },
        });
      }

      await this.recordEvent(tx, tenantId, specimen.id, LabSpecimenEventType.RECEIVED, receivedBy, dto.notes, {
        receivingLocation: dto.receivingLocation ?? null,
      }, receivedAt);

      return tx.labSpecimen.findUniqueOrThrow({
        where: { id: specimen.id },
        include: this.specimenInclude,
      });
    });
  }

  async accessionSpecimen(tenantId: string, specimenId: string, userId: string, dto: AccessionLabSpecimenDto) {
    return this.prisma.$transaction(async (tx) => {
      const specimen = await this.requireSpecimenTx(tx, tenantId, specimenId);
      this.ensureSpecimenActionable(specimen);

      const accessionedAt = dto.accessionedAt ? new Date(dto.accessionedAt) : new Date();
      const accessionedBy = dto.accessionedBy ?? userId;
      const accessionNumber = dto.accessionNumber ?? this.generateAccessionNumber();

      const existingAccession = await tx.labAccession.findFirst({
        where: { tenantId, specimenId: specimen.id },
        orderBy: { createdAt: 'desc' },
      });

      if (existingAccession) {
        await tx.labAccession.update({
          where: { id: existingAccession.id },
          data: {
            accessionNumber,
            accessionedAt,
            accessionedBy,
            status: LabAccessionStatus.ACCESSIONED,
          },
        });
      } else {
        await tx.labAccession.create({
          data: {
            tenantId,
            specimenId: specimen.id,
            accessionNumber,
            accessionedAt,
            accessionedBy,
            status: LabAccessionStatus.ACCESSIONED,
          },
        });
      }

      await tx.labSpecimen.update({
        where: { id: specimen.id },
        data: {
          status: LabSpecimenStatus.ACCESSIONED,
        },
      });

      await tx.labSpecimenTest.updateMany({
        where: { tenantId, specimenId: specimen.id },
        data: {
          status: LabSpecimenStatus.ACCESSIONED,
        },
      });

      await tx.labOrderTest.updateMany({
        where: {
          tenantId,
          specimenTests: {
            some: {
              specimenId: specimen.id,
            },
          },
        },
        data: {
          status: LabSpecimenStatus.ACCESSIONED,
        },
      });

      await this.recordEvent(tx, tenantId, specimen.id, LabSpecimenEventType.ACCESSIONED, accessionedBy, dto.notes, {
        accessionNumber,
      }, accessionedAt);

      return tx.labSpecimen.findUniqueOrThrow({
        where: { id: specimen.id },
        include: this.specimenInclude,
      });
    });
  }

  async rejectSpecimen(tenantId: string, specimenId: string, userId: string, dto: RejectLabSpecimenDto) {
    return this.prisma.$transaction(async (tx) => {
      const specimen = await this.requireSpecimenTx(tx, tenantId, specimenId);

      await tx.labSpecimen.update({
        where: { id: specimen.id },
        data: {
          status: LabSpecimenStatus.REJECTED,
          rejectionReason: dto.rejectionReason,
        },
      });

      await tx.labSpecimenTest.updateMany({
        where: { tenantId, specimenId: specimen.id },
        data: {
          status: LabSpecimenStatus.REJECTED,
        },
      });

      await tx.labOrderTest.updateMany({
        where: {
          tenantId,
          specimenTests: {
            some: {
              specimenId: specimen.id,
            },
          },
        },
        data: {
          status: LabSpecimenStatus.REJECTED,
        },
      });

      await tx.labAccession.updateMany({
        where: { tenantId, specimenId: specimen.id },
        data: {
          status: LabAccessionStatus.REJECTED,
        },
      });

      await this.recordEvent(tx, tenantId, specimen.id, LabSpecimenEventType.REJECTED, userId, dto.notes, {
        rejectionReason: dto.rejectionReason,
      });

      return tx.labSpecimen.findUniqueOrThrow({
        where: { id: specimen.id },
        include: this.specimenInclude,
      });
    });
  }

  async createProcessingRun(tenantId: string, userId: string, dto: CreateLabProcessingRunDto) {
    return this.prisma.$transaction(async (tx) => {
      const { orderTest, specimen, specimenLink, latestAccession } = await this.resolveResultEntryContextTx(
        tx,
        tenantId,
        dto,
      );
      const reportConfig = await this.getLabTestReportConfigTx(tx, orderTest.labTestMasterId);
      this.ensureSpecimenActionable(specimen);

      const link = specimenLink;

      const processedAt = dto.processedAt ? new Date(dto.processedAt) : new Date();
      const processedBy = dto.processedBy ?? userId;

      const run = await tx.labProcessingRun.create({
        data: {
          tenantId,
          specimenId: dto.specimenId,
          labOrderTestId: dto.labOrderTestId,
          runType: dto.runType ?? LabProcessingRunType.MANUAL,
          instrumentCode: dto.instrumentCode ?? null,
          instrumentRunId: dto.instrumentRunId ?? null,
          status: dto.status ?? LabProcessingStatus.PROCESSING,
          processedAt,
          processedBy,
          ...(dto.rawPayload !== undefined ? { rawPayload: dto.rawPayload } : {}),
        },
      });

      await tx.labSpecimen.update({
        where: { id: specimen.id },
        data: {
          status: LabSpecimenStatus.PROCESSING,
        },
      });

      await tx.labSpecimenTest.update({
        where: { id: link.id },
        data: {
          status: LabSpecimenStatus.PROCESSING,
        },
      });

      await tx.labOrderTest.update({
        where: { id: dto.labOrderTestId },
        data: {
          status: LabSpecimenStatus.PROCESSING,
        },
      });

      await this.ensureActiveReportForOrderTestTx(
        tx,
        tenantId,
        userId,
        orderTest,
        reportConfig.reportStyle,
        specimen,
        latestAccession,
      );

      await this.recordEvent(tx, tenantId, specimen.id, LabSpecimenEventType.PROCESSING_STARTED, processedBy, null, {
        labOrderTestId: dto.labOrderTestId,
        processingRunId: run.id,
        runType: run.runType,
      }, processedAt);

      return tx.labProcessingRun.findUniqueOrThrow({
        where: { id: run.id },
      });
    });
  }

  async startResultEntry(tenantId: string, userId: string, dto: StartLabResultEntryDto) {
    return this.prisma.$transaction(async (tx) => {
      const { orderTest, specimen, specimenLink, latestAccession } = await this.resolveResultEntryContextTx(
        tx,
        tenantId,
        dto,
      );
      const reportConfig = await this.getLabTestReportConfigTx(tx, orderTest.labTestMasterId);

      if (orderTest.status !== LabSpecimenStatus.PROCESSING && orderTest.status !== LabSpecimenStatus.RESULT_ENTERED) {
        await tx.labOrderTest.update({
          where: { id: orderTest.id },
          data: {
            status: LabSpecimenStatus.PROCESSING,
          },
        });
      }

      let report = await this.ensureActiveReportForOrderTestTx(
        tx,
        tenantId,
        userId,
        orderTest,
        reportConfig.reportStyle,
        specimen,
        latestAccession,
      );

      await this.recordEvent(tx, tenantId, specimen.id, LabSpecimenEventType.RESULT_ENTRY_STARTED, userId, null, {
        labOrderTestId: orderTest.id,
        reportId: report.id,
      });

      return {
        order: orderTest.order,
        labOrderTest: orderTest,
        specimen,
        accession: latestAccession,
        reportMode: this.isNarrativeReportStyle(reportConfig.reportStyle) ? 'narrative' : 'structured',
        report,
      };
    });
  }

  async getResultEntryContext(tenantId: string, dto: StartLabResultEntryDto) {
    const { orderTest, specimen, latestAccession } = await this.resolveResultEntryContextTx(
      this.prisma,
      tenantId,
      dto,
    );

    return {
      order: orderTest.order,
      labOrderTest: orderTest,
      specimen,
      accession: latestAccession,
    };
  }

  private async resolveResultEntryContextTx(
    tx: TxClient,
    tenantId: string,
    dto: StartLabResultEntryDto,
  ) {
    const orderTest = await tx.labOrderTest.findFirst({
      where: {
        tenantId,
        id: dto.labOrderTestId,
      },
      include: {
        order: true,
        specimenTests: {
          include: {
            specimen: {
              include: {
                accessions: {
                  orderBy: { createdAt: 'desc' },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!orderTest) {
      throw new NotFoundException(`Lab order test ${dto.labOrderTestId} not found`);
    }

    const specimenLink = dto.specimenId
      ? orderTest.specimenTests.find((candidate: any) => candidate.specimenId === dto.specimenId)
      : orderTest.specimenTests.find(
          (candidate: any) => candidate.specimen.status !== LabSpecimenStatus.REJECTED,
        );

    if (!specimenLink) {
      throw new BadRequestException('No actionable specimen is linked to this lab order test');
    }

    const specimen = specimenLink.specimen;
    const latestAccession = specimen.accessions[0] ?? null;

    return { orderTest, specimen, specimenLink, latestAccession };
  }

  private async ensureActiveReportForOrderTestTx(
    tx: TxClient,
    tenantId: string,
    userId: string,
    orderTest: any,
    reportStyle: string,
    specimen: any,
    latestAccession: any,
  ) {
    if (this.isNarrativeReportStyle(reportStyle)) {
      const existingReport = await tx.pathologyReport.findFirst({
        where: {
          tenantId,
          orderId: orderTest.orderId,
          reportStatus: {
            in: ['DRAFT', 'PRELIMINARY'],
          },
        },
        orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }],
      });

      if (!existingReport) {
        return this.pathologyReportsService.create(tenantId, userId, {
          orderId: orderTest.orderId,
          specimenType: specimen.specimenType ?? undefined,
          collectionDate: specimen.collectedAt?.toISOString(),
          receivedDate: latestAccession?.receivedAt?.toISOString(),
        });
      }

      return tx.pathologyReport.update({
        where: { id: existingReport.id },
        data: {
          specimenType: existingReport.specimenType ?? specimen.specimenType ?? null,
          collectionDate: existingReport.collectionDate ?? specimen.collectedAt ?? null,
          receivedDate: existingReport.receivedDate ?? latestAccession?.receivedAt ?? null,
          updatedBy: userId,
        },
      });
    }

    const existingReport = await tx.labReport.findFirst({
      where: {
        tenantId,
        orderId: orderTest.orderId,
        reportStatus: {
          in: ['DRAFT', 'PRELIMINARY'],
        },
      },
      include: {
        items: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }],
    });

    let report;
    if (!existingReport) {
      const createPayload: {
        orderId: string;
        specimenType?: string;
        collectionDate?: string;
        receivedDate?: string;
      } = {
        orderId: orderTest.orderId,
      };
      if (specimen.specimenType) createPayload.specimenType = specimen.specimenType;
      if (specimen.collectedAt) createPayload.collectionDate = specimen.collectedAt.toISOString();
      if (latestAccession?.receivedAt) createPayload.receivedDate = latestAccession.receivedAt.toISOString();
      const createdReport = await this.labReportsService.create(tenantId, userId, createPayload);
      report = await this.labReportsService.findById(tenantId, createdReport.id);
    } else {
      report = await tx.labReport.update({
        where: { id: existingReport.id },
        data: {
          specimenType: existingReport.specimenType ?? specimen.specimenType ?? null,
          collectionDate: existingReport.collectionDate ?? specimen.collectedAt ?? null,
          receivedDate: existingReport.receivedDate ?? latestAccession?.receivedAt ?? null,
          updatedBy: userId,
        },
        include: {
          items: {
            orderBy: {
              sortOrder: 'asc',
            },
          },
        },
      });
    }

    if (report.items.length === 0 && orderTest.labTestMasterId) {
      const seededItems = await this.seedResultTemplateItemsTx(
        tx,
        tenantId,
        report.id,
        orderTest.labTestMasterId,
      );

      if (seededItems.length > 0) {
        report = await tx.labReport.findUniqueOrThrow({
          where: { id: report.id },
          include: {
            items: {
              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
        });
      }
    }

    return report;
  }

  async completeResultEntry(tenantId: string, userId: string, dto: CompleteLabResultEntryDto) {
    return this.prisma.$transaction(async (tx) => {
      const orderTest = await tx.labOrderTest.findFirst({
        where: {
          tenantId,
          id: dto.labOrderTestId,
        },
        include: {
          order: true,
          specimenTests: {
            include: {
              specimen: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      if (!orderTest) {
        throw new NotFoundException(`Lab order test ${dto.labOrderTestId} not found`);
      }

      const specimenLink = dto.specimenId
        ? orderTest.specimenTests.find((candidate) => candidate.specimenId === dto.specimenId)
        : orderTest.specimenTests.find((candidate) => candidate.specimen.status !== LabSpecimenStatus.REJECTED);

      if (!specimenLink) {
        throw new BadRequestException('No actionable specimen is linked to this lab order test');
      }

      const reportConfig = await this.getLabTestReportConfigTx(tx, orderTest.labTestMasterId);

      const report = await tx.labReport.findFirst({
        where: this.isNarrativeReportStyle(reportConfig.reportStyle)
          ? {
              tenantId,
              orderId: orderTest.orderId,
            }
          : {
              tenantId,
              orderId: orderTest.orderId,
              reportStatus: {
                in: ['DRAFT', 'PRELIMINARY', 'FINAL', 'AMENDED'],
              },
            },
        include: {
          items: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
      if (this.isNarrativeReportStyle(reportConfig.reportStyle)) {
        const pathologyReport = await tx.pathologyReport.findFirst({
          where: {
            tenantId,
            orderId: orderTest.orderId,
            reportStatus: {
              in: ['DRAFT', 'PRELIMINARY', 'FINAL', 'AMENDED'],
            },
          },
          orderBy: {
            updatedAt: 'desc',
          },
        });

        if (
          !pathologyReport ||
          ![
            pathologyReport.clinicalHistory,
            pathologyReport.specimenReceived,
            pathologyReport.grossDescription,
            pathologyReport.microscopicDescription,
            pathologyReport.diagnosis,
            pathologyReport.comment,
          ].some((value) => value && value.trim().length > 0)
        ) {
          throw new BadRequestException('Result entry cannot be completed before pathology report content is saved');
        }

        await this.ensureManualProcessingRunForCompletedEntryTx(
          tx,
          tenantId,
          userId,
          orderTest.id,
          specimenLink.specimenId,
          pathologyReport.reportedAt ?? pathologyReport.updatedAt ?? new Date(),
        );

        await tx.labOrderTest.update({
          where: { id: orderTest.id },
          data: {
            status: LabSpecimenStatus.RESULT_ENTERED,
          },
        });

        await tx.labSpecimenTest.update({
          where: { id: specimenLink.id },
          data: {
            status: LabSpecimenStatus.RESULT_ENTERED,
          },
        });

        const remainingOpenTests = await tx.labSpecimenTest.count({
          where: {
            tenantId,
            specimenId: specimenLink.specimenId,
            status: {
              notIn: [LabSpecimenStatus.RESULT_ENTERED, LabSpecimenStatus.COMPLETED, LabSpecimenStatus.REJECTED],
            },
          },
        });

        await tx.labSpecimen.update({
          where: { id: specimenLink.specimenId },
          data: {
            status: remainingOpenTests === 0 ? LabSpecimenStatus.RESULT_ENTERED : LabSpecimenStatus.PROCESSING,
          },
        });

        await this.recordEvent(tx, tenantId, specimenLink.specimenId, LabSpecimenEventType.RESULT_ENTERED, userId, dto.notes, {
          labOrderTestId: orderTest.id,
          reportId: pathologyReport.id,
        });

        return {
          reportId: pathologyReport.id,
          specimenId: specimenLink.specimenId,
          labOrderTestId: orderTest.id,
          status: LabSpecimenStatus.RESULT_ENTERED,
        };
      }

      if (!report || report.items.length === 0) {
        throw new BadRequestException('Result entry cannot be completed before report items are saved');
      }

      await this.ensureManualProcessingRunForCompletedEntryTx(
        tx,
        tenantId,
        userId,
        orderTest.id,
        specimenLink.specimenId,
        report.reportedAt ?? report.updatedAt ?? new Date(),
      );

      await tx.labOrderTest.update({
        where: { id: orderTest.id },
        data: {
          status: LabSpecimenStatus.RESULT_ENTERED,
        },
      });

      await tx.labSpecimenTest.update({
        where: { id: specimenLink.id },
        data: {
          status: LabSpecimenStatus.RESULT_ENTERED,
        },
      });

      const remainingOpenTests = await tx.labSpecimenTest.count({
        where: {
          tenantId,
          specimenId: specimenLink.specimenId,
          status: {
            notIn: [LabSpecimenStatus.RESULT_ENTERED, LabSpecimenStatus.COMPLETED, LabSpecimenStatus.REJECTED],
          },
        },
      });

      await tx.labSpecimen.update({
        where: { id: specimenLink.specimenId },
        data: {
          status: remainingOpenTests === 0 ? LabSpecimenStatus.RESULT_ENTERED : LabSpecimenStatus.PROCESSING,
        },
      });

      await this.recordEvent(tx, tenantId, specimenLink.specimenId, LabSpecimenEventType.RESULT_ENTERED, userId, dto.notes, {
        labOrderTestId: orderTest.id,
        reportId: report.id,
      });

      return {
        reportId: report.id,
        specimenId: specimenLink.specimenId,
        labOrderTestId: orderTest.id,
        status: LabSpecimenStatus.RESULT_ENTERED,
      };
    });
  }

  private async ensureManualProcessingRunForCompletedEntryTx(
    tx: TxClient,
    tenantId: string,
    userId: string,
    labOrderTestId: string,
    specimenId: string,
    processedAtSource: Date | string,
  ) {
    const existingRun = await tx.labProcessingRun.findFirst({
      where: {
        tenantId,
        labOrderTestId,
        specimenId,
      },
      orderBy: [{ processedAt: 'desc' }, { createdAt: 'desc' }],
    });

    if (existingRun) {
      return existingRun;
    }

    const processedAt = processedAtSource instanceof Date ? processedAtSource : new Date(processedAtSource);

    const run = await tx.labProcessingRun.create({
      data: {
        tenantId,
        specimenId,
        labOrderTestId,
        runType: LabProcessingRunType.MANUAL,
        status: LabProcessingStatus.COMPLETED,
        processedAt,
        processedBy: userId,
      },
    });

    await this.recordEvent(
      tx,
      tenantId,
      specimenId,
      LabSpecimenEventType.PROCESSING_STARTED,
      userId,
      'Backfilled from manual result completion',
      {
        labOrderTestId,
        processingRunId: run.id,
        runType: run.runType,
        source: 'manual_result_completion',
      },
      processedAt,
    );

    return run;
  }

  private async getCollectionWorklist(tenantId: string, query: LabWorklistQueryDto) {
    const preparedSpecimens = await this.prisma.labSpecimen.findMany({
      where: {
        tenantId,
        status: LabSpecimenStatus.PENDING_COLLECTION,
        order: {
          orderType: 'lab',
          ...(query.encounterId ? { encounterId: query.encounterId } : {}),
          ...(query.patientId ? { patientId: query.patientId } : {}),
          status: {
            not: 'cancelled',
          },
        },
      },
      include: {
        order: {
          select: {
            id: true,
            encounterId: true,
            patientId: true,
            orderName: true,
            orderCode: true,
            priority: true,
            orderedAt: true,
          },
        },
        specimenTests: {
          include: {
            labOrderTest: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        events: {
          where: {
            eventType: {
              in: [LabSpecimenEventType.LABEL_PREPARED, LabSpecimenEventType.LABEL_PRINT_REQUESTED],
            },
          },
          orderBy: {
            eventTime: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const preparedLabOrderTestIds = new Set(
      preparedSpecimens.flatMap((specimen) => specimen.specimenTests.map((link) => link.labOrderTestId)),
    );

    const tests = await this.prisma.labOrderTest.findMany({
      where: {
        tenantId,
        status: {
          in: ['ordered', 'rejected'],
        },
        id: {
          notIn: Array.from(preparedLabOrderTestIds),
        },
        order: {
          orderType: 'lab',
          ...(query.encounterId ? { encounterId: query.encounterId } : {}),
          ...(query.patientId ? { patientId: query.patientId } : {}),
          status: {
            not: 'cancelled',
          },
        },
      },
      include: {
        order: {
          select: {
            id: true,
            encounterId: true,
            patientId: true,
            orderName: true,
            orderCode: true,
            priority: true,
            orderedAt: true,
          },
        },
      },
      orderBy: [
        { order: { orderedAt: 'desc' } },
        { sortOrder: 'asc' },
      ],
    });
    const masterIds = Array.from(
      new Set(tests.map((test) => test.labTestMasterId).filter((value): value is string => Boolean(value))),
    );
    const masters = masterIds.length
      ? await this.prisma.labTestMaster.findMany({
          where: {
            id: {
              in: masterIds,
            },
          },
          select: {
            id: true,
            specimenType: true,
            collectionMethod: true,
            fastingRequired: true,
            fastingDurationHours: true,
          },
        })
      : [];
    const masterById = new Map(masters.map((master) => [master.id, master]));
    const patientIds = Array.from(
      new Set([
        ...tests.map((test) => test.order.patientId),
        ...preparedSpecimens.map((specimen) => specimen.order.patientId),
      ]),
    );
    const patients = patientIds.length
      ? await this.prisma.patient.findMany({
          where: {
            tenantId,
            id: {
              in: patientIds,
            },
          },
          select: STANDARD_PATIENT_SELECT,
        })
      : [];
    const patientDisplayById = new Map(
      patients.map((patient) => [patient.id, this.buildPatientDisplay(patient)]),
    );

    const grouped = new Map<string, any>();

    for (const test of tests) {
      const profile = this.deriveCollectionProfile(
        test,
        test.labTestMasterId ? masterById.get(test.labTestMasterId) : null,
      );
      const key = [
        test.order.patientId,
        test.order.encounterId,
        profile.groupingKey,
      ].join(':');

      if (!grouped.has(key)) {
        grouped.set(key, {
          orderId: test.orderId,
          encounterId: test.order.encounterId,
          patientId: test.order.patientId,
          orderName: test.order.orderName,
          orderCode: test.order.orderCode,
          priority: test.order.priority,
          orderedAt: test.order.orderedAt,
          patientDisplay: patientDisplayById.get(test.order.patientId) ?? null,
          specimenType: profile.specimenType,
          collectionMethod: profile.collectionMethod,
          fastingRequired: profile.fastingRequired,
          fastingDurationHours: profile.fastingDurationHours,
          pendingLabOrderTestIds: [],
          orderIds: [],
          sourceOrders: [],
          tests: [],
        });
      }

      const group = grouped.get(key);
      group.pendingLabOrderTestIds.push(test.id);
      group.fastingRequired = group.fastingRequired || profile.fastingRequired;
      group.fastingDurationHours = Math.max(
        group.fastingDurationHours ?? 0,
        profile.fastingDurationHours ?? 0,
      ) || null;
      if (!group.orderIds.includes(test.orderId)) {
        group.orderIds.push(test.orderId);
        group.sourceOrders.push({
          id: test.orderId,
          orderName: test.order.orderName,
          orderCode: test.order.orderCode,
          priority: test.order.priority,
          orderedAt: test.order.orderedAt,
        });
      }
      group.tests.push({
        id: test.id,
        testCode: test.testCode,
        testName: test.testName,
        status: test.status,
      });
    }

    const readyGroups = Array.from(grouped.values()).map((group: any) => ({
      ...group,
      testCount: group.tests.length,
      orderCount: group.orderIds.length,
      workflowState: 'ready',
      preparedSpecimenId: null,
      preparedBarcode: null,
      preparedAt: null,
    }));

    const preparedGroups = preparedSpecimens.map((specimen: any) => ({
      orderId: specimen.orderId,
      encounterId: specimen.order.encounterId,
      patientId: specimen.order.patientId,
      patientDisplay: patientDisplayById.get(specimen.order.patientId) ?? null,
      orderName: specimen.order.orderName,
      orderCode: specimen.order.orderCode,
      priority: specimen.order.priority,
      orderedAt: specimen.order.orderedAt,
      specimenType: specimen.specimenType ?? 'Unspecified',
      collectionMethod: this.normalizeCollectionValue(specimen.specimenTests[0]?.labOrderTest.collectionMethod),
      fastingRequired: specimen.specimenTests.some((link: any) => Boolean(link.labOrderTest.fastingRequired)),
      fastingDurationHours:
        Math.max(...specimen.specimenTests.map((link: any) => link.labOrderTest.fastingDurationHours ?? 0)) || null,
      pendingLabOrderTestIds: specimen.specimenTests.map((link: any) => link.labOrderTestId),
      testCount: specimen.specimenTests.length,
      orderCount: new Set(specimen.specimenTests.map((link: any) => link.labOrderTest.orderId)).size,
      orderIds: Array.from(new Set(specimen.specimenTests.map((link: any) => link.labOrderTest.orderId))),
      sourceOrders: [
        {
          id: specimen.order.id,
          orderName: specimen.order.orderName,
          orderCode: specimen.order.orderCode,
          priority: specimen.order.priority,
          orderedAt: specimen.order.orderedAt,
        },
      ],
      tests: specimen.specimenTests.map((link: any) => ({
        id: link.labOrderTest.id,
        testCode: link.labOrderTest.testCode,
        testName: link.labOrderTest.testName,
        status: link.labOrderTest.status,
      })),
      workflowState: 'prepared',
      preparedSpecimenId: specimen.id,
      preparedBarcode: specimen.barcode,
      preparedAt: specimen.createdAt,
    }));

    return [...preparedGroups, ...readyGroups];
  }

  private async seedResultTemplateItemsTx(
    tx: TxClient,
    tenantId: string,
    reportId: string,
    labTestMasterId: string,
  ) {
    const templates = await tx.labTestResultTemplate.findMany({
      where: {
        labTestMasterId,
        isActive: true,
        OR: [{ tenantId }, { tenantId: null }],
      },
      include: {
        observationCodeCatalog: true,
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    if (templates.length === 0) {
      return [];
    }

    const analyteTemplates = templates.filter(
      (template: (typeof templates)[number]) =>
        template.nodeType === 'analyte' && template.observationCodeCatalog !== null,
    );

    return Promise.all(
      analyteTemplates.map((template: (typeof analyteTemplates)[number], index: number) =>
        tx.labResultItem.create({
          data: {
            tenantId,
            labReportId: reportId,
            sortOrder: template.sortOrder ?? index,
            testCode: template.observationCodeCatalog!.code,
            codeSystem: template.observationCodeCatalog!.codeSystem,
            testName: template.displayLabel ?? template.observationCodeCatalog!.displayName,
            testNameAr: template.observationCodeCatalog!.displayNameAr ?? null,
            unit: template.observationCodeCatalog!.defaultUnit ?? null,
            refRangeLow: template.observationCodeCatalog!.refRangeLow ?? null,
            refRangeHigh: template.observationCodeCatalog!.refRangeHigh ?? null,
          },
        }),
      ),
    );
  }

  private async getReceivingWorklist(tenantId: string, query: LabWorklistQueryDto) {
    return this.prisma.labSpecimen.findMany({
      where: {
        tenantId,
        status: LabSpecimenStatus.COLLECTED,
        order: {
          ...(query.encounterId ? { encounterId: query.encounterId } : {}),
          ...(query.patientId ? { patientId: query.patientId } : {}),
        },
      },
      include: this.specimenInclude,
      orderBy: {
        collectedAt: 'asc',
      },
    });
  }

  private async getAccessioningWorklist(tenantId: string, query: LabWorklistQueryDto) {
    return this.prisma.labSpecimen.findMany({
      where: {
        tenantId,
        status: LabSpecimenStatus.RECEIVED,
        order: {
          ...(query.encounterId ? { encounterId: query.encounterId } : {}),
          ...(query.patientId ? { patientId: query.patientId } : {}),
        },
      },
      include: this.specimenInclude,
      orderBy: {
        updatedAt: 'asc',
      },
    });
  }

  private async getProcessingWorklist(tenantId: string, query: LabWorklistQueryDto) {
    return this.prisma.labSpecimenTest.findMany({
      where: {
        tenantId,
        status: {
          in: [LabSpecimenStatus.ACCESSIONED, LabSpecimenStatus.PROCESSING],
        },
        specimen: {
          order: {
            ...(query.encounterId ? { encounterId: query.encounterId } : {}),
            ...(query.patientId ? { patientId: query.patientId } : {}),
          },
        },
      },
      include: {
        specimen: {
          include: {
            order: {
              select: {
                id: true,
                encounterId: true,
                patientId: true,
                orderName: true,
                orderCode: true,
                priority: true,
              },
            },
            accessions: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
        labOrderTest: true,
      },
      orderBy: {
        updatedAt: 'asc',
      },
    });
  }

  private async getResultEntryWorklist(tenantId: string, query: LabWorklistQueryDto) {
    return this.prisma.labSpecimenTest.findMany({
      where: {
        tenantId,
        status: {
          in: [LabSpecimenStatus.PROCESSING, LabSpecimenStatus.RESULT_ENTERED],
        },
        specimen: {
          order: {
            ...(query.encounterId ? { encounterId: query.encounterId } : {}),
            ...(query.patientId ? { patientId: query.patientId } : {}),
          },
        },
      },
      include: {
        specimen: {
          include: {
            order: {
              select: {
                id: true,
                encounterId: true,
                patientId: true,
                orderName: true,
                orderCode: true,
                priority: true,
              },
            },
            accessions: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
        labOrderTest: true,
      },
      orderBy: {
        updatedAt: 'asc',
      },
    });
  }

  private async resolveSelectedOrderTests(
    tx: TxClient,
    tenantId: string,
    orderId: string,
    labOrderTestIds: string[],
  ) {
    const anchorOrder = await tx.clinicalOrder.findFirst({
      where: {
        tenantId,
        id: orderId,
        orderType: 'lab',
        status: {
          not: 'cancelled',
        },
      },
      include: {
        labOrderTests: true,
      },
    });

    if (!anchorOrder) {
      throw new NotFoundException(`Lab order ${orderId} not found`);
    }

    if (!labOrderTestIds.length) {
      throw new BadRequestException('At least one lab order test is required for collection');
    }

    const selectedOrderTests = await tx.labOrderTest.findMany({
      where: {
        tenantId,
        id: {
          in: labOrderTestIds,
        },
        order: {
          orderType: 'lab',
          status: {
            not: 'cancelled',
          },
        },
      },
      include: {
        order: {
          select: {
            id: true,
            patientId: true,
            encounterId: true,
          },
        },
      },
    });

    const masterIds = Array.from(
      new Set(
        selectedOrderTests
          .map((test: any) => test.labTestMasterId)
          .filter((value: any): value is string => Boolean(value)),
      ),
    );
    const masters = masterIds.length
      ? await tx.labTestMaster.findMany({
          where: {
            id: {
              in: masterIds,
            },
          },
          select: {
            id: true,
            specimenType: true,
            collectionMethod: true,
            fastingRequired: true,
            fastingDurationHours: true,
          },
        })
      : [];
    const masterById = new Map<string, any>(masters.map((master: any) => [master.id, master]));

    if (selectedOrderTests.length !== labOrderTestIds.length) {
      throw new BadRequestException('One or more requested lab order tests are not available for collection');
    }

    if (!selectedOrderTests.some((test: any) => test.orderId === anchorOrder.id)) {
      throw new BadRequestException('The supplied anchor order must be one of the selected lab orders');
    }

    const patientIds = new Set(selectedOrderTests.map((test: any) => test.order.patientId));
    const encounterIds = new Set(selectedOrderTests.map((test: any) => test.order.encounterId));
    const profiles = selectedOrderTests.map((test: any) =>
      this.deriveCollectionProfile(test, test.labTestMasterId ? masterById.get(test.labTestMasterId) : null),
    );
    const groupingKeys = new Set(profiles.map((profile: any) => profile.groupingKey));
    const fastingRequired = profiles.some((profile: any) => profile.fastingRequired);

    if (patientIds.size > 1 || encounterIds.size > 1) {
      throw new BadRequestException('A single collected specimen cannot span multiple patients or encounters');
    }

    if (groupingKeys.size > 1) {
      throw new BadRequestException(
        'Selected lab tests are not collection-compatible. Group them by specimen type and collection method.',
      );
    }

    return {
      anchorOrder,
      selectedOrderTests,
      profiles,
      fastingRequired,
      canonicalProfile: profiles[0],
    };
  }

  private async buildPreparedLabelPayload(tx: TxClient, tenantId: string, specimenId: string) {
    const specimen = await tx.labSpecimen.findFirst({
      where: {
        tenantId,
        id: specimenId,
      },
      include: {
        order: {
          select: {
            patientId: true,
          },
        },
      },
    });

    if (!specimen) {
      throw new NotFoundException(`Prepared specimen ${specimenId} not found`);
    }

    const [patient, specimenTests] = await Promise.all([
      specimen.order?.patientId
        ? tx.patient.findUnique({
            where: {
              id: specimen.order.patientId,
            },
            select: STANDARD_PATIENT_SELECT,
          })
        : null,
      tx.labSpecimenTest.findMany({
        where: {
          tenantId,
          specimenId: specimen.id,
        },
        include: {
          labOrderTest: true,
        },
        orderBy: {
          createdAt: 'asc' as const,
        },
      }),
    ]);

    const patientDisplay = patient ? this.buildPatientDisplay(patient) : null;
    const testNames = specimenTests
      .map((link: any) => link.labOrderTest.testName)
      .filter((value: any): value is string => Boolean(value));
    const primaryTestLabel = testNames.slice(0, 2).join(', ');
    const extraCount = Math.max(testNames.length - 2, 0);
    const testsSummary = extraCount > 0 ? `${primaryTestLabel} +${extraCount} more` : primaryTestLabel;
    const patientName = patientDisplay?.displayName ?? 'Unknown patient';
    const patientMrn = patientDisplay?.mrn ?? '—';
    const specimenType = specimen.specimenType ?? 'Specimen';
    const barcode = specimen.barcode ?? this.generateBarcode();
    const prn = [
      '^XA',
      '^CF0,28',
      `^FO30,30^FD${patientName.slice(0, 32)}^FS`,
      `^FO30,65^FDMRN: ${patientMrn}^FS`,
      `^FO30,100^FD${specimenType.slice(0, 32)}^FS`,
      `^FO30,135^FD${testsSummary.slice(0, 40)}^FS`,
      '^BY2,3,70',
      '^FO30,180^BCN,70,Y,N,N',
      `^FD${barcode}^FS`,
      '^XZ',
    ].join('\n');

    return {
      specimenId: specimen.id,
      barcode,
      template: 'lab-specimen-zpl-v1',
      mimeType: 'application/octet-stream',
      fileName: `${barcode}.prn`,
      patientDisplay,
      specimenType,
      tests: specimenTests.map((link: any) => ({
        id: link.labOrderTest.id,
        testCode: link.labOrderTest.testCode,
        testName: link.labOrderTest.testName,
      })),
      prn,
    };
  }

  private async requireSpecimenTx(tx: TxClient, tenantId: string, specimenId: string) {
    const specimen = await tx.labSpecimen.findFirst({
      where: {
        tenantId,
        id: specimenId,
      },
    });

    if (!specimen) {
      throw new NotFoundException(`Lab specimen ${specimenId} not found`);
    }

    return specimen;
  }

  private ensureSpecimenActionable(specimen: { status: string }) {
    if (specimen.status === LabSpecimenStatus.REJECTED) {
      throw new BadRequestException('Rejected specimens cannot continue in operational workflow');
    }
  }

  private async recordEvent(
    tx: TxClient,
    tenantId: string,
    specimenId: string,
    eventType: string,
    performedBy: string | null | undefined,
    notes?: string | null,
    metadata?: Record<string, any>,
    eventTime?: Date,
  ) {
    await tx.labSpecimenEvent.create({
      data: {
        tenantId,
        specimenId,
        eventType,
        eventTime: eventTime ?? new Date(),
        performedBy: performedBy ?? null,
        notes: notes ?? null,
        ...(metadata !== undefined ? { metadata } : {}),
      },
    });
  }

  private generateBarcode() {
    return `SPM-${this.formatDateStamp(new Date())}-${Math.floor(100000 + Math.random() * 900000)}`;
  }

  private generateAccessionNumber() {
    return `ACC-${this.formatDateStamp(new Date())}-${Math.floor(100000 + Math.random() * 900000)}`;
  }

  private formatDateStamp(date: Date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }
}
