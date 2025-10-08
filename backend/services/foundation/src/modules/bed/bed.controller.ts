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
import { AssignBedDto } from './dto/assign-bed.dto';
import { ReleaseBedDto } from './dto/release-bed.dto';

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
  findAvailable(@Query('wardId') wardId?: string) {
    return this.bedService.findAvailable(wardId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bedService.findOne(id);
  }

  @Post(':id/assign')
  @HttpCode(HttpStatus.OK)
  assignPatient(
    @Param('id') id: string,
    @Body() assignBedDto: AssignBedDto,
  ) {
    return this.bedService.assignPatient(id, assignBedDto);
  }

  @Post(':id/release')
  @HttpCode(HttpStatus.OK)
  releasePatient(
    @Param('id') id: string,
    @Body() releaseBedDto: ReleaseBedDto,
  ) {
    return this.bedService.releasePatient(id, releaseBedDto);
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
