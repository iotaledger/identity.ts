import { Credential, CredentialDataModel } from "./Credential";
import { BaseProof, ProofDataModel } from "./BaseProof";
import { VerifiableObject, VerificationErrorCodes } from "./VerifiableObject";

export type VerifiableCredentialDataModel = CredentialDataModel & ProofDataModel;

export class VerifiableCredential extends VerifiableObject {
    private credential : Credential;

    constructor(credential : Credential, proof : BaseProof) {
        super(proof);
        this.credential = credential;
    }

    public Verify() : VerificationErrorCodes {
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

    public EncodeToJSON() : VerifiableCredentialDataModel {
        return;
    }
}