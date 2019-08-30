import { DID } from "../DID/DID";
import { Schema } from "./Schema";
import { BaseValidationObject } from "./BaseValidationObject";
export interface CredentialDataModel {
    "@context": string[];
    "type": string[];
    "issuer": string;
    "issuanceDate": string;
    "credentialSubject": {};
}
export declare class Credential extends BaseValidationObject {
    private issuerDID;
    private issuanceData;
    private credentialSubjects;
    static Create(credentialSchema: Schema, issuerDID: DID, credentialData: [{}] | {}, issuanceData?: Date, context?: string): Credential;
    static DecodeFromJSON(credentialData: CredentialDataModel): Credential;
    private constructor();
    GetCredential(): [{}] | {};
    EncodeToJSON(): CredentialDataModel;
}
