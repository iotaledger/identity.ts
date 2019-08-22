import { Credential, CredentialDataModel } from "./Credential";
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

interface ProofDataModel {
    "proof" ?: {}
}

export type VerifiableCredentialDataModel = CredentialDataModel & ProofDataModel;

export class VerifiableCredential {
    private credential : Credential;
    private proof : BaseProof;

    constructor(credential : Credential, proof : BaseProof) {
        this.credential = credential;
        this.proof = proof;
    }

    public Verify() {
        //Verification Steps
        if(!this.credential.GetSchema().IsDIDTrusted(this.proof.GetIssuer().GetDID())) {
            return VerificationErrorCodes.ISSUER_NOT_TRUSTED;
        }
        if(!this.credential.GetSchema().DoesObjectFollowSchema(this.credential.GetCredential())) {
            return VerificationErrorCodes.NO_MATCH_SCHEMA;
        }
        if(!this.proof.VerifySignature(this.credential)) {
            return VerificationErrorCodes.INCORRECT_SIGNATURE;
        }

        return VerificationErrorCodes.SUCCES;
    }
}