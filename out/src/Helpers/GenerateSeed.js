"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
/**
 * Generate a random seed consisting of A-Z9 characters.
 * @param length Length of the seed. Default is 81 characters.
 */
function GenerateSeed(length) {
    if (length === void 0) { length = 81; }
    var charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9';
    var seed = '';
    while (seed.length < length) {
        var byte = crypto.randomBytes(1);
        if (byte[0] < 243) {
            seed += charset.charAt(byte[0] % 27);
        }
    }
    return seed;
}
exports.GenerateSeed = GenerateSeed;
//# sourceMappingURL=GenerateSeed.js.map