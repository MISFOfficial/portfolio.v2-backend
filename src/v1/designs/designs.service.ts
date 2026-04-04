import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Design, DesignDocument } from './entities/design.entity';
import { CreateDesignDto } from './dto/create-design.dto';
import { UpdateDesignDto } from './dto/update-design.dto';
import { ImageService } from 'src/image/image.service';

@Injectable()
export class DesignsService {
  constructor(
    @InjectModel(Design.name) private designModel: Model<DesignDocument>,
    private readonly imageService: ImageService,
  ) {}

  async create(
    createDesignDto: CreateDesignDto,
    image?: Express.Multer.File,
    images?: Express.Multer.File[],
  ): Promise<Design> {
    if (!image) {
      throw new BadRequestException('Design cover image is required');
    }

    const designData: any = { ...createDesignDto };

    if (image) {
      const uploadedImage = await this.imageService.create(image);
      designData.image = uploadedImage._id;
    }

    if (images && images.length > 0) {
      const uploadedImages = await this.imageService.createMultiple(images);
      designData.images = uploadedImages.map((img) => img._id);
    }

    const createdDesign = new this.designModel(designData);
    const savedDesign = await createdDesign.save();
    return savedDesign.populate([
      { path: 'image', model: 'Image' },
      { path: 'images', model: 'Image' },
    ]);
  }

  async findAll(): Promise<Design[]> {
    return this.designModel
      .find()
      .populate([
        { path: 'image', model: 'Image' },
        { path: 'images', model: 'Image' },
      ])
      .exec();
  }

  async findOne(id: string): Promise<Design> {
    const design = await this.designModel
      .findById(id)
      .populate([
        { path: 'image', model: 'Image' },
        { path: 'images', model: 'Image' },
      ])
      .exec();
    if (!design) {
      throw new NotFoundException(`Design with ID ${id} not found`);
    }
    return design;
  }

  async update(
    id: string,
    updateDesignDto: UpdateDesignDto,
    image?: Express.Multer.File,
    images?: Express.Multer.File[],
  ): Promise<Design> {
    const existingDesign = await this.designModel.findById(id).exec();
    if (!existingDesign) {
      throw new NotFoundException(`Design with ID ${id} not found`);
    }

    const updateData: any = { ...updateDesignDto };

    if (image) {
      const uploadedImage = await this.imageService.create(image);
      updateData.image = uploadedImage._id;
    }

    if (images && images.length > 0) {
      const uploadedImages = await this.imageService.createMultiple(images);
      updateData.images = uploadedImages.map((img) => img._id);
    }

    const updatedDesign = await this.designModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate([
        { path: 'image', model: 'Image' },
        { path: 'images', model: 'Image' },
      ])
      .exec();

    if (!updatedDesign) {
      throw new NotFoundException(`Design with ID ${id} not found`);
    }

    return updatedDesign;
  }

  async remove(id: string): Promise<Design> {
    const deletedDesign = await this.designModel.findByIdAndDelete(id).exec();
    if (!deletedDesign) {
      throw new NotFoundException(`Design with ID ${id} not found`);
    }
    return deletedDesign;
  }
}
