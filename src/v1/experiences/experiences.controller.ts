import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import type { Response } from 'express';

import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { successHandler } from 'src/utils/successHandler';

@Controller('v1/experiences')
@ApiTags('Experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Create a new experience',
    description:
      'Store a new experience entry in the database with full details.',
  })
  @ApiResponse({
    status: 201,
    description: 'The experience has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(
    @Body() createExperienceDto: CreateExperienceDto,
    @Res() res: Response,
  ) {
    const result = await this.experiencesService.create(createExperienceDto);
    return successHandler({
      res,
      statusCode: HttpStatus.CREATED,
      message: 'Experience created successfully',
      data: result,
    });
  }

  @Get('all')
  @ApiOperation({
    summary: 'Get all experiences',
    description:
      'Fetch a list of all experience entries available in the system.',
  })
  @ApiResponse({ status: 200, description: 'Returns all experience records.' })
  async findAll(@Res() res: Response) {
    const result = await this.experiencesService.findAll();
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Experiences fetched successfully',
      data: result,
    });
  }

  @Get('one/:id')
  @ApiOperation({
    summary: 'Get an experience by id',
    description:
      'Retrieve details of a specific experience by its unique ID (NOT Mongo _id).',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique Experience ID',
    example: 'exp-001',
  })
  @ApiResponse({ status: 200, description: 'Found record details.' })
  @ApiResponse({ status: 404, description: 'Experience not found.' })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.experiencesService.findOne(id);
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Experience fetched successfully',
      data: result,
    });
  }

  @Patch('update/:id')
  @ApiOperation({
    summary: 'Update an experience',
    description: 'Modify an existing experience entry using its unique ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique Experience ID',
    example: 'exp-001',
  })
  @ApiResponse({
    status: 200,
    description: 'The experience record has been updated.',
  })
  @ApiResponse({ status: 404, description: 'Experience not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateExperienceDto: UpdateExperienceDto,
    @Res() res: Response,
  ) {
    const result = await this.experiencesService.update(
      id,
      updateExperienceDto,
    );
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Experience updated successfully',
      data: result,
    });
  }

  @Delete('delete/:id')
  @ApiOperation({
    summary: 'Delete an experience',
    description: 'Permanently remove an experience entry using its unique ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique Experience ID',
    example: 'exp-001',
  })
  @ApiResponse({ status: 200, description: 'Record has been removed.' })
  @ApiResponse({ status: 404, description: 'Experience not found.' })
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.experiencesService.remove(id);
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Experience deleted successfully',
      data: result,
    });
  }
}
