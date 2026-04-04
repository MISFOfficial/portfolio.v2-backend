import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Image } from 'src/image/entities/image.entity';

export type DesignDocument = Design & Document;

@Schema({ timestamps: true })
export class Design {
  @Prop({ required: true })
  title: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Image', required: true })
  image: Image | string;

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

  @Prop({ type: Object, default: null })
  badge?: { properties: { text: string; color: string } } | null;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], required: true })
  tools: string[];

  @Prop({ required: false, default: null })
  behanceUrl?: string;

  @Prop({ required: false, default: null })
  dribbbleUrl?: string;

  @Prop({ required: false, default: null })
  figmaUrl?: string;
}

export const DesignSchema = SchemaFactory.createForClass(Design);
