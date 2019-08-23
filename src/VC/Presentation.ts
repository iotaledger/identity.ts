import { VerifiableCredentialDataModel, VerifiableCredential } from "./VerifiableCredential";
import { Schema } from "./Schema";
import { BaseValidationObject } from "./BaseValidationObject";
import { DID } from "../DID/DID";

export interface PresentationDataModel {
    "@context" : string[],
    type : string[],
    holder ?: string,
    verifiableCredential: VerifiableCredentialDataModel[]
}

export class Presentation extends BaseValidationObject {
    private verifiableCredentials : VerifiableCredential[];
    private holder : DID;

    constructor(verifiableCredentials : VerifiableCredential[], presentationSchema ?: Schema, context : string = "iota.org") {
        super(context, presentationSchema);
        this.verifiableCredentials = verifiableCredentials;
    }

    public EncodeToJSON() : PresentationDataModel {
        let verifiableCredentialObjects : VerifiableCredentialDataModel[] = [];
        for(let i=0; i < this.verifiableCredentials.length; i++) {
            verifiableCredentialObjects.push(this.verifiableCredentials[i].EncodeToJSON());
        }

        let types : string[] = ["VerifiablePresentation"];
        if(this.schema) {
            types.push(this.schema.GetName());
        }

        let credentialData : PresentationDataModel =
        {
            "@context" : this.contexts,
            type : types,
            verifiableCredential : verifiableCredentialObjects
        };
        return credentialData;
    }
}