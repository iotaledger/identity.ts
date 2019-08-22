import { VerifiableCredentialDataModel, VerifiableCredential } from "./VerifiableCredential";
import { Schema } from "./Schema";
import { ExportableObject } from "./ExportableObject";

export interface PresentationDataModel {
    type : string[],
    holder : string,
    verifiableCredential: VerifiableCredentialDataModel[]
}

export class Presentation implements ExportableObject {
    private verifiableCredentials : VerifiableCredential[];
    private schema : Schema;

    public EncodeToJSON() : PresentationDataModel {

        return;
    }
}