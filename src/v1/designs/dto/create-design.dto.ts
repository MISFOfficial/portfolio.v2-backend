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

export class DesignBadgePropertiesDto {
  @ApiProperty({ example: 'Premium', description: 'Badge text' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ example: 'blue', description: 'Badge color' })
  @IsString()
  @IsNotEmpty()
  color: string;
}

export class DesignBadgeDto {
  @ApiProperty({ type: DesignBadgePropertiesDto })
  @IsObject()
  @ValidateNested()
  @Type(() => DesignBadgePropertiesDto)
  properties: DesignBadgePropertiesDto;
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
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ example: '2026', description: 'Year of creation' })
  @IsString()
  @IsNotEmpty()
  year: string;

  @ApiPropertyOptional({ type: DesignBadgeDto })
  @IsOptional()
  @IsObject()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
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
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
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
}
