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
import { BadRequestException } from '@nestjs/common';

const SafeJsonParse = ({ value, key }) => {
  let parsed = value;
  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value);
    } catch (e) {
      throw new BadRequestException(
        `Invalid JSON format for field "${key}": ${e.message}`,
      );
    }
  }
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    if (parsed.properties) return parsed.properties;
    if (parsed.property) return parsed.property;
  }
  return parsed;
};

export class DesignBadgeDto {
  @ApiProperty({ example: 'Premium', description: 'Badge text' })
  @IsString()
  text: string;

  @ApiProperty({ example: 'blue', description: 'Badge color' })
  @IsString()
  color: string;
}

export class CreateDesignDto {
  @ApiProperty({ example: 'Serpolino', description: 'Title of the design' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: [String],
    example: ['UI/UX', 'SEO'],
    description: 'Category tags',
  })
  @IsArray()
  @ArrayNotEmpty()
  @Transform(SafeJsonParse)
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ example: '2026', description: 'Year of creation' })
  @IsString()
  @IsNotEmpty()
  year: string;

  @ApiPropertyOptional({ type: DesignBadgeDto, nullable: true })
  @IsOptional()
  @IsObject()
  @Transform(SafeJsonParse)
  @ValidateNested()
  @Type(() => DesignBadgeDto)
  badge?: DesignBadgeDto | null;

  @ApiProperty({
    example: 'A sleek design...',
    description: 'Design description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    type: [String],
    example: ['Figma', 'Adobe Illustrator'],
    description: 'Tools used',
  })
  @IsArray()
  @ArrayNotEmpty()
  @Transform(SafeJsonParse)
  @IsString({ each: true })
  tools: string[];

  @ApiPropertyOptional({ example: 'https://behance.net/...' })
  @IsOptional()
  @IsString()
  behanceUrl?: string | null;

  @ApiPropertyOptional({ example: 'https://dribbble.com/...' })
  @IsOptional()
  @IsString()
  dribbbleUrl?: string | null;

  @ApiPropertyOptional({ example: 'https://figma.com/...' })
  @IsOptional()
  @IsString()
  figmaUrl?: string | null;

  @ApiProperty({ type: 'string', format: 'binary', description: 'Cover image' })
  @IsOptional()
  image?: any;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Gallery images',
  })
  @IsOptional()
  images?: any[];
}
