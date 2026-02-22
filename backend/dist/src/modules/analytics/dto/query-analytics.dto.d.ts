import { AnalyticsEventType } from '@prisma/client';
export declare class QueryAnalyticsDto {
    eventType?: AnalyticsEventType;
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month';
}
