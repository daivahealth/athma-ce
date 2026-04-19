import {
  IsString,
  IsUUID,
  IsOptional,
  IsDateString,
  IsInt,
  IsArray,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProcedureReportDto {
  @ApiProperty({ description: 'Clinical order ID' })
  @IsUUID("all")
  orderId!: string;

  @ApiPropertyOptional({ description: 'Indication for the procedure' })
  @IsOptional()
  @IsString()
  indication?: string;
}

export class UpdateProcedureReportDto {
  @ApiPropertyOptional({ description: 'Indication' })
  @IsOptional()
  @IsString()
  indication?: string;

  @ApiPropertyOptional({ description: 'Procedure description' })
  @IsOptional()
  @IsString()
  procedureDescription?: string;

  @ApiPropertyOptional({ description: 'Findings' })
  @IsOptional()
  @IsString()
  findings?: string;

  @ApiPropertyOptional({ description: 'Complications' })
  @IsOptional()
  @IsString()
  complications?: string;

  @ApiPropertyOptional({ description: 'Specimens sent (JSON array of { type, sentTo, label })' })
  @IsOptional()
  @IsArray()
  specimens?: Array<{ type: string; sentTo?: string; label?: string }>;

  @ApiPropertyOptional({ description: 'Post-procedure instructions' })
  @IsOptional()
  @IsString()
  postProcedureInstructions?: string;

  @ApiPropertyOptional({ description: 'Anesthesia type (none, local, regional, general, sedation)' })
  @IsOptional()
  @IsString()
  anesthesiaType?: string;

  @ApiPropertyOptional({ description: 'Anesthesia provider staff ID' })
  @IsOptional()
  @IsUUID("all")
  anesthesiaProvider?: string;

  @ApiPropertyOptional({ description: 'Procedure start time' })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiPropertyOptional({ description: 'Procedure end time' })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiPropertyOptional({ description: 'Duration in minutes' })
  @IsOptional()
  @IsInt()
  durationMinutes?: number;

  @ApiPropertyOptional({ description: 'Primary performer staff ID' })
  @IsOptional()
  @IsUUID("all")
  primaryPerformer?: string;

  @ApiPropertyOptional({ description: 'Assistant staff IDs' })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  assistants?: string[];

  @ApiPropertyOptional({ description: 'Estimated blood loss' })
  @IsOptional()
  @IsString()
  estimatedBloodLoss?: string;

  @ApiPropertyOptional({ description: 'Implants used (JSON array of { name, manufacturer, lot })' })
  @IsOptional()
  @IsArray()
  implantsUsed?: Array<{ name: string; manufacturer?: string; lot?: string }>;

  @ApiPropertyOptional({ description: 'Comments' })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiPropertyOptional({ description: 'Block editor content (Tiptap JSON)' })
  @IsOptional()
  @IsObject()
  reportContent?: Record<string, any>;
}
