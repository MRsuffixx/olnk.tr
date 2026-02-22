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
exports.WidgetsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const cache_service_1 = require("../../redis/cache.service");
const validators_1 = require("./validators");
let WidgetsService = class WidgetsService {
    constructor(prisma, cache, widgetValidator) {
        this.prisma = prisma;
        this.cache = cache;
        this.widgetValidator = widgetValidator;
    }
    async create(userId, dto) {
        const profile = await this.getProfileForUser(userId);
        await this.widgetValidator.validateConfig(dto.type, dto.config);
        const order = dto.order ??
            (await this.getNextOrder(profile.id));
        const widget = await this.prisma.widget.create({
            data: {
                profileId: profile.id,
                type: dto.type,
                config: dto.config,
                order,
                isVisible: dto.isVisible ?? true,
            },
        });
        await this.invalidateProfileCache(userId);
        return widget;
    }
    async findAllForUser(userId) {
        const profile = await this.getProfileForUser(userId);
        return this.prisma.widget.findMany({
            where: { profileId: profile.id },
            orderBy: { order: 'asc' },
        });
    }
    async findOne(userId, widgetId) {
        const widget = await this.prisma.widget.findUnique({
            where: { id: widgetId },
            include: { profile: true },
        });
        if (!widget) {
            throw new common_1.NotFoundException('Widget not found');
        }
        if (widget.profile.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return widget;
    }
    async update(userId, widgetId, dto) {
        const widget = await this.findOne(userId, widgetId);
        if (dto.config) {
            await this.widgetValidator.validateConfig(widget.type, dto.config);
        }
        const updated = await this.prisma.widget.update({
            where: { id: widgetId },
            data: {
                ...(dto.config && { config: dto.config }),
                ...(dto.order !== undefined && { order: dto.order }),
                ...(dto.isVisible !== undefined && { isVisible: dto.isVisible }),
            },
        });
        await this.invalidateProfileCache(userId);
        return updated;
    }
    async remove(userId, widgetId) {
        await this.findOne(userId, widgetId);
        await this.prisma.widget.delete({ where: { id: widgetId } });
        await this.invalidateProfileCache(userId);
        return { deleted: true };
    }
    async reorder(userId, dto) {
        const profile = await this.getProfileForUser(userId);
        const widgets = await this.prisma.widget.findMany({
            where: {
                id: { in: dto.widgetIds },
                profileId: profile.id,
            },
        });
        if (widgets.length !== dto.widgetIds.length) {
            throw new common_1.NotFoundException('One or more widgets not found');
        }
        await this.prisma.$transaction(dto.widgetIds.map((widgetId, index) => this.prisma.widget.update({
            where: { id: widgetId },
            data: { order: index },
        })));
        await this.invalidateProfileCache(userId);
        return { reordered: true };
    }
    async getProfileForUser(userId) {
        const profile = await this.prisma.profile.findUnique({
            where: { userId },
            include: { user: { select: { username: true } } },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Profile not found');
        }
        return profile;
    }
    async getNextOrder(profileId) {
        const lastWidget = await this.prisma.widget.findFirst({
            where: { profileId },
            orderBy: { order: 'desc' },
            select: { order: true },
        });
        return (lastWidget?.order ?? -1) + 1;
    }
    async invalidateProfileCache(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { username: true },
        });
        if (user) {
            await this.cache.del(`profile:${user.username}`);
        }
    }
};
exports.WidgetsService = WidgetsService;
exports.WidgetsService = WidgetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService,
        validators_1.WidgetValidatorService])
], WidgetsService);
//# sourceMappingURL=widgets.service.js.map