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
import { BedService } from './bed.service';
import { CreateBedDto } from './dto/create-bed.dto';
import { UpdateBedDto } from './dto/update-bed.dto';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { BED_MANAGE, BED_READ } from '@zeal/contracts';

@Controller('wards/:wardId/beds')
export class BedController {
  constructor(private readonly bedService: BedService) {}

  @Post()
  @Permissions(BED_MANAGE)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('wardId') wardId: string,
    @Body() createBedDto: CreateBedDto,
  ) {
    return this.bedService.create(wardId, createBedDto);
  }

  @Get()
  @Permissions(BED_READ)
  findAll(
    @Param('wardId') wardId: string,
    @Query('status') status?: string,
  ) {
    return this.bedService.findAll(wardId, status);
  }
}

// Standalone bed controller for direct access
@Controller('beds')
export class BedStandaloneController {
  constructor(private readonly bedService: BedService) {}

  @Get('all')
  @Permissions(BED_READ)
  findAll(
    @Query('wardId') wardId?: string,
    @Query('facilityId') facilityId?: string,
  ) {
    return this.bedService.findAllBeds(wardId, facilityId);
  }

  @Get('available')
  @Permissions(BED_READ)
  findAvailable(
    @Query('wardId') wardId?: string,
    @Query('bedType') bedType?: string,
    @Query('genderRestriction') genderRestriction?: string,
    @Query('requiresIsolation') requiresIsolation?: string,
  ) {
    const filters: any = {};
    if (bedType) filters.bedType = bedType;
    if (genderRestriction) filters.genderRestriction = genderRestriction;
    if (requiresIsolation !== undefined) filters.requiresIsolation = requiresIsolation === 'true';

    return this.bedService.findAvailable(wardId, filters);
  }

  @Get(':id')
  @Permissions(BED_READ)
  findOne(@Param('id') id: string) {
    return this.bedService.findOne(id);
  }

  @Patch(':id')
  @Permissions(BED_MANAGE)
  update(@Param('id') id: string, @Body() updateBedDto: UpdateBedDto) {
    return this.bedService.update(id, updateBedDto);
  }

  @Delete(':id')
  @Permissions(BED_MANAGE)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.bedService.remove(id);
  }

  @Post(':id/maintenance/start')
  @Permissions(BED_MANAGE)
  @HttpCode(HttpStatus.OK)
  startMaintenance(
    @Param('id') id: string,
    @Body() body: { notes?: string }
  ) {
    return this.bedService.startMaintenance(id, body.notes);
  }

  @Post(':id/maintenance/complete')
  @Permissions(BED_MANAGE)
  @HttpCode(HttpStatus.OK)
  completeMaintenance(@Param('id') id: string) {
    return this.bedService.completeMaintenance(id);
  }
}
