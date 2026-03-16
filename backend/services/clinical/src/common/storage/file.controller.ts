import { Controller, Get, Req, Res, UseGuards, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import * as mime from 'mime-types';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '@zeal/shared-utils';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private readonly storageService: StorageService) {}

  @Get('*')
  async serveFile(@Req() req: Request, @Res() res: Response) {
    // Extract the relative path from the URL after /api/v1/files/
    const relativePath = req.params[0] || '';

    if (!relativePath) {
      throw new NotFoundException('File not found');
    }

    // Prevent directory traversal attacks
    const normalized = path.normalize(relativePath);
    if (normalized.includes('..')) {
      throw new NotFoundException('File not found');
    }

    const absolutePath = this.storageService.getAbsolutePath(normalized);

    if (!fs.existsSync(absolutePath) || fs.statSync(absolutePath).isDirectory()) {
      throw new NotFoundException('File not found');
    }

    const contentType = mime.lookup(absolutePath) || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'private, max-age=3600');

    const stream = fs.createReadStream(absolutePath);
    stream.pipe(res);
  }
}
