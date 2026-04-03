import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';
import { Certificate, CertificateSchema } from './entities/certificate.entity';
import { ImageModule } from 'src/image/image.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Certificate.name, schema: CertificateSchema },
    ]),
    ImageModule,
  ],
  controllers: [CertificatesController],
  providers: [CertificatesService],
})
export class CertificatesModule {}
