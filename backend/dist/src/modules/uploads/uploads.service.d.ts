import { ConfigService } from '@nestjs/config';
export declare class UploadsService {
    private readonly configService;
    private readonly uploadDir;
    constructor(configService: ConfigService);
    saveFile(file: Express.Multer.File, subfolder: string): Promise<string>;
    deleteFile(filePath: string): Promise<void>;
    getFilePath(relativePath: string): string;
    private ensureUploadDir;
}
