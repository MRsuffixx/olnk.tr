import { AuthService, AuthResponse, AuthTokens } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { JwtPayload } from '../../common/decorators';
import { RefreshTokenPayload } from './strategies/jwt-refresh.strategy';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<AuthResponse>;
    login(dto: LoginDto): Promise<AuthResponse>;
    refreshTokens(user: RefreshTokenPayload): Promise<AuthTokens>;
    logout(user: JwtPayload): Promise<{
        message: string;
    }>;
}
