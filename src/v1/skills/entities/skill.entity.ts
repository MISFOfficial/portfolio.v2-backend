import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Image } from 'src/image/entities/image.entity';

export type SkillDocument = Skill & Document;

export enum SkillCategory {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  SOFTSKILL = 'softskill',
}

@Schema({ timestamps: true })
export class Skill {
  @Prop({ required: true })
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Image', required: true })
  logo: Image | string;

  @Prop({ required: true, enum: SkillCategory })
  category: SkillCategory;
}

export const SkillSchema = SchemaFactory.createForClass(Skill);
