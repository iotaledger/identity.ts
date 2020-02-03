"use strict";
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
var chai_1 = require("chai");
require("mocha");
var test_settings_1 = require("./test.settings");
var Credential_1 = require("../src/VC/Credential");
var VerifiableCredential_1 = require("../src/VC/VerifiableCredential");
var SchemaManager_1 = require("../src/VC/SchemaManager");
var src_1 = require("../src");
var CreateRandomDID_1 = require("../src/Helpers/CreateRandomDID");
var DIDPublisher_1 = require("../src/IOTA/DIDPublisher");
var GenerateSeed_1 = require("../src/Helpers/GenerateSeed");
var Presentation_1 = require("../src/VC/Presentation");
var VerifiablePresentation_1 = require("../src/VC/VerifiablePresentation");
var ProofTypeManager_1 = require("../src/VC/Proof/ProofTypeManager");
var DecodeProofDocument_1 = require("../src/Helpers/DecodeProofDocument");
var _loop_1 = function (i) {
    describe(test_settings_1.TestProofTypes[i].name + " Signed Credentials", function () {
        return __awaiter(this, void 0, void 0, function () {
            var IssuerDIDDocument, issuerSeed, issuerPrivateKey, SubjectDIDDocument, subjectSeed, credential, verifiableCredential, proofMethod, VCProof, presentation, verifiablePresentation, presentationProof, DIDAuth;
            return __generator(this, function (_a) {
                before(function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var keypair, publisher, keypair2, publisher2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    this.timeout(30000);
                                    //Generate an issuer
                                    issuerSeed = GenerateSeed_1.GenerateSeed();
                                    IssuerDIDDocument = CreateRandomDID_1.CreateRandomDID(issuerSeed);
                                    return [4 /*yield*/, test_settings_1.TestProofTypes[i].keyGenFunc()];
                                case 1:
                                    keypair = _a.sent();
                                    issuerPrivateKey = keypair.GetPrivateKey();
                                    IssuerDIDDocument.AddKeypair(keypair, "keys-1");
                                    publisher = new DIDPublisher_1.DIDPublisher(test_settings_1.provider, issuerSeed);
                                    return [4 /*yield*/, publisher.PublishDIDDocument(IssuerDIDDocument, "DIDTEST", 9)];
                                case 2:
                                    _a.sent();
                                    SchemaManager_1.SchemaManager.GetInstance().GetSchema("DomainValidatedCertificate").AddTrustedDID(IssuerDIDDocument.GetDID());
                                    //Generate a Subject
                                    subjectSeed = GenerateSeed_1.GenerateSeed();
                                    SubjectDIDDocument = CreateRandomDID_1.CreateRandomDID(subjectSeed);
                                    return [4 /*yield*/, test_settings_1.TestProofTypes[i].keyGenFunc()];
                                case 3:
                                    keypair2 = _a.sent();
                                    SubjectDIDDocument.AddKeypair(keypair2, "keys-1");
                                    publisher2 = new DIDPublisher_1.DIDPublisher(test_settings_1.provider, subjectSeed);
                                    return [4 /*yield*/, publisher2.PublishDIDDocument(SubjectDIDDocument, "DIDTEST", 9)];
                                case 4:
                                    _a.sent();
                                    proofMethod = ProofTypeManager_1.ProofTypeManager.GetInstance().GetProofBuilder(test_settings_1.TestProofTypes[i].name);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it('Should be able to a credential', function () {
                    var domainCertificate = {
                        id: SubjectDIDDocument.GetDID().GetDID(),
                        domains: [
                            "blog.iota.org",
                            "coordicide.iota.org",
                            "docs.iota.org"
                        ]
                    };
                    credential = Credential_1.Credential.Create(SchemaManager_1.SchemaManager.GetInstance().GetSchema("DomainValidatedCertificate"), IssuerDIDDocument.GetDID(), domainCertificate, GenerateSeed_1.GenerateSeed(81));
                    chai_1.expect(credential.GetCredential()).to.not.be.undefined;
                });
                it('Should be able to Encode / Decode a credential to be the same', function () {
                    var importedCredential = Credential_1.Credential.DecodeFromJSON(credential.EncodeToJSON());
                    chai_1.expect(importedCredential.EncodeToJSON()).to.deep.equal(credential.EncodeToJSON());
                });
                it('Should be able to create, sign and verify a Verifiable Credential', function () {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    VCProof = proofMethod({ 'issuer': IssuerDIDDocument, 'issuerKeyId': "keys-1" });
                                    VCProof.Sign(credential.EncodeToJSON());
                                    verifiableCredential = VerifiableCredential_1.VerifiableCredential.Create(credential, VCProof);
                                    return [4 /*yield*/, verifiableCredential.Verify(test_settings_1.provider)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it('Should be able to Encode / Decode a Verifiable Credential and still verify', function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var proofParameters, importedVerifiableCredential;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    this.timeout(80000);
                                    return [4 /*yield*/, test_settings_1.delay(2000)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, DecodeProofDocument_1.DecodeProofDocument(verifiableCredential.EncodeToJSON().proof, test_settings_1.provider)];
                                case 2:
                                    proofParameters = _a.sent();
                                    importedVerifiableCredential = VerifiableCredential_1.VerifiableCredential.DecodeFromJSON(verifiableCredential.EncodeToJSON(), proofParameters);
                                    return [4 /*yield*/, importedVerifiableCredential.Verify(test_settings_1.provider)];
                                case 3:
                                    _a.sent();
                                    chai_1.expect(importedVerifiableCredential.EncodeToJSON()).to.deep.equal(verifiableCredential.EncodeToJSON());
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it('Should be able to create a presentation from a Verifiable Credential', function () {
                    presentation = Presentation_1.Presentation.Create([verifiableCredential]);
                    chai_1.expect(presentation.EncodeToJSON().verifiableCredential[0]).to.deep.equal(verifiableCredential.EncodeToJSON());
                });
                it('Should be able to Encode / Decode a presentation to be the same', function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var importPresentation;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Presentation_1.Presentation.DecodeFromJSON(presentation.EncodeToJSON(), test_settings_1.provider)];
                                case 1:
                                    importPresentation = _a.sent();
                                    chai_1.expect(importPresentation.EncodeToJSON()).to.deep.equal(presentation.EncodeToJSON());
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it('Should be able to create, sign and verify the Verifiable Presentation', function () {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    presentationProof = proofMethod({ 'issuer': SubjectDIDDocument, 'issuerKeyId': "keys-1", challengeNonce: "123" });
                                    presentationProof.Sign(presentation.EncodeToJSON());
                                    verifiablePresentation = VerifiablePresentation_1.VerifiablePresentation.Create(presentation, presentationProof);
                                    return [4 /*yield*/, verifiablePresentation.Verify(test_settings_1.provider)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                //verifiablePresentation Shouldn't this be enough to integrate into VerifiableObject and do DecodeProofDocument?
                it('Should be able to Encode / Decode a Verifiable Presentation and still verify', function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var proofParameters, importVerifiablePresentation;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, DecodeProofDocument_1.DecodeProofDocument(verifiablePresentation.EncodeToJSON().proof, test_settings_1.provider)];
                                case 1:
                                    proofParameters = _a.sent();
                                    return [4 /*yield*/, VerifiablePresentation_1.VerifiablePresentation.DecodeFromJSON(verifiablePresentation.EncodeToJSON(), test_settings_1.provider, proofParameters)];
                                case 2:
                                    importVerifiablePresentation = _a.sent();
                                    return [4 /*yield*/, importVerifiablePresentation.Verify(test_settings_1.provider)];
                                case 3:
                                    _a.sent();
                                    chai_1.expect(importVerifiablePresentation.EncodeToJSON()).to.deep.equal(verifiablePresentation.EncodeToJSON());
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it('Should throw an error due to revocation', function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var result, err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    this.timeout(30000);
                                    return [4 /*yield*/, verifiableCredential.GetProof().Revoke(verifiableCredential.GetCredential(), test_settings_1.provider)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, test_settings_1.delay(2000)];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3:
                                    _a.trys.push([3, 5, , 6]);
                                    return [4 /*yield*/, verifiablePresentation.Verify(test_settings_1.provider)];
                                case 4:
                                    result = _a.sent();
                                    return [3 /*break*/, 6];
                                case 5:
                                    err_1 = _a.sent();
                                    chai_1.expect(err_1).to.deep.equal("Verification failed: Claim has been revoked");
                                    return [3 /*break*/, 6];
                                case 6: return [2 /*return*/];
                            }
                        });
                    });
                });
                it('Should create a DID Authentication Verifiable Presentation', function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var DIDAuthVC, presentation, presentationProof;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    DIDAuthVC = src_1.SignDIDAuthentication(SubjectDIDDocument, "keys-1", GenerateSeed_1.GenerateSeed(12));
                                    presentation = Presentation_1.Presentation.Create([DIDAuthVC]);
                                    presentationProof = ProofTypeManager_1.ProofTypeManager.GetInstance().CreateProofWithBuilder(test_settings_1.TestProofTypes[i].name, { issuer: SubjectDIDDocument, issuerKeyId: "keys-1", challengeNonce: GenerateSeed_1.GenerateSeed(12) });
                                    presentationProof.Sign(presentation.EncodeToJSON());
                                    DIDAuth = VerifiablePresentation_1.VerifiablePresentation.Create(presentation, presentationProof);
                                    SchemaManager_1.SchemaManager.GetInstance().GetSchema("DIDAuthenticationCredential").AddTrustedDID(SubjectDIDDocument.GetDID());
                                    return [4 /*yield*/, DIDAuth.Verify(test_settings_1.provider)];
                                case 1:
                                    _a.sent();
                                    SchemaManager_1.SchemaManager.GetInstance().GetSchema("DIDAuthenticationCredential").RemoveTrustedDID(SubjectDIDDocument.GetDID());
                                    chai_1.expect(DIDAuth.GetVerifiedTypes()).to.deep.equal(["DIDAuthenticationCredential"]);
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                it('Should be able to verify an imported DID Authentication', function () {
                    return __awaiter(this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, src_1.VerifyDIDAuthentication(DIDAuth.EncodeToJSON(), test_settings_1.provider)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                return [2 /*return*/];
            });
        });
    });
};
for (var i = 0; i < test_settings_1.TestProofTypes.length; i++) {
    _loop_1(i);
}
//# sourceMappingURL=VC.test.js.map