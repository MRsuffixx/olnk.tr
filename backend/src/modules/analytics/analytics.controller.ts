import {
    Controller,
    Post,
    Get,
    Body,
    Query,
    Req,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import { TrackEventDto, QueryAnalyticsDto } from './dto';
import { JwtAuthGuard } from '../../common/guards';
import { CurrentUser, JwtPayload } from '../../common/decorators';

@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Post('track')
    @HttpCode(HttpStatus.NO_CONTENT)
    async track(@Body() dto: TrackEventDto, @Req() req: Request): Promise<void> {
        const ip =
            (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
            req.socket.remoteAddress ||
            'unknown';
        const userAgent = req.headers['user-agent'];

        await this.analyticsService.trackEvent(dto, ip, userAgent);
    }

    @Get('stats')
    @UseGuards(JwtAuthGuard)
    async getStats(@CurrentUser() user: JwtPayload) {
        return this.analyticsService.getStats(user.sub);
    }

    @Get('stats/range')
    @UseGuards(JwtAuthGuard)
    async getStatsByRange(
        @CurrentUser() user: JwtPayload,
        @Query() query: QueryAnalyticsDto,
    ) {
        return this.analyticsService.getStatsByDateRange(
            user.sub,
            query.startDate,
            query.endDate,
        );
    }

    @Get('stats/referrers')
    @UseGuards(JwtAuthGuard)
    async getTopReferrers(@CurrentUser() user: JwtPayload) {
        return this.analyticsService.getTopReferrers(user.sub);
    }
}
