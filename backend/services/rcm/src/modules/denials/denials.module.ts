import { Module } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';

import { DenialsController } from './denials.controller';
import { AppealsController } from './appeals.controller';
import { DenialsService } from './denials.service';

@Module({
    controllers: [DenialsController, AppealsController],
    providers: [PrismaService, DenialsService],
    exports: [DenialsService],
})
export class DenialsModule { }
