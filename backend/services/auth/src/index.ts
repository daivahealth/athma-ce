import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';
import { AuthModule } from './auth.module';
import { RequestContext } from '@zeal/shared-utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use((req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers['user-agent'];
    const userAgent = Array.isArray(header) ? header.join(',') : header ?? '';

    RequestContext.run({ userAgent }, () => next());
  });
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Global prefix
  app.setGlobalPrefix('api/v1/auth');

  // Enable CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`Auth service running on port ${port}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start auth service:', error);
  process.exit(1);
});
