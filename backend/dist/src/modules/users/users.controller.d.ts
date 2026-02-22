import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';
import { JwtPayload } from '../../common/decorators';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: JwtPayload): Promise<{
        id: string;
        email: string;
        username: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateMe(user: JwtPayload, dto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        username: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteMe(user: JwtPayload): Promise<void>;
}
