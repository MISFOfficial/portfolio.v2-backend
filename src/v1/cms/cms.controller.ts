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
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import type { Response } from 'express';

import { CmsService } from './cms.service';
import { CreateCmsDto } from './dto/create-cms.dto';
import { UpdateCmsDto } from './dto/update-cms.dto';
import { CmsPlatform } from './entities/cms.entity';
import { successHandler } from 'src/utils/successHandler';

@Controller('cms')
@ApiTags('CMS Projects')
export class CmsController {
  constructor(private readonly cmsService: CmsService) { }

  @Post('create')
  @ApiOperation({
    summary: 'Create a new CMS project',
    description:
      'Add a new project built on a CMS platform (WordPress, Shopify, etc.).',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Project images',
        },
        title: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        year: { type: 'string' },
        platform: {
          type: 'string',
          enum: Object.values(CmsPlatform),
        },
        badge: {
          type: 'object',
          properties: {
            text: { type: 'string' },
            color: { type: 'string' },
          },
        },
        description: { type: 'string' },
        liveUrl: { type: 'string' },
      },
      required: ['images', 'title', 'tags', 'year', 'platform', 'description'],
    },
  })
  @ApiResponse({ status: 201, description: 'CMS project created successfully' })
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() createCmsDto: CreateCmsDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Res() res: Response,
  ) {
    const result = await this.cmsService.create(createCmsDto, images);
    return successHandler({
      res,
      statusCode: HttpStatus.CREATED,
      message: 'CMS project created successfully',
      data: result,
    });
  }

  @Get('all')
  @ApiOperation({
    summary: 'Get all CMS projects',
    description: 'Fetch all projects built on CMS platforms.',
  })
  @ApiResponse({ status: 200, description: 'Returns all CMS projects.' })
  async findAll(@Query('limit') limit: string, @Res() res: Response) {
    const result = await this.cmsService.findAll(
      limit ? parseInt(limit, 10) : 10,
    );
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'CMS projects fetched successfully',
      data: result,
    });
  }

  @Get('one/:id')
  @ApiOperation({ summary: 'Get a CMS project by ID' })
  @ApiParam({ name: 'id', description: 'MongoDB Cms _id' })
  @ApiResponse({ status: 200, description: 'Returns CMS project details.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.cmsService.findOne(id);
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'CMS project fetched successfully',
      data: result,
    });
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Update a CMS project' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
        title: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        year: { type: 'string' },
        platform: {
          type: 'string',
          enum: Object.values(CmsPlatform),
        },
        badge: {
          type: 'object',
          properties: {
            text: { type: 'string' },
            color: { type: 'string' },
          },
        },
        description: { type: 'string' },
        liveUrl: { type: 'string' },
      },
    },
  })
  @ApiParam({ name: 'id', description: 'MongoDB Cms _id' })
  @ApiResponse({ status: 200, description: 'CMS project updated successfully' })
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id') id: string,
    @Body() updateCmsDto: UpdateCmsDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Res() res: Response,
  ) {
    const result = await this.cmsService.update(id, updateCmsDto, images);
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'CMS project updated successfully',
      data: result,
    });
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a CMS project' })
  @ApiParam({ name: 'id', description: 'MongoDB Cms _id' })
  @ApiResponse({ status: 200, description: 'CMS project deleted successfully' })
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.cmsService.remove(id);
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'CMS project deleted successfully',
      data: result,
    });
  }

  @Get('count')
  @ApiOperation({
    summary: 'Get total CMS project count',
    description: 'Retrieve the total number of CMS projects in the system.',
  })
  @ApiResponse({ status: 200, description: 'Returns the count of CMS projects.' })
  async count(@Res() res: Response) {
    const result = await this.cmsService.count();
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'CMS project count fetched successfully',
      data: { count: result },
    });
  }
}
