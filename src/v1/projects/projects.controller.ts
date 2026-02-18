import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import type { Response } from 'express';

import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { successHandler } from 'src/utils/successHandler';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Post('create')
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'The project has been successfully created.' })
  async create(@Body() createProjectDto: CreateProjectDto, @Res() res: Response) {
    const result = await this.projectsService.create(createProjectDto);
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Project created successfully',
      data: result,
    });
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'Return all projects.' })
  findAll(@Res() res: Response) {
    const result = this.projectsService.findAll();
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Projects fetched successfully',
      data: result,
    });
  }

  @Get('one/:id')
  @ApiOperation({ summary: 'Get a project by id' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'Return a single project.' })
  findOne(@Param('id') id: string, @Res() res: Response) {
    const result = this.projectsService.findOne(id);
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Project fetched successfully',
      data: result,
    });
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'The project has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Res() res: Response) {
    const result = this.projectsService.update(id, updateProjectDto);
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Project updated successfully',
      data: result,
    });
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a project' })
  @ApiParam({ name: 'id', description: 'Project ID' })
  @ApiResponse({ status: 200, description: 'The project has been successfully deleted.' })
  remove(@Param('id') id: string, @Res() res: Response) {
    const result = this.projectsService.remove(id);
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Project deleted successfully',
      data: result,
    });
  }
}
