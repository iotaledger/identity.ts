import { DIDDocument } from "../DID/DIDDocument";
import { DIDKeypair } from "../DID/DIDKeypair";
import { Credential } from "./Credential";

export interface ProofDocument {
    type : string,
    verificationMethod : string
}

interface CreationDetails {
    created : string,
    creator : string,
}

type ExtendedProofDocument = ProofDocument & CreationDetails;

export abstract class BaseProof {
    protected keypair : DIDKeypair;
    protected issuer : DIDDocument;
    protected proofDocument : ExtendedProofDocument;

    constructor(issuer : DIDDocument, issuerKeyId : string) { 
        this.issuer = issuer;
        this.keypair = this.issuer.GetKeypair(issuerKeyId);
    }

    protected abstract _Sign(credential : Credential) : ProofDocument;
    public Sign(credential : Credential) {
        let document : ProofDocument = this._Sign(credential);
        this.proofDocument = {...document, ...{ 
            created : new Date().toUTCString(),
            creator : this.issuer.GetDID().GetDID()
        }};
    }
    public abstract VerifySignature(credential : Credential) : boolean;
    public GetJSON() : {} {
        return this.proofDocument;
    };

    public GetIssuer() : DIDDocument {
        return this.issuer;
    }
}