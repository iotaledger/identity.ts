import { DID } from "../DID/DID";
import { Schema } from "./Schema";
import { BaseValidationObject } from "./BaseValidationObject";
interface CredentialStatus {
    "id": string;
    "type": string;
}
export interface CredentialDataModel {
    "@context": string[];
    "type": string[];
    "issuer": string;
    "issuanceDate": string;
    "credentialSubject": {};
    "credentialStatus"?: CredentialStatus;
}
export declare class Credential extends BaseValidationObject {
    private issuerDID;
    private issuanceData;
    private credentialSubjects;
    private credentialStatus;
    static Create(credentialSchema: Schema, issuerDID: DID, credentialData: [{}] | {}, revocationAddress?: string, issuanceData?: Date, context?: string): Credential;
    static DecodeFromJSON(credentialData: CredentialDataModel): Credential;
    private constructor();
    GetCredential(): [{}] | {};
    SetRevocationAddress(revocationAddress: string): void;
    EncodeToJSON(): CredentialDataModel;
    GetType(): string;
    GetRevocationAddress(): string | undefined;
}
export {};
