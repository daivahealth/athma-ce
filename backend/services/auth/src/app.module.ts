import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth.module';
import { FoundationDatabaseModule } from '@zeal/database-foundation';
import { RequestContextModule } from '@zeal/shared-utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    FoundationDatabaseModule,
    RequestContextModule,
    JwtModule.register((() => {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET environment variable must be set');
      }
      return {
        global: true,
        secret,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRY ?? '1h',
        },
      };
    })()),
    AuthModule,
  ],
})
export class AppModule {}




