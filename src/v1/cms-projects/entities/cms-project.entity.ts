import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Image } from 'src/image/entities/image.entity';

export type CmsProjectDocument = CmsProject & Document;

@Schema({ _id: false })
class Badge {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  color: string;
}

const BadgeSchema = SchemaFactory.createForClass(Badge);

@Schema({ timestamps: true })
export class CmsProject {
  @Prop({ required: true })
  title: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Image', required: true })
  image: Image | string;

  @Prop({ type: [String], required: true })
  tags: string[];

  @Prop({ required: true })
  year: string;

  @Prop({
    required: true,
    enum: ['WordPress', 'Shopify', 'Webflow', 'Wix', 'Squarespace'],
  })
  platform: string;

  @Prop({ type: BadgeSchema, required: false })
  badge?: Badge;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false, default: null })
  liveUrl?: string;
}

export const CmsProjectSchema = SchemaFactory.createForClass(CmsProject);
