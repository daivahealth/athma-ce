import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { CLINIC_MANAGE, CLINIC_READ } from '@zeal/contracts';

@Controller('departments/:departmentId/clinics')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @Post()
  @Permissions(CLINIC_MANAGE)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('departmentId') departmentId: string,
    @Body() createClinicDto: CreateClinicDto,
  ) {
    return this.clinicService.create(departmentId, createClinicDto);
  }

  @Get()
  @Permissions(CLINIC_READ)
  findAll(
    @Param('departmentId') departmentId: string,
    @Query('specialty') specialty?: string,
  ) {
    return this.clinicService.findAll(departmentId, specialty);
  }
}

// Standalone clinic controller for direct access
@Controller('clinics')
export class ClinicStandaloneController {
  constructor(private readonly clinicService: ClinicService) {}

  @Get(':id')
  @Permissions(CLINIC_READ)
  findOne(@Param('id') id: string) {
    return this.clinicService.findOne(id);
  }

  @Patch(':id')
  @Permissions(CLINIC_MANAGE)
  update(@Param('id') id: string, @Body() updateClinicDto: UpdateClinicDto) {
    return this.clinicService.update(id, updateClinicDto);
  }

  @Delete(':id')
  @Permissions(CLINIC_MANAGE)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.clinicService.remove(id);
  }
}
