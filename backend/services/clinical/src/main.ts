import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global prefix for API versioning
  app.setGlobalPrefix('api/v1');

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // Enable CORS
  app.enableCors();

  const port = process.env.PORT ?? 3011;
  console.log(`🚀 Clinical Service listening on port ${port}`);
  console.log(`📝 API documentation available at http://localhost:${port}/api/v1`);

  await app.listen(port);
}

bootstrap();
