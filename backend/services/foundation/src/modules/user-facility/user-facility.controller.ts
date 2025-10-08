import { Body, Controller, Delete, Get, Param, Post, Request, Headers } from '@nestjs/common';
import { UserFacilityService } from './user-facility.service';
import { AssignFacilityDto } from './dto/assign-facility.dto';
import { SetDefaultFacilityDto } from './dto/set-default-facility.dto';

@Controller('users/:userId/facilities')
export class UserFacilityController {
  constructor(private readonly userFacilityService: UserFacilityService) {}

  @Get()
  getUserFacilities(
    @Param('userId') userId: string,
    @Headers('x-tenant-id') tenantId?: string,
  ) {
    // User-level operation: tenantId can be provided via header for validation
    return this.userFacilityService.getUserFacilities(userId);
  }

  @Post('assign')
  assignFacility(@Param('userId') userId: string, @Body() dto: AssignFacilityDto, @Request() req: any) {
    // TODO: Get grantedBy from authenticated user in request
    const grantedBy = req.user?.userId;
    return this.userFacilityService.assignFacility(userId, dto, grantedBy);
  }

  @Post('set-default')
  setDefaultFacility(@Param('userId') userId: string, @Body() dto: SetDefaultFacilityDto) {
    return this.userFacilityService.setDefaultFacility(userId, dto);
  }

  @Delete(':facilityId')
  revokeFacility(@Param('userId') userId: string, @Param('facilityId') facilityId: string) {
    return this.userFacilityService.revokeFacility(userId, facilityId);
  }

  @Get('check/:facilityId')
  async checkAccess(@Param('userId') userId: string, @Param('facilityId') facilityId: string) {
    const hasAccess = await this.userFacilityService.hasAccessToFacility(userId, facilityId);
    return {
      userId,
      facilityId,
      hasAccess,
    };
  }
}

@Controller('facilities/:facilityId/users')
export class FacilityUsersController {
  constructor(private readonly userFacilityService: UserFacilityService) {}

  @Get()
  getFacilityUsers(@Param('facilityId') facilityId: string) {
    return this.userFacilityService.getFacilityUsers(facilityId);
  }
}

