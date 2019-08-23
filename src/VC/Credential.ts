import { DID } from "../DID/DID";
import { RecursiveSort } from "../Helpers/RecursiveSort";
import { Schema } from "./Schema";
import { SchemaManager } from "./SchemaManager";
import { BaseValidationObject } from "./BaseValidationObject";

export interface CredentialDataModel {
    "@context" : string[],
    "type" : string[],
    "issuer" : string,
    "issuanceDate" : string,
    "credentialSubject" : {}
}

export class Credential extends BaseValidationObject {
    private issuerDID : DID;
    private issuanceData : string;
    private credentialSubjects : [{}] | {};

    public static CreateVerifiableCredential(credentialSchema : Schema, issuerDID : DID, credentialData : [{}] | {}, issuanceData : Date = new Date(), context : string = "iota.org") : Credential {
        return new Credential(context, credentialSchema, issuerDID, credentialData, issuanceData);
    }

    public static ImportVerifiableCredential(credentialData : CredentialDataModel) : Credential{
        return new Credential(
            credentialData["@context"][1], 
            SchemaManager.GetInstance().GetSchema(credentialData.type[1]), new DID(credentialData.issuer), 
            credentialData.credentialSubject, 
            new Date(credentialData.issuanceDate));
    }

    private constructor(context : string, credentialSchema : Schema, issuerDID : DID, credentialData : [{}] | {}, issuanceData : Date = new Date()) {
        super(context, credentialSchema);
        this.issuerDID = issuerDID;
        this.issuanceData = issuanceData.toUTCString();
        this.credentialSubjects = RecursiveSort(credentialData);
    }

    public GetCredential() : [{}] | {} {
        return this.credentialSubjects;
    }

    public EncodeToJSON() : CredentialDataModel {
        let credentialData : CredentialDataModel =
        {
            "@context" : this.contexts,
            type : ["VerifiableCredential", this.schema.GetName()],
            issuer : this.issuerDID.GetDID(),
            issuanceDate : this.issuanceData,
            credentialSubject : this.credentialSubjects
        };
        return credentialData;
    };
}