"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const hash_ip_1 = require("../../common/utils/hash-ip");
let AnalyticsService = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.eventBuffer = [];
        this.BUFFER_SIZE = 20;
        this.FLUSH_INTERVAL_MS = 5000;
        this.flushInterval = setInterval(() => {
            this.flush();
        }, this.FLUSH_INTERVAL_MS);
    }
    async trackEvent(dto, ip, userAgent) {
        const ipHash = (0, hash_ip_1.hashIp)(ip);
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
    async getStats(userId) {
        const profile = await this.prisma.profile.findUnique({
            where: { userId },
            select: { id: true },
        });
        if (!profile)
            return { totalViews: 0, totalClicks: 0, recent: [] };
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
    async getStatsByDateRange(userId, startDate, endDate) {
        const profile = await this.prisma.profile.findUnique({
            where: { userId },
            select: { id: true },
        });
        if (!profile)
            return [];
        const where = { profileId: profile.id };
        if (startDate || endDate) {
            const createdAt = {};
            if (startDate)
                createdAt.gte = new Date(startDate);
            if (endDate)
                createdAt.lte = new Date(endDate);
            where.createdAt = createdAt;
        }
        return this.prisma.analyticsEvent.groupBy({
            by: ['eventType'],
            where,
            _count: { id: true },
        });
    }
    async getTopReferrers(userId, limit = 10) {
        const profile = await this.prisma.profile.findUnique({
            where: { userId },
            select: { id: true },
        });
        if (!profile)
            return [];
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
    async flush() {
        if (this.eventBuffer.length === 0)
            return;
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
                    metadata: e.metadata,
                })),
            });
        }
        catch (error) {
            console.error('Failed to flush analytics events:', error);
            this.eventBuffer.push(...events);
        }
    }
    async onModuleDestroy() {
        clearInterval(this.flushInterval);
        await this.flush();
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map