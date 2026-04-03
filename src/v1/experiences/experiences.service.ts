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
    images?: Express.Multer.File[],
  ): Promise<Experience> {
    const experienceData: any = { ...createExperienceDto };

    if (!images || images.length === 0) {
      throw new BadRequestException(
        'At least one experience image is required',
      );
    }

    const uploadedImages = await this.imageService.createMultiple(images);
    experienceData.images = uploadedImages.map((img) => img._id);

    const createdExperience = new this.experienceModel(experienceData);
    const savedExperience = await createdExperience.save();
    return savedExperience.populate(['images']);
  }

  async findAll(): Promise<Experience[]> {
    return this.experienceModel.find().populate(['images']).exec();
  }

  async findOne(id: string): Promise<Experience> {
    const experience = await this.experienceModel
      .findById(id)
      .populate(['images'])
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

      const existingExperience = await this.findOne(id);
      experienceData.images = [
        ...(existingExperience.images || []).map((img: any) =>
          img._id ? img._id : img,
        ),
        ...newImageIds,
      ];
    } else {
      throw new BadRequestException(
        'At least one experience image is required',
      );
    }

    const updatedExperience = await this.experienceModel
      .findByIdAndUpdate(id, experienceData, { new: true })
      .populate(['images'])
      .exec();
    if (!updatedExperience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }
    return updatedExperience;
  }

  async remove(id: string): Promise<any> {
    const result = await this.experienceModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }
    return { deleted: true };
  }
}
