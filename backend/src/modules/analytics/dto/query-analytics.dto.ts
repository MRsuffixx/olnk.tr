import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { AnalyticsEventType } from '@prisma/client';

export class QueryAnalyticsDto {
    @IsOptional()
    @IsEnum(AnalyticsEventType)
    eventType?: AnalyticsEventType;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsString()
    groupBy?: 'day' | 'week' | 'month';
}
