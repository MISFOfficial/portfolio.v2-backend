import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCertificateDto {
  @ApiProperty({
    example: 'Full Stack Web Development',
    description: 'Title of the certificate',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Programming Hero',
    description: 'The organization that provided the certificate',
  })
  @IsString()
  @IsNotEmpty()
  provider: string;

  @ApiProperty({ example: '6 Months', description: 'Duration of the course' })
  @IsString()
  @IsNotEmpty()
  duration: string;

  @ApiProperty({ example: '180 Days', description: 'Exact time taken' })
  @IsString()
  @IsNotEmpty()
  timeTaken: string;

  @ApiProperty({
    type: [String],
    example: ['Understanding Async JS', 'Redux Toolkit'],
    description: 'Key challenges faced during the course',
  })
  @IsArray()
  @ArrayNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @IsString({ each: true })
  challenges: string[];

  @ApiProperty({ example: 5, description: 'Rating (1-5)' })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  rating: number;

  @ApiProperty({
    example: 'Comprehensive boot camp...',
    description: 'Short description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'This intensive program focused on...',
    description: 'Full program details',
  })
  @IsString()
  @IsNotEmpty()
  fullDescription: string;

  @ApiProperty({
    type: [String],
    example: ['React', 'Node.js', 'MongoDB'],
    description: 'Skills learned during the course',
  })
  @IsArray()
  @ArrayNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @IsString({ each: true })
  skillsLearned: string[];

  @ApiProperty({ example: 'December 2024', description: 'Certification date' })
  @IsString()
  @IsNotEmpty()
  certifiedAt: string;

  @ApiProperty({ example: '2024-12-15', description: 'ISO Issue Date' })
  @IsString()
  @IsNotEmpty()
  issueDate: string;
}
