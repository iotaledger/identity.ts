import { DIDDocument } from "../../DID/DIDDocument";
import { DIDKeypair } from "../../DID/DIDKeypair";
import { Credential } from "../Credential";
export interface ProofDataModel {
    "proof"?: ExtendedProofDocument;
}
export interface ProofDocument {
    type: string;
    verificationMethod: string;
}
interface CreationDetails {
    created: string;
    creator: string;
    nonce: string;
}
export interface ProofParameters {
    issuer: DIDDocument;
    issuerKeyId: string;
    challengeNonce?: string;
}
export interface RevocationSignature {
    keyId: string;
    originalSignature: string;
    revocationSignature: string;
}
export declare type ExtendedProofDocument = ProofDocument & CreationDetails;
export declare type SigningMethod = (JSONToSign: {}, keypair: DIDKeypair) => ProofDocument;
export declare type VerifySignatureMethod = (JSONToVerify: {}, keypair: DIDKeypair, proofDocument: ProofDocument) => boolean;
export declare type RevocationMethod = (keypair: DIDKeypair, proofDocument: ProofDocument) => RevocationSignature;
export declare type ProofBuildingMethod = (proofParameter: ProofParameters, proofDocument?: ExtendedProofDocument) => Proof;
export declare class Proof {
    private signMethod;
    private verifySignatureMethod;
    private revocationMethod;
    private keypair;
    private issuer;
    private proofDocument;
    private challengeNonce;
    constructor(signMethod: SigningMethod, verifySignatureMethod: VerifySignatureMethod, revocationMethod: RevocationMethod, proofParameter: ProofParameters, proofDocument?: ExtendedProofDocument);
    Sign(JSONToSign: {}): void;
    Revoke(credential: Credential, provider: string, mwm?: number): Promise<void>;
    VerifySignature(JSONToVerify: {}): boolean;
    EncodeToJSON(): ExtendedProofDocument;
    GetIssuer(): DIDDocument;
}
export {};
