import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Image } from 'src/image/entities/image.entity';

export type ExperienceDocument = Experience & Document;

export enum ExperienceRole {
  FRONTEND_ENGINEER = 'FRONTEND_ENGINEER',
  FRONTEND_DEVELOPER = 'FRONTEND_DEVELOPER',
  BACKEND_ENGINEER = 'BACKEND_ENGINEER',
  BACKEND_DEVELOPER = 'BACKEND_DEVELOPER',
  SOFTWARE_ENGINEER = 'SOFTWARE_ENGINEER',
  JR_SOFTWARE_ENGINEER = 'JR_SOFTWARE_ENGINEER',
  SENIOR_SOFTWARE_ENGINEER = 'SENIOR_SOFTWARE_ENGINEER',
}

@Schema({ timestamps: true })
export class Experience {
  @Prop({ required: true })
  company: string;

  @Prop({ required: true, enum: ExperienceRole })
  role: ExperienceRole;

  @Prop({ required: true })
  duration: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], required: true })
  responsibilities: string[];

  @Prop({ type: [String], required: true })
  technologies: string[];

  @Prop({ type: [String], required: true })
  achievements: string[];

  @Prop({ required: true })
  teamSize: string;

  @Prop({ required: true })
  companyDescription: string;

  @Prop({ required: true })
  companyWebsite: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Image' }],
    required: true,
  })
  images: (Image | string)[];
}

export const ExperienceSchema = SchemaFactory.createForClass(Experience);
