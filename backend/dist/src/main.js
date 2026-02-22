"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const helmet_1 = __importDefault(require("helmet"));
const path_1 = require("path");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin: configService.get('APP_CORS_ORIGIN', 'http://localhost:3000'),
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const uploadDir = configService.get('UPLOAD_DIR', './uploads');
    app.useStaticAssets((0, path_1.join)(process.cwd(), uploadDir), {
        prefix: '/uploads',
    });
    app.setGlobalPrefix('api');
    const port = configService.get('APP_PORT', 4000);
    await app.listen(port);
    console.log(`🚀 Application running on http://localhost:${port}`);
    console.log(`📚 API available at http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map