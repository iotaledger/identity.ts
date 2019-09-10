"use strict";
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
var chai_1 = require("chai");
require("mocha");
var Credential_1 = require("../src/VC/Credential");
var VerifiableCredential_1 = require("../src/VC/VerifiableCredential");
var SchemaManager_1 = require("./../src/VC/SchemaManager");
var src_1 = require("../src");
var CreateRandomDID_1 = require("../src/Helpers/CreateRandomDID");
var DIDPublisher_1 = require("../src/IOTA/DIDPublisher");
var GenerateSeed_1 = require("../src/Helpers/GenerateSeed");
var Presentation_1 = require("../src/VC/Presentation");
var VerifiablePresentation_1 = require("../src/VC/VerifiablePresentation");
var VerifiableObject_1 = require("../src/VC/VerifiableObject");
var ProofTypeManager_1 = require("../src/VC/Proof/ProofTypeManager");
var DecodeProofDocument_1 = require("../src/Helpers/DecodeProofDocument");
var GenerateKeypair_1 = require("../src/Helpers/GenerateKeypair");
var provider = "https://nodes.devnet.iota.org:443";
var RandomDID = new src_1.DID("did:iota:main:ABCABCABC");
describe('Schemas', function () {
    var schema;
    var testObject;
    var SchemaList = ['DIDAuthenticationCredential', 'DomainValidatedCertificate', 'WhiteListedCredential'];
    it('Should contain a list of default schemas', function () {
        chai_1.expect(SchemaManager_1.SchemaManager.GetInstance().GetSchemaNames()).to.deep.equal(SchemaList);
    });
    it('Should be able to add an extra schema', function () {
        SchemaList.push("IOTATrainingCertificate");
        SchemaManager_1.SchemaManager.GetInstance().AddSchema("IOTATrainingCertificate", {
            type: "object",
            required: ["trainingTitle", "participant", "participationDate"],
            properties: {
                "trainingTitle": {
                    type: "string"
                },
                "participant": {
                    type: "string"
                },
                "participationDate": {
                    type: "string"
                }
            }
        });
        chai_1.expect(SchemaManager_1.SchemaManager.GetInstance().GetSchemaNames()).to.deep.equal(SchemaList);
    });
    it('Should validate correctly', function () {
        schema = SchemaManager_1.SchemaManager.GetInstance().GetSchema("IOTATrainingCertificate");
        testObject = {
            "trainingTitle": "IOTA Developer Training",
            "participant": "Jelly von Yellowburg",
            "participationDate": new Date().toUTCString()
        };
        chai_1.expect(schema.DoesObjectFollowSchema(testObject)).to.be.true;
    });
    it('Should validate with extra fields', function () {
        var testObject2 = __assign({}, testObject, { "ExtraField": "Hello World" });
        chai_1.expect(schema.DoesObjectFollowSchema(testObject2)).to.be.true;
    });
    it('Should fail with a missing field', function () {
        testObject = {
            "trainingTitle": "IOTA Developer Training",
            "participant": "Jelly von Yellowburg"
        };
        chai_1.expect(schema.DoesObjectFollowSchema(testObject)).to.be.false;
    });
    it('Should fail with a wrong type', function () {
        testObject = {
            "trainingTitle": "IOTA Developer Training",
            "participant": "Jelly von Yellowburg",
            "participationDate": 12
        };
        chai_1.expect(schema.DoesObjectFollowSchema(testObject)).to.be.false;
    });
    it('Should correctly verify DIDAuthenticationCredential', function () {
        schema = SchemaManager_1.SchemaManager.GetInstance().GetSchema("DIDAuthenticationCredential");
        testObject = {
            "DID": "did:iota:main:123123"
        };
        chai_1.expect(schema.DoesObjectFollowSchema(testObject)).to.be.true;
    });
    it('Should correctly verify DomainValidatedCertificate', function () {
        schema = SchemaManager_1.SchemaManager.GetInstance().GetSchema("DomainValidatedCertificate");
        testObject = {
            "id": "did:iota:main:123123",
            "domains": ["*.iota.org", "*.reddit.com"]
        };
        chai_1.expect(schema.DoesObjectFollowSchema(testObject)).to.be.true;
    });
    it('Should not trust a random DID', function () {
        chai_1.expect(schema.IsDIDTrusted(RandomDID)).to.be.false;
    });
    it('Should add and trust a DID', function () {
        schema.AddTrustedDID(RandomDID);
        chai_1.expect(schema.IsDIDTrusted(RandomDID)).to.be.true;
    });
});
describe('Verifiable Credentials', function () {
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
                                issuerSeed = GenerateSeed_1.GenerateSeed();
                                IssuerDIDDocument = CreateRandomDID_1.CreateRandomDID(issuerSeed);
                                return [4 /*yield*/, GenerateKeypair_1.GenerateRSAKeypair()];
                            case 1:
                                keypair = _a.sent();
                                issuerPrivateKey = keypair.GetPrivateKey();
                                IssuerDIDDocument.AddKeypair(keypair, "keys-1");
                                publisher = new DIDPublisher_1.DIDPublisher(provider, issuerSeed);
                                return [4 /*yield*/, publisher.PublishDIDDocument(IssuerDIDDocument, "DIDTEST", 9)];
                            case 2:
                                _a.sent();
                                SchemaManager_1.SchemaManager.GetInstance().GetSchema("DomainValidatedCertificate").AddTrustedDID(IssuerDIDDocument.GetDID());
                                subjectSeed = GenerateSeed_1.GenerateSeed();
                                SubjectDIDDocument = CreateRandomDID_1.CreateRandomDID(subjectSeed);
                                return [4 /*yield*/, GenerateKeypair_1.GenerateRSAKeypair()];
                            case 3:
                                keypair2 = _a.sent();
                                SubjectDIDDocument.AddKeypair(keypair2, "keys-1");
                                publisher2 = new DIDPublisher_1.DIDPublisher(provider, subjectSeed);
                                return [4 /*yield*/, publisher2.PublishDIDDocument(SubjectDIDDocument, "DIDTEST", 9)];
                            case 4:
                                _a.sent();
                                proofMethod = ProofTypeManager_1.ProofTypeManager.GetInstance().GetProofBuilder("RsaSignature2018");
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
                credential = Credential_1.Credential.Create(SchemaManager_1.SchemaManager.GetInstance().GetSchema("DomainValidatedCertificate"), IssuerDIDDocument.GetDID(), domainCertificate);
                chai_1.expect(credential.GetCredential()).to.not.be.undefined;
            });
            it('Should be able to Encode / Decode a credential to be the same', function () {
                var importedCredential = Credential_1.Credential.DecodeFromJSON(credential.EncodeToJSON());
                chai_1.expect(importedCredential.EncodeToJSON()).to.deep.equal(credential.EncodeToJSON());
            });
            it('Should be able to create, sign and verify a Verifiable Credential', function () {
                VCProof = proofMethod({ 'issuer': IssuerDIDDocument, 'issuerKeyId': "keys-1" });
                VCProof.Sign(credential.EncodeToJSON());
                verifiableCredential = VerifiableCredential_1.VerifiableCredential.Create(credential, VCProof);
                chai_1.expect(verifiableCredential.Verify()).to.deep.equal(VerifiableObject_1.VerificationErrorCodes.SUCCES);
            });
            it('Should be able to Encode / Decode a Verifiable Credential and still verify', function () {
                return __awaiter(this, void 0, void 0, function () {
                    var proofParameters, importedVerifiableCredential;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this.timeout(30000);
                                return [4 /*yield*/, delay(2000)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, DecodeProofDocument_1.DecodeProofDocument(verifiableCredential.EncodeToJSON().proof, provider)];
                            case 2:
                                proofParameters = _a.sent();
                                importedVerifiableCredential = VerifiableCredential_1.VerifiableCredential.DecodeFromJSON(verifiableCredential.EncodeToJSON(), proofParameters);
                                chai_1.expect(importedVerifiableCredential.Verify()).to.deep.equal(VerifiableObject_1.VerificationErrorCodes.SUCCES);
                                chai_1.expect(importedVerifiableCredential.EncodeToJSON()).to.deep.equal(verifiableCredential.EncodeToJSON());
                                return [2 /*return*/];
                        }
                    });
                });
            });
            it('Should test all Verification Error codes for Verifiable Credentials', function () {
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
                            case 0: return [4 /*yield*/, Presentation_1.Presentation.DecodeFromJSON(presentation.EncodeToJSON(), provider)];
                            case 1:
                                importPresentation = _a.sent();
                                chai_1.expect(importPresentation.EncodeToJSON()).to.deep.equal(presentation.EncodeToJSON());
                                return [2 /*return*/];
                        }
                    });
                });
            });
            it('Should be able to create, sign and verify the Verifiable Presentation', function () {
                presentationProof = proofMethod({ 'issuer': SubjectDIDDocument, 'issuerKeyId': "keys-1", challengeNonce: "123" });
                presentationProof.Sign(presentation.EncodeToJSON());
                verifiablePresentation = VerifiablePresentation_1.VerifiablePresentation.Create(presentation, presentationProof);
                chai_1.expect(verifiablePresentation.Verify()).to.deep.equal(VerifiableObject_1.VerificationErrorCodes.SUCCES);
            });
            //verifiablePresentation Shouldn't this be enough to integrate into VerifiableObject and do DecodeProofDocument?
            it('Should be able to Encode / Decode a Verifiable Presentation and still verify', function () {
                return __awaiter(this, void 0, void 0, function () {
                    var proofParameters, importVerifiablePresentation;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, DecodeProofDocument_1.DecodeProofDocument(verifiablePresentation.EncodeToJSON().proof, provider)];
                            case 1:
                                proofParameters = _a.sent();
                                return [4 /*yield*/, VerifiablePresentation_1.VerifiablePresentation.DecodeFromJSON(verifiablePresentation.EncodeToJSON(), provider, proofParameters)];
                            case 2:
                                importVerifiablePresentation = _a.sent();
                                chai_1.expect(importVerifiablePresentation.Verify()).to.deep.equal(VerifiableObject_1.VerificationErrorCodes.SUCCES);
                                chai_1.expect(importVerifiablePresentation.EncodeToJSON()).to.deep.equal(verifiablePresentation.EncodeToJSON());
                                return [2 /*return*/];
                        }
                    });
                });
            });
            it('Should test all Verification Error codes for Verifiable Presentation', function () {
            });
            it('Should create a DID Authentication Verifiable Presentation', function () {
                DIDAuth = src_1.SignDIDAuthentication(SubjectDIDDocument, "keys-1", GenerateSeed_1.GenerateSeed(12));
                SchemaManager_1.SchemaManager.GetInstance().GetSchema("DIDAuthenticationCredential").AddTrustedDID(SubjectDIDDocument.GetDID());
                chai_1.expect(DIDAuth.Verify()).to.deep.equal(VerifiableObject_1.VerificationErrorCodes.SUCCES);
                SchemaManager_1.SchemaManager.GetInstance().GetSchema("DIDAuthenticationCredential").RemoveTrustedDID(SubjectDIDDocument.GetDID());
            });
            it('Should be able to verify an imported DID Authentication', function () {
                return __awaiter(this, void 0, void 0, function () {
                    var _a;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _a = chai_1.expect;
                                return [4 /*yield*/, src_1.VerifyDIDAuthentication(DIDAuth.EncodeToJSON(), provider)];
                            case 1:
                                _a.apply(void 0, [_b.sent()]).to.deep.equal(VerifiableObject_1.VerificationErrorCodes.SUCCES);
                                return [2 /*return*/];
                        }
                    });
                });
            });
            return [2 /*return*/];
        });
    });
});
function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
//# sourceMappingURL=VC.test.js.map