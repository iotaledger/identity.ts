import { Proof, ProofDocument, SigningMethod, VerifySignatureMethod, ProofBuildingMethod, ProofParameters, ExtendedProofDocument, RevocationMethod, RevocationSignature } from "./Proof";
import { RecursiveSort } from "../../Helpers/RecursiveSort";
import { ECDSAKeypair } from "../../Encryption/ECDSAKeypair";
import { DIDKeypair } from "../../DID/DIDKeypair";

export interface ECDSAProofDocument extends ProofDocument {
    signatureValue : string
}

export const BuildECDSAProof : ProofBuildingMethod = function(proofParameter : ProofParameters, proofDocument ?: ExtendedProofDocument) : Proof {
    let SigningMethod : SigningMethod = function(JSONToSign : {}, keypair : DIDKeypair) {
        let encryptionKeypair : ECDSAKeypair = keypair.GetEncryptionKeypair();
        let documentToSign : string = JSON.stringify( RecursiveSort(JSONToSign) );

        let proof : ECDSAProofDocument = {
            type: "EcdsaSecp256k1VerificationKey2019",
            verificationMethod : keypair.GetFullId(),
            signatureValue : encryptionKeypair.Sign(documentToSign).toString("base64")
        };
        return proof;
    };

    let VerifySignatureMethod : VerifySignatureMethod = function(JSONToVerify : {}, keypair : DIDKeypair, proofDocument : ProofDocument) {
        let documentToVerify : string = JSON.stringify( RecursiveSort(JSONToVerify) );
        let ECDSAproofDocument : ECDSAProofDocument = <ECDSAProofDocument>proofDocument;
        return keypair.GetEncryptionKeypair().Verify( documentToVerify, Buffer.from(ECDSAproofDocument.signatureValue, "base64"));
    };

    let RevocationMethod : RevocationMethod = function(keypair : DIDKeypair, proofDocument : ProofDocument) : RevocationSignature {
        const originalSignature = (<ECDSAProofDocument>proofDocument).signatureValue;
        return {
            "keyId" : keypair.GetFullId(),
            "originalSignature" : originalSignature,
            "revocationSignature" : keypair.GetEncryptionKeypair().Sign(originalSignature).toString("base64")
        };
    };
    return new Proof(SigningMethod, VerifySignatureMethod,RevocationMethod, proofParameter, proofDocument);
}
