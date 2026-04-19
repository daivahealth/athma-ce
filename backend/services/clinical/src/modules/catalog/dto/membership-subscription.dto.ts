import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsBoolean,
    IsEnum,
    IsUUID,
    IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum SubscriptionStatus {
    ACTIVE = 'active',
    CANCELLED = 'cancelled',
    EXPIRED = 'expired',
    PENDING = 'pending',
}

export enum BillingCycle {
    MONTHLY = 'monthly',
    YEARLY = 'yearly',
}

export class CreateMembershipSubscriptionDto {
    @ApiProperty({ description: 'Patient ID' })
    @IsUUID("all")
    patientId!: string;

    @ApiProperty({ description: 'Membership Plan ID' })
    @IsUUID("all")
    planId!: string;

    @ApiProperty({ enum: BillingCycle, description: 'Billing cycle' })
    @IsEnum(BillingCycle)
    billingCycle!: string;

    @ApiProperty({ description: 'Start date' })
    @Type(() => Date)
    @IsDate()
    startDate!: Date;

    @ApiPropertyOptional({ description: 'End date' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    endDate?: Date;

    @ApiPropertyOptional({ description: 'Next billing date' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    nextBillingDate?: Date;

    @ApiPropertyOptional({ default: true })
    @IsOptional()
    @IsBoolean()
    autoRenew?: boolean;

    @ApiPropertyOptional({ description: 'Metadata' })
    @IsOptional()
    metadata?: any;
}

export class UpdateMembershipSubscriptionDto {
    @ApiPropertyOptional({ enum: SubscriptionStatus })
    @IsOptional()
    @IsEnum(SubscriptionStatus)
    status?: string;

    @ApiPropertyOptional({ enum: BillingCycle })
    @IsOptional()
    @IsEnum(BillingCycle)
    billingCycle?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    endDate?: Date;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    nextBillingDate?: Date;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    autoRenew?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    metadata?: any;
}

export class MembershipSubscriptionResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    tenantId!: string;

    @ApiProperty()
    patientId!: string;

    @ApiProperty()
    planId!: string;

    @ApiProperty({ enum: SubscriptionStatus })
    status!: string;

    @ApiProperty({ enum: BillingCycle })
    billingCycle!: string;

    @ApiProperty()
    startDate!: Date;

    @ApiPropertyOptional()
    endDate?: Date;

    @ApiPropertyOptional()
    nextBillingDate?: Date;

    @ApiProperty()
    autoRenew!: boolean;

    @ApiPropertyOptional()
    metadata?: any;

    @ApiProperty()
    isActive!: boolean;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;

    @ApiProperty()
    createdBy!: string;

    // Optional included relations
    @ApiPropertyOptional()
    patient?: any;

    @ApiPropertyOptional()
    plan?: any;
}
