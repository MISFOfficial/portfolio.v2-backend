import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import {
  Certificate,
  CertificateDocument,
} from './entities/certificate.entity';
import { ImageService } from 'src/image/image.service';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectModel(Certificate.name)
    private certificateModel: Model<CertificateDocument>,
    private readonly imageService: ImageService,
  ) {}

  async create(
    createCertificateDto: CreateCertificateDto,
    image?: Express.Multer.File,
  ): Promise<Certificate> {
    if (!image) {
      throw new BadRequestException('Certificate image is required');
    }

    const certificateData: any = { ...createCertificateDto };

    if (image) {
      const uploadedImage = await this.imageService.create(image);
      certificateData.image = uploadedImage._id;
    }

    const createdCertificate = new this.certificateModel(certificateData);
    const savedCertificate = await createdCertificate.save();
    return savedCertificate.populate(['image']);
  }

  async findAll(limit: number = 3): Promise<Certificate[]> {
    return this.certificateModel.find().populate(['image']).limit(limit).exec();
  }

  async findOne(id: string): Promise<Certificate> {
    const certificate = await this.certificateModel
      .findById(id)
      .populate(['image'])
      .exec();
    if (!certificate) {
      throw new NotFoundException(`Certificate with ID ${id} not found`);
    }
    return certificate;
  }

  async update(
    id: string,
    updateCertificateDto: UpdateCertificateDto,
    image?: Express.Multer.File,
  ): Promise<Certificate> {
    const certificateData: any = { ...updateCertificateDto };

    if (image) {
      const uploadedImage = await this.imageService.create(image);
      certificateData.image = uploadedImage._id;
    }

    const updatedCertificate = await this.certificateModel
      .findByIdAndUpdate(id, certificateData, { new: true })
      .populate(['image'])
      .exec();

    if (!updatedCertificate) {
      throw new NotFoundException(`Certificate with ID ${id} not found`);
    }

    return updatedCertificate;
  }

  async remove(id: string): Promise<any> {
    const certificate = await this.certificateModel.findById(id).exec();

    if (!certificate) {
      throw new NotFoundException(`Certificate with ID ${id} not found`);
    }

    // 1. Delete associated image
    if (certificate.image) {
      const imageId = (certificate.image as any)._id
        ? (certificate.image as any)._id
        : certificate.image;
      await this.imageService.remove(imageId.toString());
    }

    // 2. Delete certificate record
    await this.certificateModel.findByIdAndDelete(id).exec();

    return { deleted: true };
  }
}
