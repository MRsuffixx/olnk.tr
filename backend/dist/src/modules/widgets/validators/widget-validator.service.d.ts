import { WidgetType } from '@prisma/client';
export declare class WidgetValidatorService {
    private readonly configMap;
    validateConfig(type: WidgetType, config: Record<string, unknown>): Promise<void>;
}
