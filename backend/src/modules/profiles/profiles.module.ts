import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { CacheService } from '../../redis/cache.service';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
    imports: [UploadsModule],
    controllers: [ProfilesController],
    providers: [ProfilesService, CacheService],
    exports: [ProfilesService],
})
export class ProfilesModule { }
