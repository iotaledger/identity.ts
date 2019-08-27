import { Proof, ProofDocument, SigningMethod, VerifySignatureMethod, ProofBuildingMethod, ProofParameters } from "./Proof";
import { DIDDocument } from "../../DID/DIDDocument";
import { RecursiveSort } from "../../Helpers/RecursiveSort";
import { RSAKeypair } from "../../Encryption/RSAKeypair";
import { DIDKeypair } from "../../DID/DIDKeypair";

export interface RSAProofDocument extends ProofDocument {
    signatureValue : string
}

export const BuildRSAProof : ProofBuildingMethod = function(proofParameter : ProofParameters) : Proof {
    let SigningMethod : SigningMethod = function(JSONToSign : {}, keypair : DIDKeypair) {
        let encryptionKeypair : RSAKeypair = keypair.GetEncryptionKeypair();
        let documentToSign : string = JSON.stringify( RecursiveSort(JSONToSign) );

        let proof : RSAProofDocument = {
            type: "RsaSignature2018",
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
    return new Proof(SigningMethod, VerifySignatureMethod, proofParameter);
}