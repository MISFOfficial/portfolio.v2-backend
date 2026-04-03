import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExperiencesService } from './experiences.service';
import { ExperiencesController } from './experiences.controller';
import { Experience, ExperienceSchema } from './entities/experience.entity';

import { ImageModule } from 'src/image/image.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Experience.name, schema: ExperienceSchema },
    ]),
    ImageModule,
  ],
  controllers: [ExperiencesController],
  providers: [ExperiencesService],
})
export class ExperiencesModule {}
