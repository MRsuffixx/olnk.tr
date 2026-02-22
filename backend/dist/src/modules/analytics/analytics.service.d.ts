import { PrismaService } from '../../prisma/prisma.service';
import { TrackEventDto } from './dto';
export declare class AnalyticsService {
    private readonly prisma;
    private eventBuffer;
    private flushInterval;
    private readonly BUFFER_SIZE;
    private readonly FLUSH_INTERVAL_MS;
    constructor(prisma: PrismaService);
    trackEvent(dto: TrackEventDto, ip: string, userAgent?: string): Promise<void>;
    getStats(userId: string): Promise<{
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
    getStatsByDateRange(userId: string, startDate?: string, endDate?: string): Promise<(import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.AnalyticsEventGroupByOutputType, "eventType"[]> & {
        _count: {
            id: number;
        };
    })[]>;
    getTopReferrers(userId: string, limit?: number): Promise<(import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.AnalyticsEventGroupByOutputType, "referrer"[]> & {
        _count: {
            id: number;
        };
    })[]>;
    private flush;
    onModuleDestroy(): Promise<void>;
}
