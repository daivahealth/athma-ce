/**
 * National Identity Controller
 *
 * Country-agnostic endpoints. The UI asks which providers a tenant has enabled
 * and renders from the returned capabilities — it never hardcodes country logic.
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, PermissionsGuard, Permissions } from '@zeal/shared-utils';
import {
  PATIENT_IDENTITY_READ,
  PATIENT_IDENTITY_CREATE,
  PATIENT_IDENTITY_UPDATE,
  PATIENT_IDENTITY_DELETE,
  PATIENT_IDENTITY_VERIFY,
} from '@zeal/contracts';
import { NationalIdentityService } from '../services/national-identity.service';
import {
  CompleteChallengeDto,
  CreatePatientIdentityDto,
  StartChallengeDto,
  UpdatePatientIdentityDto,
  ValidateIdentityDto,
} from '../dto/national-identity.dto';
import { TenantId, Context } from '../../../common/decorators/tenant-context.decorator';

@Controller('national-identity')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class NationalIdentityController {
  constructor(private readonly service: NationalIdentityService) {}

  /** GET /api/v1/national-identity/providers?country=IN */
  @Get('providers')
  @Permissions(PATIENT_IDENTITY_READ)
  async listProviders(@TenantId() tenantId: string, @Query('country') country?: string) {
    return this.service.listProviders(tenantId, country);
  }

  /** POST /api/v1/national-identity/validate — offline format/checksum only. */
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @Permissions(PATIENT_IDENTITY_READ)
  async validate(@Body() dto: ValidateIdentityDto) {
    return this.service.validate(dto);
  }

  /**
   * POST /api/v1/national-identity/challenge — starts an OTP challenge.
   * Body carries a raw identifier (Aadhaar/mobile): never logged, never stored.
   */
  @Post('challenge')
  @HttpCode(HttpStatus.OK)
  @Permissions(PATIENT_IDENTITY_VERIFY)
  async startChallenge(@Body() dto: StartChallengeDto, @Context() context: any) {
    return this.service.startChallenge(dto, context);
  }

  /** POST /api/v1/national-identity/challenge/:txnId/verify */
  @Post('challenge/:txnId/verify')
  @HttpCode(HttpStatus.OK)
  @Permissions(PATIENT_IDENTITY_VERIFY)
  async completeChallenge(
    @Param('txnId') txnId: string,
    @Body() dto: CompleteChallengeDto,
    @Context() context: any,
  ) {
    return this.service.completeChallenge(txnId, dto, context);
  }
}

@Controller('patients/:patientId/identities')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PatientIdentityController {
  constructor(private readonly service: NationalIdentityService) {}

  /** GET /api/v1/patients/:patientId/identities */
  @Get()
  @Permissions(PATIENT_IDENTITY_READ)
  async list(@Param('patientId') patientId: string, @TenantId() tenantId: string) {
    return this.service.listForPatient(patientId, tenantId);
  }

  /** POST /api/v1/patients/:patientId/identities */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions(PATIENT_IDENTITY_CREATE)
  async create(
    @Param('patientId') patientId: string,
    @Body() dto: CreatePatientIdentityDto,
    @Context() context: any,
  ) {
    return this.service.createForPatient(patientId, dto, context);
  }

  /** PATCH /api/v1/patients/:patientId/identities/:id */
  @Patch(':id')
  @Permissions(PATIENT_IDENTITY_UPDATE)
  async update(
    @Param('patientId') patientId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePatientIdentityDto,
    @Context() context: any,
  ) {
    return this.service.updateForPatient(patientId, id, dto, context);
  }

  /** DELETE /api/v1/patients/:patientId/identities/:id */
  @Delete(':id')
  @Permissions(PATIENT_IDENTITY_DELETE)
  async remove(
    @Param('patientId') patientId: string,
    @Param('id') id: string,
    @TenantId() tenantId: string,
  ) {
    return this.service.removeForPatient(patientId, id, tenantId);
  }
}
