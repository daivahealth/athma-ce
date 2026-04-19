import { IsString, IsOptional, IsNotEmpty, IsEnum, IsObject, IsBoolean, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export enum PolicyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export class CreatePolicyDto {
  @ApiProperty({ description: 'Patient ID (from Clinical database)' })
  @IsUUID("loose" as any)
  @IsNotEmpty()
  patientId!: string;

  @ApiProperty({ description: 'Policy number' })
  @IsString()
  @IsNotEmpty()
  policyNumber!: string;

  @ApiPropertyOptional({ description: 'Group number' })
  @IsString()
  @IsOptional()
  groupNumber?: string;

  @ApiProperty({ description: 'Payer name' })
  @IsString()
  @IsNotEmpty()
  payerName!: string;

  @ApiProperty({ description: 'Payer ID (references Payer entity)' })
  @IsUUID("loose" as any)
  @IsNotEmpty()
  payerId!: string;

  @ApiPropertyOptional({ description: 'Relationship to policy holder (self, spouse, child, etc.)' })
  @IsString()
  @IsOptional()
  relationship?: string;

  @ApiPropertyOptional({ description: 'Policy effective date' })
  @IsDateString()
  @IsOptional()
  effectiveDate?: string;

  @ApiPropertyOptional({ description: 'Policy expiration date' })
  @IsDateString()
  @IsOptional()
  expirationDate?: string;

  @ApiPropertyOptional({ description: 'Benefits details (JSON)' })
  @IsObject()
  @IsOptional()
  benefits?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Is this the primary insurance', default: false })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @ApiPropertyOptional({ enum: PolicyStatus, default: PolicyStatus.ACTIVE })
  @IsEnum(PolicyStatus)
  @IsOptional()
  status?: PolicyStatus;
}

export class UpdatePolicyDto extends PartialType(CreatePolicyDto) {}

export interface PolicyResponseDto {
  id: string;
  tenantId: string;
  patientId: string;
  policyNumber: string;
  groupNumber?: string | null;
  payerName: string;
  payerId: string;
  relationship?: string | null;
  effectiveDate?: Date | null;
  expirationDate?: Date | null;
  benefits?: Record<string, any>;
  isPrimary: boolean;
  status: PolicyStatus;
  createdAt: Date;
  updatedAt: Date;
  payer?: any; // Will include payer details if requested
}
