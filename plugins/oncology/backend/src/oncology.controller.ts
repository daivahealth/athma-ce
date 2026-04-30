import {
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PluginController } from '@athma/plugin-sdk';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import { OncologyService } from './oncology.service';

@PluginController('oncology')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OncologyController {
  constructor(private readonly oncologyService: OncologyService) {}

  // ============================================
  // Tumor Staging
  // ============================================

  @Get('staging')
  @Permissions('oncology.staging.read')
  async listStagings(
    @Query('patientId') patientId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.oncologyService.listStagings(
      patientId,
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

  // ============================================
  // Chemo Protocols
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
  // Chemo Orders
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

  // ============================================
  // Tumor Board
  // ============================================

  @Get('tumor-board')
  @Permissions('oncology.tumor_board.read')
  async listTumorBoardCases(
    @Query('status') status?: string,
    @Query('date') date?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.oncologyService.listTumorBoardCases(
      { status, date },
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
    return { success: true, ...result };
  }

  @Post('tumor-board')
  @Permissions('oncology.tumor_board.manage')
  @HttpCode(HttpStatus.CREATED)
  async createTumorBoardCase(@Body() body: Record<string, unknown>) {
    return { success: true, data: await this.oncologyService.createTumorBoardCase(body) };
  }
}
