import { Body, Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { InternalApiKeyGuard } from '../../common/guards/internal-api-key.guard';
import { HiuService } from './hiu.service';

const UUID_SHAPE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

class FetchDto {
  @Matches(UUID_SHAPE)
  tenantId!: string;

  @IsOptional()
  @Matches(UUID_SHAPE)
  facilityId?: string;

  @IsString()
  @MaxLength(200)
  abhaAddress!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  purpose?: string;
}

/**
 * HIU orchestration for core services (issue #83): the clinical
 * AbdmHieProvider calls fetch and, on 'transfer_pending', polls the transfer.
 */
@Controller('internal/hiu')
@UseGuards(InternalApiKeyGuard)
export class HiuController {
  constructor(private readonly hiu: HiuService) {}

  @Post('fetch')
  @HttpCode(HttpStatus.OK)
  async fetch(@Body() dto: FetchDto) {
    return this.hiu.fetch(
      { tenantId: dto.tenantId, facilityId: dto.facilityId },
      dto.abhaAddress,
      dto.purpose ?? 'External record fetch via ABDM',
    );
  }

  @Get('transfers/:tenantId/:transactionId')
  async transfer(
    @Param('tenantId') tenantId: string,
    @Param('transactionId') transactionId: string,
  ) {
    if (!UUID_SHAPE.test(tenantId)) throw new NotFoundException('Unknown transfer');
    const transfer = await this.hiu.getTransfer(tenantId, transactionId);
    if (!transfer) throw new NotFoundException('Unknown transfer');
    return { success: true, data: transfer };
  }
}
