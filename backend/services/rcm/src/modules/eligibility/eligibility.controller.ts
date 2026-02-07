import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { EligibilityService } from './eligibility.service';
import {
    CheckEligibilityDto,
    EligibilityFilterDto,
    EligibilityStatus,
} from './dto/eligibility.dto';

@ApiTags('Eligibility')
@Controller('eligibility')
@ApiHeader({ name: 'x-tenant-id', required: true })
export class EligibilityController {
    constructor(private readonly eligibilityService: EligibilityService) { }

    @Post('check')
    @ApiOperation({ summary: 'Check patient eligibility with payer' })
    async checkEligibility(
        @Headers('x-tenant-id') tenantId: string,
        @Headers('x-user-id') userId: string,
        @Body() dto: CheckEligibilityDto,
    ) {
        return this.eligibilityService.checkEligibility(tenantId, dto, userId);
    }

    @Get('requests')
    @ApiOperation({ summary: 'List eligibility requests' })
    @ApiQuery({ name: 'patientId', required: false })
    @ApiQuery({ name: 'payerId', required: false })
    @ApiQuery({ name: 'status', required: false, enum: EligibilityStatus })
    @ApiQuery({ name: 'dateFrom', required: false })
    @ApiQuery({ name: 'dateTo', required: false })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    async findAll(
        @Headers('x-tenant-id') tenantId: string,
        @Headers('authorization') authHeader: string,
        @Headers('x-facility-id') facilityId: string,
        @Headers('x-user-id') userId: string,
        @Query() filters: EligibilityFilterDto,
    ) {
        return this.eligibilityService.findAll(tenantId, filters, authHeader, facilityId, userId);
    }

    @Get('requests/:id')
    @ApiOperation({ summary: 'Get eligibility request by ID' })
    async findById(
        @Headers('x-tenant-id') tenantId: string,
        @Headers('authorization') authHeader: string,
        @Headers('x-facility-id') facilityId: string,
        @Headers('x-user-id') userId: string,
        @Param('id') id: string,
    ) {
        return this.eligibilityService.findById(tenantId, id, authHeader, facilityId, userId);
    }
}
