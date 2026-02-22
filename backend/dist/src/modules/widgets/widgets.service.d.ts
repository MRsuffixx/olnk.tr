import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../redis/cache.service';
import { CreateWidgetDto, UpdateWidgetDto, ReorderWidgetsDto } from './dto';
import { WidgetValidatorService } from './validators';
export declare class WidgetsService {
    private readonly prisma;
    private readonly cache;
    private readonly widgetValidator;
    constructor(prisma: PrismaService, cache: CacheService, widgetValidator: WidgetValidatorService);
    create(userId: string, dto: CreateWidgetDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.WidgetType;
        config: import("@prisma/client/runtime/client").JsonValue;
        order: number;
        isVisible: boolean;
        profileId: string;
    }>;
    findAllForUser(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.WidgetType;
        config: import("@prisma/client/runtime/client").JsonValue;
        order: number;
        isVisible: boolean;
        profileId: string;
    }[]>;
    findOne(userId: string, widgetId: string): Promise<{
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            displayName: string | null;
            bio: string | null;
            avatarUrl: string | null;
            theme: import("@prisma/client/runtime/client").JsonValue;
            layoutConfig: import("@prisma/client/runtime/client").JsonValue;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.WidgetType;
        config: import("@prisma/client/runtime/client").JsonValue;
        order: number;
        isVisible: boolean;
        profileId: string;
    }>;
    update(userId: string, widgetId: string, dto: UpdateWidgetDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.WidgetType;
        config: import("@prisma/client/runtime/client").JsonValue;
        order: number;
        isVisible: boolean;
        profileId: string;
    }>;
    remove(userId: string, widgetId: string): Promise<{
        deleted: boolean;
    }>;
    reorder(userId: string, dto: ReorderWidgetsDto): Promise<{
        reordered: boolean;
    }>;
    private getProfileForUser;
    private getNextOrder;
    private invalidateProfileCache;
}
