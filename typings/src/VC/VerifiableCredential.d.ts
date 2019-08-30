import { Credential, CredentialDataModel } from "./Credential";
import { Proof, ProofDataModel, ProofParameters } from "./Proof/Proof";
import { VerifiableObject, VerificationErrorCodes } from "./VerifiableObject";
export declare type VerifiableCredentialDataModel = CredentialDataModel & ProofDataModel;
export declare class VerifiableCredential extends VerifiableObject {
    private credential;
    static Create(credential: Credential, proof: Proof): VerifiableCredential;
    static DecodeFromJSON(credentialData: VerifiableCredentialDataModel, proofParameter: ProofParameters): VerifiableCredential;
    private constructor();
    Verify(): VerificationErrorCodes;
    EncodeToJSON(): VerifiableCredentialDataModel;
}
