import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CmsProjectsService } from './cms-projects.service';
import { CmsProjectsController } from './cms-projects.controller';
import { CmsProject, CmsProjectSchema } from './entities/cms-project.entity';
import { ImageModule } from 'src/image/image.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CmsProject.name, schema: CmsProjectSchema },
    ]),
    ImageModule,
  ],
  controllers: [CmsProjectsController],
  providers: [CmsProjectsService],
})
export class CmsProjectsModule {}
