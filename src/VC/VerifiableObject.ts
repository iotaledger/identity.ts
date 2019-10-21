import { Proof } from "./Proof/Proof";

export enum VerificationErrorCodes {
    SUCCES = 1,
    NO_MATCH_SCHEMA,
    ISSUER_NOT_TRUSTED,
    INCORRECT_SIGNATURE,
    CREDENTIAL_REVOCATED,
    CREDENTIAL_EXPIRED,
    INCORRECT_CHALLENGE_ANSWER,
    CHALLENGE_ANSWER_EXPIRED
}

export abstract class VerifiableObject {
    protected proof : Proof;

    constructor(proof : Proof) { 
        this.proof = proof;
    };

    public abstract Verify() : VerificationErrorCodes;
}