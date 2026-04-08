import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Image } from 'src/image/entities/image.entity';

export type CmsDocument = Cms & Document;

export enum CmsPlatform {
  WORDPRESS = 'WordPress',
  SHOPIFY = 'Shopify',
  WEBFLOW = 'Webflow',
  WIX = 'Wix',
  SQUARESPACE = 'Squarespace',
}

@Schema({ timestamps: true })
export class Cms {
  @Prop({ required: true })
  title: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Image' }],
    required: true,
    default: [],
  })
  images: (Image | string)[];

  @Prop({ type: [String], required: true })
  tags: string[];

  @Prop({ required: true })
  year: string;

  @Prop({ required: true, enum: CmsPlatform })
  platform: CmsPlatform;

  @Prop({ type: Object, default: null })
  badge?: { text: string; color: string } | null;

  @Prop({ required: true })
  description: string;

  @Prop({ type: String, required: false, default: null })
  liveUrl?: string | null;
}

export const CmsSchema = SchemaFactory.createForClass(Cms);
