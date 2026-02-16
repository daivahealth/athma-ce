import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Headers,
    UseGuards,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MembershipSubscriptionService } from '../services/membership-subscription.service';
import {
    CreateMembershipSubscriptionDto,
    UpdateMembershipSubscriptionDto,
    MembershipSubscriptionResponseDto,
} from '../dto/membership-subscription.dto';
import { JwtAuthGuard, PermissionsGuard } from '@zeal/shared-utils';

@ApiTags('Membership Subscriptions')
@ApiBearerAuth()
@Controller('membership-subscriptions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MembershipSubscriptionController {
    constructor(private readonly membershipSubscriptionService: MembershipSubscriptionService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new membership subscription' })
    @ApiResponse({ status: 201, type: MembershipSubscriptionResponseDto })
    async create(
        @Headers('x-tenant-id') tenantId: string,
        @Headers('x-user-id') userId: string,
        @Body() dto: CreateMembershipSubscriptionDto,
    ) {
        return this.membershipSubscriptionService.create(tenantId, userId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'List all membership subscriptions' })
    @ApiQuery({ name: 'patientId', required: false })
    @ApiQuery({ name: 'status', required: false })
    @ApiResponse({ status: 200, type: [MembershipSubscriptionResponseDto] })
    async findAll(
        @Headers('x-tenant-id') tenantId: string,
        @Query('patientId') patientId?: string,
        @Query('status') status?: string,
    ) {
        return this.membershipSubscriptionService.findAll(tenantId, patientId, status);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get membership subscription by ID' })
    @ApiResponse({ status: 200, type: MembershipSubscriptionResponseDto })
    async findOne(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
        return this.membershipSubscriptionService.findOne(tenantId, id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a membership subscription' })
    @ApiResponse({ status: 200, type: MembershipSubscriptionResponseDto })
    async update(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
        @Body() dto: UpdateMembershipSubscriptionDto,
    ) {
        return this.membershipSubscriptionService.update(tenantId, id, dto);
    }

    @Patch(':id/cancel')
    @ApiOperation({ summary: 'Cancel a membership subscription' })
    @ApiResponse({ status: 200, type: MembershipSubscriptionResponseDto })
    async cancel(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
        return this.membershipSubscriptionService.cancel(tenantId, id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a membership subscription' })
    @ApiResponse({ status: 200 })
    async remove(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
        return this.membershipSubscriptionService.remove(tenantId, id);
    }
}
