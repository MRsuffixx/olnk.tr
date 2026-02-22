import { Module } from '@nestjs/common';
import { WidgetsController } from './widgets.controller';
import { WidgetsService } from './widgets.service';
import { WidgetValidatorService } from './validators';
import { CacheService } from '../../redis/cache.service';

@Module({
    controllers: [WidgetsController],
    providers: [WidgetsService, WidgetValidatorService, CacheService],
    exports: [WidgetsService],
})
export class WidgetsModule { }
