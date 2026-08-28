import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { RegistryLinkService } from './registry-link.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import {
  FACILITY_READ,
  FACILITY_UPDATE,
  STAFF_READ,
  STAFF_UPDATE,
} from '@zeal/contracts';
import type { JwtClaims } from '@zeal/contracts';

const REGISTRY_ID = /^[A-Za-z0-9-]{4,30}$/;

class LinkDto {
  @Matches(REGISTRY_ID)
  registryId!: string;
}

class SearchQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @Matches(REGISTRY_ID)
  registryId?: string;
}

interface AuthedRequest {
  user?: JwtClaims;
}

/**
 * National registry search/link for facilities and practitioners. Country- and
 * vendor-neutral: which registry answers depends on the tenant's capability
 * bindings (e.g. the India pack binds hfr/hpr).
 */
@Controller('registry')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RegistryLinkController {
  constructor(private readonly service: RegistryLinkService) {}

  @Get('facilities/search')
  @Permissions(FACILITY_READ)
  async searchFacilities(@Query() query: SearchQueryDto, @Req() req: AuthedRequest) {
    return {
      success: true,
      data: await this.service.searchFacilities(this.ctx(req), query),
    };
  }

  @Put('facilities/:facilityId/link')
  @Permissions(FACILITY_UPDATE)
  async linkFacility(
    @Param('facilityId') facilityId: string,
    @Body() dto: LinkDto,
    @Req() req: AuthedRequest,
  ) {
    return {
      success: true,
      data: await this.service.linkFacility(this.ctx(req), facilityId, dto.registryId),
    };
  }

  @Get('facilities/:facilityId/status')
  @Permissions(FACILITY_READ)
  async facilityStatus(@Param('facilityId') facilityId: string, @Req() req: AuthedRequest) {
    return { success: true, data: await this.service.facilityStatus(this.ctx(req), facilityId) };
  }

  @Get('practitioners/search')
  @Permissions(STAFF_READ)
  async searchPractitioners(@Query() query: SearchQueryDto, @Req() req: AuthedRequest) {
    return {
      success: true,
      data: await this.service.searchPractitioners(this.ctx(req), query),
    };
  }

  @Put('practitioners/:staffId/link')
  @Permissions(STAFF_UPDATE)
  async linkPractitioner(
    @Param('staffId') staffId: string,
    @Body() dto: LinkDto,
    @Req() req: AuthedRequest,
  ) {
    return {
      success: true,
      data: await this.service.linkPractitioner(this.ctx(req), staffId, dto.registryId),
    };
  }

  @Get('practitioners/:staffId/status')
  @Permissions(STAFF_READ)
  async practitionerStatus(@Param('staffId') staffId: string, @Req() req: AuthedRequest) {
    return {
      success: true,
      data: await this.service.practitionerStatus(this.ctx(req), staffId),
    };
  }

  private ctx(req: AuthedRequest) {
    // JwtClaims carries no facility claim in foundation tokens; facility
    // scope for registry lookups is tenant-wide here.
    return { tenantId: req.user?.tenantId ?? '' };
  }
}
