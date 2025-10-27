import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UploadService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    // Configure Cloudinary (free option)
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadPhoto(userId: string, file: Express.Multer.File) {
    // Validate file
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG and WebP are allowed');
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File too large. Maximum size is 10MB');
    }

    try {
      // Upload to Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'narcymorph/profiles',
            public_id: `user_${userId}_${Date.now()}`,
            transformation: [
              { width: 1000, height: 1000, crop: 'limit' },
              { quality: 'auto' },
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        uploadStream.end(file.buffer);
      });

      // Update profile with photo URL
      await this.prisma.profile.update({
        where: { userId },
        data: {
          photoUrl: result.secure_url,
          photoUploadedAt: new Date(),
          completionPercentage: 20, // Photo uploaded
        },
      });

      return {
        url: result.secure_url,
        message: 'Photo uploaded successfully',
      };
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new BadRequestException('Failed to upload photo');
    }
  }

  async deletePhoto(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (profile?.photoUrl) {
      // Extract public_id from URL and delete from Cloudinary
      try {
        const publicId = this.extractPublicId(profile.photoUrl);
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
      }

      // Update profile
      await this.prisma.profile.update({
        where: { userId },
        data: {
          photoUrl: null,
          photoUploadedAt: null,
        },
      });
    }

    return { message: 'Photo deleted successfully' };
  }

  private extractPublicId(url: string): string {
    // Extract public_id from Cloudinary URL
    const matches = url.match(/\/narcymorph\/profiles\/([^.]+)/);
    return matches ? `narcymorph/profiles/${matches[1]}` : '';
  }
}
