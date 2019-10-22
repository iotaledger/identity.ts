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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var Credential_1 = require("./Credential");
var ProofTypeManager_1 = require("./Proof/ProofTypeManager");
var VerifiableObject_1 = require("./VerifiableObject");
var iota_1 = require("../IOTA/iota");
var DID_1 = require("../DID/DID");
var VerifiableCredential = /** @class */ (function (_super) {
    __extends(VerifiableCredential, _super);
    function VerifiableCredential(credential, proof) {
        var _this = _super.call(this, proof) || this;
        _this.credential = credential;
        return _this;
    }
    VerifiableCredential.Create = function (credential, proof) {
        return new VerifiableCredential(credential, proof);
    };
    /*public static async DecodeFromJSON(credentialData : VerifiableCredentialDataModel, provider : string, issuerRoot : string, issuerKeyId : string, challengeNonce : string | undefined, mamSettings ?: MAMSettings) : Promise<VerifiableCredential>{
        let IssuerDID : DIDDocument = await DIDDocument.readDIDDocument(provider, issuerRoot, mamSettings);
        let proof : Proof = ProofTypeManager.GetInstance().CreateProofWithBuilder(credentialData.proof.type, IssuerDID, issuerKeyId, challengeNonce);
        return new VerifiableCredential( Credential.DecodeFromJSON(<CredentialDataModel>credentialData), proof);
    }*/
    VerifiableCredential.DecodeFromJSON = function (credentialData, proofParameter) {
        if (credentialData.proof) {
            var proof = ProofTypeManager_1.ProofTypeManager.GetInstance().CreateProofWithBuilder(credentialData.proof.type, proofParameter, credentialData.proof);
            if (proof) {
                return new VerifiableCredential(Credential_1.Credential.DecodeFromJSON(credentialData), proof);
            }
        }
        return null;
    };
    VerifiableCredential.prototype.Verify = function (provider) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var messages, i, jsonObject, issuerDID, keypair;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    //Verification Steps
                                    if (!this.credential.GetSchema().IsDIDTrusted(this.proof.GetIssuer().GetDID())) {
                                        reject("Verification failed: Issuer not trusted for schema " + this.credential.GetSchema());
                                    }
                                    if (!this.credential.GetSchema().DoesObjectFollowSchema(this.credential.GetCredential())) {
                                        reject("Verification failed: Schema not followed for schema " + this.credential.GetSchema());
                                    }
                                    if (!this.proof.VerifySignature(this.credential.EncodeToJSON())) {
                                        reject("Verification failed: Signature incorrect");
                                    }
                                    if (!this.credential.GetRevocationAddress()) return [3 /*break*/, 2];
                                    return [4 /*yield*/, iota_1.ReadAddress(this.credential.GetRevocationAddress(), provider)];
                                case 1:
                                    messages = _a.sent();
                                    for (i = 0; i < messages.length; i++) {
                                        jsonObject = void 0;
                                        try {
                                            jsonObject = JSON.parse(messages[i]);
                                        }
                                        catch (e) {
                                            console.log(e);
                                            continue;
                                        }
                                        ;
                                        //Check if it has the right fields
                                        if (!jsonObject["keyId"] || !jsonObject["originalSignature"] || !jsonObject["revocationSignature"]) {
                                            continue;
                                        }
                                        issuerDID = new DID_1.DID(jsonObject["keyId"]);
                                        if (issuerDID.GetDID() != this.proof.GetIssuer().GetDID().GetDID()) {
                                            continue;
                                        }
                                        keypair = this.proof.GetIssuer().GetKeypair(issuerDID.GetFragment());
                                        if (!keypair) {
                                            continue;
                                        }
                                        if (keypair.GetEncryptionKeypair().Verify(jsonObject["originalSignature"], Buffer.from(jsonObject["revocationSignature"], "base64"))) {
                                            reject("Verification failed: Claim has been revoked");
                                        }
                                    }
                                    _a.label = 2;
                                case 2:
                                    resolve();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    VerifiableCredential.prototype.EncodeToJSON = function () {
        return __assign({}, this.credential.EncodeToJSON(), { proof: this.proof.EncodeToJSON() });
    };
    VerifiableCredential.prototype.GetCredential = function () {
        return this.credential;
    };
    return VerifiableCredential;
}(VerifiableObject_1.VerifiableObject));
exports.VerifiableCredential = VerifiableCredential;
//# sourceMappingURL=VerifiableCredential.js.map