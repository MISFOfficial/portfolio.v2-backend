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
  ) { }

  async create(
    createProjectDto: CreateProjectDto,
    coverImage?: Express.Multer.File,
    galleryImages?: Express.Multer.File[],
  ): Promise<any> {
    if (!coverImage && (!galleryImages || galleryImages.length === 0)) {
      throw new BadRequestException('At least one project image is required');
    }

    const projectData: any = { ...createProjectDto };
    const allImageIds: any[] = [];

    if (coverImage) {
      const uploaded = await this.imageService.create(coverImage);
      allImageIds.push(uploaded._id);
    }

    if (galleryImages && galleryImages.length > 0) {
      const uploaded = await this.imageService.createMultiple(galleryImages);
      allImageIds.push(...uploaded.map((img) => img._id));
    }

    projectData.images = allImageIds;

    console.log(projectData);

    const createdProject = new this.projectModel(projectData);
    const saved = await createdProject.save();
    return saved.populate({ path: 'images', model: 'Image' });
  }

  async findAll(limit: number = 3): Promise<any[]> {
    return this.projectModel
      .find()
      .populate({ path: 'images', model: 'Image' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async findOne(id: string): Promise<any> {
    const project = await this.projectModel
      .findById(id)
      .populate({ path: 'images', model: 'Image' })
      .exec();
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    coverImage?: Express.Multer.File,
    galleryImages?: Express.Multer.File[],
  ): Promise<any> {
    const projectData: any = { ...updateProjectDto };

    const newImageIds: any[] = [];

    if (coverImage) {
      const uploaded = await this.imageService.create(coverImage);
      newImageIds.push(uploaded._id);
    }

    if (galleryImages && galleryImages.length > 0) {
      const uploaded = await this.imageService.createMultiple(galleryImages);
      newImageIds.push(...uploaded.map((img) => img._id));
    }

    if (newImageIds.length > 0) {
      const existing = await this.findOne(id);
      const existingIds = (existing.images || []).map((img: any) =>
        img._id ? img._id : img,
      );
      projectData.images = [...existingIds, ...newImageIds];
    }

    const updated = await this.projectModel
      .findByIdAndUpdate(id, projectData, { new: true })
      .populate({ path: 'images', model: 'Image' })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<any> {
    const project = await this.projectModel.findById(id).exec();
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // 1. Delete associated images
    if (project.images && project.images.length > 0) {
      for (const image of project.images) {
        const imageId = (image as any)._id ? (image as any)._id : image;
        await this.imageService.remove(imageId.toString());
      }
    }

    // 2. Delete project record
    await this.projectModel.findByIdAndDelete(id).exec();

    return { deleted: true };
  }

  async count(): Promise<number> {
    return this.projectModel.countDocuments().exec();
  }
}
