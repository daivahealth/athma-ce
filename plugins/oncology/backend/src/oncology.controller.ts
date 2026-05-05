import {
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Logger,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PluginController } from '@athma/plugin-sdk';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import { OncologyService } from './oncology.service';

@PluginController('oncology')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OncologyController {
  private readonly logger = new Logger(OncologyController.name);

  constructor(private readonly oncologyService: OncologyService) {}

  // ============================================
  // Cancer Diagnosis
  // ============================================

  @Get('diagnoses')
  @Permissions('oncology.diagnosis.read')
  async listDiagnoses(
    @Query('patientId') patientId?: string,
    @Query('clinicalStatus') clinicalStatus?: string,
    @Query('cancerType') cancerType?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.oncologyService.listCancerDiagnoses(
      { patientId, clinicalStatus, cancerType },
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
    return { success: true, ...result };
  }

  @Get('diagnoses/:id')
  @Permissions('oncology.diagnosis.read')
  async getDiagnosis(@Param('id') id: string) {
    return { success: true, data: await this.oncologyService.getCancerDiagnosis(id) };
  }

  @Post('diagnoses')
  @Permissions('oncology.diagnosis.write')
  @HttpCode(HttpStatus.CREATED)
  async createDiagnosis(@Body() body: Record<string, unknown>) {
    try {
      const data = await this.oncologyService.createCancerDiagnosis(body);
      return { success: true, data };
    } catch (err: unknown) {
      this.handleError('createDiagnosis', err);
    }
  }

  @Put('diagnoses/:id')
  @Permissions('oncology.diagnosis.write')
  async updateDiagnosis(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.updateCancerDiagnosis(id, body) };
  }

  // ============================================
  // Oncology Registry
  // ============================================

  @Get('registry')
  @Permissions('oncology.registry.read')
  async listRegistry(
    @Query('cancerType') cancerType?: string,
    @Query('clinicalStatus') clinicalStatus?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.oncologyService.listRegistry(
      { cancerType, clinicalStatus, search },
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
    return { success: true, ...result };
  }

  @Get('registry/:patientId/summary')
  @Permissions('oncology.registry.read')
  async getPatientSummary(@Param('patientId') patientId: string) {
    return { success: true, data: await this.oncologyService.getPatientCancerSummary(patientId) };
  }

  // ============================================
  // Oncology Care Plans
  // ============================================

  @Get('care-plans')
  @Permissions('oncology.care_plan.read')
  async listCarePlans(
    @Query('patientId') patientId?: string,
    @Query('status') status?: string,
    @Query('treatmentIntent') treatmentIntent?: string,
    @Query('cancerDiagnosisId') cancerDiagnosisId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.oncologyService.listCarePlans(
      { patientId, status, treatmentIntent, cancerDiagnosisId },
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
    return { success: true, ...result };
  }

  @Get('care-plans/:id')
  @Permissions('oncology.care_plan.read')
  async getCarePlan(@Param('id') id: string) {
    return { success: true, data: await this.oncologyService.getCarePlan(id) };
  }

  @Post('care-plans')
  @Permissions('oncology.care_plan.write')
  @HttpCode(HttpStatus.CREATED)
  async createCarePlan(@Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.createCarePlan(body) };
  }

  @Put('care-plans/:id')
  @Permissions('oncology.care_plan.write')
  async updateCarePlan(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.updateCarePlan(id, body) };
  }

  @Post('care-plans/:id/approve')
  @Permissions('oncology.care_plan.approve')
  async approveCarePlan(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.approveCarePlan(id, body.approvedBy as string) };
  }

  @Post('care-plans/:id/revise')
  @Permissions('oncology.care_plan.write')
  @HttpCode(HttpStatus.CREATED)
  async reviseCarePlan(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.reviseCarePlan(id, body) };
  }

  // ============================================
  // Tumor Staging
  // ============================================

  @Get('staging')
  @Permissions('oncology.staging.read')
  async listStagings(
    @Query('patientId') patientId?: string,
    @Query('cancerDiagnosisId') cancerDiagnosisId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.oncologyService.listStagings(
      { patientId, cancerDiagnosisId },
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
    return { success: true, ...result };
  }

  @Get('staging/:id')
  @Permissions('oncology.staging.read')
  async getStaging(@Param('id') id: string) {
    return { success: true, data: await this.oncologyService.getStaging(id) };
  }

  @Post('staging')
  @Permissions('oncology.staging.write')
  @HttpCode(HttpStatus.CREATED)
  async createStaging(@Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.createStaging(body) };
  }

  @Put('staging/:id')
  @Permissions('oncology.staging.write')
  async updateStaging(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.updateStaging(id, body) };
  }

  // ============================================
  // Tumor Board
  // ============================================

  @Get('tumor-board')
  @Permissions('oncology.tumor_board.read')
  async listTumorBoardCases(
    @Query('status') status?: string,
    @Query('date') date?: string,
    @Query('patientId') patientId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.oncologyService.listTumorBoardCases(
      { status, date, patientId },
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
    return { success: true, ...result };
  }

  @Get('tumor-board/:id')
  @Permissions('oncology.tumor_board.read')
  async getTumorBoardCase(@Param('id') id: string) {
    return { success: true, data: await this.oncologyService.getTumorBoardCase(id) };
  }

  @Post('tumor-board')
  @Permissions('oncology.tumor_board.manage')
  @HttpCode(HttpStatus.CREATED)
  async createTumorBoardCase(@Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.createTumorBoardCase(body) };
  }

  @Put('tumor-board/:id')
  @Permissions('oncology.tumor_board.manage')
  async updateTumorBoardCase(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.updateTumorBoardCase(id, body) };
  }

  // ============================================
  // Chemo Protocols (Phase 2 — kept for backward compat)
  // ============================================

  @Get('protocols')
  @Permissions('oncology.chemo_protocol.read')
  async listProtocols(
    @Query('cancerType') cancerType?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.oncologyService.listProtocols(
      cancerType,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
    return { success: true, ...result };
  }

  @Get('protocols/:id')
  @Permissions('oncology.chemo_protocol.read')
  async getProtocol(@Param('id') id: string) {
    return { success: true, data: await this.oncologyService.getProtocol(id) };
  }

  @Post('protocols')
  @Permissions('oncology.chemo_protocol.write')
  @HttpCode(HttpStatus.CREATED)
  async createProtocol(@Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.createProtocol(body) };
  }

  // ============================================
  // Chemo Orders (Phase 2 — kept for backward compat)
  // ============================================

  @Get('orders')
  @Permissions('oncology.chemo_order.read')
  async listChemoOrders(
    @Query('patientId') patientId?: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.oncologyService.listChemoOrders(
      { patientId, status, date },
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
    return { success: true, ...result };
  }

  @Post('orders')
  @Permissions('oncology.chemo_order.write')
  @HttpCode(HttpStatus.CREATED)
  async createChemoOrder(@Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.createChemoOrder(body) };
  }

  private handleError(method: string, err: unknown): never {
    if (err instanceof HttpException) throw err;
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    this.logger.error(`[oncology.${method}] ${message}`, stack);
    throw new InternalServerErrorException(message);
  }
}
