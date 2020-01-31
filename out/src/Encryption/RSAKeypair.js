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
var crypto = require("crypto");
exports.passphrase = 'Semantic Market runs on IOTA! @(^_^)@';
var RSAKeypair = /** @class */ (function (_super) {
    __extends(RSAKeypair, _super);
    function RSAKeypair(publicKey, privateKey) {
        var _this = _super.call(this) || this;
        _this.publicKey = publicKey;
        _this.privateKey = (privateKey) ? privateKey : undefined;
        return _this;
    }
    RSAKeypair.prototype.PublicEncrypt = function (message) {
        return crypto.publicEncrypt({ key: this.publicKey, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(message));
    };
    //These two functions dont seem useful as Sign and Verify should take care of this.
    /*public async PublicDecrypt(input: string): Promise<string> {
        return crypto.publicDecrypt({key : this.publicKey, padding: crypto.constants.RSA_PKCS1_PADDING}, Buffer.from(input)).toString();
    }*/
    /*public async PrivateEncrypt(message: string): Promise<Buffer> {
        if(!this.privateKey) {
            console.log("Warning: Encryption with private key called, without a private key accessible\n");
            return new Buffer("");
        }
            
        return crypto.privateEncrypt({key: this.privateKey, passphrase: passphrase, padding: crypto.constants.RSA_PKCS1_PADDING}, Buffer.from(message));
    }*/
    RSAKeypair.prototype.PrivateDecrypt = function (input) {
        if (!this.privateKey) {
            console.log("Warning: Decryption with private key called, without a private key accessible\n");
            return "";
        }
        return crypto.privateDecrypt({ key: this.privateKey, passphrase: exports.passphrase, padding: crypto.constants.RSA_PKCS1_PADDING }, input).toString();
    };
    RSAKeypair.prototype.Sign = function (dataToSign) {
        if (!this.privateKey)
            return undefined;
        var signer = crypto.createSign('SHA256');
        signer.update(dataToSign);
        signer.end();
        return signer.sign({ key: this.privateKey, passphrase: exports.passphrase, padding: crypto.constants.RSA_PKCS1_PADDING });
    };
    RSAKeypair.prototype.Verify = function (dataToCheck, signatureToVerify) {
        var verifier = crypto.createVerify('SHA256');
        verifier.update(dataToCheck);
        verifier.end();
        return verifier.verify(this.publicKey, signatureToVerify);
    };
    RSAKeypair.prototype.GetKeyType = function () {
        return "RsaVerificationKey2018";
    };
    ;
    RSAKeypair.prototype.GetPublicKeyFormat = function () {
        return "publicKeyPem";
    };
    return RSAKeypair;
}(BaseKeypair_1.BaseKeypair));
exports.RSAKeypair = RSAKeypair;
//# sourceMappingURL=RSAKeypair.js.map