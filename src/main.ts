import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { HttpExceptionFilter } from './common/filters/http-exception.filter';


async function main() {
  const port = process.env.PORT ?? 5000;
  const app = await NestFactory.create(AppModule);

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
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port);
  console.log(`My Portfolio API is running at port ${port}`);
  console.log(`Swagger documentation is available at http://localhost:${port}/api-docs`);
}
main();
