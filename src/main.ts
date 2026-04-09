import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { envConfig } from './config/env';
import * as dns from 'dns';
import express from 'express';
import ServerlessHttp from 'serverless-http';
import { ExpressAdapter } from '@nestjs/platform-express';

// Set DNS servers
dns.setServers(['1.1.1.1']);

const expressApp = express();

/**
 * Shared configuration for both Local and Vercel environments
 */
async function setupApp(app: INestApplication) {
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

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('My Portfolio API')
    .setDescription('The Portfolio API description')
    .setVersion('2.0')
    .addTag('Projects')
    .addTag('Experiences')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('fateen/api-docs', app, document);

  await app.init();
}

/**
 * VERCEL / SERVERLESS EXPORT
 */
async function bootstrapServerless() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  await setupApp(app);
}

let isInitialized = false;

export default async (req: any, res: any) => {
  if (!isInitialized) {
    await bootstrapServerless();
    isInitialized = true;
  }
  const handler = ServerlessHttp(expressApp);
  return handler(req, res);
};

/**
 * LOCAL DEVELOPMENT SERVER
 */
if (process.env.ENV_MODE !== 'production' && !process.env.VERCEL) {
  const port = envConfig.PORT || 5000;
  async function startLocal() {
    const app = await NestFactory.create(AppModule);
    await setupApp(app); // Ensure Swagger and other configs are applied locally
    await app.listen(port);
    console.log(`Local server running at http://localhost:${port}`);
    console.log(`Swagger documentation: http://localhost:${port}/fateen/api-docs`);
  }
  startLocal();
}