import { HttpStatus } from '@nestjs/common';
import { ACCESS_CONTROL, BUCKET_NAME, s3 } from './config';
import { Exception } from '../src/api/exceptions/Exception';

export type AWSFile = Pick<File, 'name' | 'type'> & { data: string };

export async function upload(folder: string, file: AWSFile): Promise<string> {
  const fileAsBuffer = Buffer.from(file.data, 'base64');

  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: `${folder}/${file.name}`,
    Body: fileAsBuffer,
    ContentEncoding: 'buffer',
    ContentType: file.type,
    ACL: ACCESS_CONTROL,
  };

  return await new Promise<string>((resolve, reject) => {
    try {
      s3.upload(uploadParams, (err, data) => {
        if (err) {
          console.error(err);
          throw new Exception(
            `Image could not be uploaded`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
        resolve(data.Location);
      });
    } catch (err) {
      reject(err);
    }
  });
}
