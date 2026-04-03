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
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import type { Response } from 'express';

import { CmsProjectsService } from './cms-projects.service';
import { CreateCmsProjectDto } from './dto/create-cms-project.dto';
import { UpdateCmsProjectDto } from './dto/update-cms-project.dto';
import { successHandler } from 'src/utils/successHandler';

@Controller('cms-projects')
@ApiTags('CMS Projects')
export class CmsProjectsController {
  constructor(private readonly cmsProjectsService: CmsProjectsService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Create a new CMS project',
    description: 'Store a new CMS project entry in the database with an image.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
        title: { type: 'string' },
        year: { type: 'string' },
        platform: {
          type: 'string',
          enum: ['WordPress', 'Shopify', 'Webflow', 'Wix', 'Squarespace'],
        },
        description: { type: 'string' },
        liveUrl: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        badge: {
          type: 'object',
          properties: {
            text: { type: 'string' },
            color: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'CMS Project created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createCmsProjectDto: CreateCmsProjectDto,
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ) {
    const result = await this.cmsProjectsService.create(
      createCmsProjectDto,
      image,
    );
    return successHandler({
      res,
      statusCode: HttpStatus.CREATED,
      message: 'CMS Project created successfully',
      data: result,
    });
  }

  @Get('all')
  @ApiOperation({
    summary: 'Get all CMS projects',
    description: 'Fetch a list of all CMS project entries.',
  })
  @ApiResponse({ status: 200, description: 'Returns all CMS projects.' })
  async findAll(@Res() res: Response) {
    const result = await this.cmsProjectsService.findAll();
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'CMS Projects fetched successfully',
      data: result,
    });
  }

  @Get('one/:id')
  @ApiOperation({
    summary: 'Get a CMS project by id',
    description: 'Retrieve details of a specific CMS project.',
  })
  @ApiParam({ name: 'id', description: 'MongoDB CMS Project _id' })
  @ApiResponse({ status: 200, description: 'Record found.' })
  @ApiResponse({ status: 404, description: 'CMS Project not found.' })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.cmsProjectsService.findOne(id);
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'CMS Project fetched successfully',
      data: result,
    });
  }

  @Patch('update/:id')
  @ApiOperation({
    summary: 'Update a CMS project',
    description: 'Modify an existing CMS project entry.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'MongoDB CMS Project _id' })
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateCmsProjectDto: UpdateCmsProjectDto,
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ) {
    const result = await this.cmsProjectsService.update(
      id,
      updateCmsProjectDto,
      image,
    );
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'CMS Project updated successfully',
      data: result,
    });
  }

  @Delete('delete/:id')
  @ApiOperation({
    summary: 'Delete a CMS project',
    description: 'Remove a CMS project from the database.',
  })
  @ApiParam({ name: 'id', description: 'MongoDB CMS Project _id' })
  @ApiResponse({ status: 200, description: 'Record removed.' })
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.cmsProjectsService.remove(id);
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'CMS Project deleted successfully',
      data: result,
    });
  }
}
