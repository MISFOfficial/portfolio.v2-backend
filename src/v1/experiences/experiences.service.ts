import { Injectable, NotFoundException } from '@nestjs/common';
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
    images?: Express.Multer.File[],
  ): Promise<Experience> {
    const experienceData: any = { ...createExperienceDto };

    if (images && images.length > 0) {
      const uploadedImages = await this.imageService.createMultiple(images);
      experienceData.images = uploadedImages.map((img) => img._id);
    }

    const createdExperience = new this.experienceModel(experienceData);
    return createdExperience.save();
  }

  async findAll(): Promise<Experience[]> {
    return this.experienceModel.find().populate('images').exec();
  }

  async findOne(id: string): Promise<Experience> {
    const experience = await this.experienceModel
      .findOne({ id })
      .populate('images')
      .exec();
    if (!experience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }
    return experience;
  }

  async update(
    id: string,
    updateExperienceDto: UpdateExperienceDto,
    images?: Express.Multer.File[],
  ): Promise<Experience> {
    const experienceData: any = { ...updateExperienceDto };

    if (images && images.length > 0) {
      const uploadedImages = await this.imageService.createMultiple(images);
      const newImageIds = uploadedImages.map((img) => img._id);

      // Merge with existing images or replace? Usually merge for portfolio
      const existingExperience = await this.findOne(id);
      experienceData.images = [
        ...(existingExperience.images || []).map((img: any) =>
          img._id ? img._id : img,
        ),
        ...newImageIds,
      ];
    }

    const updatedExperience = await this.experienceModel
      .findOneAndUpdate({ id }, experienceData, { new: true })
      .populate('images')
      .exec();
    if (!updatedExperience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }
    return updatedExperience;
  }

  async remove(id: string): Promise<any> {
    const result = await this.experienceModel.deleteOne({ id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }
    return { deleted: true };
  }
}
