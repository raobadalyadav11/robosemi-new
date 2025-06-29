import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export class CloudinaryService {
  async uploadImage(
    file: Buffer | string,
    options: {
      folder?: string;
      public_id?: string;
      transformation?: any;
      resource_type?: 'image' | 'video' | 'raw' | 'auto';
    } = {}
  ): Promise<CloudinaryUploadResult> {
    try {
      let uploadFile: string;
      if (Buffer.isBuffer(file)) {
        // Default to image/jpeg if unsure; adjust as needed
        const mimeType = 'image/jpeg';
        uploadFile = `data:${mimeType};base64,${file.toString('base64')}`;
      } else {
        uploadFile = file;
      }

      const result = await cloudinary.uploader.upload(uploadFile, {
        folder: options.folder || 'robosemi',
        public_id: options.public_id,
        transformation: options.transformation,
        resource_type: options.resource_type || 'auto',
        quality: 'auto',
        fetch_format: 'auto',
      });

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        resource_type: result.resource_type,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image');
    }
  }

  async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      return false;
    }
  }

  async generateTransformedUrl(
    publicId: string,
    transformations: any
  ): Promise<string> {
    return cloudinary.url(publicId, transformations);
  }

  async getImageDetails(publicId: string): Promise<any> {
    try {
      return await cloudinary.api.resource(publicId);
    } catch (error) {
      console.error('Cloudinary get details error:', error);
      throw new Error('Failed to get image details');
    }
  }
}

export const cloudinaryService = new CloudinaryService();