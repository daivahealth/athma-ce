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
import { WardService } from './ward.service';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';

@Controller('departments/:departmentId/wards')
export class WardController {
  constructor(private readonly wardService: WardService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('departmentId') departmentId: string,
    @Body() createWardDto: CreateWardDto,
  ) {
    return this.wardService.create(departmentId, createWardDto);
  }

  @Get()
  findAll(
    @Param('departmentId') departmentId: string,
    @Query('type') wardType?: string,
    @Query('genderRestriction') genderRestriction?: string,
    @Query('specialtyId') specialtyId?: string,
  ) {
    const filters: any = {};
    if (wardType) filters.wardType = wardType;
    if (genderRestriction) filters.genderRestriction = genderRestriction;
    if (specialtyId) filters.specialtyId = specialtyId;

    return this.wardService.findAll(departmentId, filters);
  }
}

// Standalone ward controller for direct access
@Controller('wards')
export class WardStandaloneController {
  constructor(private readonly wardService: WardService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wardService.findOne(id);
  }

  @Get(':id/availability')
  getAvailability(@Param('id') id: string) {
    return this.wardService.getAvailability(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWardDto: UpdateWardDto) {
    return this.wardService.update(id, updateWardDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.wardService.remove(id);
  }
}

// Facility-level ward controller for getting all wards in a facility
@Controller('facilities')
export class FacilityWardController {
  constructor(private readonly wardService: WardService) {}

  @Get(':facilityId/wards')
  findAllByFacility(@Param('facilityId') facilityId: string) {
    return this.wardService.findAllByFacility(facilityId);
  }
}
