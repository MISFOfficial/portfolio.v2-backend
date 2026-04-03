import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExperienceDocument = Experience & Document;

@Schema({ timestamps: true })
export class Experience {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  duration: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  logo: string;

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
}

export const ExperienceSchema = SchemaFactory.createForClass(Experience);
