import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../redis/cache.service';
import { CreateWidgetDto, UpdateWidgetDto, ReorderWidgetsDto } from './dto';
import { WidgetValidatorService } from './validators';

@Injectable()
export class WidgetsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cache: CacheService,
        private readonly widgetValidator: WidgetValidatorService,
    ) { }

    async create(userId: string, dto: CreateWidgetDto) {
        const profile = await this.getProfileForUser(userId);

        // Validate the config against the widget type schema
        await this.widgetValidator.validateConfig(dto.type, dto.config);

        // Get the next order value if not specified
        const order =
            dto.order ??
            (await this.getNextOrder(profile.id));

        const widget = await this.prisma.widget.create({
            data: {
                profileId: profile.id,
                type: dto.type,
                config: dto.config as any,
                order,
                isVisible: dto.isVisible ?? true,
            },
        });

        await this.invalidateProfileCache(userId);

        return widget;
    }

    async findAllForUser(userId: string) {
        const profile = await this.getProfileForUser(userId);

        return this.prisma.widget.findMany({
            where: { profileId: profile.id },
            orderBy: { order: 'asc' },
        });
    }

    async findOne(userId: string, widgetId: string) {
        const widget = await this.prisma.widget.findUnique({
            where: { id: widgetId },
            include: { profile: true },
        });

        if (!widget) {
            throw new NotFoundException('Widget not found');
        }

        if (widget.profile.userId !== userId) {
            throw new ForbiddenException('Access denied');
        }

        return widget;
    }

    async update(userId: string, widgetId: string, dto: UpdateWidgetDto) {
        const widget = await this.findOne(userId, widgetId);

        if (dto.config) {
            await this.widgetValidator.validateConfig(widget.type, dto.config);
        }

        const updated = await this.prisma.widget.update({
            where: { id: widgetId },
            data: {
                ...(dto.config && { config: dto.config as any }),
                ...(dto.order !== undefined && { order: dto.order }),
                ...(dto.isVisible !== undefined && { isVisible: dto.isVisible }),
            },
        });

        await this.invalidateProfileCache(userId);

        return updated;
    }

    async remove(userId: string, widgetId: string) {
        await this.findOne(userId, widgetId); // verifies ownership

        await this.prisma.widget.delete({ where: { id: widgetId } });

        await this.invalidateProfileCache(userId);

        return { deleted: true };
    }

    async reorder(userId: string, dto: ReorderWidgetsDto) {
        const profile = await this.getProfileForUser(userId);

        // Verify all widget IDs belong to this profile
        const widgets = await this.prisma.widget.findMany({
            where: {
                id: { in: dto.widgetIds },
                profileId: profile.id,
            },
        });

        if (widgets.length !== dto.widgetIds.length) {
            throw new NotFoundException('One or more widgets not found');
        }

        // Update order for each widget using a transaction
        await this.prisma.$transaction(
            dto.widgetIds.map((widgetId, index) =>
                this.prisma.widget.update({
                    where: { id: widgetId },
                    data: { order: index },
                }),
            ),
        );

        await this.invalidateProfileCache(userId);

        return { reordered: true };
    }

    private async getProfileForUser(userId: string) {
        const profile = await this.prisma.profile.findUnique({
            where: { userId },
            include: { user: { select: { username: true } } },
        });

        if (!profile) {
            throw new NotFoundException('Profile not found');
        }

        return profile;
    }

    private async getNextOrder(profileId: string): Promise<number> {
        const lastWidget = await this.prisma.widget.findFirst({
            where: { profileId },
            orderBy: { order: 'desc' },
            select: { order: true },
        });

        return (lastWidget?.order ?? -1) + 1;
    }

    private async invalidateProfileCache(userId: string): Promise<void> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { username: true },
        });
        if (user) {
            await this.cache.del(`profile:${user.username}`);
        }
    }
}
