// Load environment variables from .env into process.env
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const port = Number(process.env.PORT ?? 3000);
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(port);
  // Use Nest's logger so logs integrate with Nest's logging system
  const url = await app.getUrl();
  const logger = new Logger('Bootstrap');
  logger.log(`Listening on ${url}`);
}

void bootstrap();
