import {
    Controller,
    Get,
    Patch,
    Delete,
    Body,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';
import { JwtAuthGuard } from '../../common/guards';
import { CurrentUser, JwtPayload } from '../../common/decorators';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    async getMe(@CurrentUser() user: JwtPayload) {
        return this.usersService.findById(user.sub);
    }

    @Patch('me')
    async updateMe(
        @CurrentUser() user: JwtPayload,
        @Body() dto: UpdateUserDto,
    ) {
        return this.usersService.update(user.sub, dto);
    }

    @Delete('me')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteMe(@CurrentUser() user: JwtPayload): Promise<void> {
        await this.usersService.delete(user.sub);
    }
}
