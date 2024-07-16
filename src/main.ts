import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_SERVER_PORT } from './constants';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVER_PORT') || DEFAULT_SERVER_PORT;
  await app.listen(port);
}

bootstrap();
