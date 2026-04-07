import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cms, CmsSchema } from './entities/cms.entity';
import { CmsService } from './cms.service';
import { CmsController } from './cms.controller';
import { Image, ImageSchema } from 'src/image/entities/image.entity';
import { ImageService } from 'src/image/image.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cms.name, schema: CmsSchema },
      { name: Image.name, schema: ImageSchema },
    ]),
  ],
  controllers: [CmsController],
  providers: [CmsService, ImageService],
  exports: [CmsService],
})
export class CmsModule {}
