import { VerifiableCredentialDataModel, VerifiableCredential } from "./VerifiableCredential";
import { Schema } from "./Schema";
import { BaseValidationObject } from "./BaseValidationObject";
export interface PresentationDataModel {
    "@context": string[];
    type: string[];
    holder?: string;
    verifiableCredential: VerifiableCredentialDataModel[];
}
export declare class Presentation extends BaseValidationObject {
    private verifiableCredentials;
    private holder;
    static Create(verifiableCredentials: VerifiableCredential[], presentationSchema?: Schema, context?: string): Presentation;
    static DecodeFromJSON(presentationData: PresentationDataModel, provider: string, presentationSchema?: Schema): Promise<Presentation>;
    private constructor();
    EncodeToJSON(): PresentationDataModel;
}
