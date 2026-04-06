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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  FilesInterceptor,
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import type { Response } from 'express';

import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { successHandler } from 'src/utils/successHandler';

@Controller('projects')
@ApiTags('Projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Create a new project',
    description:
      'Store a new project entry in the database with full details and multiple images.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProjectDto })
  @ApiResponse({
    status: 201,
    description: 'The project has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
  )
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; images?: Express.Multer.File[] },
    @Res() res: Response,
  ) {
    const result = await this.projectsService.create(
      createProjectDto,
      files?.image?.[0],
      files?.images,
    );
    return successHandler({
      res,
      statusCode: HttpStatus.CREATED,
      message: 'Project created successfully',
      data: result,
    });
  }

  @Get('all')
  @ApiOperation({
    summary: 'Get all projects',
    description: 'Fetch a list of all projects available in the system.',
  })
  @ApiResponse({ status: 200, description: 'Returns all project records.' })
  async findAll(@Res() res: Response) {
    const result = await this.projectsService.findAll();
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Projects fetched successfully',
      data: result,
    });
  }

  @Get('one/:id')
  @ApiOperation({
    summary: 'Get a project by id',
    description: 'Retrieve details of a specific project by its MongoDB _id.',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB Project _id',
    example: '60d5f9f9e6bcfb0015f8a0a8',
  })
  @ApiResponse({ status: 200, description: 'Found record details.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.projectsService.findOne(id);
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Project fetched successfully',
      data: result,
    });
  }

  @Patch('update/:id')
  @ApiOperation({
    summary: 'Update a project',
    description: 'Modify an existing project entry using its MongoDB _id.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateProjectDto })
  @ApiParam({
    name: 'id',
    description: 'MongoDB Project _id',
    example: '60d5f9f9e6bcfb0015f8a0a8',
  })
  @ApiResponse({
    status: 200,
    description: 'The project record has been updated.',
  })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
  )
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; images?: Express.Multer.File[] },
    @Res() res: Response,
  ) {
    const result = await this.projectsService.update(
      id,
      updateProjectDto,
      files?.image?.[0],
      files?.images,
    );
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Project updated successfully',
      data: result,
    });
  }

  @Delete('delete/:id')
  @ApiOperation({
    summary: 'Delete a project',
    description: 'Permanently remove a project entry using its MongoDB _id.',
  })
  @ApiParam({
    name: 'id',
    description: 'MongoDB Project _id',
    example: '60d5f9f9e6bcfb0015f8a0a8',
  })
  @ApiResponse({ status: 200, description: 'Record has been removed.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.projectsService.remove(id);
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Project deleted successfully',
      data: result,
    });
  }
}
