import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { randomUUID } from 'crypto';
import { envEnum } from '../../utils/enum/env.enum';


export interface UploadAudioOptions {
  userId?: string;
  folder?: string;
}
const FILE_TTS_FOLDER = 'help-mum/tts';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private readonly configured: boolean;

  constructor(private readonly configService: ConfigService) {
    const cloudName = this.readConfig(envEnum.CLOUDINARY_CLOUD_NAME);
    const apiKey = this.readConfig(envEnum.CLOUDINARY_API_KEY);
    const apiSecret = this.readConfig(envEnum.CLOUDINARY_API_SECRET);

    this.configured = Boolean(cloudName && apiKey && apiSecret);

    if (this.configured) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
      this.logger.log('File storage configured for Cloudinary audio uploads');
    } else {
      this.logger.warn(
        'File storage is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to upload TTS audio.',
      );
    }
  }

  isConfigured(): boolean {
    return this.configured;
  }

  async uploadAudioBuffer(
    buffer: Buffer,
    contentType: string,
    options: UploadAudioOptions = {},
  ): Promise<string | null> {
    if (!this.configured) {
      this.logger.warn('Skipping audio upload because file storage is not configured');
      return null;
    }

    if (!buffer.length) {
      return null;
    }

    const folder = options.folder ?? FILE_TTS_FOLDER;
    const publicId = this.buildPublicId(options.userId);

    this.logger.log(
      `Uploading audio bytes=${buffer.length} contentType=${contentType} publicId=${publicId}`,
    );

    try {
      const result = await this.uploadBuffer(buffer, folder, publicId);

      this.logger.log(
        `Audio upload succeeded publicId=${result.public_id} url=${result.secure_url}`,
      );

      return result.secure_url;
    } catch (error) {
      this.logger.error(this.formatUploadError(error));
      return null;
    }
  }

  private readConfig(key: envEnum): string | undefined {
    const value = this.configService.get<string>(key);
    return value?.trim() || undefined;
  }

  private buildPublicId(userId?: string): string {
    const id = randomUUID();
    return userId ? `${userId}-${id}` : id;
  }

  private uploadBuffer(
    buffer: Buffer,
    folder: string,
    publicId: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder,
          public_id: `${publicId}.mp3`,
          overwrite: false,
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result?.secure_url) {
            reject(new Error('Cloudinary upload returned no secure_url'));
            return;
          }

          resolve(result);
        },
      );

      uploadStream.end(buffer);
    });
  }

  private formatUploadError(error: unknown): string {
    if (error && typeof error === 'object' && 'message' in error) {
      const uploadError = error as UploadApiErrorResponse;
      const httpCode = uploadError.http_code ? ` http_code=${uploadError.http_code}` : '';
      return `Audio upload failed: ${uploadError.message}${httpCode}`;
    }

    return `Audio upload failed: ${String(error)}`;
  }
}
