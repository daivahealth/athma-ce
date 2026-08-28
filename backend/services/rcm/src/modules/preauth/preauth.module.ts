import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '@zeal/database-rcm';

import { PreAuthController } from './preauth.controller';
import { PreAuthService } from './preauth.service';
import { NhcxExchangeClient } from '../../common/nhcx/nhcx-exchange.client';

@Module({
    imports: [
        HttpModule.register({
            timeout: 10000,
            maxRedirects: 5,
        }),
    ],
    controllers: [PreAuthController],
    providers: [PrismaService, PreAuthService,
        NhcxExchangeClient,
    ],
    exports: [PreAuthService],
})
export class PreAuthModule { }
