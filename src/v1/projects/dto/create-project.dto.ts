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
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    text: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    color: string;
}

class ArchitectureDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    frontend: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    backend: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    database: string;

    @ApiProperty({ type: [String] })
    @IsArray()
    @IsString({ each: true })
    infrastructure: string[];
}

class ProblemSolutionDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    problem: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    solution: string;
}

class MetricDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    label: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    value: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;
}

export class CreateProjectDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    slug: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    image: string;

    @ApiProperty({ type: [String] })
    @IsArray()
    @IsString({ each: true })
    tags: string[];

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    year: string;

    @ApiPropertyOptional({ type: Object, nullable: true })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => BadgeDto)
    badge?: BadgeDto | null;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    overlayText?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    fullDescription: string;

    @ApiProperty({ type: [String] })
    @IsArray()
    @IsString({ each: true })
    technologies: string[];

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    liveUrl?: string | null;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    githubUrl?: string | null;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    fgithubUrl?: string | null;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    bgithubUrl?: string | null;

    @ApiProperty({ type: [String] })
    @IsArray()
    @IsString({ each: true })
    features: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    role?: string;

    @ApiPropertyOptional({ type: Object })
    @IsOptional()
    @ValidateNested()
    @Type(() => ArchitectureDto)
    architecture?: ArchitectureDto;

    @ApiPropertyOptional({ type: Object })
    @IsOptional()
    @ValidateNested()
    @Type(() => ProblemSolutionDto)
    problemSolution?: ProblemSolutionDto;

    @ApiPropertyOptional({ type: Object, isArray: true })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => MetricDto)
    metrics?: MetricDto[];

    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    lessons?: string[];
}
