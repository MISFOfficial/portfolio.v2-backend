import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { HttpExceptionFilter } from './common/filters/http-exception.filter';

import { envConfig } from './config/env';
// import * as dns from 'dns';
// dns.setServers(['1.1.1.1']);

async function main() {
  const port = envConfig.PORT;
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: envConfig.ALLOWED_ORIGINS,
    credentials: true,
  });

  // Global Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('My Portfolio API')
    .setDescription('The Portfolio API description')
    .setVersion('2.0')
    .addTag('Projects')
    .addTag('Experiences')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port);
  console.log(`My Portfolio API is running at port ${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api-docs`);
}
main();
