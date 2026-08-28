import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';
import { CountryPackService } from './country-pack.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { TENANT_READ, TENANT_UPDATE } from '@zeal/contracts';
import type { JwtClaims } from '@zeal/contracts';

class ApplyCountryPackDto {
  @IsString()
  @Matches(/^[a-z]{2,10}$/i)
  country!: string;

  /** Overwrite tenant config the tenant has already customized. */
  @IsOptional()
  @IsBoolean()
  force?: boolean;
}

@Controller('country-packs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CountryPackController {
  constructor(private readonly countryPackService: CountryPackService) {}

  @Get()
  @Permissions(TENANT_READ)
  list() {
    return { success: true, data: this.countryPackService.listPacks() };
  }

  @Post('tenant/:tenantId/apply')
  @Permissions(TENANT_UPDATE)
  async apply(
    @Param('tenantId') tenantId: string,
    @Body() dto: ApplyCountryPackDto,
    @Req() req: { user?: JwtClaims },
  ) {
    return {
      success: true,
      data: await this.countryPackService.apply(
        tenantId,
        dto.country,
        req.user?.userId ?? 'system',
        dto.force === true,
      ),
    };
  }
}
