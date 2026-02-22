// eslint-disable-next-line @typescript-eslint/no-var-requires
const sanitizeHtml = require('sanitize-html') as (dirty: string, options?: any) => string;

export function sanitize(input: string): string {
    return sanitizeHtml(input, {
        allowedTags: [],
        allowedAttributes: {},
        disallowedTagsMode: 'recursiveEscape',
    });
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
    const sanitized = { ...obj };
    for (const key of Object.keys(sanitized)) {
        const value = sanitized[key];
        if (typeof value === 'string') {
            (sanitized as Record<string, unknown>)[key] = sanitize(value);
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            (sanitized as Record<string, unknown>)[key] = sanitizeObject(
                value as Record<string, unknown>,
            );
        }
    }
    return sanitized;
}
