import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DesignsService } from './designs.service';
import { DesignsController } from './designs.controller';
import { Design, DesignSchema } from './entities/design.entity';
import { ImageModule } from 'src/image/image.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Design.name, schema: DesignSchema }]),
    ImageModule,
  ],
  controllers: [DesignsController],
  providers: [DesignsService],
})
export class DesignsModule {}
