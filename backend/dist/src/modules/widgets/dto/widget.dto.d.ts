import { WidgetType } from '@prisma/client';
export declare class LinkWidgetConfig {
    title: string;
    url: string;
    description?: string;
    icon?: string;
}
export declare class TextWidgetConfig {
    content: string;
    align?: string;
    fontSize?: string;
}
export declare class ImageWidgetConfig {
    src: string;
    alt?: string;
    linkUrl?: string;
}
export declare class SocialPlatform {
    platform: string;
    url: string;
}
export declare class SocialWidgetConfig {
    platforms: SocialPlatform[];
}
export declare class CreateWidgetDto {
    type: WidgetType;
    config: Record<string, unknown>;
    order?: number;
    isVisible?: boolean;
}
export declare class UpdateWidgetDto {
    config?: Record<string, unknown>;
    order?: number;
    isVisible?: boolean;
}
export declare class ReorderWidgetsDto {
    widgetIds: string[];
}
