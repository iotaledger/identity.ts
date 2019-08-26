import { DIDDocument } from "../DID/DIDDocument";
import { DIDKeypair } from "../DID/DIDKeypair";

export interface ProofDataModel {
    "proof" ?: ExtendedProofDocument
}

export interface ProofDocument {
    type : string,
    verificationMethod : string
}

interface CreationDetails {
    created : string,
    creator : string,
    nonce : string
}

export interface ProofParameters {
    issuer : DIDDocument, 
    issuerKeyId : string, 
    challengeNonce ?: string
}

type ExtendedProofDocument = ProofDocument & CreationDetails;

export type SigningMethod = (JSONToSign : {}, keypair : DIDKeypair) => ProofDocument;
export type VerifySignatureMethod = (JSONToVerify : {}, keypair : DIDKeypair, proofDocument : ProofDocument) => boolean;
export type ProofBuildingMethod = (proofParameter : ProofParameters) => Proof;

export class Proof {
    private signMethod : SigningMethod;
    private verifySignatureMethod : VerifySignatureMethod;

    private keypair : DIDKeypair;
    private issuer : DIDDocument;
    private proofDocument : ExtendedProofDocument;
    private challengeNonce : string | undefined;

    constructor(signMethod : SigningMethod, verifySignatureMethod : VerifySignatureMethod, proofParameter : ProofParameters) {
        this.signMethod = signMethod;
        this.verifySignatureMethod = verifySignatureMethod;
        this.issuer = proofParameter.issuer;
        this.keypair = this.issuer.GetKeypair(proofParameter.issuerKeyId);
        this.challengeNonce = proofParameter.challengeNonce;
    }

    public Sign(JSONToSign : {}) {
        let finalJSON = JSONToSign;
        if(this.challengeNonce) {
            finalJSON = { ...finalJSON, "nonce" : this.challengeNonce}
        }
        let document : ProofDocument = this.signMethod(finalJSON, this.keypair);
        this.proofDocument = {...document, ...{ 
            created : new Date().toUTCString(),
            creator : this.issuer.GetDID().GetDID(),
            nonce : this.challengeNonce
        }};
    }

    public VerifySignature(JSONToVerify : {}) : boolean {
        let finalJSON = JSONToVerify;
        if(this.challengeNonce) {
            finalJSON = { ...finalJSON, "nonce" : this.challengeNonce}
        }
        return this.verifySignatureMethod(finalJSON, this.keypair, this.proofDocument);
    }

    public EncodeToJSON() : ExtendedProofDocument {
        return this.proofDocument;
    };

    public GetIssuer() : DIDDocument {
        return this.issuer;
    }
}