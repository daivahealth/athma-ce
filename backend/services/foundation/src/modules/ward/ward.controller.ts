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
import { Permissions } from '../auth/decorators/permissions.decorator';
import { WARD_MANAGE, WARD_READ } from '@zeal/contracts';

@Controller('departments/:departmentId/wards')
export class WardController {
  constructor(private readonly wardService: WardService) {}

  @Post()
  @Permissions(WARD_MANAGE)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('departmentId') departmentId: string,
    @Body() createWardDto: CreateWardDto,
  ) {
    return this.wardService.create(departmentId, createWardDto);
  }

  @Get()
  @Permissions(WARD_READ)
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
  @Permissions(WARD_READ)
  findOne(@Param('id') id: string) {
    return this.wardService.findOne(id);
  }

  @Get(':id/availability')
  @Permissions(WARD_READ)
  getAvailability(@Param('id') id: string) {
    return this.wardService.getAvailability(id);
  }

  @Patch(':id')
  @Permissions(WARD_MANAGE)
  update(@Param('id') id: string, @Body() updateWardDto: UpdateWardDto) {
    return this.wardService.update(id, updateWardDto);
  }

  @Delete(':id')
  @Permissions(WARD_MANAGE)
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
  @Permissions(WARD_READ)
  findAllByFacility(@Param('facilityId') facilityId: string) {
    return this.wardService.findAllByFacility(facilityId);
  }
}
