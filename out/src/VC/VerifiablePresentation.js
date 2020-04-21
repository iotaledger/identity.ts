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
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var Presentation_1 = require("./Presentation");
var VerifiableObject_1 = require("./VerifiableObject");
var ProofTypeManager_1 = require("./Proof/ProofTypeManager");
var VerifiablePresentation = /** @class */ (function (_super) {
    __extends(VerifiablePresentation, _super);
    function VerifiablePresentation(presentation, proof) {
        var _this = _super.call(this, proof) || this;
        _this.presentation = presentation;
        return _this;
    }
    VerifiablePresentation.Create = function (presentation, proof) {
        return new VerifiablePresentation(presentation, proof);
    };
    VerifiablePresentation.DecodeFromJSON = function (presentationData, provider, proofParameter, presentationSchema) {
        return __awaiter(this, void 0, void 0, function () {
            var proof, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        proof = ProofTypeManager_1.ProofTypeManager.GetInstance().CreateProofWithBuilder(presentationData.proof.type, proofParameter, presentationData.proof);
                        _a = VerifiablePresentation.bind;
                        return [4 /*yield*/, Presentation_1.Presentation.DecodeFromJSON(presentationData, provider, presentationSchema)];
                    case 1: return [2 /*return*/, new (_a.apply(VerifiablePresentation, [void 0, _b.sent(), proof]))()];
                }
            });
        });
    };
    VerifiablePresentation.prototype.Verify = function (provider) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var vcs, i;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    //Verification Steps
                                    if (this.presentation.GetSchema()) {
                                        if (!this.presentation.GetSchema().IsDIDTrusted(this.proof.GetIssuer().GetDID())) {
                                            reject("Verification failed: Issuer not trusted for schema " + this.presentation.GetSchema());
                                        }
                                        if (!this.presentation.GetSchema().DoesObjectFollowSchema(this.presentation.EncodeToJSON())) {
                                            reject("Verification failed: Schema not followed for schema " + this.presentation.GetSchema());
                                        }
                                    }
                                    if (!this.proof.VerifySignature(this.presentation.EncodeToJSON())) {
                                        reject("Verification failed: Signature incorrect");
                                    }
                                    vcs = this.presentation.GetVerifiableCredentials();
                                    i = 0;
                                    _a.label = 1;
                                case 1:
                                    if (!(i < vcs.length)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, vcs[i].Verify(provider).catch(function (err) { return reject(err); })];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3:
                                    i++;
                                    return [3 /*break*/, 1];
                                case 4:
                                    resolve();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    VerifiablePresentation.prototype.EncodeToJSON = function () {
        return __assign(__assign({}, this.presentation.EncodeToJSON()), { proof: this.proof.EncodeToJSON() });
    };
    VerifiablePresentation.prototype.GetVerifiedTypes = function () {
        var credentials = this.presentation.GetVerifiableCredentials();
        var types = [];
        for (var i = 0; i < credentials.length; i++) {
            types.push(credentials[i].GetCredential().GetType());
        }
        return types;
    };
    return VerifiablePresentation;
}(VerifiableObject_1.VerifiableObject));
exports.VerifiablePresentation = VerifiablePresentation;
//# sourceMappingURL=VerifiablePresentation.js.map