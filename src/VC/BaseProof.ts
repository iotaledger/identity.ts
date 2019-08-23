import { DIDDocument } from "../DID/DIDDocument";
import { DIDKeypair } from "../DID/DIDKeypair";
import { Credential } from "./Credential";
import { BaseValidationObject } from "./BaseValidationObject";

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
    protected challengeNonce : string | undefined;

    constructor(issuer : DIDDocument, issuerKeyId : string, challengeNonce : string | undefined) { 
        this.issuer = issuer;
        this.keypair = this.issuer.GetKeypair(issuerKeyId);
        this.challengeNonce = challengeNonce;
    }

    protected abstract _Sign(JSONToSign : {}) : ProofDocument;
    public Sign(JSONToSign : {}) {
        let finalJSON = JSONToSign;
        if(this.challengeNonce) {
            finalJSON = { ...finalJSON, "nonce" : this.challengeNonce}
        }
        let document : ProofDocument = this._Sign(finalJSON);
        this.proofDocument = {...document, ...{ 
            created : new Date().toUTCString(),
            creator : this.issuer.GetDID().GetDID()
        }};
    }
    protected abstract _VerifySignature(JSONToVerify : {}) : boolean; 
    public VerifySignature(JSONToVerify : {}) : boolean {
        let finalJSON = JSONToVerify;
        if(this.challengeNonce) {
            finalJSON = { ...finalJSON, "nonce" : this.challengeNonce}
        }
        return this._VerifySignature(finalJSON);
    } ;
    public GetJSON() : {} {
        return this.proofDocument;
    };

    public GetIssuer() : DIDDocument {
        return this.issuer;
    }
}