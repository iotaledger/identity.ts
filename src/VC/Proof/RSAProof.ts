import { Proof, ProofDocument, SigningMethod, VerifySignatureMethod, ProofBuildingMethod, ProofParameters, ExtendedProofDocument, RevocationMethod, RevocationSignature } from "./Proof";
import { RecursiveSort } from "../../Helpers/RecursiveSort";
import { RSAKeypair } from "../../Encryption/RSAKeypair";
import { DIDKeypair } from "../../DID/DIDKeypair";

export interface RSAProofDocument extends ProofDocument {
    signatureValue : string
}

export const BuildRSAProof : ProofBuildingMethod = function(proofParameter : ProofParameters, proofDocument ?: ExtendedProofDocument) : Proof {
    let SigningMethod : SigningMethod = function(JSONToSign : {}, keypair : DIDKeypair) {
        let encryptionKeypair : RSAKeypair = keypair.GetEncryptionKeypair();
        let documentToSign : string = JSON.stringify( RecursiveSort(JSONToSign) );

        let proof : RSAProofDocument = {
            type: "RsaVerificationKey2018",
            verificationMethod : keypair.GetFullId(),
            signatureValue : encryptionKeypair.Sign(documentToSign).toString("base64")
        };
        return proof;
    };

    let VerifySignatureMethod : VerifySignatureMethod = function(JSONToVerify : {}, keypair : DIDKeypair, proofDocument : ProofDocument) {
        let documentToVerify : string = JSON.stringify( RecursiveSort(JSONToVerify) );
        let RSAproofDocument : RSAProofDocument = <RSAProofDocument>proofDocument;
        return keypair.GetEncryptionKeypair().Verify( documentToVerify, Buffer.from(RSAproofDocument.signatureValue, "base64"));
    };

    let RevocationMethod : RevocationMethod = function(keypair : DIDKeypair, proofDocument : ProofDocument) : RevocationSignature {
        const originalSignature = (<RSAProofDocument>proofDocument).signatureValue;
        return {
            "keyId" : keypair.GetFullId(),
            "originalSignature" : originalSignature,
            "revocationSignature" : keypair.GetEncryptionKeypair().Sign(originalSignature).toString("base64")
        };
    };
    return new Proof(SigningMethod, VerifySignatureMethod, RevocationMethod, proofParameter, proofDocument);
}