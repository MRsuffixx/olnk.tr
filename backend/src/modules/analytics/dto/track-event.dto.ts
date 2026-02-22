import { IsEnum, IsString, IsOptional, IsObject } from 'class-validator';
import { AnalyticsEventType } from '@prisma/client';

export class TrackEventDto {
    @IsString()
    profileId!: string;

    @IsEnum(AnalyticsEventType, {
        message: 'Event type must be PAGE_VIEW or LINK_CLICK',
    })
    eventType!: AnalyticsEventType;

    @IsOptional()
    @IsString()
    referrer?: string;

    @IsOptional()
    @IsObject()
    metadata?: Record<string, unknown>;
}
