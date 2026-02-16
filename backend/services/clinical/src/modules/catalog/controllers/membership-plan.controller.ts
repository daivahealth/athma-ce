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
import { MembershipPlanService } from '../services/membership-plan.service';
import {
    CreateMembershipPlanDto,
    UpdateMembershipPlanDto,
    MembershipPlanResponseDto,
} from '../dto/membership-plan.dto';
import { JwtAuthGuard, PermissionsGuard } from '@zeal/shared-utils';

@ApiTags('Membership Plans')
@ApiBearerAuth()
@Controller('membership-plans')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MembershipPlanController {
    constructor(private readonly membershipPlanService: MembershipPlanService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new membership plan' })
    @ApiResponse({ status: 201, type: MembershipPlanResponseDto })
    async create(
        @Headers('x-tenant-id') tenantId: string,
        @Headers('x-user-id') userId: string,
        @Body() dto: CreateMembershipPlanDto,
    ) {
        return this.membershipPlanService.create(tenantId, userId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'List all membership plans' })
    @ApiQuery({ name: 'isActive', required: false, type: Boolean })
    @ApiResponse({ status: 200, type: [MembershipPlanResponseDto] })
    async findAll(
        @Headers('x-tenant-id') tenantId: string,
        @Query('isActive') isActive?: boolean,
    ) {
        return this.membershipPlanService.findAll(tenantId, isActive);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get membership plan by ID' })
    @ApiResponse({ status: 200, type: MembershipPlanResponseDto })
    async findOne(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
        return this.membershipPlanService.findOne(tenantId, id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a membership plan' })
    @ApiResponse({ status: 200, type: MembershipPlanResponseDto })
    async update(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
        @Body() dto: UpdateMembershipPlanDto,
    ) {
        return this.membershipPlanService.update(tenantId, id, dto);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Toggle membership plan status' })
    @ApiResponse({ status: 200, type: MembershipPlanResponseDto })
    async toggleStatus(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
        return this.membershipPlanService.toggleStatus(tenantId, id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a membership plan' })
    @ApiResponse({ status: 200 })
    async remove(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
        return this.membershipPlanService.remove(tenantId, id);
    }
}
