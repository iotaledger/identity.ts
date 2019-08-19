import { VerifiableCredential } from "./VerifiableCredentail";
import { DIDDocument } from "../DID/DIDDocument";

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
    protected credential : VerifiableCredential;
    protected issuer : DIDDocument;
    protected proofDocument : ExtendedProofDocument;

    constructor(credential : VerifiableCredential, issuer : DIDDocument) { 
        this.credential = credential;
        this.issuer = issuer;
    }

    protected abstract _Sign() : ProofDocument;
    public Sign() {
        let document : ProofDocument = this._Sign();
        this.proofDocument = {...document, ...{ 
            created : new Date().toUTCString(),
            creator : this.issuer.GetDID().GetDID()
        }};
        this.credential.SetProof(this);
    }
    public abstract Verify() : boolean;
    public GetJSON() : {} {
        return this.proofDocument;
    };
}