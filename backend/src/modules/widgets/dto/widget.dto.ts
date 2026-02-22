import {
    IsEnum,
    IsObject,
    IsOptional,
    IsInt,
    IsBoolean,
    Min,
    ValidateNested,
    IsString,
    IsUrl,
    MaxLength,
    IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WidgetType } from '@prisma/client';

// --- Per-type config classes ---

export class LinkWidgetConfig {
    @IsString()
    @MaxLength(100)
    title!: string;

    @IsUrl({}, { message: 'Must be a valid URL' })
    url!: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @IsOptional()
    @IsString()
    icon?: string;
}

export class TextWidgetConfig {
    @IsString()
    @MaxLength(2000)
    content!: string;

    @IsOptional()
    @IsString()
    align?: string;

    @IsOptional()
    @IsString()
    fontSize?: string;
}

export class ImageWidgetConfig {
    @IsUrl({}, { message: 'Must be a valid URL' })
    src!: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    alt?: string;

    @IsOptional()
    @IsUrl()
    linkUrl?: string;
}

export class SocialPlatform {
    @IsString()
    platform!: string;

    @IsUrl({}, { message: 'Must be a valid URL' })
    url!: string;
}

export class SocialWidgetConfig {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SocialPlatform)
    platforms!: SocialPlatform[];
}

// --- Main DTOs ---

export class CreateWidgetDto {
    @IsEnum(WidgetType, {
        message: 'Widget type must be one of: LINK, TEXT, IMAGE, SOCIAL',
    })
    type!: WidgetType;

    @IsObject()
    config!: Record<string, unknown>;

    @IsOptional()
    @IsInt()
    @Min(0)
    order?: number;

    @IsOptional()
    @IsBoolean()
    isVisible?: boolean;
}

export class UpdateWidgetDto {
    @IsOptional()
    @IsObject()
    config?: Record<string, unknown>;

    @IsOptional()
    @IsInt()
    @Min(0)
    order?: number;

    @IsOptional()
    @IsBoolean()
    isVisible?: boolean;
}

export class ReorderWidgetsDto {
    @IsArray()
    @IsString({ each: true })
    widgetIds!: string[];
}
