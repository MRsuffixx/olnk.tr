import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

export interface RefreshTokenPayload {
    sub: string;
    email: string;
    username: string;
    refreshToken: string;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(configService: ConfigService) {
        const secret = configService.get<string>('JWT_REFRESH_SECRET');
        if (!secret) {
            throw new Error('JWT_REFRESH_SECRET is not defined');
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: { sub: string; email: string; username: string }): RefreshTokenPayload {
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            throw new UnauthorizedException('No refresh token provided');
        }
        const refreshToken = authHeader.replace('Bearer ', '').trim();

        if (!payload.sub || !payload.email) {
            throw new UnauthorizedException('Invalid refresh token payload');
        }

        return {
            sub: payload.sub,
            email: payload.email,
            username: payload.username,
            refreshToken,
        };
    }
}
