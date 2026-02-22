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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReorderWidgetsDto = exports.UpdateWidgetDto = exports.CreateWidgetDto = exports.SocialWidgetConfig = exports.SocialPlatform = exports.ImageWidgetConfig = exports.TextWidgetConfig = exports.LinkWidgetConfig = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class LinkWidgetConfig {
}
exports.LinkWidgetConfig = LinkWidgetConfig;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], LinkWidgetConfig.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsUrl)({}, { message: 'Must be a valid URL' }),
    __metadata("design:type", String)
], LinkWidgetConfig.prototype, "url", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], LinkWidgetConfig.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LinkWidgetConfig.prototype, "icon", void 0);
class TextWidgetConfig {
}
exports.TextWidgetConfig = TextWidgetConfig;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], TextWidgetConfig.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TextWidgetConfig.prototype, "align", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TextWidgetConfig.prototype, "fontSize", void 0);
class ImageWidgetConfig {
}
exports.ImageWidgetConfig = ImageWidgetConfig;
__decorate([
    (0, class_validator_1.IsUrl)({}, { message: 'Must be a valid URL' }),
    __metadata("design:type", String)
], ImageWidgetConfig.prototype, "src", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], ImageWidgetConfig.prototype, "alt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], ImageWidgetConfig.prototype, "linkUrl", void 0);
class SocialPlatform {
}
exports.SocialPlatform = SocialPlatform;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SocialPlatform.prototype, "platform", void 0);
__decorate([
    (0, class_validator_1.IsUrl)({}, { message: 'Must be a valid URL' }),
    __metadata("design:type", String)
], SocialPlatform.prototype, "url", void 0);
class SocialWidgetConfig {
}
exports.SocialWidgetConfig = SocialWidgetConfig;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SocialPlatform),
    __metadata("design:type", Array)
], SocialWidgetConfig.prototype, "platforms", void 0);
class CreateWidgetDto {
}
exports.CreateWidgetDto = CreateWidgetDto;
__decorate([
    (0, class_validator_1.IsEnum)(client_1.WidgetType, {
        message: 'Widget type must be one of: LINK, TEXT, IMAGE, SOCIAL',
    }),
    __metadata("design:type", String)
], CreateWidgetDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateWidgetDto.prototype, "config", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateWidgetDto.prototype, "order", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateWidgetDto.prototype, "isVisible", void 0);
class UpdateWidgetDto {
}
exports.UpdateWidgetDto = UpdateWidgetDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateWidgetDto.prototype, "config", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateWidgetDto.prototype, "order", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateWidgetDto.prototype, "isVisible", void 0);
class ReorderWidgetsDto {
}
exports.ReorderWidgetsDto = ReorderWidgetsDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ReorderWidgetsDto.prototype, "widgetIds", void 0);
//# sourceMappingURL=widget.dto.js.map