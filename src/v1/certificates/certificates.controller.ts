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

import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { successHandler } from 'src/utils/successHandler';

@Controller('certificates')
@ApiTags('Certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Create a new certificate',
    description: 'Store a new certificate entry in the database with an image.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary' },
        title: { type: 'string' },
        provider: { type: 'string' },
        duration: { type: 'string' },
        timeTaken: { type: 'string' },
        rating: { type: 'number' },
        description: { type: 'string' },
        fullDescription: { type: 'string' },
        certifiedAt: { type: 'string' },
        issueDate: { type: 'string' },
        challenges: { type: 'array', items: { type: 'string' } },
        skillsLearned: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Certificate created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createCertificateDto: CreateCertificateDto,
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ) {
    const result = await this.certificatesService.create(
      createCertificateDto,
      image,
    );
    return successHandler({
      res,
      statusCode: HttpStatus.CREATED,
      message: 'Certificate created successfully',
      data: result,
    });
  }

  @Get('all')
  @ApiOperation({
    summary: 'Get all certificates',
    description: 'Fetch a list of all certificate entries.',
  })
  @ApiResponse({ status: 200, description: 'Returns all certificates.' })
  async findAll(@Res() res: Response) {
    const result = await this.certificatesService.findAll();
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Certificates fetched successfully',
      data: result,
    });
  }

  @Get('one/:id')
  @ApiOperation({
    summary: 'Get a certificate by id',
    description: 'Retrieve details of a specific certificate.',
  })
  @ApiParam({ name: 'id', description: 'MongoDB Certificate _id' })
  @ApiResponse({ status: 200, description: 'Record found.' })
  @ApiResponse({ status: 404, description: 'Certificate not found.' })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.certificatesService.findOne(id);
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Certificate fetched successfully',
      data: result,
    });
  }

  @Patch('update/:id')
  @ApiOperation({
    summary: 'Update a certificate',
    description: 'Modify an existing certificate entry.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'MongoDB Certificate _id' })
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateCertificateDto: UpdateCertificateDto,
    @UploadedFile() image: Express.Multer.File,
    @Res() res: Response,
  ) {
    const result = await this.certificatesService.update(
      id,
      updateCertificateDto,
      image,
    );
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Certificate updated successfully',
      data: result,
    });
  }

  @Delete('delete/:id')
  @ApiOperation({
    summary: 'Delete a certificate',
    description: 'Remove a certificate from the database.',
  })
  @ApiParam({ name: 'id', description: 'MongoDB Certificate _id' })
  @ApiResponse({ status: 200, description: 'Record removed.' })
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.certificatesService.remove(id);
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Certificate deleted successfully',
      data: result,
    });
  }
}
