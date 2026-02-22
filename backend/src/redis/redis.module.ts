import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: REDIS_CLIENT,
            useFactory: (configService: ConfigService) => {
                const redis = new Redis({
                    host: configService.get<string>('REDIS_HOST', 'localhost'),
                    port: configService.get<number>('REDIS_PORT', 6379),
                    password: configService.get<string>('REDIS_PASSWORD', ''),
                    maxRetriesPerRequest: 3,
                    retryStrategy: (times: number) => {
                        if (times > 3) return null;
                        return Math.min(times * 200, 2000);
                    },
                });

                redis.on('error', (err: Error) => {
                    console.error('Redis connection error:', err.message);
                });

                redis.on('connect', () => {
                    console.log('Redis connected successfully');
                });

                return redis;
            },
            inject: [ConfigService],
        },
    ],
    exports: [REDIS_CLIENT],
})
export class RedisModule { }
