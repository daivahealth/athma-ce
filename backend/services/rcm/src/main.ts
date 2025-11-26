import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with credentials support
  app.enableCors({
    origin: true, // Reflects the request origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id', 'x-user-id', 'x-facility-id'],
  });

  // Set global prefix
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT ?? 3012;
  await app.listen(port);

  console.log(`🚀 RCM Service is running on: http://localhost:${port}`);
  console.log(`📚 API Base URL: http://localhost:${port}/api/v1`);
}

bootstrap();
