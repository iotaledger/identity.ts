"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseKeypair = /** @class */ (function () {
    function BaseKeypair() {
    }
    BaseKeypair.prototype.GetPublicKey = function () {
        return this.publicKey;
    };
    BaseKeypair.prototype.SetPrivateKey = function (privateKey) {
        this.privateKey = privateKey;
    };
    BaseKeypair.prototype.GetPrivateKey = function () {
        return this.privateKey;
    };
    return BaseKeypair;
}());
exports.BaseKeypair = BaseKeypair;
//# sourceMappingURL=BaseKeypair.js.map