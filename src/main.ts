// Load environment variables from .env into process.env
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Build DATABASE_URL from component env vars (DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME)
  const dbUser = process.env.DB_USER ?? 'postgres';
  const dbPassword = process.env.DB_PASSWORD ?? 'password';
  const dbHost = process.env.DB_HOST ?? 'localhost';
  const dbPort = process.env.DB_PORT ?? '5432';
  const dbName = process.env.DB_NAME ?? 'travel_db';

  // Set DATABASE_URL for Prisma to consume
  process.env.DATABASE_URL = `postgresql://${dbUser}:${encodeURIComponent(dbPassword)}@${dbHost}:${dbPort}/${dbName}?schema=public`;

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
  logger.log(`Database connected successfully: ${dbHost}:${dbPort}/${dbName}`);
}

void bootstrap();
