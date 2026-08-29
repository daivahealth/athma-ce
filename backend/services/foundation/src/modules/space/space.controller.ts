import { Body, Controller, Delete, Get, Param, Post, Put, Query, BadRequestException } from '@nestjs/common';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { SPACE_MANAGE, SPACE_READ } from '@zeal/contracts';

@Controller('spaces')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Post()
  @Permissions(SPACE_MANAGE)
  create(@Body() dto: CreateSpaceDto) {
    return this.spaceService.create(dto);
  }

  @Get()
  @Permissions(SPACE_READ)
  list(@Query('facilityId') facilityId?: string) {
    if (!facilityId) {
      throw new BadRequestException('facilityId query parameter is required');
    }
    return this.spaceService.list(facilityId);
  }

  @Get(':id')
  @Permissions(SPACE_READ)
  get(@Param('id') id: string) {
    return this.spaceService.get(id);
  }

  @Put(':id')
  @Permissions(SPACE_MANAGE)
  update(@Param('id') id: string, @Body() dto: UpdateSpaceDto) {
    return this.spaceService.update(id, dto);
  }

  @Delete(':id')
  @Permissions(SPACE_MANAGE)
  remove(@Param('id') id: string) {
    return this.spaceService.archive(id);
  }
}
