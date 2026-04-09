// utils/cloudflare/r2Storage.ts
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  type PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { InternalServerErrorException } from '@nestjs/common';


import sharp from 'sharp';
import { envConfig } from '../../config/env';

export interface R2UploadResult {
  url: string;
  key: string;
  filename: string;
  filesize: number;
  mimetype: string;
}

// Initialize S3 client for R2
const getR2Client = (): S3Client => {
  const { R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT } = envConfig;

  if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ENDPOINT) {
    throw new InternalServerErrorException(
      'R2 configuration missing. Please set R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_ENDPOINT',
    );
  }

  return new S3Client({
    region: 'auto', // R2 uses 'auto' for region
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
};

/**
 * Upload file to Cloudflare R2
 * @param file - Multer file object
 * @param folder - Optional folder path in bucket (e.g., 'tickets', 'faq/categories')
 * @returns R2 upload result with public URL
 */
export const uploadToR2 = async (
  file: Express.Multer.File,
  folder: string = 'uploads',
): Promise<R2UploadResult> => {
  try {
    const {
      R2_BUCKET_NAME,
      R2_PUBLIC_URL,
      ENABLE_IMAGE_COMPRESSION,
      IMAGE_COMPRESSION_TARGET_MB,
    } = envConfig;

    if (!R2_BUCKET_NAME) {
      throw new InternalServerErrorException('R2_BUCKET_NAME not configured');
    }

    const client = getR2Client();

    let bufferToUpload = file.buffer;
    let mimetypeToUpload = file.mimetype;
    let originalnameToUpload = file.originalname;

    if (ENABLE_IMAGE_COMPRESSION && file.mimetype.startsWith('image/')) {
      const targetBytes = IMAGE_COMPRESSION_TARGET_MB * 1024 * 1024;
      if (file.size > targetBytes) {
        console.log(
          `Compressing ${file.originalname} (size: ${file.size} bytes)...`,
        );

        bufferToUpload = await sharp(file.buffer)
          .resize({ width: 1920, withoutEnlargement: true }) // Restrict extreme widths
          .webp({ quality: 80 }) // Compress to WebP at 80% quality
          .toBuffer();

        mimetypeToUpload = 'image/webp';
        const nameWithoutExt =
          file.originalname.substring(0, file.originalname.lastIndexOf('.')) ||
          file.originalname;
        originalnameToUpload = `${nameWithoutExt}.webp`;

        console.log(
          `Compression finished. New size: ${bufferToUpload.length} bytes`,
        );
      }
    }

    // Generate unique key for the file
    const fileExtension = originalnameToUpload.split('.').pop();
    const { v4: uuidv4 } = await import('uuid');
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const key = `${folder}/${uniqueFilename}`;

    const uploadParams: PutObjectCommandInput = {
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: bufferToUpload,
      ContentType: mimetypeToUpload,
      CacheControl: 'public, max-age=31536000', // 1 year cache
    };

    const command = new PutObjectCommand(uploadParams);
    await client.send(command);

    // Generate public URL
    // const publicUrl = R2_PUBLIC_URL
    //   ? `${R2_PUBLIC_URL}/${R2_BUCKET_NAME}/${key}`
    //   : `${R2_BUCKET_NAME}.r2.dev/${key}`;

    const baseUrl = R2_PUBLIC_URL?.endsWith('/')
      ? R2_PUBLIC_URL.slice(0, -1)
      : R2_PUBLIC_URL;
    const normalizedKey = key.startsWith('/') ? key.slice(1) : key;

    const publicUrl = R2_PUBLIC_URL
      ? `${baseUrl}/${R2_BUCKET_NAME}/${normalizedKey}`
      : `https://${R2_BUCKET_NAME}.r2.dev/${normalizedKey}`;

    return {
      url: publicUrl,
      key,
      filename: originalnameToUpload,
      filesize: bufferToUpload.length,
      mimetype: mimetypeToUpload,
    };
  } catch (error: any) {
    if (error instanceof InternalServerErrorException) throw error;

    console.error('R2 upload error:', error.message);

    throw new InternalServerErrorException(
      error.message || 'Failed to upload file to R2',
    );
  }
};

/**
 * Delete file from Cloudflare R2
 * @param key - R2 object key
 */
export const deleteFromR2 = async (key: string): Promise<void> => {
  try {
    const { R2_BUCKET_NAME } = envConfig;

    if (!R2_BUCKET_NAME) {
      console.warn('R2_BUCKET_NAME not configured, skipping deletion');
      return;
    }

    const client = getR2Client();

    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    await client.send(command);
  } catch (error: any) {
    console.error('R2 deletion error:', error.message);
    // Don't throw error for deletion failures
  }
};

/**
 * Upload multiple files to Cloudflare R2
 * @param files - Array of Multer file objects
 * @param folder - Optional folder path in bucket
 * @returns Array of R2 upload results
 */
export const uploadMultipleToR2 = async (
  files: Express.Multer.File[],
  folder: string = 'uploads',
): Promise<R2UploadResult[]> => {
  const uploadPromises = files.map((file) => uploadToR2(file, folder));
  return await Promise.all(uploadPromises);
};
