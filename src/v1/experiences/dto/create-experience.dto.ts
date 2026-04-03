import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateExperienceDto {
  @ApiProperty({
    example: 'exp-001',
    description: 'Unique identifier for the experience',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'Aviro Soft', description: 'Name of the company' })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({
    example: 'Jr. Software Engineer',
    description: 'Role in the company',
  })
  @IsString()
  @IsNotEmpty()
  role: string;

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
    example: 'https://i.ibb.co.com/p6ZkhwLJ/image.png',
    description: 'Company logo URL',
  })
  @IsUrl()
  @IsNotEmpty()
  logo: string;

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
  @IsString({ each: true })
  responsibilities: string[];

  @ApiProperty({
    type: [String],
    example: ['React', 'Next.js', 'Node.js'],
    description: 'Technologies used',
  })
  @IsArray()
  @IsString({ each: true })
  technologies: string[];

  @ApiProperty({
    type: [String],
    example: ['Improved performance by 20%', 'Delivered project on time'],
    description: 'Key achievements',
  })
  @IsArray()
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
