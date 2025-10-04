import { Body, Controller, Delete, Get, Param, Post, Put, Query, BadRequestException } from '@nestjs/common';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';

@Controller('spaces')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Post()
  create(@Body() dto: CreateSpaceDto) {
    return this.spaceService.create(dto);
  }

  @Get()
  list(@Query('facilityId') facilityId?: string) {
    if (!facilityId) {
      throw new BadRequestException('facilityId query parameter is required');
    }
    return this.spaceService.list(facilityId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.spaceService.get(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSpaceDto) {
    return this.spaceService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.spaceService.archive(id);
  }
}
