import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '@zeal/database-rcm';

import { EligibilityController } from './eligibility.controller';
import { EligibilityService } from './eligibility.service';
import { MockEligibilityConnector } from './connectors/mock.connector';

@Module({
    imports: [
        HttpModule.register({
            timeout: 10000,
            maxRedirects: 5,
        }),
    ],
    controllers: [EligibilityController],
    providers: [
        PrismaService,
        EligibilityService,
        MockEligibilityConnector,
    ],
    exports: [EligibilityService],
})
export class EligibilityModule { }
