import { BaseProof, ProofDocument } from "./BaseProof";
import { VerifiableCredential } from "./VerifiableCredentail";
import { DIDDocument } from "../DID/DIDDocument";
import { DIDKeypair } from "../DID/DIDKeypair";
import { RecursiveSort } from "../Helpers/RecursiveSort";
import { RSAKeypair } from "../Encryption/RSAKeypair";

export interface RSAProofDocument extends ProofDocument {
    signatureValue : string
}

export class RSAProof extends BaseProof {
    private keypair : DIDKeypair;

    constructor(credential : VerifiableCredential, issuer : DIDDocument, issuerKeyId : string) {
        super(credential, issuer);
        this.keypair = this.issuer.GetKeypair(issuerKeyId);
    }

    public SetPrivateKey(privateKey : string) {
        this.keypair.GetEncryptionKeypair().SetPrivateKey(privateKey);
    }
   
    protected _Sign() : ProofDocument {
        let encryptionKeypair : RSAKeypair = this.keypair.GetEncryptionKeypair();
        let documentToSign : string = JSON.stringify( RecursiveSort(this.credential.GetJSONDIDDocument(true)) );

        let proof : RSAProofDocument = {
            type: "RsaSignature2018",
            verificationMethod : this.keypair.GetFullId(),
            signatureValue : encryptionKeypair.Sign(documentToSign).toString("base64")
        };
        return proof;
    }    
    
    public Verify() : boolean {
        let documentToVerify : string = JSON.stringify( RecursiveSort(this.credential.GetJSONDIDDocument(true)) );
        let proofDocument : RSAProofDocument = <RSAProofDocument>this.credential.GetProof().GetJSON();
        return this.keypair.GetEncryptionKeypair().Verify( documentToVerify, Buffer.from(proofDocument.signatureValue, "base64"));
    }
}