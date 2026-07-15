/**
 * Patient Narrative DTOs
 * Request/response shapes for the AI Care Narrative endpoint.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

// ---------- Request ----------

export class GenerateNarrativeDto {
  @ApiPropertyOptional({
    description:
      'Reading clinician specialty used to tune emphasis (e.g. "Oncology", ' +
      '"Cardiology", "Internal Medicine"). If omitted, it is inferred from the ' +
      "patient's problem list and encounter types.",
    example: 'Oncology',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  specialty?: string;
}

// ---------- Responses ----------

export class CareNarrativeResponseDto {
  @ApiProperty({ description: 'Whether the AI narrative was generated', example: true })
  available: true;

  @ApiProperty({
    description: 'The specialty-aware clinical narrative (markdown-ish plain text)',
  })
  narrative: string;

  @ApiProperty({ description: 'Specialty the narrative was tuned for', example: 'Oncology' })
  specialty: string;

  @ApiProperty({ description: 'LLM model that produced the narrative', example: 'claude-sonnet-4-20250514' })
  model: string;

  @ApiProperty({
    description: 'Number of source clinical records (encounters + observations) fed to the model',
    example: 7,
  })
  sourceCount: number;

  @ApiProperty({ description: 'ISO timestamp of generation' })
  generatedAt: string;
}

export class CareNarrativeUnavailableDto {
  @ApiProperty({ description: 'Always false when the AI narrative could not be generated', example: false })
  available: false;

  @ApiProperty({
    description: 'Human-readable reason the narrative is unavailable (drives the client-side fallback)',
    example: 'The AI Gateway is missing an LLM API key/provider configuration.',
  })
  reason: string;
}

export class NarrativeMessageDto {
  @ApiProperty({ enum: ['system', 'user'], example: 'system' })
  role: 'system' | 'user';

  @ApiProperty({ description: 'Message content' })
  content: string;
}

export class CareNarrativeDryRunDto {
  @ApiProperty({ description: 'Always true for a dry-run response', example: true })
  dryRun: true;

  @ApiProperty({ description: 'Specialty the prompt was assembled for', example: 'Oncology' })
  specialty: string;

  @ApiProperty({
    description: 'Number of source clinical records (encounters + observations) included',
    example: 7,
  })
  sourceCount: number;

  @ApiProperty({ type: [NarrativeMessageDto], description: 'The assembled prompt messages (no LLM call made)' })
  messages: NarrativeMessageDto[];
}
