import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SkillCategory } from '../entities/skill.entity';

export class CreateSkillDto {
  @ApiProperty({ example: 'React Js', description: 'Name of the skill' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'frontend',
    enum: SkillCategory,
    description: 'Category of the skill (frontend, backend, softskill)',
  })
  @IsEnum(SkillCategory)
  @IsNotEmpty()
  category: SkillCategory;
}
