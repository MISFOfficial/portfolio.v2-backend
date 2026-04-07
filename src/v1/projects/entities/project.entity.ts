import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Image } from 'src/image/entities/image.entity';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  title: string;

  @Prop({ type: [String], required: true })
  tags: string[];

  @Prop({ required: true })
  year: string;

  @Prop({ type: Object, default: null })
  badge?: { text: string; color: string } | null;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  fullDescription: string;

  @Prop({ type: [String], required: true })
  technologies: string[];

  @Prop({ required: true })
  liveUrl: string;

  @Prop({ type: String, required: false, default: null })
  githubUrl?: string | null;
  @Prop({ type: String, required: false, default: null })
  frontendGithubUrl?: string | null;
  @Prop({ type: String, required: false, default: null })
  backendGithubUrl?: string | null;

  @Prop({ type: [String], required: true })
  features: string[];

  @Prop({ required: true })
  role: string;

  @Prop({ type: Object, required: true })
  architecture: {
    frontend: string;
    backend: string;
    database: string;
    infrastructure: string[];
  };

  @Prop({ type: Object, required: true })
  problemSolution: {
    problem: string;
    solution: string;
  };

  @Prop({
    type: [{ label: String, value: String, description: String }],
    required: true,
  })
  metrics: {
    label: string;
    value: string;
    description: string;
  }[];

  @Prop({ type: [String], required: true })
  lessons: string[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Image' }],
    required: true,
  })
  images: (Image | string)[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
