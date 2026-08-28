import {
    IsArray,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// PreAuth status enum
export enum PreAuthStatus {
    DRAFT = 'draft',
    PENDING = 'pending',
    SUBMITTED = 'submitted',
    APPROVED = 'approved',
    PARTIALLY_APPROVED = 'partially_approved',
    DENIED = 'denied',
    CANCELLED = 'cancelled',
    EXPIRED = 'expired',
}

// PreAuth urgency level
export enum PreAuthUrgency {
    ROUTINE = 'routine',
    URGENT = 'urgent',
    EMERGENCY = 'emergency',
}

// DTO for creating a pre-authorization request
// NOTE: these DTOs previously had no class-validator decorators, so the
// global whitelist ValidationPipe stripped every property and create/submit
// could never work over HTTP. Decorated as part of #124.
export class RequestedService {
    @IsString()
    procedureCode!: string;

    @IsOptional()
    @IsString()
    procedureCodeType?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    quantity?: number;

    @IsOptional()
    @IsNumber()
    estimatedCost?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    diagnosisCodes?: string[];
}

export class CreatePreAuthDto {
    @IsUUID()
    patientId!: string;

    @IsUUID()
    payerId!: string;

    @IsOptional()
    @IsUUID()
    policyId?: string;

    @IsOptional()
    @IsUUID()
    encounterId?: string;

    @IsOptional()
    @IsEnum(PreAuthUrgency)
    urgency?: PreAuthUrgency;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RequestedService)
    requestedServices!: RequestedService[];

    @IsOptional()
    @IsString()
    clinicalNotes?: string;

    @IsOptional()
    scheduledDate?: Date;
}

// DTO for updating a pre-authorization
export class UpdatePreAuthDto {
    status?: PreAuthStatus;
    authorizationNumber?: string;
    approvedServices?: ApprovedService[];
    denialReason?: string;
    validFrom?: Date;
    validTo?: Date;
}

export class ApprovedService {
    procedureCode!: string;
    approvedQuantity!: number;
    approvedAmount?: number;
}

// DTO for filtering pre-auth requests
export class PreAuthFilterDto {
    @IsOptional() @IsString() patientId?: string;
    @IsOptional() @IsString() payerId?: string;
    @IsOptional() @IsString() encounterId?: string;
    @IsOptional() status?: PreAuthStatus;
    @IsOptional() dateFrom?: Date;
    @IsOptional() dateTo?: Date;
    @IsOptional() limit?: number;
    @IsOptional() offset?: number;
}
