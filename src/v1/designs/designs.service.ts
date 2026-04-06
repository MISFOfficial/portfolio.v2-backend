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
    coverImage?: Express.Multer.File,
    galleryImages?: Express.Multer.File[],
  ): Promise<any> {
    if (!coverImage && (!galleryImages || galleryImages.length === 0)) {
      throw new BadRequestException('At least one design image is required');
    }

    const designData: any = { ...createDesignDto };
    const allImageIds: any[] = [];

    if (coverImage) {
      const uploaded = await this.imageService.create(coverImage);
      allImageIds.push(uploaded._id);
    }

    if (galleryImages && galleryImages.length > 0) {
      const uploaded = await this.imageService.createMultiple(galleryImages);
      allImageIds.push(...uploaded.map((img) => img._id));
    }

    designData.images = allImageIds;

    const created = new this.designModel(designData);
    const saved = await created.save();
    return saved.populate({ path: 'images', model: 'Image' });
  }

  async findAll(): Promise<any[]> {
    return this.designModel
      .find()
      .populate({ path: 'images', model: 'Image' })
      .exec();
  }

  async findOne(id: string): Promise<any> {
    const design = await this.designModel
      .findById(id)
      .populate({ path: 'images', model: 'Image' })
      .exec();
    if (!design) {
      throw new NotFoundException(`Design with ID ${id} not found`);
    }
    return design;
  }

  async update(
    id: string,
    updateDesignDto: UpdateDesignDto,
    coverImage?: Express.Multer.File,
    galleryImages?: Express.Multer.File[],
  ): Promise<any> {
    const existing = await this.designModel.findById(id).exec();
    if (!existing) {
      throw new NotFoundException(`Design with ID ${id} not found`);
    }

    const updateData: any = { ...updateDesignDto };
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
      const existingIds = (existing.images || []).map((img: any) =>
        img._id ? img._id : img,
      );
      updateData.images = [...existingIds, ...newImageIds];
    }

    const updated = await this.designModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate({ path: 'images', model: 'Image' })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Design with ID ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<any> {
    const deleted = await this.designModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`Design with ID ${id} not found`);
    }
    return { deleted: true };
  }
}
