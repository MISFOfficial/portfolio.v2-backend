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

  async findAll(limit: number = 3): Promise<any[]> {
    const experiences = await this.experienceModel
      .find()
      .populate('image')
      .populate('images')
      .limit(limit)
      .exec();

    return experiences.map((exp) => {
      const obj = exp.toObject();
      // Fallback: If image is missing but images array has data, use the first one
      if (!obj.image && obj.images && obj.images.length > 0) {
        obj.image = obj.images[0];
      }
      delete obj.images; // Always remove the legacy plural field from response
      return obj;
    });
  }

  async findOne(id: string): Promise<any> {
    const experience = await this.experienceModel
      .findById(id)
      .populate('image')
      .populate('images')
      .exec();

    if (!experience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    const obj = experience.toObject();
    // Fallback: If image is missing but images array has data, use the first one
    if (!obj.image && obj.images && obj.images.length > 0) {
      obj.image = obj.images[0];
    }
    delete obj.images; // Always remove the legacy plural field from response
    return obj;
  }

  async update(
    id: string,
    updateExperienceDto: UpdateExperienceDto,
    image?: Express.Multer.File,
  ): Promise<any> {
    const experienceData: any = { ...updateExperienceDto };
    const existingExperience = await this.experienceModel.findById(id).exec();

    if (!existingExperience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    if (image) {
      // 1. Delete old image (from either field)
      const oldImageId =
        existingExperience.image ||
        (existingExperience.images && existingExperience.images.length > 0
          ? existingExperience.images[0]
          : null);

      if (oldImageId) {
        await this.imageService.remove(oldImageId.toString());
      }

      // 2. Upload new image
      const uploadedImage = await this.imageService.create(image);
      experienceData.image = uploadedImage._id;
      experienceData.images = []; // Clear legacy field on update
    }

    const updatedExperience = await this.experienceModel
      .findByIdAndUpdate(id, experienceData, { new: true })
      .populate('image')
      .exec();

    if (!updatedExperience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    const obj = updatedExperience.toObject();
    delete obj.images;
    return obj;
  }

  async remove(id: string): Promise<any> {
    const experience = await this.experienceModel.findById(id).exec();
    if (!experience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    // 1. Delete associated image
    if (experience.image) {
      const imageId = (experience.image as any)._id
        ? (experience.image as any)._id
        : experience.image;
      await this.imageService.remove(imageId.toString());
    }

    // 2. Delete legacy images (if any)
    if (experience.images && experience.images.length > 0) {
      for (const image of experience.images) {
        const imageId = (image as any)._id ? (image as any)._id : image;
        await this.imageService.remove(imageId.toString());
      }
    }

    // 3. Delete experience record
    await this.experienceModel.findByIdAndDelete(id).exec();

    return { deleted: true };
  }
}
