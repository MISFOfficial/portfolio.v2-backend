import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Image } from 'src/image/entities/image.entity';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  image: string;

  @Prop({ type: [String], required: true })
  tags: string[];

  @Prop({ required: true })
  year: string;

  @Prop({ type: Object, default: null })
  badge?: { text: string; color: string } | null;

  @Prop()
  overlayText?: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  fullDescription: string;

  @Prop({ type: [String], required: true })
  technologies: string[];

  @Prop({ type: String, default: null })
  liveUrl?: string | null;

  @Prop({ type: String, default: null })
  githubUrl?: string | null;

  @Prop({ type: String, default: null })
  fgithubUrl?: string | null;

  @Prop({ type: String, default: null })
  bgithubUrl?: string | null;

  @Prop({ type: [String], required: true })
  features: string[];

  @Prop()
  role?: string;

  @Prop({ type: Object })
  architecture?: {
    frontend: string;
    backend: string;
    database: string;
    infrastructure: string[];
  };

  @Prop({ type: Object })
  problemSolution?: {
    problem: string;
    solution: string;
  };

  @Prop({ type: [{ label: String, value: String, description: String }] })
  metrics?: {
    label: string;
    value: string;
    description: string;
  }[];

  @Prop({ type: [String] })
  lessons?: string[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Image' }] })
  images?: (Image | string)[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
