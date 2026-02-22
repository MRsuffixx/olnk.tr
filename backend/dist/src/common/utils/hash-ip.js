"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashIp = hashIp;
const crypto_1 = require("crypto");
function hashIp(ip) {
    return (0, crypto_1.createHash)('sha256').update(ip).digest('hex');
}
//# sourceMappingURL=hash-ip.js.map