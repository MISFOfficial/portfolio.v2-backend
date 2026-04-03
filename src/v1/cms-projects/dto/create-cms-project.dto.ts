import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

class BadgeDto {
  @ApiProperty({ example: 'Live' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ example: 'bg-[#22c55e]' })
  @IsString()
  @IsNotEmpty()
  color: string;
}

export class CreateCmsProjectDto {
  @ApiProperty({ example: 'TutorSheba' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: [String], example: ['Education', 'LMS'] })
  @IsArray()
  @ArrayNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ example: '2026' })
  @IsString()
  @IsNotEmpty()
  year: string;

  @ApiProperty({
    enum: ['WordPress', 'Shopify', 'Webflow', 'Wix', 'Squarespace'],
    example: 'WordPress',
  })
  @IsEnum(['WordPress', 'Shopify', 'Webflow', 'Wix', 'Squarespace'])
  @IsNotEmpty()
  platform: string;

  @ApiPropertyOptional({ type: BadgeDto })
  @IsOptional()
  @IsObject()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @ValidateNested()
  @Type(() => BadgeDto)
  badge?: BadgeDto;

  @ApiProperty({ example: 'A professional tutor marketplace...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'https://tutorsheba.com' })
  @IsOptional()
  @IsString()
  liveUrl?: string;
}
