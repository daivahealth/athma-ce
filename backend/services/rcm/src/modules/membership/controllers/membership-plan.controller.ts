import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MembershipPlanService } from '../services/membership-plan.service';
import {
  CreateMembershipPlanDto,
  UpdateMembershipPlanDto,
  MembershipPlanResponseDto,
  MembershipPlanSummaryDto,
  MembershipTier,
} from '../dto/membership-plan.dto';
import { JwtAuthGuard, PermissionsGuard } from '@zeal/shared-utils';

@ApiTags('Membership Plans')
@ApiBearerAuth()
@Controller('membership/plans')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MembershipPlanController {
  constructor(private readonly planService: MembershipPlanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a membership plan' })
  @ApiResponse({ status: 201, type: MembershipPlanResponseDto })
  async create(
    @Headers('x-tenant-id') tenantId: string,
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateMembershipPlanDto,
  ) {
    return this.planService.create(tenantId, userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all membership plans' })
  @ApiQuery({ name: 'tier', required: false, enum: MembershipTier })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'isPublic', required: false, type: Boolean })
  @ApiQuery({ name: 'facilityId', required: false })
  @ApiResponse({ status: 200, type: [MembershipPlanResponseDto] })
  async findAll(
    @Headers('x-tenant-id') tenantId: string,
    @Query('tier') tier?: MembershipTier,
    @Query('isActive') isActive?: string,
    @Query('isPublic') isPublic?: string,
    @Query('facilityId') facilityId?: string,
  ) {
    return this.planService.findAll(tenantId, {
      tier,
      isActive: isActive === undefined ? undefined : isActive === 'true',
      isPublic: isPublic === undefined ? undefined : isPublic === 'true',
      facilityId,
    });
  }

  @Get('public')
  @ApiOperation({ summary: 'Get public membership plans (for patient-facing)' })
  @ApiQuery({ name: 'facilityId', required: false })
  @ApiResponse({ status: 200, type: [MembershipPlanSummaryDto] })
  async findPublicPlans(
    @Headers('x-tenant-id') tenantId: string,
    @Query('facilityId') facilityId?: string,
  ) {
    return this.planService.findPublicPlans(tenantId, facilityId);
  }

  @Get('compare')
  @ApiOperation({ summary: 'Compare multiple plans' })
  @ApiQuery({ name: 'planIds', required: true, isArray: true })
  async comparePlans(
    @Headers('x-tenant-id') tenantId: string,
    @Query('planIds') planIds: string[],
  ) {
    const ids = Array.isArray(planIds) ? planIds : [planIds];
    return this.planService.comparePlans(tenantId, ids);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a membership plan by ID' })
  @ApiResponse({ status: 200, type: MembershipPlanResponseDto })
  async findById(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.planService.findById(tenantId, id);
  }

  @Get(':id/statistics')
  @ApiOperation({ summary: 'Get plan statistics' })
  async getPlanStatistics(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.planService.getPlanStatistics(tenantId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a membership plan' })
  @ApiResponse({ status: 200, type: MembershipPlanResponseDto })
  async update(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateMembershipPlanDto,
  ) {
    return this.planService.update(tenantId, id, dto);
  }

  @Post(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a membership plan' })
  @ApiResponse({ status: 200, type: MembershipPlanResponseDto })
  async deactivate(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.planService.deactivate(tenantId, id);
  }

  @Post(':id/reactivate')
  @ApiOperation({ summary: 'Reactivate a membership plan' })
  @ApiResponse({ status: 200, type: MembershipPlanResponseDto })
  async reactivate(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.planService.reactivate(tenantId, id);
  }
}
