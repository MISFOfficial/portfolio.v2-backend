import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Image } from 'src/image/entities/image.entity';

export type CertificateDocument = Certificate & Document;

@Schema({ timestamps: true })
export class Certificate {
  @Prop({ required: true })
  title: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Image', required: true })
  image: Image | string;

  @Prop({ required: true })
  provider: string;

  @Prop({ required: true })
  duration: string;

  @Prop({ required: true })
  timeTaken: string;

  @Prop({ type: [String], required: true })
  challenges: string[];

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  fullDescription: string;

  @Prop({ type: [String], required: true })
  skillsLearned: string[];

  @Prop({ required: true })
  certifiedAt: string;

  @Prop({ required: true })
  issueDate: string;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);
