import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsBoolean,
    IsNumber,
    IsArray,
    IsEnum,
    IsUUID,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum MembershipTier {
    BASIC = 'basic',
    STANDARD = 'standard',
    PREMIUM = 'premium',
    PLATINUM = 'platinum',
    VIP = 'vip',
}

export class MembershipBenefitDto {
    @ApiProperty({ description: 'Benefit name' })
    @IsString()
    name!: string;

    @ApiPropertyOptional({ description: 'Benefit description' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ description: 'Benefit value (e.g. "1 session/month")' })
    @IsOptional()
    @IsString()
    value?: string;

    @ApiProperty({ description: 'Whether the benefit is included in the plan' })
    @IsBoolean()
    included!: boolean;
}

export class CreateMembershipPlanDto {
    @ApiProperty({ description: 'Plan name' })
    @IsString()
    name!: string;

    @ApiProperty({ description: 'Plan code' })
    @IsString()
    code!: string;

    @ApiPropertyOptional({ description: 'Plan description' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ enum: MembershipTier, description: 'Membership tier' })
    @IsEnum(MembershipTier)
    tier!: string;

    @ApiProperty({ description: 'Monthly price' })
    @IsNumber()
    monthlyPrice!: number;

    @ApiProperty({ description: 'Yearly price' })
    @IsNumber()
    yearlyPrice!: number;

    @ApiPropertyOptional({ default: 'USD', description: 'Currency' })
    @IsOptional()
    @IsString()
    currency?: string;

    @ApiProperty({ type: [MembershipBenefitDto], description: 'List of benefits' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MembershipBenefitDto)
    benefits!: MembershipBenefitDto[];

    @ApiPropertyOptional({ default: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateMembershipPlanDto extends PartialType(CreateMembershipPlanDto) {}

export class MembershipPlanResponseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    tenantId!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty()
    code!: string;

    @ApiPropertyOptional()
    description?: string;

    @ApiProperty()
    tier!: string;

    @ApiProperty()
    monthlyPrice!: number;

    @ApiProperty()
    yearlyPrice!: number;

    @ApiProperty()
    currency!: string;

    @ApiProperty({ type: [MembershipBenefitDto] })
    benefits!: MembershipBenefitDto[];

    @ApiProperty()
    isActive!: boolean;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;

    @ApiProperty()
    createdBy!: string;
}
