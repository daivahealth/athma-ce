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
  ) {
    return this.wardService.findAll(departmentId, wardType);
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
