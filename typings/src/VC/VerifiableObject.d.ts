import { Proof } from "./Proof/Proof";
export declare enum VerificationErrorCodes {
    SUCCES = 1,
    NO_MATCH_SCHEMA = 2,
    ISSUER_NOT_TRUSTED = 3,
    INCORRECT_SIGNATURE = 4,
    CREDENTIAL_EXPIRED = 5,
    INCORRECT_CHALLENGE_ANSWER = 6,
    CHALLENGE_ANSWER_EXPIRED = 7
}
export declare abstract class VerifiableObject {
    protected proof: Proof;
    constructor(proof: Proof);
    abstract Verify(): VerificationErrorCodes;
}
