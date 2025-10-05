import { Module, RequestMethod } from '@nestjs/common';
import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestContextInterceptor } from './request-context.interceptor';
import { RequestContextMiddleware } from './request-context.middleware';

@Module({
  providers: [
    RequestContextInterceptor,
    {
      provide: APP_INTERCEPTOR,
      useExisting: RequestContextInterceptor,
    },
  ],
})
export class RequestContextModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequestContextMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
