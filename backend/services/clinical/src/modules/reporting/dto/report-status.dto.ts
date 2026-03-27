import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ReportStatus {
  DRAFT = 'DRAFT',
  PRELIMINARY = 'PRELIMINARY',
  FINAL = 'FINAL',
  AMENDED = 'AMENDED',
  CORRECTED = 'CORRECTED',
  CANCELLED = 'CANCELLED',
}

export enum ReportType {
  LAB = 'lab',
  IMAGING = 'imaging',
  PROCEDURE = 'procedure',
}

export class TransitionReportStatusDto {
  @ApiProperty({ description: 'Target status', enum: ReportStatus })
  @IsEnum(ReportStatus)
  status!: ReportStatus;

  @ApiPropertyOptional({ description: 'Reason for status change (required for amendments)' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class AmendReportDto {
  @ApiProperty({ description: 'Reason for amendment' })
  @IsString()
  reason!: string;
}
