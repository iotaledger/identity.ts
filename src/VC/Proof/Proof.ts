import { DIDDocument } from "../../DID/DIDDocument";
import { DIDKeypair } from "../../DID/DIDKeypair";
import { Credential } from "../Credential";
import { composeAPI } from '@iota/core';
import { asciiToTrytes } from '@iota/converter';
import { GenerateSeed } from "../../Helpers/GenerateSeed";

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

export interface RevocationSignature {
    keyId : string,
    originalSignature : string,
    revocationSignature : string
}

export type ExtendedProofDocument = ProofDocument & CreationDetails;

export type SigningMethod = (JSONToSign : {}, keypair : DIDKeypair) => ProofDocument;
export type VerifySignatureMethod = (JSONToVerify : {}, keypair : DIDKeypair, proofDocument : ProofDocument) => boolean;
export type RevocationMethod = (keypair: DIDKeypair, proofDocument : ProofDocument) => RevocationSignature;
export type ProofBuildingMethod = (proofParameter : ProofParameters, proofDocument ?: ExtendedProofDocument) => Proof;

export class Proof {
    private signMethod : SigningMethod;
    private verifySignatureMethod : VerifySignatureMethod;
    private revocationMethod : RevocationMethod;

    private keypair : DIDKeypair;
    private issuer : DIDDocument;
    private proofDocument : ExtendedProofDocument;
    private challengeNonce : string | undefined;

    constructor(signMethod : SigningMethod, verifySignatureMethod : VerifySignatureMethod, revocationMethod : RevocationMethod, proofParameter : ProofParameters, proofDocument ?: ExtendedProofDocument) {
        this.signMethod = signMethod;
        this.verifySignatureMethod = verifySignatureMethod;
        this.revocationMethod = revocationMethod;
        this.issuer = proofParameter.issuer;
        this.keypair = this.issuer.GetKeypair(proofParameter.issuerKeyId);
        this.challengeNonce = proofParameter.challengeNonce;
        this.proofDocument = proofDocument;
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

    public Revoke(credential : Credential, provider : string, mwm : number = 9) {
        const revocationAddress = credential.GetRevocationAddress();
        if(!revocationAddress) {
            return;
        }
        const RevocationSignature = this.revocationMethod(this.keypair, this.proofDocument);
        const iota = composeAPI({provider : provider});
        iota.prepareTransfers(GenerateSeed(), [{value:0, address:revocationAddress, message: asciiToTrytes(JSON.stringify(RevocationSignature))}])
        .then((trytes : readonly string[]) => {
            return iota.sendTrytes(trytes, 3, mwm)
        })
        .catch((err : Error) => { console.log("Error posting revocation: " + err);});
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