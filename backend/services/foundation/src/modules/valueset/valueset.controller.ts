import { Controller, Get, Param, Query } from '@nestjs/common';
import { ValueSetService } from './valueset.service';
import { QueryValueSetDto, GetConceptsDto } from './dto/query-valueset.dto';

@Controller('valuesets')
export class ValueSetController {
  constructor(private readonly valueSetService: ValueSetService) {}

  /**
   * GET /api/v1/valuesets
   * Get all valuesets with optional filtering
   */
  @Get()
  async findAll(@Query() query: QueryValueSetDto) {
    return this.valueSetService.findAll(query);
  }

  /**
   * GET /api/v1/valuesets/categories
   * Get all available categories
   */
  @Get('categories')
  async getCategories() {
    return this.valueSetService.getCategories();
  }

  /**
   * GET /api/v1/valuesets/search
   * Search concepts across valuesets
   */
  @Get('search')
  async searchConcepts(
    @Query('q') searchTerm: string,
    @Query('valueSetCode') valueSetCode?: string,
    @Query('language') language?: string,
  ) {
    return this.valueSetService.searchConcepts(searchTerm, valueSetCode, language);
  }

  /**
   * GET /api/v1/valuesets/:code
   * Get a specific valueset by code
   */
  @Get(':code')
  async findOne(@Param('code') code: string) {
    return this.valueSetService.findOne(code);
  }

  /**
   * GET /api/v1/valuesets/:code/concepts
   * Get concepts for a valueset with optional language and tenant overrides
   */
  @Get(':code/concepts')
  async getConcepts(
    @Param('code') code: string,
    @Query() options: GetConceptsDto,
  ) {
    return this.valueSetService.getConcepts(code, options);
  }
}
