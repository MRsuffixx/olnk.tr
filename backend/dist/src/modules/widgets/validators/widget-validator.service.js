"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetValidatorService = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const widget_dto_1 = require("../dto/widget.dto");
let WidgetValidatorService = class WidgetValidatorService {
    constructor() {
        this.configMap = {
            [client_1.WidgetType.LINK]: widget_dto_1.LinkWidgetConfig,
            [client_1.WidgetType.TEXT]: widget_dto_1.TextWidgetConfig,
            [client_1.WidgetType.IMAGE]: widget_dto_1.ImageWidgetConfig,
            [client_1.WidgetType.SOCIAL]: widget_dto_1.SocialWidgetConfig,
        };
    }
    async validateConfig(type, config) {
        const ConfigClass = this.configMap[type];
        if (!ConfigClass) {
            throw new common_1.BadRequestException(`Unknown widget type: ${type}`);
        }
        const instance = (0, class_transformer_1.plainToInstance)(ConfigClass, config);
        const errors = await (0, class_validator_1.validate)(instance, {
            whitelist: true,
            forbidNonWhitelisted: true,
        });
        if (errors.length > 0) {
            const messages = errors
                .map((err) => {
                const constraints = err.constraints;
                return constraints ? Object.values(constraints).join(', ') : '';
            })
                .filter(Boolean);
            throw new common_1.BadRequestException({
                message: `Invalid config for widget type ${type}`,
                errors: messages,
            });
        }
    }
};
exports.WidgetValidatorService = WidgetValidatorService;
exports.WidgetValidatorService = WidgetValidatorService = __decorate([
    (0, common_1.Injectable)()
], WidgetValidatorService);
//# sourceMappingURL=widget-validator.service.js.map