import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { BedSearchService } from './bed-search.service';
import { SearchBedsDto } from './dto/search-beds.dto';
import { ValidateBedDto } from './dto/validate-bed.dto';
import { Context } from '../../common/decorators/tenant-context.decorator';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import { BED_MANAGE } from '@zeal/contracts';

@Controller('beds')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class BedSearchController {
  constructor(private readonly bedSearchService: BedSearchService) {}

  /**
   * Search for available beds with filters
   * GET /api/v1/beds/search-available
   */
  @Get('search-available')
  @Permissions(BED_MANAGE)
  async searchAvailableBeds(
    @Query() searchDto: SearchBedsDto,
    @Context() context: any,
  ) {
    return this.bedSearchService.searchAvailableBeds(searchDto, context);
  }

  /**
   * Validate bed availability before assignment
   * POST /api/v1/beds/validate-availability
   */
  @Post('validate-availability')
  @Permissions(BED_MANAGE)
  @HttpCode(HttpStatus.OK)
  async validateBedAvailability(
    @Body() validateDto: ValidateBedDto,
    @Context() context: any,
  ) {
    return this.bedSearchService.validateBedAvailability(validateDto, context);
  }
}
