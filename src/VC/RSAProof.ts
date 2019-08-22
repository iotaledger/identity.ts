import { BaseProof, ProofDocument } from "./BaseProof";
import { DIDDocument } from "../DID/DIDDocument";
import { RecursiveSort } from "../Helpers/RecursiveSort";
import { RSAKeypair } from "../Encryption/RSAKeypair";
import { ExportableObject } from "./ExportableObject";

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
   
    protected _Sign(object : ExportableObject) : ProofDocument {
        let encryptionKeypair : RSAKeypair = this.keypair.GetEncryptionKeypair();
        let documentToSign : string = JSON.stringify( RecursiveSort(object.EncodeToJSON()) );

        let proof : RSAProofDocument = {
            type: "RsaSignature2018",
            verificationMethod : this.keypair.GetFullId(),
            signatureValue : encryptionKeypair.Sign(documentToSign).toString("base64")
        };
        return proof;
    }    
    
    public VerifySignature(object : ExportableObject) : boolean {
        let documentToVerify : string = JSON.stringify( RecursiveSort(object.EncodeToJSON()) );
        let proofDocument : RSAProofDocument = <RSAProofDocument><unknown>this.proofDocument;
        return this.keypair.GetEncryptionKeypair().Verify( documentToVerify, Buffer.from(proofDocument.signatureValue, "base64"));
    }
}