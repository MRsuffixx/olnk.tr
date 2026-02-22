import { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import { TrackEventDto, QueryAnalyticsDto } from './dto';
import { JwtPayload } from '../../common/decorators';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    track(dto: TrackEventDto, req: Request): Promise<void>;
    getStats(user: JwtPayload): Promise<{
        totalViews: number;
        totalClicks: number;
        recent: {
            id: string;
            createdAt: Date;
            eventType: import(".prisma/client").$Enums.AnalyticsEventType;
            referrer: string | null;
            metadata: import("@prisma/client/runtime/client").JsonValue;
        }[];
    }>;
    getStatsByRange(user: JwtPayload, query: QueryAnalyticsDto): Promise<(import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.AnalyticsEventGroupByOutputType, "eventType"[]> & {
        _count: {
            id: number;
        };
    })[]>;
    getTopReferrers(user: JwtPayload): Promise<(import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.AnalyticsEventGroupByOutputType, "referrer"[]> & {
        _count: {
            id: number;
        };
    })[]>;
}
