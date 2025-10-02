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
import { PatientService } from './patient.service';
import {
  CreatePatientDto,
  UpdatePatientDto,
  PatientQueryDto,
  PatientSearchDto,
} from './dto/patient.dto';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  async createPatient(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.createPatient(createPatientDto);
  }

  @Get()
  async getPatients(@Query() query: PatientQueryDto) {
    return this.patientService.getPatients(query);
  }

  @Get('search')
  async searchPatients(@Query() searchDto: PatientSearchDto) {
    return this.patientService.searchPatients(searchDto);
  }

  @Get(':id')
  async getPatient(@Param('id') id: string) {
    return this.patientService.getPatientById(id);
  }

  @Put(':id')
  async updatePatient(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.patientService.updatePatient(id, updatePatientDto);
  }

  @Delete(':id')
  async deletePatient(@Param('id') id: string) {
    return this.patientService.deletePatient(id);
  }

  @Get(':id/appointments')
  async getPatientAppointments(@Param('id') id: string, @Query() query: any) {
    return this.patientService.getPatientAppointments(id, query);
  }

  @Get(':id/encounters')
  async getPatientEncounters(@Param('id') id: string, @Query() query: any) {
    return this.patientService.getPatientEncounters(id, query);
  }

  @Get(':id/medical-history')
  async getPatientMedicalHistory(@Param('id') id: string) {
    return this.patientService.getPatientMedicalHistory(id);
  }

  @Post(':id/merge')
  async mergePatients(
    @Param('id') primaryPatientId: string,
    @Body() body: { secondaryPatientId: string },
  ) {
    return this.patientService.mergePatients(primaryPatientId, body.secondaryPatientId);
  }

  @Get(':id/duplicates')
  async findDuplicatePatients(@Param('id') id: string) {
    return this.patientService.findDuplicatePatients(id);
  }

  @Post(':id/consent')
  async updatePatientConsent(
    @Param('id') id: string,
    @Body() consentDto: any,
  ) {
    return this.patientService.updatePatientConsent(id, consentDto);
  }

  @Get(':id/translations')
  async getPatientTranslations(@Param('id') id: string) {
    return this.patientService.getPatientTranslations(id);
  }

  @Post(':id/translations')
  async updatePatientTranslations(
    @Param('id') id: string,
    @Body() translations: any,
  ) {
    return this.patientService.updatePatientTranslations(id, translations);
  }
}
