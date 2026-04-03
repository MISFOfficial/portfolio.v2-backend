import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCmsProjectDto } from './dto/create-cms-project.dto';
import { UpdateCmsProjectDto } from './dto/update-cms-project.dto';
import { CmsProject, CmsProjectDocument } from './entities/cms-project.entity';
import { ImageService } from 'src/image/image.service';

@Injectable()
export class CmsProjectsService {
  constructor(
    @InjectModel(CmsProject.name)
    private cmsProjectModel: Model<CmsProjectDocument>,
    private readonly imageService: ImageService,
  ) {}

  async create(
    createCmsProjectDto: CreateCmsProjectDto,
    image?: Express.Multer.File,
  ): Promise<CmsProject> {
    if (!image) {
      throw new BadRequestException('Project image is required');
    }

    const projectData: any = { ...createCmsProjectDto };

    if (image) {
      const uploadedImage = await this.imageService.create(image);
      projectData.image = uploadedImage._id;
    }

    const createdProject = new this.cmsProjectModel(projectData);
    const savedProject = await createdProject.save();
    return savedProject.populate(['image']);
  }

  async findAll(): Promise<CmsProject[]> {
    return this.cmsProjectModel.find().populate(['image']).exec();
  }

  async findOne(id: string): Promise<CmsProject> {
    const project = await this.cmsProjectModel
      .findById(id)
      .populate(['image'])
      .exec();
    if (!project) {
      throw new NotFoundException(`CMS Project with ID ${id} not found`);
    }
    return project;
  }

  async update(
    id: string,
    updateCmsProjectDto: UpdateCmsProjectDto,
    image?: Express.Multer.File,
  ): Promise<CmsProject> {
    const projectData: any = { ...updateCmsProjectDto };

    if (image) {
      const uploadedImage = await this.imageService.create(image);
      projectData.image = uploadedImage._id;
    }

    const updatedProject = await this.cmsProjectModel
      .findByIdAndUpdate(id, projectData, { new: true })
      .populate(['image'])
      .exec();

    if (!updatedProject) {
      throw new NotFoundException(`CMS Project with ID ${id} not found`);
    }

    return updatedProject;
  }

  async remove(id: string): Promise<any> {
    const result = await this.cmsProjectModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`CMS Project with ID ${id} not found`);
    }
    return { deleted: true };
  }
}
