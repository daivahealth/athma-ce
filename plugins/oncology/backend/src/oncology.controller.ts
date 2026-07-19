import {
  Get,
  Post,
  Put,
  Delete,
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

  @Get('registry/:patientId/labs')
  @Permissions('oncology.registry.read')
  async getRelevantLabs(@Param('patientId') patientId: string) {
    return { success: true, data: await this.oncologyService.getRelevantLabs(patientId) };
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

  @Put('protocols/:id')
  @Permissions('oncology.chemo_protocol.write')
  async updateProtocol(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.updateProtocol(id, body) };
  }

  @Put('protocols/:id/deactivate')
  @Permissions('oncology.chemo_protocol.write')
  async deactivateProtocol(@Param('id') id: string) {
    return { success: true, data: await this.oncologyService.deactivateProtocol(id) };
  }

  // ============================================
  // Chemo Orders
  // ============================================

  @Get('orders')
  @Permissions('oncology.chemo_order.read')
  async listChemoOrders(
    @Query('patientId') patientId?: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
    @Query('cancerDiagnosisId') cancerDiagnosisId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.oncologyService.listChemoOrders(
      {
        ...(patientId !== undefined && { patientId }),
        ...(status !== undefined && { status }),
        ...(date !== undefined && { date }),
        ...(cancerDiagnosisId !== undefined && { cancerDiagnosisId }),
      },
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
    return { success: true, ...result };
  }

  @Get('orders/:id')
  @Permissions('oncology.chemo_order.read')
  async getChemoOrder(@Param('id') id: string) {
    return { success: true, data: await this.oncologyService.getChemoOrder(id) };
  }

  @Post('orders')
  @Permissions('oncology.chemo_order.write')
  @HttpCode(HttpStatus.CREATED)
  async createChemoOrder(@Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.createChemoOrder(body) };
  }

  @Put('orders/:id')
  @Permissions('oncology.chemo_order.write')
  async updateChemoOrder(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.updateChemoOrder(id, body) };
  }

  @Post('orders/:id/approve')
  @Permissions('oncology.chemo_order.approve')
  async approveChemoOrder(@Param('id') id: string) {
    return { success: true, data: await this.oncologyService.approveChemoOrder(id) };
  }

  @Post('orders/:id/verify')
  @Permissions('oncology.chemo_order.verify')
  async verifyChemoOrder(@Param('id') id: string, @Body() body: { secondVerifiedBy?: string; nurseVerificationChecklist?: Record<string, unknown>; drugPreparationDetails?: unknown[] }) {
    return { success: true, data: await this.oncologyService.verifyChemoOrder(id, body.secondVerifiedBy, body.nurseVerificationChecklist, body.drugPreparationDetails) };
  }

  @Post('orders/:id/progress')
  @Permissions('oncology.chemo_order.administer')
  async updateAdministrationProgress(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.updateAdministrationProgress(id, body) };
  }

  @Post('orders/:id/start')
  @Permissions('oncology.chemo_order.administer')
  async startAdministration(@Param('id') id: string) {
    return { success: true, data: await this.oncologyService.startAdministration(id) };
  }

  @Post('orders/:id/complete')
  @Permissions('oncology.chemo_order.administer')
  async completeAdministration(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.completeAdministration(id, body) };
  }

  @Post('orders/:id/hold')
  @Permissions('oncology.chemo_order.write')
  async holdChemoOrder(@Param('id') id: string, @Body() body: { reason?: string }) {
    return { success: true, data: await this.oncologyService.holdChemoOrder(id, body.reason ?? '') };
  }

  @Post('orders/:id/cancel')
  @Permissions('oncology.chemo_order.write')
  async cancelChemoOrder(@Param('id') id: string, @Body() body: { reason?: string }) {
    return { success: true, data: await this.oncologyService.cancelChemoOrder(id, body.reason ?? '') };
  }

  // ============================================
  // Catalog: Cancer Types
  // ============================================

  @Get('catalogs/cancer-types')
  @Permissions('oncology.catalog.read')
  async listCancerTypes(
    @Query('search') search?: string,
    @Query('active') active?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.oncologyService.listCancerTypes(
      { ...(search !== undefined && { search }), ...(active !== undefined && { active }) },
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 50,
    );
    return { success: true, ...result };
  }

  @Get('catalogs/cancer-types/:id')
  @Permissions('oncology.catalog.read')
  async getCancerType(@Param('id') id: string) {
    return { success: true, data: await this.oncologyService.getCancerType(id) };
  }

  @Post('catalogs/cancer-types')
  @Permissions('oncology.catalog.write')
  @HttpCode(HttpStatus.CREATED)
  async createCancerType(@Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.createCancerType(body) };
  }

  @Put('catalogs/cancer-types/:id')
  @Permissions('oncology.catalog.write')
  async updateCancerType(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.updateCancerType(id, body) };
  }

  // ============================================
  // Catalog: Primary Sites
  // ============================================

  @Get('catalogs/primary-sites')
  @Permissions('oncology.catalog.read')
  async listPrimarySites(
    @Query('search') search?: string,
    @Query('bodySystem') bodySystem?: string,
    @Query('active') active?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.oncologyService.listPrimarySites(
      {
        ...(search !== undefined && { search }),
        ...(bodySystem !== undefined && { bodySystem }),
        ...(active !== undefined && { active }),
      },
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 50,
    );
    return { success: true, ...result };
  }

  @Get('catalogs/primary-sites/:id')
  @Permissions('oncology.catalog.read')
  async getPrimarySite(@Param('id') id: string) {
    return { success: true, data: await this.oncologyService.getPrimarySite(id) };
  }

  @Post('catalogs/primary-sites')
  @Permissions('oncology.catalog.write')
  @HttpCode(HttpStatus.CREATED)
  async createPrimarySite(@Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.createPrimarySite(body) };
  }

  @Put('catalogs/primary-sites/:id')
  @Permissions('oncology.catalog.write')
  async updatePrimarySite(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.updatePrimarySite(id, body) };
  }

  // ============================================
  // Catalog: Cancer Type ↔ Site Mappings
  // ============================================

  @Get('catalogs/site-mappings')
  @Permissions('oncology.catalog.read')
  async listSiteMappings(
    @Query('cancerTypeId') cancerTypeId?: string,
    @Query('primarySiteId') primarySiteId?: string,
    @Query('active') active?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.oncologyService.listSiteMappings(
      {
        ...(cancerTypeId !== undefined && { cancerTypeId }),
        ...(primarySiteId !== undefined && { primarySiteId }),
        ...(active !== undefined && { active }),
      },
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 100,
    );
    return { success: true, ...result };
  }

  @Post('catalogs/site-mappings')
  @Permissions('oncology.catalog.write')
  @HttpCode(HttpStatus.CREATED)
  async createSiteMapping(@Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.createSiteMapping(body) };
  }

  @Put('catalogs/site-mappings/:id')
  @Permissions('oncology.catalog.write')
  async updateSiteMapping(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.updateSiteMapping(id, body) };
  }

  @Put('catalogs/site-mappings/:id/delete')
  @Permissions('oncology.catalog.write')
  async deleteSiteMapping(@Param('id') id: string) {
    return { success: true, data: await this.oncologyService.deleteSiteMapping(id) };
  }

  // ============================================
  // Catalog: Histologies
  // ============================================

  @Get('catalogs/histologies')
  @Permissions('oncology.catalog.read')
  async listHistologies(
    @Query('search') search?: string,
    @Query('behaviorCode') behaviorCode?: string,
    @Query('active') active?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.oncologyService.listHistologies(
      {
        ...(search !== undefined && { search }),
        ...(behaviorCode !== undefined && { behaviorCode }),
        ...(active !== undefined && { active }),
      },
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 50,
    );
    return { success: true, ...result };
  }

  @Get('catalogs/histologies/:id')
  @Permissions('oncology.catalog.read')
  async getHistology(@Param('id') id: string) {
    return { success: true, data: await this.oncologyService.getHistology(id) };
  }

  @Post('catalogs/histologies')
  @Permissions('oncology.catalog.write')
  @HttpCode(HttpStatus.CREATED)
  async createHistology(@Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.createHistology(body) };
  }

  @Put('catalogs/histologies/:id')
  @Permissions('oncology.catalog.write')
  async updateHistology(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.updateHistology(id, body) };
  }

  // ============================================
  // Radiation Oncology — Prescriptions
  // ============================================

  @Get('radiation/prescriptions')
  @Permissions('oncology.radiation.read')
  async listRadiationPrescriptions(
    @Query('patientId') patientId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.oncologyService.listRadiationPrescriptions(
      {
        ...(patientId !== undefined && { patientId }),
        ...(status !== undefined && { status }),
      },
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
    return { success: true, ...result };
  }

  @Get('radiation/prescriptions/:id')
  @Permissions('oncology.radiation.read')
  async getRadiationPrescription(@Param('id') id: string) {
    return { success: true, data: await this.oncologyService.getRadiationPrescription(id) };
  }

  @Post('radiation/prescriptions')
  @Permissions('oncology.radiation.write')
  @HttpCode(HttpStatus.CREATED)
  async createRadiationPrescription(@Body() body: Record<string, unknown>) {
    try {
      return { success: true, data: await this.oncologyService.createRadiationPrescription(body) };
    } catch (err: unknown) { this.handleError('createRadiationPrescription', err); }
  }

  @Put('radiation/prescriptions/:id')
  @Permissions('oncology.radiation.write')
  async updateRadiationPrescription(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.updateRadiationPrescription(id, body) };
  }

  @Post('radiation/prescriptions/:id/approve')
  @Permissions('oncology.radiation.approve')
  async approveRadiationPrescription(@Param('id') id: string) {
    try {
      return { success: true, data: await this.oncologyService.approveRadiationPrescription(id) };
    } catch (err: unknown) { this.handleError('approveRadiationPrescription', err); }
  }

  @Post('radiation/prescriptions/:id/activate')
  @Permissions('oncology.radiation.write')
  async activateRadiationPrescription(@Param('id') id: string) {
    try {
      return { success: true, data: await this.oncologyService.activateRadiationPrescription(id) };
    } catch (err: unknown) { this.handleError('activateRadiationPrescription', err); }
  }

  // ============================================
  // Radiation Oncology — Simulations
  // ============================================

  @Get('radiation/prescriptions/:prescriptionId/simulations')
  @Permissions('oncology.radiation.read')
  async listRadiationSimulations(
    @Param('prescriptionId') prescriptionId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return { success: true, ...(await this.oncologyService.listRadiationSimulations(
      prescriptionId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    )) };
  }

  @Get('radiation/simulations/:id')
  @Permissions('oncology.radiation.read')
  async getRadiationSimulation(@Param('id') id: string) {
    return { success: true, data: await this.oncologyService.getRadiationSimulation(id) };
  }

  @Post('radiation/simulations')
  @Permissions('oncology.radiation.write')
  @HttpCode(HttpStatus.CREATED)
  async createRadiationSimulation(@Body() body: Record<string, unknown>) {
    try {
      return { success: true, data: await this.oncologyService.createRadiationSimulation(body) };
    } catch (err: unknown) { this.handleError('createRadiationSimulation', err); }
  }

  @Put('radiation/simulations/:id')
  @Permissions('oncology.radiation.write')
  async updateRadiationSimulation(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.updateRadiationSimulation(id, body) };
  }

  // ============================================
  // Radiation Oncology — Treatment Plans
  // ============================================

  @Get('radiation/plans')
  @Permissions('oncology.radiation.read')
  async listRadiationPlans(
    @Query('prescriptionId') prescriptionId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return { success: true, ...(await this.oncologyService.listRadiationPlans(
      {
        ...(prescriptionId !== undefined && { prescriptionId }),
        ...(status !== undefined && { status }),
      },
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    )) };
  }

  @Get('radiation/plans/:id')
  @Permissions('oncology.radiation.read')
  async getRadiationPlan(@Param('id') id: string) {
    return { success: true, data: await this.oncologyService.getRadiationPlan(id) };
  }

  @Post('radiation/plans')
  @Permissions('oncology.radiation.write')
  @HttpCode(HttpStatus.CREATED)
  async createRadiationPlan(@Body() body: Record<string, unknown>) {
    try {
      return { success: true, data: await this.oncologyService.createRadiationPlan(body) };
    } catch (err: unknown) { this.handleError('createRadiationPlan', err); }
  }

  @Put('radiation/plans/:id')
  @Permissions('oncology.radiation.write')
  async updateRadiationPlan(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.updateRadiationPlan(id, body) };
  }

  @Post('radiation/plans/:id/approve')
  @Permissions('oncology.radiation.approve')
  async approveRadiationPlan(@Param('id') id: string) {
    try {
      return { success: true, data: await this.oncologyService.approveRadiationPlan(id) };
    } catch (err: unknown) { this.handleError('approveRadiationPlan', err); }
  }

  // ============================================
  // Radiation Oncology — Fractions
  // ============================================

  @Get('radiation/plans/:planId/fractions')
  @Permissions('oncology.radiation.read')
  async listRadiationFractions(@Param('planId') planId: string) {
    return { success: true, ...(await this.oncologyService.listRadiationFractions(planId)) };
  }

  @Post('radiation/plans/:planId/fractions/bulk')
  @Permissions('oncology.radiation.write')
  @HttpCode(HttpStatus.CREATED)
  async bulkCreateFractions(@Param('planId') planId: string, @Body() body: Record<string, unknown>) {
    try {
      const data = await this.oncologyService.bulkCreateFractions({ ...body, treatmentPlanId: planId });
      return { success: true, data };
    } catch (err: unknown) { this.handleError('bulkCreateFractions', err); }
  }

  @Put('radiation/fractions/:id')
  @Permissions('oncology.radiation.write')
  async updateRadiationFraction(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.updateRadiationFraction(id, body) };
  }

  @Post('radiation/fractions/:id/deliver')
  @Permissions('oncology.radiation.deliver')
  async deliverFraction(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    try {
      return { success: true, data: await this.oncologyService.deliverFraction(id, body) };
    } catch (err: unknown) { this.handleError('deliverFraction', err); }
  }

  // ============================================
  // Radiation Oncology — On-Treatment Reviews
  // ============================================

  @Get('radiation/prescriptions/:prescriptionId/reviews')
  @Permissions('oncology.radiation.read')
  async listOnTreatmentReviews(
    @Param('prescriptionId') prescriptionId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return { success: true, ...(await this.oncologyService.listOnTreatmentReviews(
      prescriptionId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 50,
    )) };
  }

  @Get('radiation/reviews/:id')
  @Permissions('oncology.radiation.read')
  async getOnTreatmentReview(@Param('id') id: string) {
    return { success: true, data: await this.oncologyService.getOnTreatmentReview(id) };
  }

  @Post('radiation/reviews')
  @Permissions('oncology.radiation.write')
  @HttpCode(HttpStatus.CREATED)
  async createOnTreatmentReview(@Body() body: Record<string, unknown>) {
    try {
      return { success: true, data: await this.oncologyService.createOnTreatmentReview(body) };
    } catch (err: unknown) { this.handleError('createOnTreatmentReview', err); }
  }

  @Put('radiation/reviews/:id')
  @Permissions('oncology.radiation.write')
  async updateOnTreatmentReview(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.updateOnTreatmentReview(id, body) };
  }

  // ============================================
  // Radiation Oncology — Completion Summary
  // ============================================

  @Get('radiation/prescriptions/:prescriptionId/completion')
  @Permissions('oncology.radiation.read')
  async getCompletionSummary(@Param('prescriptionId') prescriptionId: string) {
    return { success: true, data: await this.oncologyService.getCompletionSummary(prescriptionId) };
  }

  @Post('radiation/completions')
  @Permissions('oncology.radiation.write')
  @HttpCode(HttpStatus.CREATED)
  async createCompletionSummary(@Body() body: Record<string, unknown>) {
    try {
      return { success: true, data: await this.oncologyService.createCompletionSummary(body) };
    } catch (err: unknown) { this.handleError('createCompletionSummary', err); }
  }

  // ============================================
  // Cancer Patient Timeline
  // ============================================

  @Get('timeline/:patientId')
  @Permissions('oncology.diagnosis.read')
  async listTimeline(
    @Param('patientId') patientId: string,
    @Query('eventType') eventType?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('cancerDiagnosisId') cancerDiagnosisId?: string,
  ) {
    const filters: { eventType?: string; fromDate?: string; toDate?: string; cancerDiagnosisId?: string } = {};
    if (eventType !== undefined) filters.eventType = eventType;
    if (fromDate !== undefined) filters.fromDate = fromDate;
    if (toDate !== undefined) filters.toDate = toDate;
    if (cancerDiagnosisId !== undefined) filters.cancerDiagnosisId = cancerDiagnosisId;
    return { success: true, ...(await this.oncologyService.listTimeline(patientId, filters)) };
  }

  @Post('timeline')
  @Permissions('oncology.diagnosis.write')
  @HttpCode(HttpStatus.CREATED)
  async createCustomTimelineEvent(@Body() body: Record<string, unknown>) {
    try {
      return { success: true, data: await this.oncologyService.createCustomTimelineEvent(body) };
    } catch (err: unknown) { this.handleError('createCustomTimelineEvent', err); }
  }

  @Delete('timeline/:id')
  @Permissions('oncology.diagnosis.write')
  async deleteTimelineEvent(@Param('id') id: string) {
    try {
      return { success: true, data: await this.oncologyService.deleteTimelineEvent(id) };
    } catch (err: unknown) { this.handleError('deleteTimelineEvent', err); }
  }

  private handleError(method: string, err: unknown): never {
    if (err instanceof HttpException) throw err;
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    this.logger.error(`[oncology.${method}] ${message}`, stack);
    throw new InternalServerErrorException(message);
  }
}
