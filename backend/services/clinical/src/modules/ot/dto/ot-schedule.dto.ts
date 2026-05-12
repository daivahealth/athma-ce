import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OtTeamRole } from '../ot.constants';

export class OtTeamMemberDto {
  @ApiProperty()
  @IsUUID()
  staffId!: string;

  @ApiProperty({ enum: OtTeamRole })
  @IsEnum(OtTeamRole)
  role!: OtTeamRole;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  displayOrder?: number;
}

export class CreateOtScheduleDto {
  @ApiProperty()
  @IsUUID()
  otRequestId!: string;

  @ApiProperty()
  @IsUUID()
  otRoomSpaceId!: string;

  @ApiProperty()
  @IsDateString()
  scheduledStartTime!: string;

  @ApiProperty()
  @IsDateString()
  scheduledEndTime!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  primarySurgeonId?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  assistantSurgeonIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  anaesthetistId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  scrubNurseId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  circulatingNurseId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  technicianId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  anaesthesiaType?: string;

  @ApiPropertyOptional({ type: [OtTeamMemberDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OtTeamMemberDto)
  teamMembers?: OtTeamMemberDto[];
}

export class UpdateOtScheduleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  otRoomSpaceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  scheduledStartTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  scheduledEndTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  actualStartTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  actualEndTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  primarySurgeonId?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  assistantSurgeonIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  anaesthetistId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  scrubNurseId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  circulatingNurseId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  technicianId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  anaesthesiaType?: string;

  @ApiPropertyOptional({ type: [OtTeamMemberDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OtTeamMemberDto)
  teamMembers?: OtTeamMemberDto[];
}

export class TransitionOtScheduleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  actualStartTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  actualEndTime?: string;
}

export class ListOtSchedulesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
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
  otRoomSpaceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  primarySurgeonId?: string;
}

export class CheckOtScheduleConflictsDto {
  @ApiProperty()
  @IsUUID()
  otRoomSpaceId!: string;

  @ApiProperty()
  @IsDateString()
  scheduledStartTime!: string;

  @ApiProperty()
  @IsDateString()
  scheduledEndTime!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  scheduleId?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  staffIds?: string[];
}
