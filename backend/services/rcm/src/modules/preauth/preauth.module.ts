import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '@zeal/database-rcm';

import { PreAuthController } from './preauth.controller';
import { PreAuthService } from './preauth.service';

@Module({
    imports: [
        HttpModule.register({
            timeout: 10000,
            maxRedirects: 5,
        }),
    ],
    controllers: [PreAuthController],
    providers: [PrismaService, PreAuthService],
    exports: [PreAuthService],
})
export class PreAuthModule { }
