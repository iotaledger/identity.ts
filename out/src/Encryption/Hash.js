"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
function Hash(message) {
    var Hasher = crypto.createHash('sha256');
    Hasher.update(message);
    return Hasher.digest('base64');
}
exports.Hash = Hash;
//# sourceMappingURL=Hash.js.map