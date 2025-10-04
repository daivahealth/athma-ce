import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3010;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Foundation service listening on http://localhost:${port}`);
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Foundation service failed to bootstrap', error);
  process.exit(1);
});
