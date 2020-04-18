"use strict";
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
var chai_1 = require("chai");
require("mocha");
var test_settings_1 = require("./test.settings");
var RecursiveSort_1 = require("../src/Helpers/RecursiveSort");
var msg = "Hello World";
var UnsortedObject = [{
        "id": [{
                "did": "did",
            }, {
                "uuid": "ebfeb1f712ebc6f1c276e12ec21",
                "method": "example"
            }],
        "name": {
            "surname": "Doe",
            "firstname": "Jayden"
        },
        "spouse": "did:example:c276e12ec21ebfeb1f712ebc6f1"
    }, {
        "name": {
            "firstname": "Morgan",
            "surname": "Doe"
        },
        "spouse": "did:example:ebfeb1f712ebc6f1c276e12ec21",
        "id": [{
                "did": "did",
            }, {
                "method": "example",
                "uuid": "c276e12ec21ebfeb1f712ebc6f1"
            }]
    }];
var _loop_1 = function (i) {
    describe(test_settings_1.TestProofTypes[i].name + ' Encryption', function () {
        var keypair;
        it('Should generate a keypair', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, test_settings_1.TestProofTypes[i].keyGenFunc()];
                        case 1:
                            keypair = _a.sent();
                            chai_1.expect(keypair).to.not.be.undefined;
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('Should encrypt->decrypt to reveal the same message', function () {
            return __awaiter(this, void 0, void 0, function () {
                var encryptedMsg;
                return __generator(this, function (_a) {
                    encryptedMsg = keypair.PublicEncrypt(msg);
                    chai_1.expect(keypair.PrivateDecrypt(encryptedMsg)).to.deep.equal(msg);
                    return [2 /*return*/];
                });
            });
        });
        it('Should Sign and correctly verify msg', function () {
            return __awaiter(this, void 0, void 0, function () {
                var signature;
                return __generator(this, function (_a) {
                    signature = keypair.Sign(msg);
                    chai_1.expect(keypair.Verify(msg, signature)).to.be.true;
                    return [2 /*return*/];
                });
            });
        });
        it('Should Sign and catch the change', function () {
            return __awaiter(this, void 0, void 0, function () {
                var signature;
                return __generator(this, function (_a) {
                    signature = keypair.Sign(msg);
                    chai_1.expect(keypair.Verify("Another message", signature)).to.be.false;
                    return [2 /*return*/];
                });
            });
        });
        it('Should Sign and Verify correctly after doing a base64 encoding', function () {
            return __awaiter(this, void 0, void 0, function () {
                var signature, stringSignature, signatureBuffer;
                return __generator(this, function (_a) {
                    signature = keypair.Sign(msg);
                    stringSignature = signature.toString("base64");
                    signatureBuffer = Buffer.from(stringSignature, "base64");
                    chai_1.expect(keypair.Verify(msg, signatureBuffer)).to.be.true;
                    return [2 /*return*/];
                });
            });
        });
    });
    describe('Recursive Sorting ' + test_settings_1.TestProofTypes[i].name, function () {
        var SortedObject = [{
                "id": [{
                        "did": "did",
                    }, {
                        "method": "example",
                        "uuid": "ebfeb1f712ebc6f1c276e12ec21"
                    }],
                "name": {
                    "firstname": "Jayden",
                    "surname": "Doe"
                },
                "spouse": "did:example:c276e12ec21ebfeb1f712ebc6f1"
            }, {
                "id": [{
                        "did": "did",
                    }, {
                        "method": "example",
                        "uuid": "c276e12ec21ebfeb1f712ebc6f1"
                    }],
                "name": {
                    "firstname": "Morgan",
                    "surname": "Doe"
                },
                "spouse": "did:example:ebfeb1f712ebc6f1c276e12ec21"
            }];
        var PostSorting = RecursiveSort_1.RecursiveSort(UnsortedObject);
        var keypair;
        before(function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, test_settings_1.TestProofTypes[i].keyGenFunc()];
                        case 1:
                            keypair = _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('Should sort the document correctly', function () {
            chai_1.expect(SortedObject).to.deep.equal(PostSorting);
        });
        //Known Issue
        /*it('Should not match signatures when scrambled', function () {
            expect(keypair.Sign(JSON.stringify(SortedObject))).to.not.deep.equal(keypair.Sign(JSON.stringify(UnsortedObject)));
        });*/
        it('Should match signatures even when first scrambled and then sorted', function () {
            chai_1.expect(keypair.Sign(JSON.stringify(SortedObject))).to.deep.equal(keypair.Sign(JSON.stringify(PostSorting)));
        });
    });
};
for (var i = 0; i < test_settings_1.TestProofTypes.length; i++) {
    _loop_1(i);
}
//# sourceMappingURL=Encryption.test.js.map