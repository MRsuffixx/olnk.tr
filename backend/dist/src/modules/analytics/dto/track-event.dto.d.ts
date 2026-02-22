import { AnalyticsEventType } from '@prisma/client';
export declare class TrackEventDto {
    profileId: string;
    eventType: AnalyticsEventType;
    referrer?: string;
    metadata?: Record<string, unknown>;
}
