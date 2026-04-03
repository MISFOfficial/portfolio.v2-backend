import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

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
  @ArrayNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
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
  @ArrayNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
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
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @ValidateNested()
  @Type(() => BadgeDto)
  badge?: BadgeDto | null;

  @ApiProperty({
    example: 'Hover for details',
    description: 'Text shown on image overlay',
  })
  @IsString()
  @IsNotEmpty()
  overlayText: string;

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
  @ArrayNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @IsString({ each: true })
  technologies: string[];

  @ApiProperty({
    example: 'https://live.com',
    description: 'Live project URL',
  })
  @IsString()
  @IsNotEmpty()
  liveUrl: string;

  @ApiProperty({
    example: 'https://github.com/repo',
    description: 'Main GitHub repository',
  })
  @IsString()
  @IsNotEmpty()
  githubUrl: string;

  @ApiProperty({
    example: 'https://github.com/frontend',
    description: 'Frontend repository',
  })
  @IsString()
  @IsNotEmpty()
  fgithubUrl: string;

  @ApiProperty({
    example: 'https://github.com/backend',
    description: 'Backend repository',
  })
  @IsString()
  @IsNotEmpty()
  bgithubUrl: string;

  @ApiProperty({
    type: [String],
    example: ['User Auth', 'Real-time updates'],
    description: 'Key features of the project',
  })
  @IsArray()
  @ArrayNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @IsString({ each: true })
  features: string[];

  @ApiProperty({
    example: 'Full Stack Developer',
    description: 'Role in the project',
  })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({
    type: ArchitectureDto,
    description: 'Technical architecture details',
  })
  @IsObject()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @ValidateNested()
  @Type(() => ArchitectureDto)
  architecture: ArchitectureDto;

  @ApiProperty({
    type: ProblemSolutionDto,
    description: 'Problem and Solution statement',
  })
  @IsObject()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @ValidateNested()
  @Type(() => ProblemSolutionDto)
  problemSolution: ProblemSolutionDto;

  @ApiProperty({
    type: [MetricDto],
    description: 'Project performance or success metrics',
  })
  @IsArray()
  @ArrayNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @ValidateNested({ each: true })
  @Type(() => MetricDto)
  metrics: MetricDto[];

  @ApiProperty({
    type: [String],
    example: ['Mastered CI/CD'],
    description: 'Key takeaways from the project',
  })
  @IsArray()
  @ArrayNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @IsString({ each: true })
  lessons: string[];
}
