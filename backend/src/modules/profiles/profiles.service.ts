import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../redis/cache.service';
import { UpdateProfileDto } from './dto';
import { sanitize } from '../../common/utils/sanitize';

const PROFILE_CACHE_TTL = 300; // 5 minutes

@Injectable()
export class ProfilesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cache: CacheService,
    ) { }

    async getMyProfile(userId: string) {
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
            throw new NotFoundException('Profile not found');
        }

        return profile;
    }

    async getPublicProfile(username: string) {
        const cacheKey = `profile:${username.toLowerCase()}`;

        // Try cache first
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
            throw new NotFoundException('Profile not found');
        }

        // Cache the result
        await this.cache.set(cacheKey, profile, PROFILE_CACHE_TTL);

        return profile;
    }

    async updateProfile(userId: string, dto: UpdateProfileDto) {
        const existing = await this.prisma.profile.findUnique({
            where: { userId },
            include: { user: { select: { username: true } } },
        });

        if (!existing) {
            throw new NotFoundException('Profile not found');
        }

        const updateData: Record<string, unknown> = {};

        if (dto.displayName !== undefined) {
            updateData.displayName = sanitize(dto.displayName);
        }
        if (dto.bio !== undefined) {
            updateData.bio = sanitize(dto.bio);
        }
        if (dto.theme !== undefined) {
            updateData.theme = dto.theme;
        }
        if (dto.layoutConfig !== undefined) {
            updateData.layoutConfig = dto.layoutConfig;
        }

        const profile = await this.prisma.profile.update({
            where: { userId },
            data: updateData as any,
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

        // Invalidate cache
        await this.cache.del(`profile:${existing.user.username}`);

        return profile;
    }

    async updateAvatar(userId: string, avatarUrl: string) {
        const existing = await this.prisma.profile.findUnique({
            where: { userId },
            include: { user: { select: { username: true } } },
        });

        if (!existing) {
            throw new NotFoundException('Profile not found');
        }

        const profile = await this.prisma.profile.update({
            where: { userId },
            data: { avatarUrl },
        });

        // Invalidate cache
        await this.cache.del(`profile:${existing.user.username}`);

        return profile;
    }
}
