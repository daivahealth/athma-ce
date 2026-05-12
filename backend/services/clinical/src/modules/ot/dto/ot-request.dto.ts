import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { OtRequestPriority } from '../ot.constants';

export class CreateOtRequestDto {
  @ApiProperty()
  @IsUUID()
  patientId!: string;

  @ApiProperty()
  @IsUUID()
  encounterId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  surgeryType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  procedureCode?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  procedureName!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional({ enum: OtRequestPriority, default: OtRequestPriority.ELECTIVE })
  @IsOptional()
  @IsEnum(OtRequestPriority)
  priority?: OtRequestPriority;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  expectedDurationMinutes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  preferredDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  preferredOtRoomSpaceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  primarySurgeonId?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  anaesthetistRequired?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  anaesthesiaTypePlanned?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  specialEquipmentRequired?: string[];

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  bloodRequired?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  implantsRequired?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  remarks?: string;
}

export class UpdateOtRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  surgeryType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  procedureCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  procedureName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional({ enum: OtRequestPriority })
  @IsOptional()
  @IsEnum(OtRequestPriority)
  priority?: OtRequestPriority;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  expectedDurationMinutes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  preferredDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  preferredOtRoomSpaceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  primarySurgeonId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  anaesthetistRequired?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  anaesthesiaTypePlanned?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  specialEquipmentRequired?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  bloodRequired?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  implantsRequired?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  remarks?: string;
}

export class TransitionOtRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  remarks?: string;
}

export class ListOtRequestsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ['DRAFT', 'REQUESTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SCHEDULED', 'CANCELLED', 'COMPLETED'] })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  patientId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  encounterId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  primarySurgeonId?: string;
}
