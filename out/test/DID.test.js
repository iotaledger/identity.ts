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
var CreateRandomDID_1 = require("../src/Helpers/CreateRandomDID");
var DID_1 = require("../src/DID/DID");
var Hash_1 = require("../src/Encryption/Hash");
var DIDDocument_1 = require("../src/DID/DIDDocument");
var DIDPublisher_1 = require("../src/IOTA/DIDPublisher");
var GenerateSeed_1 = require("../src/Helpers/GenerateSeed");
var Service_1 = require("../src/DID/Service");
var _loop_1 = function (i) {
    describe('DID Functionalities with ' + test_settings_1.TestProofTypes[i].name, function () {
        var uuid;
        it('Should create a valid DID from a UUID', function () {
            return __awaiter(this, void 0, void 0, function () {
                var keypair;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, test_settings_1.TestProofTypes[i].keyGenFunc()];
                        case 1:
                            keypair = _a.sent();
                            uuid = Hash_1.Hash(keypair.GetPublicKey());
                            chai_1.expect("did:iota:main:" + uuid, new DID_1.DID(uuid).GetSpecificDID());
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('Should create a valid DID from a did:method:uuid', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    chai_1.expect("did:iota:main:" + uuid, new DID_1.DID("did:iota:" + uuid).GetSpecificDID());
                    return [2 /*return*/];
                });
            });
        });
        it('Should create a valid DID from a did:method:network:uuid', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    chai_1.expect("did:iota:dev:" + uuid, new DID_1.DID("did:iota:dev:" + uuid).GetSpecificDID());
                    return [2 /*return*/];
                });
            });
        });
        it('Should create a valid DID from a did:method:network:uuid#fragment', function () {
            return __awaiter(this, void 0, void 0, function () {
                var did;
                return __generator(this, function (_a) {
                    did = new DID_1.DID("did:iota:dev:" + uuid + "#fragment");
                    chai_1.expect("did:iota:dev:" + uuid, did.GetSpecificDID());
                    chai_1.expect("fragment", did.GetFragment());
                    return [2 /*return*/];
                });
            });
        });
    });
    describe('DID Document with ' + test_settings_1.TestProofTypes[i].name, function () {
        var document;
        var seed = GenerateSeed_1.GenerateSeed();
        var root;
        var documentFromTangle;
        var publisher;
        var service;
        it('Should create and output a valid DID Document', function () {
            return __awaiter(this, void 0, void 0, function () {
                var keypair;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, CreateRandomDID_1.CreateRandomDID(seed)];
                        case 1:
                            document = _a.sent();
                            return [4 /*yield*/, test_settings_1.TestProofTypes[i].keyGenFunc()];
                        case 2:
                            keypair = _a.sent();
                            document.AddKeypair(keypair, "keys-1");
                            chai_1.expect(document.GetJSONDIDDocument()).to.not.be.undefined;
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('Should publish the DID Document', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.timeout(60000);
                            publisher = new DIDPublisher_1.DIDPublisher(test_settings_1.provider, seed);
                            return [4 /*yield*/, publisher.PublishDIDDocument(document, "DIDTEST", 9)];
                        case 1:
                            root = _a.sent();
                            chai_1.expect(root).to.not.be.undefined;
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('Should read the same document from the Tangle', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.timeout(60000);
                            return [4 /*yield*/, test_settings_1.delay(2000)];
                        case 1:
                            _a.sent(); //Sleep prevents the node to not know about the first tx yet, failing the test.
                            return [4 /*yield*/, DIDDocument_1.DIDDocument.readDIDDocument(test_settings_1.provider, root)];
                        case 2:
                            documentFromTangle = _a.sent();
                            chai_1.expect(documentFromTangle.GetJSONDIDDocument()).to.deep.equal(document.GetJSONDIDDocument());
                            return [2 /*return*/];
                    }
                });
            });
        });
        //Known poorly implemented test
        /*it('Should handle empty DID Documents', async function() {
            const result = await DIDDocument.readDIDDocument(provider, GenerateSeed(81));
        });*/
        it('Should Sign locally and Verify from loaded DID Document', function () {
            return __awaiter(this, void 0, void 0, function () {
                var msg, signature, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            msg = "Hello World";
                            return [4 /*yield*/, document.GetKeypair("keys-1").GetEncryptionKeypair().Sign(msg)];
                        case 1:
                            signature = _b.sent();
                            _a = chai_1.expect;
                            return [4 /*yield*/, documentFromTangle.GetKeypair("keys-1").GetEncryptionKeypair().Verify(msg, signature)];
                        case 2:
                            _a.apply(void 0, [_b.sent()]).to.be.true;
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('Should add a ServiceEndpoint', function () {
            service = new Service_1.Service(document.GetDID(), "test", "TestService", GenerateSeed_1.GenerateSeed());
            document.AddServiceEndpoint(service);
            chai_1.expect(document.GetService("test")).to.not.be.null;
        });
        it('Should update the DIDDocument correctly and contain a ServiceEndpoint', function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.timeout(60000);
                            return [4 /*yield*/, publisher.PublishDIDDocument(document, "DIDTEST", 9)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, DIDDocument_1.DIDDocument.readDIDDocument(test_settings_1.provider, root)];
                        case 2:
                            documentFromTangle = _a.sent();
                            chai_1.expect(documentFromTangle.GetJSONDIDDocument()).to.deep.equal(document.GetJSONDIDDocument());
                            chai_1.expect(documentFromTangle.GetService("test").EncodeToJSON()).to.deep.equal(service.EncodeToJSON());
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
};
for (var i = 0; i < test_settings_1.TestProofTypes.length; i++) {
    _loop_1(i);
}
//# sourceMappingURL=DID.test.js.map