"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Proof_1 = require("./Proof");
var RecursiveSort_1 = require("../../Helpers/RecursiveSort");
exports.BuildECDSAProof = function (proofParameter, proofDocument) {
    var SigningMethod = function (JSONToSign, keypair) {
        var encryptionKeypair = keypair.GetEncryptionKeypair();
        var documentToSign = JSON.stringify(RecursiveSort_1.RecursiveSort(JSONToSign));
        var proof = {
            type: "EcdsaSecp256k1VerificationKey2019",
            verificationMethod: keypair.GetFullId(),
            signatureValue: encryptionKeypair.Sign(documentToSign).toString("base64")
        };
        return proof;
    };
    var VerifySignatureMethod = function (JSONToVerify, keypair, proofDocument) {
        var documentToVerify = JSON.stringify(RecursiveSort_1.RecursiveSort(JSONToVerify));
        var ECDSAproofDocument = proofDocument;
        return keypair.GetEncryptionKeypair().Verify(documentToVerify, Buffer.from(ECDSAproofDocument.signatureValue, "base64"));
    };
    return new Proof_1.Proof(SigningMethod, VerifySignatureMethod, proofParameter, proofDocument);
};
//# sourceMappingURL=ECDSAProof.js.map