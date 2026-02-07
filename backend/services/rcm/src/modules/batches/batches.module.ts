import { Module } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';

import { BatchesController } from './batches.controller';
import { BatchesService } from './batches.service';
import { ClaimsModule } from '../claims/claims.module';

@Module({
    imports: [ClaimsModule],
    controllers: [BatchesController],
    providers: [PrismaService, BatchesService],
    exports: [BatchesService],
})
export class BatchesModule { }
