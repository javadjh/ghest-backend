import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import { mkdirSync } from 'fs';
import { FilesController } from '@/modules/files/files.controller';
import { FilesService } from '@/modules/files/files.service';
import { File, FileSchema } from '@/modules/files/schemas/file.schema';

@Module({
  imports: [
    ConfigModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uploadDir = config.get<string>('UPLOAD_DIR') || './uploads';
        const dir = path.resolve(process.cwd(), 'uploads');
        try {
          mkdirSync(dir, { recursive: true });
        } catch {
          // ignore
        }
        return {
          storage: multer.diskStorage({
            destination: (_req, _file, cb) => cb(null, dir),
            filename: (_req, file, cb) => {
              const ext = path.extname(file.originalname) || '';
              const base = path.basename(file.originalname, ext).slice(0, 20);
              const finalName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${base}${ext}`;
              cb(null, finalName);
            },
          }),
          limits: { fileSize: 10 * 1024 * 1024 },
        };
      },
    }),
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService, MulterModule],
})
export class FilesModule {}
