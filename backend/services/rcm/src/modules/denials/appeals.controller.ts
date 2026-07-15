import {
    Controller,
    Post,
    Body,
    Param,
    Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { DenialsService } from './denials.service';
import { FileAppealDto } from './dto/denial.dto';

@ApiTags('Appeals')
@Controller('appeals')
@ApiHeader({ name: 'x-tenant-id', required: true })
export class AppealsController {
    constructor(private readonly denialsService: DenialsService) { }

    @Post(':id/file')
    @ApiOperation({ summary: 'File a drafted appeal with the payer' })
    async file(
        @Headers('x-tenant-id') tenantId: string,
        @Param('id') id: string,
        @Body() dto: FileAppealDto,
    ) {
        return this.denialsService.fileAppeal(tenantId, id, dto);
    }
}
