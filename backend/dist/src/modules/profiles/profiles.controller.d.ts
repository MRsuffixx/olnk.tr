import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto';
import { JwtPayload } from '../../common/decorators';
import { UploadsService } from '../uploads/uploads.service';
export declare class ProfilesController {
    private readonly profilesService;
    private readonly uploadsService;
    constructor(profilesService: ProfilesService, uploadsService: UploadsService);
    getMyProfile(user: JwtPayload): Promise<{
        widgets: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.WidgetType;
            config: import("@prisma/client/runtime/client").JsonValue;
            order: number;
            isVisible: boolean;
            profileId: string;
        }[];
        user: {
            email: string;
            username: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        displayName: string | null;
        bio: string | null;
        avatarUrl: string | null;
        theme: import("@prisma/client/runtime/client").JsonValue;
        layoutConfig: import("@prisma/client/runtime/client").JsonValue;
        userId: string;
    }>;
    updateProfile(user: JwtPayload, dto: UpdateProfileDto): Promise<{
        widgets: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.WidgetType;
            config: import("@prisma/client/runtime/client").JsonValue;
            order: number;
            isVisible: boolean;
            profileId: string;
        }[];
        user: {
            username: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        displayName: string | null;
        bio: string | null;
        avatarUrl: string | null;
        theme: import("@prisma/client/runtime/client").JsonValue;
        layoutConfig: import("@prisma/client/runtime/client").JsonValue;
        userId: string;
    }>;
    uploadAvatar(user: JwtPayload, file: Express.Multer.File): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        displayName: string | null;
        bio: string | null;
        avatarUrl: string | null;
        theme: import("@prisma/client/runtime/client").JsonValue;
        layoutConfig: import("@prisma/client/runtime/client").JsonValue;
        userId: string;
    }>;
    getPublicProfile(username: string): Promise<{}>;
}
