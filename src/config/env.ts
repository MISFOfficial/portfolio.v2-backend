import * as dotenv from 'dotenv';

dotenv.config();

interface Env {
  DB_URI: string;
  ENV_MODE: string;
  PORT: number;
  ALLOWED_ORIGINS: string | string[];
  BACKEND_URL: string;
  FRONTEND_URL: string;
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
  R2_BUCKET_NAME?: string;
  R2_ENDPOINT?: string;
  R2_PUBLIC_URL?: string;
  ENABLE_IMAGE_COMPRESSION: boolean;
  IMAGE_COMPRESSION_TARGET_MB: number;
}

export const envConfig: Env = {
  DB_URI: process.env.DB_URI || 'mongodb://localhost:27017/portfolio',
  ENV_MODE: process.env.ENV_MODE || 'development',
  PORT: Number(process.env.PORT) || 5000,
  ALLOWED_ORIGINS:
    (process.env.ENV_MODE || 'development') === 'production'
      ? ['https://muksitul.pages.dev']
      : ['http://localhost:3000'],
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:5000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
  R2_ENDPOINT: process.env.R2_ENDPOINT,
  R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
  ENABLE_IMAGE_COMPRESSION:
    process.env.ENABLE_IMAGE_COMPRESSION === 'true' ? true : false,
  IMAGE_COMPRESSION_TARGET_MB:
    Number(process.env.IMAGE_COMPRESSION_TARGET_MB) || 1,
};
