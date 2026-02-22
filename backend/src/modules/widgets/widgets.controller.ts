import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { WidgetsService } from './widgets.service';
import { CreateWidgetDto, UpdateWidgetDto, ReorderWidgetsDto } from './dto';
import { JwtAuthGuard } from '../../common/guards';
import { CurrentUser, JwtPayload } from '../../common/decorators';

@Controller('widgets')
@UseGuards(JwtAuthGuard)
export class WidgetsController {
    constructor(private readonly widgetsService: WidgetsService) { }

    @Post()
    async create(
        @CurrentUser() user: JwtPayload,
        @Body() dto: CreateWidgetDto,
    ) {
        return this.widgetsService.create(user.sub, dto);
    }

    @Get()
    async findAll(@CurrentUser() user: JwtPayload) {
        return this.widgetsService.findAllForUser(user.sub);
    }

    @Get(':id')
    async findOne(
        @CurrentUser() user: JwtPayload,
        @Param('id') id: string,
    ) {
        return this.widgetsService.findOne(user.sub, id);
    }

    @Patch(':id')
    async update(
        @CurrentUser() user: JwtPayload,
        @Param('id') id: string,
        @Body() dto: UpdateWidgetDto,
    ) {
        return this.widgetsService.update(user.sub, id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(
        @CurrentUser() user: JwtPayload,
        @Param('id') id: string,
    ) {
        return this.widgetsService.remove(user.sub, id);
    }

    @Post('reorder')
    @HttpCode(HttpStatus.OK)
    async reorder(
        @CurrentUser() user: JwtPayload,
        @Body() dto: ReorderWidgetsDto,
    ) {
        return this.widgetsService.reorder(user.sub, dto);
    }
}
