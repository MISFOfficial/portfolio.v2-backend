/* Original Code (Commented out)
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { HttpExceptionFilter } from './common/filters/http-exception.filter';

import { envConfig } from './config/env';
import * as dns from 'dns';
import express from 'express';
import ServerlessHttp from 'serverless-http';
dns.setServers(['1.1.1.1']);


// use it for vercel cz support only server less
const appExpress = express();


// main
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
      forbidNonWhitelisted: false,
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



// use it for vercel cz support only server less
export default ServerlessHttp(appExpress);
*/

// --- NEW MODIFIED CODE FOR VERCEL ---
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { HttpExceptionFilter } from './common/filters/http-exception.filter';

import { envConfig } from './config/env';
import * as dns from 'dns';
import express from 'express';
import ServerlessHttp from 'serverless-http';
import { ExpressAdapter } from '@nestjs/platform-express';

dns.setServers(['1.1.1.1']);

const expressApp = express();

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

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
      forbidNonWhitelisted: false,
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
  SwaggerModule.setup('api/api-docs', app, document);

  await app.init();
}

// Keep track of initialization
let isInitialized = false;

export default async (req: any, res: any) => {
  if (!isInitialized) {
    await bootstrap();
    isInitialized = true;
  }
  const handler = ServerlessHttp(expressApp);
  return handler(req, res);
};

// Start for local development (only if not running in Vercel)
if (process.env.ENV_MODE !== 'production' && !process.env.VERCEL) {
  const port = envConfig.PORT || 5000;
  async function startLocal() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({ origin: envConfig.ALLOWED_ORIGINS, credentials: true });
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    
    await app.listen(port);
    console.log(`My Portfolio API is running at port ${port}`);
  }
  startLocal();
}