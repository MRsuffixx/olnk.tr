import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadsService {
    private readonly uploadDir: string;

    constructor(private readonly configService: ConfigService) {
        this.uploadDir = this.configService.get<string>('UPLOAD_DIR', './uploads');
        this.ensureUploadDir();
    }

    async saveFile(file: Express.Multer.File, subfolder: string): Promise<string> {
        const dir = path.join(this.uploadDir, subfolder);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const ext = path.extname(file.originalname).toLowerCase();
        const filename = `${uuid()}${ext}`;
        const filepath = path.join(dir, filename);

        fs.writeFileSync(filepath, file.buffer);

        return filename;
    }

    async deleteFile(filePath: string): Promise<void> {
        const fullPath = path.join(this.uploadDir, filePath);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    }

    getFilePath(relativePath: string): string {
        return path.join(this.uploadDir, relativePath);
    }

    private ensureUploadDir(): void {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }
}
