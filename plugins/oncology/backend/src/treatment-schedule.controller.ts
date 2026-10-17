import { Body, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PluginController } from '@athma/plugin-sdk';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import { TreatmentScheduleService } from './treatment-schedule.service';

// Patient treatment schedules — guarded by the chemo order permissions.
@PluginController('oncology')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TreatmentScheduleController {
  constructor(private readonly schedule: TreatmentScheduleService) {}

  @Get('treatment-plans')
  @Permissions('oncology.chemo_order.read')
  async listPlans(
    @Query('patientId') patientId?: string,
    @Query('carePlanId') carePlanId?: string,
    @Query('cancerDiagnosisId') cancerDiagnosisId?: string,
    @Query('status') status?: string,
  ) {
    return { success: true, ...(await this.schedule.listPlans({ patientId, carePlanId, cancerDiagnosisId, status })) };
  }

  @Get('treatment-plans/:id')
  @Permissions('oncology.chemo_order.read')
  async getPlan(@Param('id') id: string) {
    return { success: true, data: await this.schedule.getPlan(id) };
  }

  @Post('treatment-plans')
  @Permissions('oncology.chemo_order.write')
  @HttpCode(HttpStatus.CREATED)
  async createPlan(@Body() body: Record<string, unknown>) {
    return { success: true, data: await this.schedule.createPlan(body) };
  }

  @Put('treatment-plans/:id')
  @Permissions('oncology.chemo_order.write')
  async updatePlan(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return { success: true, data: await this.schedule.updatePlan(id, body) };
  }

  @Post('treatment-plans/:id/cycles/:cycleNumber/delay')
  @Permissions('oncology.chemo_order.write')
  async delayCycle(
    @Param('id') id: string,
    @Param('cycleNumber', ParseIntPipe) cycleNumber: number,
    @Body() body: Record<string, unknown>,
  ) {
    return { success: true, data: await this.schedule.delayCycle(id, cycleNumber, body) };
  }

  @Put('treatment-plans/:id/cycles/:cycleNumber/dose-level')
  @Permissions('oncology.chemo_order.write')
  async setDoseLevel(
    @Param('id') id: string,
    @Param('cycleNumber', ParseIntPipe) cycleNumber: number,
    @Body() body: Record<string, unknown>,
  ) {
    return { success: true, data: await this.schedule.setCycleDoseLevel(id, cycleNumber, body) };
  }

  @Get('treatment-days')
  @Permissions('oncology.chemo_order.read')
  async listDays(
    @Query('date') date?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('status') status?: string,
  ) {
    return { success: true, ...(await this.schedule.listDays({ date, from, to, status })) };
  }

  @Put('treatment-days/:id')
  @Permissions('oncology.chemo_order.write')
  async updateDay(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return { success: true, data: await this.schedule.updateDay(id, body) };
  }

  @Post('treatment-days/:id/order')
  @Permissions('oncology.chemo_order.write')
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Param('id') id: string) {
    return { success: true, data: await this.schedule.createOrderForDay(id) };
  }
}
