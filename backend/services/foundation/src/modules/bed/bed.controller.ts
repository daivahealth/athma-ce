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

@Controller('wards/:wardId/beds')
export class BedController {
  constructor(private readonly bedService: BedService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('wardId') wardId: string,
    @Body() createBedDto: CreateBedDto,
  ) {
    return this.bedService.create(wardId, createBedDto);
  }

  @Get()
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

  @Get('available')
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
  findOne(@Param('id') id: string) {
    return this.bedService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBedDto: UpdateBedDto) {
    return this.bedService.update(id, updateBedDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.bedService.remove(id);
  }
}
