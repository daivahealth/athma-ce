/**
 * Update Template DTO
 * All fields optional for PATCH operations
 */

import { PartialType } from '@nestjs/swagger';
import { CreateTemplateDto } from './create-template.dto';

export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {}
