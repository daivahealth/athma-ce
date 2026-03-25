import { Controller, Post, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CohortQueryService } from './cohort-query.service';
import { CohortQueryDto } from './dto/cohort-query.dto';

@ApiTags('Cohort Query')
@ApiBearerAuth()
@Controller('cohort-query')
export class CohortQueryController {
  constructor(private readonly cohortQueryService: CohortQueryService) {}

  @Post()
  @ApiOperation({
    summary: 'Execute a clinical cohort query',
    description:
      'Query patients matching combinations of coding criteria (diagnoses, history) ' +
      'and observation criteria (vitals, lab results). ' +
      'Example: Find all diabetic patients (E11%) with systolic BP > 120.',
  })
  async execute(
    @Headers('x-tenant-id') tenantId: string,
    @Body() dto: CohortQueryDto,
  ) {
    return this.cohortQueryService.execute(tenantId, dto);
  }
}
