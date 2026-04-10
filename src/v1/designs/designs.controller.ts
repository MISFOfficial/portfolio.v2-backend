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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import type { Response } from 'express';

import { DesignsService } from './designs.service';
import { CreateDesignDto } from './dto/create-design.dto';
import { UpdateDesignDto } from './dto/update-design.dto';
import { successHandler } from 'src/utils/successHandler';

@Controller('designs')
@ApiTags('Designs')
export class DesignsController {
  constructor(private readonly designsService: DesignsService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Create a new design',
    description:
      'Store a new design entry in the database with multiple images.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateDesignDto })
  @ApiResponse({ status: 201, description: 'Design created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
  )
  async create(
    @Body() createDesignDto: CreateDesignDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; images?: Express.Multer.File[] },
    @Res() res: Response,
  ) {
    const result = await this.designsService.create(
      createDesignDto,
      files?.image?.[0],
      files?.images,
    );
    return successHandler({
      res,
      statusCode: HttpStatus.CREATED,
      message: 'Design created successfully',
      data: result,
    });
  }

  @Get('all')
  @ApiOperation({
    summary: 'Get all designs',
    description: 'Fetch a list of all design entries.',
  })
  @ApiResponse({ status: 200, description: 'Returns all designs.' })
  async findAll(@Query('limit') limit: string, @Res() res: Response) {
    const result = await this.designsService.findAll(
      limit ? parseInt(limit, 10) : 3,
    );
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Designs fetched successfully',
      data: result,
    });
  }

  @Get('one/:id')
  @ApiOperation({
    summary: 'Get a design by id',
    description: 'Retrieve details of a specific design.',
  })
  @ApiParam({ name: 'id', description: 'MongoDB Design _id' })
  @ApiResponse({ status: 200, description: 'Record found.' })
  @ApiResponse({ status: 404, description: 'Design not found.' })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.designsService.findOne(id);
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Design fetched successfully',
      data: result,
    });
  }

  @Patch('update/:id')
  @ApiOperation({
    summary: 'Update a design',
    description: 'Modify an existing design entry.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateDesignDto })
  @ApiParam({ name: 'id', description: 'MongoDB Design _id' })
  @ApiResponse({ status: 200, description: 'Design updated successfully.' })
  @ApiResponse({ status: 404, description: 'Design not found.' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'images', maxCount: 10 },
    ]),
  )
  async update(
    @Param('id') id: string,
    @Body() updateDesignDto: UpdateDesignDto,
    @UploadedFiles()
    files: { image?: Express.Multer.File[]; images?: Express.Multer.File[] },
    @Res() res: Response,
  ) {
    const result = await this.designsService.update(
      id,
      updateDesignDto,
      files?.image?.[0],
      files?.images,
    );
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Design updated successfully',
      data: result,
    });
  }

  @Delete('delete/:id')
  @ApiOperation({
    summary: 'Delete a design',
    description: 'Remove a design from the database.',
  })
  @ApiParam({ name: 'id', description: 'MongoDB Design _id' })
  @ApiResponse({ status: 200, description: 'Record removed.' })
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.designsService.remove(id);
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Design deleted successfully',
      data: result,
    });
  }

  @Get('count')
  @ApiOperation({
    summary: 'Get total design count',
    description: 'Retrieve the total number of designs in the system.',
  })
  @ApiResponse({ status: 200, description: 'Returns the count of designs.' })
  async count(@Res() res: Response) {
    const result = await this.designsService.count();
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Design count fetched successfully',
      data: result,
    });
  }
}
