import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectDocument } from './entities/project.entity';
import { ImageService } from 'src/image/image.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,
    private readonly imageService: ImageService,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    image?: Express.Multer.File,
    images?: Express.Multer.File[],
  ): Promise<Project> {
    if (!image) {
      throw new BadRequestException('Project cover image is required');
    }
    if (!images || images.length === 0) {
      throw new BadRequestException(
        'At least one additional project image is required',
      );
    }
    const projectData: any = { ...createProjectDto };

    if (image) {
      const uploadedImage = await this.imageService.create(image);
      projectData.image = uploadedImage._id;
    }

    if (images && images.length > 0) {
      const uploadedImages = await this.imageService.createMultiple(images);
      projectData.images = uploadedImages.map((img) => img._id);
    }

    const createdProject = new this.projectModel(projectData);
    const savedProject = await createdProject.save();
    return savedProject.populate(['image', 'images']);
  }

  async findAll(): Promise<Project[]> {
    return this.projectModel.find().populate(['image', 'images']).exec();
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectModel
      .findById(id)
      .populate(['image', 'images'])
      .exec();
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    image?: Express.Multer.File,
    images?: Express.Multer.File[],
  ): Promise<Project> {
    const projectData: any = { ...updateProjectDto };

    if (image) {
      const uploadedImage = await this.imageService.create(image);
      projectData.image = uploadedImage._id;
    }

    if (images && images.length > 0) {
      const uploadedImages = await this.imageService.createMultiple(images);
      const newImageIds = uploadedImages.map((img) => img._id);

      const existingProject = await this.findOne(id);
      projectData.images = [
        ...(existingProject.images || []).map((img: any) =>
          img._id ? img._id : img,
        ),
        ...newImageIds,
      ];
    }

    const updatedProject = await this.projectModel
      .findByIdAndUpdate(id, projectData, { new: true })
      .populate(['image', 'images'])
      .exec();
    if (!updatedProject) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return updatedProject;
  }

  async remove(id: string): Promise<any> {
    const result = await this.projectModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return { deleted: true };
  }
}
