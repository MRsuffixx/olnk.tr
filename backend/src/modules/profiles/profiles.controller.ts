import {
    Controller,
    Get,
    Patch,
    Param,
    Body,
    UseGuards,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
    Post,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto';
import { JwtAuthGuard } from '../../common/guards';
import { CurrentUser, JwtPayload } from '../../common/decorators';
import { UploadsService } from '../uploads/uploads.service';

@Controller('profiles')
export class ProfilesController {
    constructor(
        private readonly profilesService: ProfilesService,
        private readonly uploadsService: UploadsService,
    ) { }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getMyProfile(@CurrentUser() user: JwtPayload) {
        return this.profilesService.getMyProfile(user.sub);
    }

    @Patch('me')
    @UseGuards(JwtAuthGuard)
    async updateProfile(
        @CurrentUser() user: JwtPayload,
        @Body() dto: UpdateProfileDto,
    ) {
        return this.profilesService.updateProfile(user.sub, dto);
    }

    @Post('me/avatar')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('avatar'))
    async uploadAvatar(
        @CurrentUser() user: JwtPayload,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedMimes.includes(file.mimetype)) {
            throw new BadRequestException('File must be a JPEG, PNG, WebP, or GIF image');
        }

        if (file.size > 5 * 1024 * 1024) {
            throw new BadRequestException('File size must be less than 5MB');
        }

        const filename = await this.uploadsService.saveFile(file, 'avatars');
        const avatarUrl = `/uploads/avatars/${filename}`;

        return this.profilesService.updateAvatar(user.sub, avatarUrl);
    }

    @Get(':username')
    async getPublicProfile(@Param('username') username: string) {
        return this.profilesService.getPublicProfile(username);
    }
}
