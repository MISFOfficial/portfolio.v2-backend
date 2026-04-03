import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class BadgeDto {
  @ApiProperty({
    example: 'New',
    description: 'The text displayed on the badge',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ example: 'blue', description: 'The color of the badge' })
  @IsString()
  @IsNotEmpty()
  color: string;
}

class ArchitectureDto {
  @ApiProperty({ example: 'Next.js', description: 'Frontend technology used' })
  @IsString()
  @IsNotEmpty()
  frontend: string;

  @ApiProperty({ example: 'NestJS', description: 'Backend technology used' })
  @IsString()
  @IsNotEmpty()
  backend: string;

  @ApiProperty({ example: 'MongoDB', description: 'Database used' })
  @IsString()
  @IsNotEmpty()
  database: string;

  @ApiProperty({
    type: [String],
    example: ['AWS', 'Vercel'],
    description: 'Infrastructure and hosting services',
  })
  @IsArray()
  @IsString({ each: true })
  infrastructure: string[];
}

class ProblemSolutionDto {
  @ApiProperty({
    example: 'Existing solutions were too complex.',
    description: 'The core problem this project aims to solve',
  })
  @IsString()
  @IsNotEmpty()
  problem: string;

  @ApiProperty({
    example: 'Developed a lightweight alternative.',
    description: 'The solution implemented in this project',
  })
  @IsString()
  @IsNotEmpty()
  solution: string;
}

class MetricDto {
  @ApiProperty({ example: 'Performance', description: 'Label for the metric' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ example: '99%', description: 'Value of the metric' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({
    example: 'Lighthouse score',
    description: 'Short description of the metric',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class CreateProjectDto {
  @ApiProperty({
    example: 'My Awesome Project',
    description: 'Title of the project',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'my-awesome-project',
    description: 'Slug for URL generation',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    type: [String],
    example: ['React', 'NestJS'],
    description: 'Category tags',
  })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ example: '2026', description: 'Year of project development' })
  @IsString()
  @IsNotEmpty()
  year: string;

  @ApiPropertyOptional({
    type: BadgeDto,
    nullable: true,
    description: 'Optional badge information',
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => BadgeDto)
  badge?: BadgeDto | null;

  @ApiPropertyOptional({
    example: 'Hover for details',
    description: 'Text shown on image overlay',
  })
  @IsOptional()
  @IsString()
  overlayText?: string;

  @ApiProperty({
    example: 'Brief summary',
    description: 'Short project description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'Full detailed breakdown...',
    description: 'Complete project details',
  })
  @IsString()
  @IsNotEmpty()
  fullDescription: string;

  @ApiProperty({
    type: [String],
    example: ['TypeScript', 'Mongoose'],
    description: 'Tools and technologies used',
  })
  @IsArray()
  @IsString({ each: true })
  technologies: string[];

  @ApiPropertyOptional({
    example: 'https://live.com',
    description: 'Live project URL',
  })
  @IsOptional()
  @IsString()
  liveUrl?: string | null;

  @ApiPropertyOptional({
    example: 'https://github.com/repo',
    description: 'Main GitHub repository',
  })
  @IsOptional()
  @IsString()
  githubUrl?: string | null;

  @ApiPropertyOptional({
    example: 'https://github.com/frontend',
    description: 'Frontend repository',
  })
  @IsOptional()
  @IsString()
  fgithubUrl?: string | null;

  @ApiPropertyOptional({
    example: 'https://github.com/backend',
    description: 'Backend repository',
  })
  @IsOptional()
  @IsString()
  bgithubUrl?: string | null;

  @ApiProperty({
    type: [String],
    example: ['User Auth', 'Real-time updates'],
    description: 'Key features of the project',
  })
  @IsArray()
  @IsString({ each: true })
  features: string[];

  @ApiPropertyOptional({
    example: 'Full Stack Developer',
    description: 'Role in the project',
  })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({
    type: ArchitectureDto,
    description: 'Technical architecture details',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ArchitectureDto)
  architecture?: ArchitectureDto;

  @ApiPropertyOptional({
    type: ProblemSolutionDto,
    description: 'Problem and Solution statement',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ProblemSolutionDto)
  problemSolution?: ProblemSolutionDto;

  @ApiPropertyOptional({
    type: [MetricDto],
    description: 'Project performance or success metrics',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MetricDto)
  metrics?: MetricDto[];

  @ApiPropertyOptional({
    type: [String],
    example: ['Mastered CI/CD'],
    description: 'Key takeaways from the project',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  lessons?: string[];
}
