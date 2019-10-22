"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Proof_1 = require("./Proof");
var RecursiveSort_1 = require("../../Helpers/RecursiveSort");
exports.BuildRSAProof = function (proofParameter, proofDocument) {
    var SigningMethod = function (JSONToSign, keypair) {
        var encryptionKeypair = keypair.GetEncryptionKeypair();
        var documentToSign = JSON.stringify(RecursiveSort_1.RecursiveSort(JSONToSign));
        var proof = {
            type: "RsaSignature2018",
            verificationMethod: keypair.GetFullId(),
            signatureValue: encryptionKeypair.Sign(documentToSign).toString("base64")
        };
        return proof;
    };
    var VerifySignatureMethod = function (JSONToVerify, keypair, proofDocument) {
        var documentToVerify = JSON.stringify(RecursiveSort_1.RecursiveSort(JSONToVerify));
        var RSAproofDocument = proofDocument;
        return keypair.GetEncryptionKeypair().Verify(documentToVerify, Buffer.from(RSAproofDocument.signatureValue, "base64"));
    };
    var RevocationMethod = function (keypair, proofDocument) {
        var originalSignature = proofDocument.signatureValue;
        return {
            "keyId": keypair.GetFullId(),
            "originalSignature": originalSignature,
            "revocationSignature": keypair.GetEncryptionKeypair().Sign(originalSignature).toString("base64")
        };
    };
    return new Proof_1.Proof(SigningMethod, VerifySignatureMethod, RevocationMethod, proofParameter, proofDocument);
};
//# sourceMappingURL=RSAProof.js.map