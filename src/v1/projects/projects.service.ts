import { Injectable, NotFoundException } from '@nestjs/common';
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
    images?: Express.Multer.File[],
  ): Promise<Project> {
    const projectData: any = { ...createProjectDto };

    if (images && images.length > 0) {
      const uploadedImages = await this.imageService.createMultiple(images);
      projectData.images = uploadedImages.map((img) => img._id);
    }

    const createdProject = new this.projectModel(projectData);
    return createdProject.save();
  }

  async findAll(): Promise<Project[]> {
    return this.projectModel.find().populate('images').exec();
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectModel
      .findOne({ id })
      .populate('images')
      .exec();
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    images?: Express.Multer.File[],
  ): Promise<Project> {
    const projectData: any = { ...updateProjectDto };

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
      .findOneAndUpdate({ id }, projectData, { new: true })
      .populate('images')
      .exec();
    if (!updatedProject) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return updatedProject;
  }

  async remove(id: string): Promise<any> {
    const result = await this.projectModel.deleteOne({ id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return { deleted: true };
  }
}
