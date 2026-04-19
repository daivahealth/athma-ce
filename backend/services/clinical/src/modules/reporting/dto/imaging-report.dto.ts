import { IsString, IsUUID, IsOptional, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateImagingReportDto {
  @ApiProperty({ description: 'Clinical order ID' })
  @IsUUID("all")
  orderId!: string;

  @ApiPropertyOptional({ description: 'Imaging modality (X-ray, CT, MRI, Ultrasound)' })
  @IsOptional()
  @IsString()
  modality?: string;

  @ApiPropertyOptional({ description: 'Body part' })
  @IsOptional()
  @IsString()
  bodyPart?: string;

  @ApiPropertyOptional({ description: 'DICOM accession number' })
  @IsOptional()
  @IsString()
  accessionNumber?: string;

  @ApiPropertyOptional({ description: 'DICOM study instance UID' })
  @IsOptional()
  @IsString()
  studyInstanceUid?: string;
}

export class UpdateImagingReportDto {
  @ApiPropertyOptional({ description: 'Technique description' })
  @IsOptional()
  @IsString()
  technique?: string;

  @ApiPropertyOptional({ description: 'Comparison with prior studies' })
  @IsOptional()
  @IsString()
  comparison?: string;

  @ApiPropertyOptional({ description: 'Findings' })
  @IsOptional()
  @IsString()
  findings?: string;

  @ApiPropertyOptional({ description: 'Clinical impression/conclusion' })
  @IsOptional()
  @IsString()
  impression?: string;

  @ApiPropertyOptional({ description: 'Recommendations' })
  @IsOptional()
  @IsString()
  recommendations?: string;

  @ApiPropertyOptional({ description: 'Critical finding flag' })
  @IsOptional()
  @IsBoolean()
  criticalFinding?: boolean;

  @ApiPropertyOptional({ description: 'Comments' })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiPropertyOptional({ description: 'DICOM accession number' })
  @IsOptional()
  @IsString()
  accessionNumber?: string;

  @ApiPropertyOptional({ description: 'DICOM study instance UID' })
  @IsOptional()
  @IsString()
  studyInstanceUid?: string;

  @ApiPropertyOptional({ description: 'Block editor content (Tiptap JSON)' })
  @IsOptional()
  @IsObject()
  reportContent?: Record<string, any>;
}

export class CriticalFindingDto {
  @ApiProperty({ description: 'Staff ID notified about critical finding' })
  @IsUUID("all")
  notifiedTo!: string;
}
