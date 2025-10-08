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

@Controller('departments/:departmentId/clinics')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('departmentId') departmentId: string,
    @Body() createClinicDto: CreateClinicDto,
  ) {
    return this.clinicService.create(departmentId, createClinicDto);
  }

  @Get()
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
  findOne(@Param('id') id: string) {
    return this.clinicService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClinicDto: UpdateClinicDto) {
    return this.clinicService.update(id, updateClinicDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.clinicService.remove(id);
  }
}
