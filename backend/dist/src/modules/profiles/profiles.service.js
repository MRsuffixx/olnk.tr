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
exports.ProfilesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const cache_service_1 = require("../../redis/cache.service");
const sanitize_1 = require("../../common/utils/sanitize");
const PROFILE_CACHE_TTL = 300;
let ProfilesService = class ProfilesService {
    constructor(prisma, cache) {
        this.prisma = prisma;
        this.cache = cache;
    }
    async getMyProfile(userId) {
        const profile = await this.prisma.profile.findUnique({
            where: { userId },
            include: {
                widgets: {
                    where: { isVisible: true },
                    orderBy: { order: 'asc' },
                },
                user: {
                    select: {
                        username: true,
                        email: true,
                    },
                },
            },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Profile not found');
        }
        return profile;
    }
    async getPublicProfile(username) {
        const cacheKey = `profile:${username.toLowerCase()}`;
        const cached = await this.cache.get(cacheKey);
        if (cached) {
            return cached;
        }
        const profile = await this.prisma.profile.findFirst({
            where: {
                user: {
                    username: username.toLowerCase(),
                },
            },
            select: {
                id: true,
                displayName: true,
                bio: true,
                avatarUrl: true,
                theme: true,
                layoutConfig: true,
                user: {
                    select: {
                        username: true,
                    },
                },
                widgets: {
                    where: { isVisible: true },
                    orderBy: { order: 'asc' },
                    select: {
                        id: true,
                        type: true,
                        config: true,
                        order: true,
                    },
                },
            },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Profile not found');
        }
        await this.cache.set(cacheKey, profile, PROFILE_CACHE_TTL);
        return profile;
    }
    async updateProfile(userId, dto) {
        const existing = await this.prisma.profile.findUnique({
            where: { userId },
            include: { user: { select: { username: true } } },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Profile not found');
        }
        const updateData = {};
        if (dto.displayName !== undefined) {
            updateData.displayName = (0, sanitize_1.sanitize)(dto.displayName);
        }
        if (dto.bio !== undefined) {
            updateData.bio = (0, sanitize_1.sanitize)(dto.bio);
        }
        if (dto.theme !== undefined) {
            updateData.theme = dto.theme;
        }
        if (dto.layoutConfig !== undefined) {
            updateData.layoutConfig = dto.layoutConfig;
        }
        const profile = await this.prisma.profile.update({
            where: { userId },
            data: updateData,
            include: {
                widgets: {
                    where: { isVisible: true },
                    orderBy: { order: 'asc' },
                },
                user: {
                    select: { username: true },
                },
            },
        });
        await this.cache.del(`profile:${existing.user.username}`);
        return profile;
    }
    async updateAvatar(userId, avatarUrl) {
        const existing = await this.prisma.profile.findUnique({
            where: { userId },
            include: { user: { select: { username: true } } },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Profile not found');
        }
        const profile = await this.prisma.profile.update({
            where: { userId },
            data: { avatarUrl },
        });
        await this.cache.del(`profile:${existing.user.username}`);
        return profile;
    }
};
exports.ProfilesService = ProfilesService;
exports.ProfilesService = ProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], ProfilesService);
//# sourceMappingURL=profiles.service.js.map