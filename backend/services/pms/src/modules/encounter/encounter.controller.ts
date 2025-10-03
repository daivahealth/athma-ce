import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EncounterService } from './encounter.service';
import {
  CreateEncounterDto,
  UpdateEncounterDto,
  EncounterQueryDto,
  EncounterSearchDto,
  CreateClinicalNoteDto,
  UpdateClinicalNoteDto,
  CreateVitalsDto,
  CreateOrderDto,
} from './dto/encounter.dto';

@Controller('encounters')
export class EncounterController {
  constructor(private readonly encounterService: EncounterService) {}

  @Post()
  async createEncounter(@Body() createEncounterDto: CreateEncounterDto) {
    return this.encounterService.createEncounter(createEncounterDto);
  }

  @Get()
  async getEncounters(@Query() query: EncounterQueryDto) {
    return this.encounterService.getEncounters(query);
  }

  @Get('search')
  async searchEncounters(@Query() searchDto: EncounterSearchDto) {
    return this.encounterService.searchEncounters(searchDto);
  }

  @Get('stats')
  async getEncounterStats(@Query() query: Record<string, string>) {
    return this.encounterService.getEncounterStats(query);
  }

  @Get(':id')
  async getEncounter(@Param('id') id: string) {
    return this.encounterService.getEncounterById(id);
  }

  @Put(':id')
  async updateEncounter(
    @Param('id') id: string,
    @Body() updateEncounterDto: UpdateEncounterDto,
  ) {
    return this.encounterService.updateEncounter(id, updateEncounterDto);
  }

  @Delete(':id')
  async deleteEncounter(@Param('id') id: string) {
    await this.encounterService.deleteEncounter(id);
    return { message: 'Encounter deleted successfully' };
  }

  @Post(':id/start')
  async startEncounter(@Param('id') id: string) {
    return this.encounterService.startEncounter(id);
  }

  @Post(':id/complete')
  async completeEncounter(@Param('id') id: string) {
    return this.encounterService.completeEncounter(id);
  }

  @Post(':id/cancel')
  async cancelEncounter(
    @Param('id') id: string,
    @Body() body: { reason: string },
  ) {
    return this.encounterService.cancelEncounter(id, body.reason);
  }

  // Clinical Notes
  @Get(':id/notes')
  async getClinicalNotes(@Param('id') id: string) {
    return this.encounterService.getClinicalNotes(id);
  }

  @Post(':id/notes')
  async createClinicalNote(
    @Param('id') id: string,
    @Body() createNoteDto: Omit<CreateClinicalNoteDto, 'encounterId'>,
  ) {
    return this.encounterService.createClinicalNote({
      ...createNoteDto,
      encounterId: id,
    });
  }

  @Put('notes/:noteId')
  async updateClinicalNote(
    @Param('noteId') noteId: string,
    @Body() updateNoteDto: UpdateClinicalNoteDto,
  ) {
    return this.encounterService.updateClinicalNote(noteId, updateNoteDto);
  }

  @Delete('notes/:noteId')
  async deleteClinicalNote(@Param('noteId') noteId: string) {
    await this.encounterService.deleteClinicalNote(noteId);
    return { message: 'Clinical note deleted successfully' };
  }

  @Post('notes/:noteId/sign')
  async signClinicalNote(
    @Param('noteId') noteId: string,
    @Body() body: { signedBy: string },
  ) {
    return this.encounterService.signClinicalNote(noteId, body.signedBy);
  }

  // Vitals
  @Get(':id/vitals')
  async getVitals(@Param('id') id: string) {
    return this.encounterService.getVitals(id);
  }

  @Post(':id/vitals')
  async recordVitals(
    @Param('id') id: string,
    @Body() createVitalsDto: Omit<CreateVitalsDto, 'encounterId'>,
  ) {
    return this.encounterService.recordVitals({
      ...createVitalsDto,
      encounterId: id,
    });
  }

  @Put('vitals/:vitalId')
  async updateVitals(
    @Param('vitalId') vitalId: string,
    @Body() updates: any,
  ) {
    return this.encounterService.updateVitals(vitalId, updates);
  }

  // Orders
  @Get(':id/orders')
  async getOrders(@Param('id') id: string) {
    return this.encounterService.getOrders(id);
  }

  @Post(':id/orders')
  async createOrder(
    @Param('id') id: string,
    @Body() createOrderDto: Omit<CreateOrderDto, 'encounterId'>,
  ) {
    return this.encounterService.createOrder({
      ...createOrderDto,
      encounterId: id,
    });
  }

  @Put('orders/:orderId')
  async updateOrder(
    @Param('orderId') orderId: string,
    @Body() updates: any,
  ) {
    return this.encounterService.updateOrder(orderId, updates);
  }

  @Post('orders/:orderId/cancel')
  async cancelOrder(
    @Param('orderId') orderId: string,
    @Body() body: { reason: string },
  ) {
    return this.encounterService.cancelOrder(orderId, body.reason);
  }
}

