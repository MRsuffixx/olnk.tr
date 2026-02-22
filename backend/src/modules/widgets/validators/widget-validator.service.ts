import { Injectable, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { WidgetType } from '@prisma/client';
import {
    LinkWidgetConfig,
    TextWidgetConfig,
    ImageWidgetConfig,
    SocialWidgetConfig,
} from '../dto/widget.dto';

@Injectable()
export class WidgetValidatorService {
    private readonly configMap: Record<WidgetType, new () => object> = {
        [WidgetType.LINK]: LinkWidgetConfig,
        [WidgetType.TEXT]: TextWidgetConfig,
        [WidgetType.IMAGE]: ImageWidgetConfig,
        [WidgetType.SOCIAL]: SocialWidgetConfig,
    };

    async validateConfig(
        type: WidgetType,
        config: Record<string, unknown>,
    ): Promise<void> {
        const ConfigClass = this.configMap[type];
        if (!ConfigClass) {
            throw new BadRequestException(`Unknown widget type: ${type}`);
        }

        const instance = plainToInstance(ConfigClass, config);
        const errors = await validate(instance as object, {
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

            throw new BadRequestException({
                message: `Invalid config for widget type ${type}`,
                errors: messages,
            });
        }
    }
}
