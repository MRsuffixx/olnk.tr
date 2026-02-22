import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../redis/cache.service';
import { UpdateProfileDto } from './dto';
export declare class ProfilesService {
    private readonly prisma;
    private readonly cache;
    constructor(prisma: PrismaService, cache: CacheService);
    getMyProfile(userId: string): Promise<{
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
    getPublicProfile(username: string): Promise<{}>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
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
    updateAvatar(userId: string, avatarUrl: string): Promise<{
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
}
