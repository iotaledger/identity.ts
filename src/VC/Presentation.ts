import { VerifiableCredentialDataModel, VerifiableCredential } from "./VerifiableCredential";
import { Schema } from "./Schema";
import { BaseValidationObject } from "./BaseValidationObject";
import { DID } from "../DID/DID";

export interface PresentationDataModel {
    "@context" : string[],
    type : string[],
    holder : string,
    verifiableCredential: VerifiableCredentialDataModel[]
}

export class Presentation extends BaseValidationObject {
    private verifiableCredentials : VerifiableCredential[];
    private holder : DID;

    constructor(presentationSchema ?: Schema, context : string = "iota.org") {
        super(context, presentationSchema);
    }

    public EncodeToJSON() : PresentationDataModel {
        let credentialData : PresentationDataModel =
        {
            "@context" : this.contexts,
            type : ["VerifiablePresentation", this.schema.GetName()],
            issuer : this.issuerDID.GetDID(),
            issuanceDate : this.issuanceData,
            credentialSubject : this.credentialSubjects
        };
        return credentialData;
        return;
    }
}