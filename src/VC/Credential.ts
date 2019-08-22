import { DID } from "../DID/DID";
import { RecursiveSort } from "../Helpers/RecursiveSort";
import { Schema } from "./Schema";
import { SchemaManager } from "./SchemaManager";
import { ExportableObject } from "./ExportableObject";

export interface CredentialDataModel {
    "@context" : string[],
    "type" : string[],
    "issuer" : string,
    "issuanceDate" : string,
    "credentialSubject" : {}
}

export class Credential implements ExportableObject {
    private contexts : string[];
    private schema : Schema;
    private issuerDID : DID;
    private issuanceData : string;
    private credentialSubjects : [{}] | {};

    public static CreateVerifiableCredential(context : string, credentialSchema : Schema, issuerDID : DID, credentialData : [{}] | {}, issuanceData : Date = new Date()) : Credential {
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
        this.contexts = ["https://www.w3.org/2018/credentials/v1", context];
        this.schema = credentialSchema;
        this.issuerDID = issuerDID;
        this.issuanceData = issuanceData.toUTCString();
        this.credentialSubjects = RecursiveSort(credentialData);
    }

    public GetCredential() : [{}] | {} {
        return this.credentialSubjects;
    }

    public GetSchema() : Schema {
        return this.schema;
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