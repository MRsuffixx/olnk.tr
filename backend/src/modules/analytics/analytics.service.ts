import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AnalyticsEventType } from '@prisma/client';
import { hashIp } from '../../common/utils/hash-ip';
import { TrackEventDto } from './dto';

@Injectable()
export class AnalyticsService {
    private eventBuffer: Array<{
        profileId: string;
        eventType: AnalyticsEventType;
        ipHash: string;
        userAgent: string | null;
        referrer: string | null;
        metadata: Record<string, unknown> | null;
    }> = [];

    private flushInterval: ReturnType<typeof setInterval>;
    private readonly BUFFER_SIZE = 20;
    private readonly FLUSH_INTERVAL_MS = 5000;

    constructor(private readonly prisma: PrismaService) {
        // Flush buffered events periodically
        this.flushInterval = setInterval(() => {
            this.flush();
        }, this.FLUSH_INTERVAL_MS);
    }

    async trackEvent(
        dto: TrackEventDto,
        ip: string,
        userAgent?: string,
    ): Promise<void> {
        const ipHash = hashIp(ip);

        this.eventBuffer.push({
            profileId: dto.profileId,
            eventType: dto.eventType,
            ipHash,
            userAgent: userAgent || null,
            referrer: dto.referrer || null,
            metadata: dto.metadata || null,
        });

        if (this.eventBuffer.length >= this.BUFFER_SIZE) {
            await this.flush();
        }
    }

    async getStats(userId: string) {
        const profile = await this.prisma.profile.findUnique({
            where: { userId },
            select: { id: true },
        });

        if (!profile) return { totalViews: 0, totalClicks: 0, recent: [] };

        const [totalViews, totalClicks, recent] = await Promise.all([
            this.prisma.analyticsEvent.count({
                where: { profileId: profile.id, eventType: 'PAGE_VIEW' },
            }),
            this.prisma.analyticsEvent.count({
                where: { profileId: profile.id, eventType: 'LINK_CLICK' },
            }),
            this.prisma.analyticsEvent.findMany({
                where: { profileId: profile.id },
                orderBy: { createdAt: 'desc' },
                take: 50,
                select: {
                    id: true,
                    eventType: true,
                    referrer: true,
                    metadata: true,
                    createdAt: true,
                },
            }),
        ]);

        return { totalViews, totalClicks, recent };
    }

    async getStatsByDateRange(
        userId: string,
        startDate?: string,
        endDate?: string,
    ) {
        const profile = await this.prisma.profile.findUnique({
            where: { userId },
            select: { id: true },
        });

        if (!profile) return [];

        const where: Record<string, unknown> = { profileId: profile.id };

        if (startDate || endDate) {
            const createdAt: Record<string, Date> = {};
            if (startDate) createdAt.gte = new Date(startDate);
            if (endDate) createdAt.lte = new Date(endDate);
            where.createdAt = createdAt;
        }

        return this.prisma.analyticsEvent.groupBy({
            by: ['eventType'],
            where,
            _count: { id: true },
        });
    }

    async getTopReferrers(userId: string, limit = 10) {
        const profile = await this.prisma.profile.findUnique({
            where: { userId },
            select: { id: true },
        });

        if (!profile) return [];

        return this.prisma.analyticsEvent.groupBy({
            by: ['referrer'],
            where: {
                profileId: profile.id,
                referrer: { not: null },
            },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: limit,
        });
    }

    private async flush(): Promise<void> {
        if (this.eventBuffer.length === 0) return;

        const events = [...this.eventBuffer];
        this.eventBuffer = [];

        try {
            await this.prisma.analyticsEvent.createMany({
                data: events.map((e) => ({
                    profileId: e.profileId,
                    eventType: e.eventType,
                    ipHash: e.ipHash,
                    userAgent: e.userAgent,
                    referrer: e.referrer,
                    metadata: e.metadata as any,
                })),
            });
        } catch (error) {
            // Re-add failed events to buffer for retry
            console.error('Failed to flush analytics events:', error);
            this.eventBuffer.push(...events);
        }
    }

    async onModuleDestroy(): Promise<void> {
        clearInterval(this.flushInterval);
        await this.flush();
    }
}
