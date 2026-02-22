"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetsController = void 0;
const common_1 = require("@nestjs/common");
const widgets_service_1 = require("./widgets.service");
const dto_1 = require("./dto");
const guards_1 = require("../../common/guards");
const decorators_1 = require("../../common/decorators");
let WidgetsController = class WidgetsController {
    constructor(widgetsService) {
        this.widgetsService = widgetsService;
    }
    async create(user, dto) {
        return this.widgetsService.create(user.sub, dto);
    }
    async findAll(user) {
        return this.widgetsService.findAllForUser(user.sub);
    }
    async findOne(user, id) {
        return this.widgetsService.findOne(user.sub, id);
    }
    async update(user, id, dto) {
        return this.widgetsService.update(user.sub, id, dto);
    }
    async remove(user, id) {
        return this.widgetsService.remove(user.sub, id);
    }
    async reorder(user, dto) {
        return this.widgetsService.reorder(user.sub, dto);
    }
};
exports.WidgetsController = WidgetsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateWidgetDto]),
    __metadata("design:returntype", Promise)
], WidgetsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WidgetsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WidgetsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.UpdateWidgetDto]),
    __metadata("design:returntype", Promise)
], WidgetsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WidgetsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('reorder'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.ReorderWidgetsDto]),
    __metadata("design:returntype", Promise)
], WidgetsController.prototype, "reorder", null);
exports.WidgetsController = WidgetsController = __decorate([
    (0, common_1.Controller)('widgets'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    __metadata("design:paramtypes", [widgets_service_1.WidgetsService])
], WidgetsController);
//# sourceMappingURL=widgets.controller.js.map