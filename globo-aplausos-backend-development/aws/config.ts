import { S3 } from 'aws-sdk';
import {} from 'dotenv/config';

export const s3 = new S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

export const BUCKET_NAME = process.env.BUCKET_NAME;
export const ACCESS_CONTROL = 'public-read';
