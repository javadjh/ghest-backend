import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ApiAuth } from '@/common/decorators/api-auth.decorator';
import { FilesService } from '@/modules/files/files.service';
import { FileResponseDto } from '@/modules/files/dto/file.dto';

@ApiTags('فایل‌ها')
@ApiAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiOperation({ summary: 'آپلود فیش واریزی یا فایل' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async upload(@Req() req: any, @Req() request: Request): Promise<FileResponseDto> {
    if (!req.file) throw new BadRequestException('فایل ارسال نشده است');
    const userId = req.user?.sub || '000000000000000000000000';
    const file = await this.filesService.save(req.file, userId);
    return {
      id: (file._id as any).toString(),
      originalName: file.originalName,
      filename: file.filename,
      mimeType: file.mimeType,
      size: file.size,
      url: this.filesService.getUrl(file),
      category: file.category,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'اطلاعات فایل' })
  async info(@Param('id') id: string): Promise<FileResponseDto> {
    const file = await this.filesService.getById(id);
    return {
      id: (file._id as any).toString(),
      originalName: file.originalName,
      filename: file.filename,
      mimeType: file.mimeType,
      size: file.size,
      url: this.filesService.getUrl(file),
      category: file.category,
    };
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'دانلود فایل' })
  async download(@Param('id') id: string, @Res() res: Response) {
    const file = await this.filesService.getById(id);
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(file.originalName)}"`);
    res.sendFile(file.path, { root: process.cwd() });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف فایل' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.filesService.delete(id);
  }
}
