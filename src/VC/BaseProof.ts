import { DIDDocument } from "../DID/DIDDocument";
import { DIDKeypair } from "../DID/DIDKeypair";
import { Credential } from "./Credential";
import { ExportableObject } from "./ExportableObject";

export interface ProofDataModel {
    "proof" ?: {}
}

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

    protected abstract _Sign(object : ExportableObject) : ProofDocument;
    public Sign(object : ExportableObject) {
        let document : ProofDocument = this._Sign(object);
        this.proofDocument = {...document, ...{ 
            created : new Date().toUTCString(),
            creator : this.issuer.GetDID().GetDID()
        }};
    }
    public abstract VerifySignature(object : ExportableObject) : boolean;
    public GetJSON() : {} {
        return this.proofDocument;
    };

    public GetIssuer() : DIDDocument {
        return this.issuer;
    }
}