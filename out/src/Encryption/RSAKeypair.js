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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, crypto.publicEncrypt({ key: this.publicKey, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(message))];
            });
        });
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
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.privateKey) {
                    console.log("Warning: Decryption with private key called, without a private key accessible\n");
                    return [2 /*return*/, ""];
                }
                return [2 /*return*/, crypto.privateDecrypt({ key: this.privateKey, passphrase: exports.passphrase, padding: crypto.constants.RSA_PKCS1_PADDING }, input).toString()];
            });
        });
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
    return RSAKeypair;
}(BaseKeypair_1.BaseKeypair));
exports.RSAKeypair = RSAKeypair;
//# sourceMappingURL=RSAKeypair.js.map