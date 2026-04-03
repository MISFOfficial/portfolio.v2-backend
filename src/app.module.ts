import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ProjectsModule } from './v1/projects/projects.module';
import { ExperiencesModule } from './v1/experiences/experiences.module';
import { CertificatesModule } from './v1/certificates/certificates.module';
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
    CertificatesModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });
  }
}
