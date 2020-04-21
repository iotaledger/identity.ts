"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var cryptoJS = require("crypto-js");
function Hash(message) {
    var Hasher = crypto.createHash('sha256');
    Hasher.update(message);
    return Hasher.digest('base64');
}
exports.Hash = Hash;
function Uint8ArrayHash(message) {
    var hash = cryptoJS.SHA256(message);
    var buffer = Buffer.from(hash.toString(cryptoJS.enc.Hex), 'hex');
    return new Uint8Array(buffer);
}
exports.Uint8ArrayHash = Uint8ArrayHash;
//# sourceMappingURL=Hash.js.map