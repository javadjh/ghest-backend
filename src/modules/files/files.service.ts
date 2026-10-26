import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { promises as fs } from 'fs';
import path from 'path';
import { ConfigService } from '@nestjs/config';
import { File, FileDocument } from '@/modules/files/schemas/file.schema';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<FileDocument>,
    private readonly configService: ConfigService,
  ) {}

  async save(file: Express.Multer.File, userId: string, category: string = 'receipt'): Promise<FileDocument> {
    if (!file) {
      throw new BadRequestException('فایل ارسال نشده است');
    }
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      await fs.unlink(file.path).catch(() => {});
      throw new BadRequestException('نوع فایل مجاز نیست (فقط تصاویر و PDF)');
    }
    if (file.size > 10 * 1024 * 1024) {
      await fs.unlink(file.path).catch(() => {});
      throw new BadRequestException('حجم فایل نباید بیشتر از ۱۰ مگابایت باشد');
    }

    const created = await this.fileModel.create({
      originalName: file.originalname,
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      uploadedBy: new Types.ObjectId(userId),
      category,
    });
    return created;
  }

  async getById(id: string): Promise<FileDocument> {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new NotFoundException('فایل یافت نشد');
    }
    const file = await this.fileModel.findById(id).exec();
    if (!file) {
      throw new NotFoundException('فایل یافت نشد');
    }
    return file;
  }

  async delete(id: string): Promise<void> {
    const file = await this.getById(id);
    await fs.unlink(file.path).catch(() => {});
    await this.fileModel.findByIdAndDelete(id).exec();
  }

  getUrl(file: FileDocument): string {
    return `/uploads/${file.filename}`;
  }
}
