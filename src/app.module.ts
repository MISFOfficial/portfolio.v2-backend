import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ProjectsModule } from './v1/projects/projects.module';
import { ExperiencesModule } from './v1/experiences/experiences.module';
import { ImageModule } from './image/image.module';

import { envConfig } from './config/env';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(envConfig.DB_URI, {
      dbName: 'mukstul',
    }),
    ProjectsModule,
    ExperiencesModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        if (req.path.includes('experiences/create')) {
          console.log('--- GLOBAL REQUEST LOG ---');
          console.log('Path:', req.path);
          console.log('Headers:', req.headers['content-type']);
        }
        next();
      })
      .forRoutes('*');
  }
}
