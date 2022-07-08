import { NestFactory } from '@nestjs/core';
import { json } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(json({ limit: '50mb' }));
  await app.listen(process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT, 10) : 8080);
}
bootstrap();
