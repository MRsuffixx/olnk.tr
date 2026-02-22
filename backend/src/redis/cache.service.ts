import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.module';

@Injectable()
export class CacheService {
    constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) { }

    async get<T>(key: string): Promise<T | null> {
        const data = await this.redis.get(key);
        if (!data) return null;
        try {
            return JSON.parse(data) as T;
        } catch {
            return data as unknown as T;
        }
    }

    async set(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
        const serialized = typeof value === 'string' ? value : JSON.stringify(value);
        await this.redis.set(key, serialized, 'EX', ttlSeconds);
    }

    async del(key: string): Promise<void> {
        await this.redis.del(key);
    }

    async delByPattern(pattern: string): Promise<void> {
        const keys = await this.redis.keys(pattern);
        if (keys.length > 0) {
            await this.redis.del(...keys);
        }
    }

    async exists(key: string): Promise<boolean> {
        const result = await this.redis.exists(key);
        return result === 1;
    }
}
