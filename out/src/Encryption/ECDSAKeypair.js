"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseKeypair_1 = require("./BaseKeypair");
var secp256k1 = require("secp256k1");
var Hash_1 = require("./Hash");
var eciesjs_1 = require("eciesjs");
var ECDSAKeypair = /** @class */ (function (_super) {
    __extends(ECDSAKeypair, _super);
    function ECDSAKeypair(publicKey, privateKey) {
        var _this = _super.call(this) || this;
        _this.publicKey = publicKey;
        _this.privateKey = (privateKey) ? privateKey : undefined;
        return _this;
    }
    ECDSAKeypair.prototype.PublicEncrypt = function (message) {
        return eciesjs_1.encrypt(Buffer.from(this.publicKey, 'base64'), Buffer.from(message));
    };
    ECDSAKeypair.prototype.PrivateDecrypt = function (input) {
        if (!this.privateKey) {
            // tslint:disable-next-line:no-console
            console.log("Warning: Decryption with private key called, without a private key accessible\n");
            return "";
        }
        return eciesjs_1.decrypt(Buffer.from(this.privateKey, 'base64'), input).toString();
    };
    ECDSAKeypair.prototype.Sign = function (dataToSign) {
        if (!this.privateKey)
            return undefined;
        var privateKeyBuffer = Buffer.from(this.privateKey, 'base64');
        var signature = secp256k1.ecdsaSign(Hash_1.Uint8ArrayHash(dataToSign), new Uint8Array(privateKeyBuffer));
        return Buffer.from(signature.signature);
    };
    ECDSAKeypair.prototype.Verify = function (dataToCheck, signatureToVerify) {
        var publicKeyBuffer = Buffer.from(this.publicKey, 'base64');
        return secp256k1.ecdsaVerify(signatureToVerify, Hash_1.Uint8ArrayHash(dataToCheck), new Uint8Array(publicKeyBuffer));
    };
    ECDSAKeypair.prototype.GetKeyType = function () {
        return "EcdsaSecp256k1VerificationKey2019";
    };
    ECDSAKeypair.prototype.GetPublicKeyFormat = function () {
        return "publicKeyBase58";
    };
    return ECDSAKeypair;
}(BaseKeypair_1.BaseKeypair));
exports.ECDSAKeypair = ECDSAKeypair;
//# sourceMappingURL=ECDSAKeypair.js.map