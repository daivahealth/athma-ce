import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ValueSetService } from './valueset.service';
import { QueryValueSetDto, GetConceptsDto } from './dto/query-valueset.dto';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import { VALUESET_READ } from '@zeal/contracts';

@Controller('catalogs/valuesets')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ValueSetController {
  constructor(private readonly valueSetService: ValueSetService) {}

  /**
   * GET /api/v1/catalogs/valuesets
   * Get all valuesets with optional filtering
   */
  @Get()
  @Permissions(VALUESET_READ)
  async findAll(@Query() query: QueryValueSetDto) {
    return this.valueSetService.findAll(query);
  }

  /**
   * GET /api/v1/catalogs/valuesets/categories
   * Get all available categories
   */
  @Get('categories')
  @Permissions(VALUESET_READ)
  async getCategories() {
    return this.valueSetService.getCategories();
  }

  /**
   * GET /api/v1/catalogs/valuesets/search
   * Search concepts across valuesets
   */
  @Get('search')
  @Permissions(VALUESET_READ)
  async searchConcepts(
    @Query('q') searchTerm: string,
    @Query('valueSetCode') valueSetCode?: string,
    @Query('language') language?: string,
  ) {
    return this.valueSetService.searchConcepts(searchTerm, valueSetCode, language);
  }

  /**
   * GET /api/v1/catalogs/valuesets/:code
   * Get a specific valueset by code
   */
  @Get(':code')
  @Permissions(VALUESET_READ)
  async findOne(@Param('code') code: string) {
    return this.valueSetService.findOne(code);
  }

  /**
   * GET /api/v1/catalogs/valuesets/:code/concepts
   * Get concepts for a valueset with optional language and tenant overrides
   */
  @Get(':code/concepts')
  @Permissions(VALUESET_READ)
  async getConcepts(
    @Param('code') code: string,
    @Query() options: GetConceptsDto,
  ) {
    return this.valueSetService.getConcepts(code, options);
  }
}
