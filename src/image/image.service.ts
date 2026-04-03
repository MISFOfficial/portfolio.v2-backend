import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image } from './entities/image.entity';
import {
  uploadToR2,
  deleteFromR2,
  uploadMultipleToR2,
} from '../utils/cloudflare/r2Storage';

@Injectable()
export class ImageService {
  constructor(@InjectModel(Image.name) private imageModel: Model<Image>) {}

  async create(file: Express.Multer.File, caption?: string): Promise<Image> {
    try {
      console.log(
        `[ImageService] Starting upload for file: ${file.originalname} (${file.size} bytes)`,
      );

      // 1. Upload to R2
      const uploadResult = await uploadToR2(file, 'properties');
      console.log(`[ImageService] Uploaded to R2: ${uploadResult.key}`);

      // 2. Save metadata to DB
      const newImage = new this.imageModel({
        url: uploadResult.url,
        key: uploadResult.key,
        filename: uploadResult.filename,
        mimeType: uploadResult.mimetype,
        size: uploadResult.filesize,
        caption: caption,
        uploadedAt: new Date(),
      });

      const savedImage = await newImage.save();
      console.log(
        `[ImageService] Saved image metadata to DB: ${savedImage._id}`,
      );
      return savedImage;
    } catch (error) {
      console.error('Image creation failed:', error);
      throw new InternalServerErrorException('Failed to upload and save image');
    }
  }

  async createMultiple(
    files: Express.Multer.File[],
    caption?: string,
  ): Promise<Image[]> {
    try {
      console.log(`[ImageService] Uploading ${files.length} files...`);

      // 1. Upload to R2
      const uploadResults = await uploadMultipleToR2(files, 'properties');

      // 2. Save each to DB
      const savePromises = uploadResults.map((result) => {
        const newImage = new this.imageModel({
          url: result.url,
          key: result.key,
          filename: result.filename,
          mimeType: result.mimetype,
          size: result.filesize,
          caption: caption,
          uploadedAt: new Date(),
        });
        return newImage.save();
      });

      const savedImages = await Promise.all(savePromises);
      console.log(`[ImageService] Saved ${savedImages.length} images to DB`);
      return savedImages;
    } catch (error) {
      console.error('Multiple image upload failed:', error);
      throw new InternalServerErrorException(
        'Failed to upload and save images',
      );
    }
  }

  async findAll(): Promise<Image[]> {
    return this.imageModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Image> {
    const image = await this.imageModel.findById(id).exec();
    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }
    return image;
  }

  async remove(id: string): Promise<void> {
    const image = await this.findOne(id);

    // 1. Delete from R2
    if (image.key) {
      await deleteFromR2(image.key);
    }

    // 2. Delete from DB
    await this.imageModel.findByIdAndDelete(id).exec();
  }
}
