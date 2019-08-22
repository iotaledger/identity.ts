import { BaseProof, ProofDocument } from "./BaseProof";
import { Credential } from "./Credential";
import { DIDDocument } from "../DID/DIDDocument";
import { RecursiveSort } from "../Helpers/RecursiveSort";
import { RSAKeypair } from "../Encryption/RSAKeypair";

export interface RSAProofDocument extends ProofDocument {
    signatureValue : string
}

export class RSAProof extends BaseProof {
    constructor(issuer : DIDDocument, issuerKeyId : string) {
        super(issuer, issuerKeyId);
    }

    public SetPrivateKey(privateKey : string) {
        this.keypair.GetEncryptionKeypair().SetPrivateKey(privateKey);
    }
   
    protected _Sign(credential : Credential) : ProofDocument {
        let encryptionKeypair : RSAKeypair = this.keypair.GetEncryptionKeypair();
        let documentToSign : string = JSON.stringify( RecursiveSort(credential.GetJSONDIDDocument()) );

        let proof : RSAProofDocument = {
            type: "RsaSignature2018",
            verificationMethod : this.keypair.GetFullId(),
            signatureValue : encryptionKeypair.Sign(documentToSign).toString("base64")
        };
        return proof;
    }    
    
    public VerifySignature(credential : Credential) : boolean {
        let documentToVerify : string = JSON.stringify( RecursiveSort(credential.GetJSONDIDDocument()) );
        let proofDocument : RSAProofDocument = <RSAProofDocument><unknown>this.proofDocument;
        return this.keypair.GetEncryptionKeypair().Verify( documentToVerify, Buffer.from(proofDocument.signatureValue, "base64"));
    }
}