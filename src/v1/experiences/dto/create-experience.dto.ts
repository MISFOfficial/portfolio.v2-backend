import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUrl,
  IsEnum,
} from 'class-validator';
import { ExperienceRole } from '../entities/experience.entity';
import { Transform } from 'class-transformer';

export class CreateExperienceDto {
  @ApiProperty({ example: 'Aviro Soft', description: 'Name of the company' })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({
    enum: ExperienceRole,
    example: ExperienceRole.SOFTWARE_ENGINEER,
    description: 'Role in the company',
  })
  @IsEnum(ExperienceRole)
  @IsNotEmpty()
  role: ExperienceRole;

  @ApiProperty({
    example: '12-01-2025 - Present',
    description: 'Duration of the experience',
  })
  @IsString()
  @IsNotEmpty()
  duration: string;

  @ApiProperty({ example: 'On-site', description: 'Location of the work' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    example: 'Working as a Jr Software Engineer...',
    description: 'Brief description of the experience',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: [String],
    example: ['Developing web applications', 'Collaborating with teams'],
    description: 'List of responsibilities',
  })
  @IsArray()
  @ArrayNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @IsString({ each: true })
  responsibilities: string[];

  @ApiProperty({
    type: [String],
    example: ['React', 'Next.js', 'Node.js'],
    description: 'Technologies used',
  })
  @IsArray()
  @ArrayNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @IsString({ each: true })
  technologies: string[];

  @ApiProperty({
    type: [String],
    example: ['Improved performance by 20%', 'Delivered project on time'],
    description: 'Key achievements',
  })
  @IsArray()
  @ArrayNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @IsString({ each: true })
  achievements: string[];

  @ApiProperty({ example: '10+', description: 'Size of the team' })
  @IsString()
  @IsNotEmpty()
  teamSize: string;

  @ApiProperty({
    example: 'Aviro Soft is a software development company...',
    description: 'Brief description of the company',
  })
  @IsString()
  @IsNotEmpty()
  companyDescription: string;

  @ApiProperty({
    example: 'https://avirosoft.com',
    description: 'Company website URL',
  })
  @IsUrl()
  @IsNotEmpty()
  companyWebsite: string;
}
