import { BaseProof, ProofDocument } from "./BaseProof";
import { DIDDocument } from "../DID/DIDDocument";
import { RecursiveSort } from "../Helpers/RecursiveSort";
import { RSAKeypair } from "../Encryption/RSAKeypair";
import { BaseValidationObject } from "./BaseValidationObject";

export interface RSAProofDocument extends ProofDocument {
    signatureValue : string
}

export class RSAProof extends BaseProof {
    constructor(issuer : DIDDocument, issuerKeyId : string, challengeNonce ?: string) {
        super(issuer, issuerKeyId, challengeNonce);
    }

    public SetPrivateKey(privateKey : string) {
        this.keypair.GetEncryptionKeypair().SetPrivateKey(privateKey);
    }
   
    protected _Sign(JSONToSign : {}) : ProofDocument {
        let encryptionKeypair : RSAKeypair = this.keypair.GetEncryptionKeypair();
        let documentToSign : string = JSON.stringify( RecursiveSort(JSONToSign) );

        let proof : RSAProofDocument = {
            type: "RsaSignature2018",
            verificationMethod : this.keypair.GetFullId(),
            signatureValue : encryptionKeypair.Sign(documentToSign).toString("base64")
        };
        return proof;
    }    
    
    protected _VerifySignature(JSONToVerify : {}) : boolean {
        let documentToVerify : string = JSON.stringify( RecursiveSort(JSONToVerify) );
        let proofDocument : RSAProofDocument = <RSAProofDocument><unknown>this.proofDocument;
        return this.keypair.GetEncryptionKeypair().Verify( documentToVerify, Buffer.from(proofDocument.signatureValue, "base64"));
    }
}