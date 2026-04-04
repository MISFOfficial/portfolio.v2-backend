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
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillCategory } from './entities/skill.entity';
import { successHandler } from 'src/utils/successHandler';

@Controller('skills')
@ApiTags('Skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Create a new skill',
    description: 'Add a new professional skill to the portfolio.',
  })
  @ApiResponse({ status: 201, description: 'Skill created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createSkillDto: CreateSkillDto, @Res() res: Response) {
    const result = await this.skillsService.create(createSkillDto);
    return successHandler({
      res,
      statusCode: HttpStatus.CREATED,
      message: 'Skill created successfully',
      data: result,
    });
  }

  @Get('all')
  @ApiOperation({
    summary: 'Get all skills',
    description: 'Fetch all skills organized by category.',
  })
  @ApiResponse({ status: 200, description: 'Returns all skills.' })
  async findAll(@Res() res: Response) {
    const result = await this.skillsService.findAll();
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Skills fetched successfully',
      data: result,
    });
  }

  @Get('category/:category')
  @ApiOperation({
    summary: 'Get skills by category',
    description: 'Filter skills by category (frontend, backend, softskill).',
  })
  @ApiParam({
    name: 'category',
    enum: SkillCategory,
    description: 'The category of skills to retrieve',
  })
  @ApiResponse({ status: 200, description: 'Returns filtered skills.' })
  async findByCategory(
    @Param('category') category: SkillCategory,
    @Res() res: Response,
  ) {
    const result = await this.skillsService.findByCategory(category);
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: `Skills for category ${category} fetched successfully`,
      data: result,
    });
  }

  @Get('one/:id')
  @ApiOperation({
    summary: 'Get a skill by ID',
    description: 'Retrieve details of a specific skill using its MongoDB _id.',
  })
  @ApiParam({ name: 'id', description: 'MongoDB Skill _id' })
  @ApiResponse({ status: 200, description: 'Returns skill details.' })
  @ApiResponse({ status: 404, description: 'Skill not found.' })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.skillsService.findOne(id);
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Skill fetched successfully',
      data: result,
    });
  }

  @Patch('update/:id')
  @ApiOperation({
    summary: 'Update a skill',
    description: 'Modify an existing skill using its MongoDB _id.',
  })
  @ApiParam({ name: 'id', description: 'MongoDB Skill _id' })
  @ApiResponse({ status: 200, description: 'Skill updated successfully' })
  @ApiResponse({ status: 404, description: 'Skill not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto,
    @Res() res: Response,
  ) {
    const result = await this.skillsService.update(id, updateSkillDto);
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Skill updated successfully',
      data: result,
    });
  }

  @Delete('delete/:id')
  @ApiOperation({
    summary: 'Delete a skill',
    description: 'Permanently remove a skill using its MongoDB _id.',
  })
  @ApiParam({ name: 'id', description: 'MongoDB Skill _id' })
  @ApiResponse({ status: 200, description: 'Skill deleted successfully' })
  @ApiResponse({ status: 404, description: 'Skill not found.' })
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.skillsService.remove(id);
    return successHandler({
      res,
      statusCode: HttpStatus.OK,
      message: 'Skill deleted successfully',
      data: result,
    });
  }

  @Post('seed')
  @ApiOperation({
    summary: 'Seed initial skills data',
    description: 'Populates the database with initial skills from Data.ts.',
  })
  @ApiResponse({ status: 201, description: 'Seeding successful' })
  async seed(@Res() res: Response) {
    const result = await this.skillsService.seed();
    return successHandler({
      res,
      statusCode: HttpStatus.CREATED,
      message: result.message,
      data: result,
    });
  }
}
