import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

export interface StorageConfig {
  provider: 'local' | 's3' | 'azure';
  basePath: string; // For local: filesystem path. For S3: bucket name. For Azure: container name.
  baseUrl?: string; // Public URL prefix for serving files
}

export interface UploadResult {
  filePath: string; // Relative path within storage
  url: string; // URL to access the file
  originalName: string;
  mimeType: string;
  size: number;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly config: StorageConfig;

  constructor() {
    this.config = {
      provider: (process.env.STORAGE_PROVIDER as StorageConfig['provider']) || 'local',
      basePath: process.env.STORAGE_BASE_PATH || path.resolve(process.cwd(), 'uploads'),
      baseUrl: process.env.STORAGE_BASE_URL || '/api/v1/files',
    };

    if (this.config.provider === 'local') {
      this.ensureDirectory(this.config.basePath);
    }

    this.logger.log(`Storage initialized: provider=${this.config.provider}, basePath=${this.config.basePath}`);
  }

  async upload(
    file: Express.Multer.File,
    subDirectory: string,
  ): Promise<UploadResult> {
    const ext = path.extname(file.originalname);
    const uniqueName = `${randomUUID()}${ext}`;
    const relativePath = path.join(subDirectory, uniqueName);

    switch (this.config.provider) {
      case 'local':
        return this.uploadLocal(file, relativePath);
      case 's3':
        // Future: implement S3 upload
        throw new Error('S3 storage provider not yet implemented. Configure STORAGE_PROVIDER=local');
      case 'azure':
        // Future: implement Azure Blob upload
        throw new Error('Azure storage provider not yet implemented. Configure STORAGE_PROVIDER=local');
      default:
        throw new Error(`Unknown storage provider: ${this.config.provider}`);
    }
  }

  async delete(filePath: string): Promise<void> {
    switch (this.config.provider) {
      case 'local':
        return this.deleteLocal(filePath);
      default:
        this.logger.warn(`Delete not implemented for provider: ${this.config.provider}`);
    }
  }

  getAbsolutePath(relativePath: string): string {
    return path.resolve(this.config.basePath, relativePath);
  }

  private async uploadLocal(
    file: Express.Multer.File,
    relativePath: string,
  ): Promise<UploadResult> {
    const absolutePath = path.resolve(this.config.basePath, relativePath);
    const dir = path.dirname(absolutePath);

    this.ensureDirectory(dir);

    fs.writeFileSync(absolutePath, file.buffer);

    this.logger.log(`File uploaded: ${absolutePath} (${file.size} bytes)`);

    return {
      filePath: relativePath,
      url: `${this.config.baseUrl}/${relativePath}`,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  private async deleteLocal(relativePath: string): Promise<void> {
    const absolutePath = path.resolve(this.config.basePath, relativePath);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      this.logger.log(`File deleted: ${absolutePath}`);
    }
  }

  private ensureDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }
}
