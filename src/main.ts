import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { envConfig } from './config/env';
import serverless from 'serverless-http';
import { Express } from 'express';

let cachedHandler: any;

async function bootstrap(): Promise<Express> {
  try {
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

    await app.init();

    const expressApp = app.getHttpAdapter().getInstance();
    return expressApp;
  } catch (error) {
    console.error('Error during bootstrap:', error);
    throw error;
  }
}

// Local development
if (process.env.NODE_ENV !== 'production') {
  async function startLocal() {
    try {
      const expressApp = await bootstrap();
      const port = envConfig.PORT || 3000;
      (expressApp as any).listen(port, () => {
        console.log(`My Portfolio API is running at port ${port}`);
        console.log(`Swagger documentation: http://localhost:${port}/api-docs`);
      });
    } catch (err) {
      console.error('Failed to start local server:', err);
    }
  }
  // Start local if not imported as a module (e.g. by Vercel)
  if (require.main === module) {
    startLocal();
  }
}

// Vercel handler
export default async (req: any, res: any) => {
  try {
    if (!cachedHandler) {
      console.log('Bootstrapping application...');
      const expressApp = await bootstrap();
      cachedHandler = serverless(expressApp);
      console.log('Application bootstrapped successfully.');
    }
    return cachedHandler(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
};