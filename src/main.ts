import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DEFAULT_SERVER_PORT } from './constants';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle('msg Career Start Online Shop')
    .setDescription(
      'API documentation for the msg Career Start Online Shop - by Andrei-David Nan',
    )
    .setVersion('0.6')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  const apiVersion = process.env.API_VERSION || '';
  const apiPrefix = `api${apiVersion ? `/${apiVersion}` : ''}`;
  
  SwaggerModule.setup(apiPrefix, app, document);

  const port = configService.get<number>('SERVER_PORT') || DEFAULT_SERVER_PORT;

  await app.listen(port);
}

bootstrap();
