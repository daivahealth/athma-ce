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
import { PrismaService } from '@zeal/shared-database';
import {
  CreatePatientDto,
  UpdatePatientDto,
  PatientQueryDto,
  PatientSearchDto,
} from './dto/patient.dto';

@Controller('patients')
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
    private readonly prisma: PrismaService
  ) {}

  @Post()
  async createPatient(@Body() createPatientDto: any) {
    console.log('Controller received patient data:', JSON.stringify(createPatientDto, null, 2));
    console.log('createPatientDto type:', typeof createPatientDto);
    
    try {
      const result = await this.patientService.createPatient(createPatientDto);
      console.log('Controller success, returning:', result?.id);
      return result;
    } catch (error: any) {
      console.error('Controller error:', {
        message: error.message,
        stack: error.stack,
        input: createPatientDto,
      });
      throw error;
    }
  }

  @Get()
  async getPatients() {
    try {
      const query: PatientQueryDto = {
        page: 1,
        limit: 10,
        sortBy: 'lastName' as const,
        sortOrder: 'asc' as const,
      };
      console.log('Calling patientService.getPatients with:', query);
      const result = await this.patientService.getPatients(query);
      console.log('Service returned:', result);
      return result;
    } catch (error: any) {
      console.error('Error in getPatients controller:', error);
      return {
        statusCode: 500,
        message: 'Internal server error',
        error: error.message,
        stack: error.stack
      };
    }
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
  async getPatientAppointments(@Param('id') id: string, @Query() query: Record<string, string>) {
    return this.patientService.getPatientAppointments(id, query);
  }

  @Get(':id/encounters')
  async getPatientEncounters(@Param('id') id: string, @Query() query: Record<string, string>) {
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
