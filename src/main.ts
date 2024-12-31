import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT') || 8888;
  const BASE_URL = configService.get('BASE_URL');

  // Global prefix /api/v1
  app.setGlobalPrefix(BASE_URL);

  // Use cookies
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(PORT, () => {
    Logger.log(
      `Your NestJS app is live at http://localhost:${PORT}${BASE_URL} !`,
    );
  });
}
bootstrap();
