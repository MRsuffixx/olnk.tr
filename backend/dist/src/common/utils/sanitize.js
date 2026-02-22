"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitize = sanitize;
exports.sanitizeObject = sanitizeObject;
const sanitizeHtml = require('sanitize-html');
function sanitize(input) {
    return sanitizeHtml(input, {
        allowedTags: [],
        allowedAttributes: {},
        disallowedTagsMode: 'recursiveEscape',
    });
}
function sanitizeObject(obj) {
    const sanitized = { ...obj };
    for (const key of Object.keys(sanitized)) {
        const value = sanitized[key];
        if (typeof value === 'string') {
            sanitized[key] = sanitize(value);
        }
        else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            sanitized[key] = sanitizeObject(value);
        }
    }
    return sanitized;
}
//# sourceMappingURL=sanitize.js.map