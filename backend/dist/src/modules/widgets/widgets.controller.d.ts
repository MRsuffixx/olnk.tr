import { WidgetsService } from './widgets.service';
import { CreateWidgetDto, UpdateWidgetDto, ReorderWidgetsDto } from './dto';
import { JwtPayload } from '../../common/decorators';
export declare class WidgetsController {
    private readonly widgetsService;
    constructor(widgetsService: WidgetsService);
    create(user: JwtPayload, dto: CreateWidgetDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.WidgetType;
        config: import("@prisma/client/runtime/client").JsonValue;
        order: number;
        isVisible: boolean;
        profileId: string;
    }>;
    findAll(user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.WidgetType;
        config: import("@prisma/client/runtime/client").JsonValue;
        order: number;
        isVisible: boolean;
        profileId: string;
    }[]>;
    findOne(user: JwtPayload, id: string): Promise<{
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
    update(user: JwtPayload, id: string, dto: UpdateWidgetDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.WidgetType;
        config: import("@prisma/client/runtime/client").JsonValue;
        order: number;
        isVisible: boolean;
        profileId: string;
    }>;
    remove(user: JwtPayload, id: string): Promise<{
        deleted: boolean;
    }>;
    reorder(user: JwtPayload, dto: ReorderWidgetsDto): Promise<{
        reordered: boolean;
    }>;
}
