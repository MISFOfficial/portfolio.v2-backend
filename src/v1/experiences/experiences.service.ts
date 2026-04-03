import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { Experience, ExperienceDocument } from './entities/experience.entity';
import { ImageService } from 'src/image/image.service';

@Injectable()
export class ExperiencesService {
  constructor(
    @InjectModel(Experience.name)
    private experienceModel: Model<ExperienceDocument>,
    private readonly imageService: ImageService,
  ) {}

  async create(
    createExperienceDto: CreateExperienceDto,
    image?: Express.Multer.File, // Single image upload
  ): Promise<Experience> {
    const experienceData: any = { ...createExperienceDto };

    if (!image) {
      throw new BadRequestException('Experience image is required');
    }

    const uploadedImage = await this.imageService.create(image);
    experienceData.image = uploadedImage._id;

    const createdExperience = new this.experienceModel(experienceData);
    const savedExperience = await createdExperience.save();
    return savedExperience.populate(['image']);
  }

  async findAll(): Promise<Experience[]> {
    return this.experienceModel.find().populate(['image']).exec();
  }

  async findOne(id: string): Promise<Experience> {
    const experience = await this.experienceModel
      .findById(id)
      .populate(['image'])
      .exec();
    if (!experience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }
    return experience;
  }

  async update(
    id: string,
    updateExperienceDto: UpdateExperienceDto,
    image?: Express.Multer.File,
  ): Promise<Experience> {
    const experienceData: any = { ...updateExperienceDto };
    const existingExperience = await this.findOne(id);

    if (image) {
      // 1. Delete old image if it exists
      if (existingExperience.image) {
        const oldImageId = (existingExperience.image as any)._id
          ? (existingExperience.image as any)._id
          : existingExperience.image;
        await this.imageService.remove(oldImageId.toString());
      }

      // 2. Upload new image
      const uploadedImage = await this.imageService.create(image);
      experienceData.image = uploadedImage._id;
    }

    const updatedExperience = await this.experienceModel
      .findByIdAndUpdate(id, experienceData, { new: true })
      .populate(['image'])
      .exec();

    if (!updatedExperience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }
    return updatedExperience;
  }

  async remove(id: string): Promise<any> {
    const experience = await this.findOne(id);

    // 1. Delete associated image
    if (experience.image) {
      const imageId = (experience.image as any)._id
        ? (experience.image as any)._id
        : experience.image;
      await this.imageService.remove(imageId.toString());
    }

    // 2. Delete experience record
    const result = await this.experienceModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }
    return { deleted: true };
  }
}
