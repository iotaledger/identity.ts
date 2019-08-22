import { BaseProof } from "./BaseProof";

export enum VerificationErrorCodes {
    SUCCES = 1,
    NO_MATCH_SCHEMA,
    ISSUER_NOT_TRUSTED,
    INCORRECT_SIGNATURE,
    CREDENTIAL_EXPIRED,
    INCORRECT_CHALLENGE_ANSWER,
    CHALLENGE_ANSWER_EXPIRED
}

export abstract class VerifiableObject {
    protected proof : BaseProof;

    constructor(proof : BaseProof) { 
        this.proof = proof;
    };

    public abstract Verify() : VerificationErrorCodes;
}