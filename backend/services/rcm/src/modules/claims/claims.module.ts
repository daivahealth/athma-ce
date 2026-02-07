import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '@zeal/database-rcm';

import { ClaimsController } from './claims.controller';
import { ClaimsService } from './claims.service';
import { ClaimGeneratorFactory } from './generators/claim-generator.factory';
import { GenericJsonGenerator } from './generators/generic-json.generator';

@Module({
    imports: [
        HttpModule.register({
            timeout: 10000,
            maxRedirects: 5,
        }),
    ],
    controllers: [ClaimsController],
    providers: [
        PrismaService,
        ClaimsService,
        ClaimGeneratorFactory,
        GenericJsonGenerator,
    ],
    exports: [ClaimsService, ClaimGeneratorFactory],
})
export class ClaimsModule { }
