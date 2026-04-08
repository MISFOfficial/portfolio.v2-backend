import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CmsPlatform } from '../entities/cms.entity';

export class CmsBadgeDto {
  @ApiProperty({ example: 'Live', description: 'Badge text' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ example: 'bg-[#22c55e]', description: 'Badge color class' })
  @IsString()
  @IsNotEmpty()
  color: string;
}

export class CreateCmsDto {
  @ApiProperty({ example: 'TutorSheba', description: 'Title of the project' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: [String],
    example: ['Education', 'LMS'],
    description: 'Project tags',
  })
  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ example: '2026', description: 'Creation year' })
  @IsString()
  @IsNotEmpty()
  year: string;

  @ApiProperty({
    enum: CmsPlatform,
    example: CmsPlatform.WORDPRESS,
    description: 'CMS platform used',
  })
  @IsEnum(CmsPlatform)
  @IsNotEmpty()
  platform: CmsPlatform;

  @ApiPropertyOptional({ type: CmsBadgeDto })
  @IsOptional()
  @IsObject()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @ValidateNested()
  @Type(() => CmsBadgeDto)
  badge?: CmsBadgeDto | null;

  @ApiProperty({
    example: 'A professional tutor marketplace...',
    description: 'Short project description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'https://tutorsheba.com' })
  @IsOptional()
  @IsUrl()
  liveUrl?: string | null;
}
