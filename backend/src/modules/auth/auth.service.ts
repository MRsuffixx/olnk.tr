import {
    Injectable,
    ConflictException,
    UnauthorizedException,
    ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto';

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse {
    tokens: AuthTokens;
    user: {
        id: string;
        email: string;
        username: string;
    };
}

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async register(dto: RegisterDto): Promise<AuthResponse> {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: dto.email }, { username: dto.username }],
            },
        });

        if (existingUser) {
            if (existingUser.email === dto.email) {
                throw new ConflictException('Email already in use');
            }
            throw new ConflictException('Username already taken');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 12);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                username: dto.username.toLowerCase(),
                password: hashedPassword,
                profile: {
                    create: {
                        displayName: dto.username,
                    },
                },
            },
        });

        const tokens = await this.generateTokens(user.id, user.email, user.username);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return {
            tokens,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
        };
    }

    async login(dto: LoginDto): Promise<AuthResponse> {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordValid = await bcrypt.compare(dto.password, user.password);
        if (!passwordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = await this.generateTokens(user.id, user.email, user.username);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return {
            tokens,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
        };
    }

    async refreshTokens(userId: string, refreshToken: string): Promise<AuthTokens> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || !user.refreshToken) {
            throw new ForbiddenException('Access denied');
        }

        const tokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!tokenValid) {
            // Possible token reuse attack — revoke all tokens
            await this.prisma.user.update({
                where: { id: userId },
                data: { refreshToken: null },
            });
            throw new ForbiddenException('Token reuse detected');
        }

        const tokens = await this.generateTokens(user.id, user.email, user.username);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async logout(userId: string): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
    }

    private async generateTokens(
        userId: string,
        email: string,
        username: string,
    ): Promise<AuthTokens> {
        const payload = { sub: userId, email, username };

        const accessExpiration = this.configService.get<string>('JWT_ACCESS_EXPIRATION') || '15m';
        const refreshExpiration = this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d';

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                expiresIn: accessExpiration,
            } as any),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: refreshExpiration,
            } as any),
        ]);

        return { accessToken, refreshToken };
    }

    private async updateRefreshToken(
        userId: string,
        refreshToken: string,
    ): Promise<void> {
        const hashedToken = await bcrypt.hash(refreshToken, 12);
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: hashedToken },
        });
    }
}
