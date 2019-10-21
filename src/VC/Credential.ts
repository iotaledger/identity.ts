import { DID } from "../DID/DID";
import { RecursiveSort } from "../Helpers/RecursiveSort";
import { Schema } from "./Schema";
import { SchemaManager } from "./SchemaManager";
import { BaseValidationObject } from "./BaseValidationObject";

interface CredentialStatus {
    "id" : string,
    "type" : string
}
const RevocationAddressCredentialStatusType = "RevocationAddress";

export interface CredentialDataModel {
    "@context" : string[],
    "type" : string[],
    "issuer" : string,
    "issuanceDate" : string,
    "credentialSubject" : {},
    "credentialStatus" ?: CredentialStatus
}

export class Credential extends BaseValidationObject {
    private issuerDID : DID;
    private issuanceData : string;
    private credentialSubjects : [{}] | {};
    private credentialStatus : CredentialStatus | undefined;

    public static Create(credentialSchema : Schema, issuerDID : DID, credentialData : [{}] | {}, revocationAddress ?: string, issuanceData : Date = new Date(), context : string = "iota.org") : Credential {
        return new Credential(context, credentialSchema, issuerDID, credentialData, (revocationAddress)?{"id" : revocationAddress, "type" : RevocationAddressCredentialStatusType }:undefined, issuanceData);
    }

    public static DecodeFromJSON(credentialData : CredentialDataModel) : Credential{
        return new Credential(
            credentialData["@context"][1], 
            SchemaManager.GetInstance().GetSchema(credentialData.type[1]), new DID(credentialData.issuer), 
            credentialData.credentialSubject, 
            credentialData.credentialStatus,
            new Date(credentialData.issuanceDate));
    }

    private constructor(context : string, credentialSchema : Schema, issuerDID : DID, credentialData : [{}] | {}, credentialStatus ?: CredentialStatus, issuanceData : Date = new Date()) {
        super(context, credentialSchema);
        this.issuerDID = issuerDID;
        this.issuanceData = issuanceData.toUTCString();
        this.credentialSubjects = RecursiveSort(credentialData);
        this.credentialStatus = credentialStatus;
    }

    public GetCredential() : [{}] | {} {
        return this.credentialSubjects;
    }

    public SetRevocationAddress(revocationAddress : string) {
        this.credentialStatus = {
            "id" : revocationAddress,
            "type" : RevocationAddressCredentialStatusType
        }
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
        
        if(this.credentialStatus) {
            credentialData["credentialStatus"] = this.credentialStatus;
        }
        return credentialData;
    };

    public GetType() : string {
        return this.schema.GetName()
    }

    public GetRevocationAddress() : string|undefined {
        return (this.credentialStatus) ? this.credentialStatus.id : undefined;
    }
}