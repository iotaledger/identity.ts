import { DIDDocument } from "../DID/DIDDocument";
import { DIDKeypair } from "../DID/DIDKeypair";

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

/*
export interface BaseProof extends AbstractProof {}

export abstract class BaseProof implements AbstractProof {
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
    public EncodeToJSON() : {} {
        return this.proofDocument;
    };

    public GetIssuer() : DIDDocument {
        return this.issuer;
    }
}*/

export type SigningMethod = (JSONToSign : {}, keypair : DIDKeypair) => ProofDocument;
export type VerifySignatureMethod = (JSONToVerify : {}, keypair : DIDKeypair, proofDocument : ProofDocument) => boolean;
export type ProofBuildingMethod = (issuer : DIDDocument, issuerKeyId : string, challengeNonce : string | undefined) => Proof;

export class Proof {
    private signMethod : SigningMethod;
    private verifySignatureMethod : VerifySignatureMethod;

    private keypair : DIDKeypair;
    private issuer : DIDDocument;
    private proofDocument : ExtendedProofDocument;
    private challengeNonce : string | undefined;

    constructor(signMethod : SigningMethod, verifySignatureMethod : VerifySignatureMethod, issuer : DIDDocument, issuerKeyId : string, challengeNonce : string | undefined) {
        this.signMethod = signMethod;
        this.verifySignatureMethod = verifySignatureMethod;
        this.issuer = issuer;
        this.keypair = this.issuer.GetKeypair(issuerKeyId);
        this.challengeNonce = challengeNonce;
    }

    public Sign(JSONToSign : {}) {
        let finalJSON = JSONToSign;
        if(this.challengeNonce) {
            finalJSON = { ...finalJSON, "nonce" : this.challengeNonce}
        }
        let document : ProofDocument = this.signMethod(finalJSON, this.keypair);
        this.proofDocument = {...document, ...{ 
            created : new Date().toUTCString(),
            creator : this.issuer.GetDID().GetDID()
        }};
    }

    public VerifySignature(JSONToVerify : {}) : boolean {
        let finalJSON = JSONToVerify;
        if(this.challengeNonce) {
            finalJSON = { ...finalJSON, "nonce" : this.challengeNonce}
        }
        return this.verifySignatureMethod(finalJSON, this.keypair, this.proofDocument);
    }

    public EncodeToJSON() : {} {
        return this.proofDocument;
    };

    public GetIssuer() : DIDDocument {
        return this.issuer;
    }
}