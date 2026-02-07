import { Module } from '@nestjs/common';
import { PrismaService } from '@zeal/database-rcm';

import { RemittanceController } from './remittance.controller';
import { RemittanceService } from './remittance.service';

@Module({
    controllers: [RemittanceController],
    providers: [PrismaService, RemittanceService],
    exports: [RemittanceService],
})
export class RemittanceModule { }
