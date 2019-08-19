import { BaseProof, ProofDocument } from "./BaseProof";
import { VerifiableCredential } from "./VerifiableCredentail";
import { DIDDocument } from "../DID/DIDDocument";
import { DIDKeypair } from "../DID/DIDKeypair";

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
        let proof : RSAProofDocument = {
            type: "RsaSignature2018",
            verificationMethod : this.keypair.GetFullId(),
            signatureValue : this.keypair.GetEncryptionKeypair().Sign(JSON.stringify(this.credential.GetCredential())).toString("base64")
        };
        return proof;
    }    
    
    public Verify() {
        let document : RSAProofDocument = <RSAProofDocument>this.credential.GetProof().GetJSON();
        return this.keypair.GetEncryptionKeypair().Verify( JSON.stringify(this.credential.GetCredential()), Buffer.from(document.signatureValue, "base64"));
    }
}