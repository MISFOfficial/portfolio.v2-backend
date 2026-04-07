import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cms, CmsDocument } from './entities/cms.entity';
import { CreateCmsDto } from './dto/create-cms.dto';
import { UpdateCmsDto } from './dto/update-cms.dto';
import { ImageService } from 'src/image/image.service';

@Injectable()
export class CmsService {
  constructor(
    @InjectModel(Cms.name) private cmsModel: Model<CmsDocument>,
    private readonly imageService: ImageService,
  ) {}

  async create(
    createCmsDto: CreateCmsDto,
    galleryImages?: Express.Multer.File[],
  ): Promise<any> {
    if (!galleryImages || galleryImages.length === 0) {
      throw new BadRequestException(
        'At least one CMS project image is required',
      );
    }

    const cmsData: any = { ...createCmsDto };
    const uploaded = await this.imageService.createMultiple(galleryImages);
    cmsData.images = uploaded.map((img) => img._id);

    const created = new this.cmsModel(cmsData);
    const saved = await created.save();
    return saved.populate({ path: 'images', model: 'Image' });
  }

  async findAll(limit: number = 3): Promise<any[]> {
    return this.cmsModel
      .find()
      .populate({ path: 'images', model: 'Image' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async findOne(id: string): Promise<any> {
    const cms = await this.cmsModel
      .findById(id)
      .populate({ path: 'images', model: 'Image' })
      .exec();
    if (!cms) {
      throw new NotFoundException(`CMS Project with ID ${id} not found`);
    }
    return cms;
  }

  async update(
    id: string,
    updateCmsDto: UpdateCmsDto,
    galleryImages?: Express.Multer.File[],
  ): Promise<any> {
    const existing = await this.cmsModel.findById(id).exec();
    if (!existing) {
      throw new NotFoundException(`CMS Project with ID ${id} not found`);
    }

    const updateData: any = { ...updateCmsDto };

    if (galleryImages && galleryImages.length > 0) {
      const uploaded = await this.imageService.createMultiple(galleryImages);
      const newImageIds = uploaded.map((img) => img._id);

      const existingIds = (existing.images || []).map((img: any) =>
        img._id ? img._id : img,
      );
      updateData.images = [...existingIds, ...newImageIds];
    }

    const updated = await this.cmsModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate({ path: 'images', model: 'Image' })
      .exec();

    if (!updated) {
      throw new NotFoundException(`CMS Project with ID ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<any> {
    const cms = await this.cmsModel.findById(id).exec();
    if (!cms) {
      throw new NotFoundException(`CMS Project with ID ${id} not found`);
    }

    // 1. Delete associated images
    if (cms.images && cms.images.length > 0) {
      for (const image of cms.images) {
        const imageId = (image as any)._id ? (image as any)._id : image;
        await this.imageService.remove(imageId.toString());
      }
    }

    // 2. Delete CMS record
    await this.cmsModel.findByIdAndDelete(id).exec();

    return { deleted: true };
  }
}
