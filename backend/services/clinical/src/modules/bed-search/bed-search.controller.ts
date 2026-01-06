import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { BedSearchService } from './bed-search.service';
import { SearchBedsDto } from './dto/search-beds.dto';
import { ValidateBedDto } from './dto/validate-bed.dto';
import { Context } from '../../common/decorators/tenant-context.decorator';

@Controller('beds')
export class BedSearchController {
  constructor(private readonly bedSearchService: BedSearchService) {}

  /**
   * Search for available beds with filters
   * GET /api/v1/beds/search-available
   */
  @Get('search-available')
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
  @HttpCode(HttpStatus.OK)
  async validateBedAvailability(
    @Body() validateDto: ValidateBedDto,
    @Context() context: any,
  ) {
    return this.bedSearchService.validateBedAvailability(validateDto, context);
  }
}
