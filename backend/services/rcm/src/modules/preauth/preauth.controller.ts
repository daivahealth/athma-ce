import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiQuery } from '@nestjs/swagger';
import { PreAuthService } from './preauth.service';
import {
    CreatePreAuthDto,
    UpdatePreAuthDto,
    PreAuthFilterDto,
    PreAuthStatus,
} from './dto/preauth.dto';

@ApiTags('Prior Authorization')
@Controller('preauth')
@ApiHeader({ name: 'x-tenant-id', required: true })
export class PreAuthController {
    constructor(private readonly preAuthService: PreAuthService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new pre-authorization request' })
    async create(
        @Headers('x-tenant-id') tenantId: string,
        @Headers('x-user-id') userId: string,
        @Body() dto: CreatePreAuthDto,
    ) {
        return this.preAuthService.create(tenantId, dto, userId);
    }

    @Get()
    @ApiOperation({ summary: 'List pre-authorization requests' })
    @ApiQuery({ name: 'patientId', required: false })
    @ApiQuery({ name: 'payerId', required: false })
    @ApiQuery({ name: 'encounterId', required: false })
    @ApiQuery({ name: 'status', required: false, enum: PreAuthStatus })
    @ApiQuery({ name: 'dateFrom', required: false })
    @ApiQuery({ name: 'dateTo', required: false })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'offset', required: false, type: Number })
    async findAll(
        @Headers('x-tenant-id') tenantId: string,
        @Headers('authorization') authHeader: string,
        @Headers('x-facility-id') facilityId: string,
        @Headers('x-user-id') userId: string,
        @Query() filters: PreAuthFilterDto,
    ) {
        return this.preAuthService.findAll(tenantId, filters, authHeader, facilityId, userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get pre-authorization by ID' })
    async findById(
        @Headers('x-tenant-id') tenantId: string,
        @Headers('authorization') authHeader: string,
        @Headers('x-facility-id') facilityId: string,
        @Headers('x-user-id') userId: string,
        @Param('id') id: string,
    ) {
        return this.preAuthService.findById(tenantId, id, authHeader, facilityId, userId);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update pre-authorization' })
    async update(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
        @Body() dto: UpdatePreAuthDto,
    ) {
        return this.preAuthService.update(tenantId, id, dto);
    }

    @Post(':id/submit')
    @ApiOperation({ summary: 'Submit pre-authorization to payer' })
    async submit(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
    ) {
        return this.preAuthService.submit(tenantId, id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Cancel pre-authorization request' })
    async cancel(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
    ) {
        return this.preAuthService.cancel(tenantId, id);
    }
}
