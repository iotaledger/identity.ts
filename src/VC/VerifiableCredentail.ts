import { DID } from "../DID/DID";
import { RecursiveSort } from "../Helpers/RecursiveSort";

export class VerifiableCredential {
    private contexts : string[];
    private type : string;
    private issuerDID : DID;
    private issuanceData : string;
    private credentialSubjects : [{}] | {};
    private proof : {}

    private constructor(context : string, credentialType : string, issuerDID : DID, credentialData : [{}] | {}, issuanceData : Date = new Date()) {
        this.contexts = ["https://www.w3.org/2018/credentials/v1", context];
        this.type = credentialType;
        this.issuerDID = issuerDID;
        this.issuanceData = issuanceData.toUTCString();
        this.credentialSubjects = RecursiveSort(credentialData);
    }

    public GetCredential() : [{}] | {} {
        return this.credentialSubjects;
    }

    public GetProof() : string {
        return "";
    }

    public GetJSONDIDDocument() : string {
        let JSONObject : {} =
        {
            "@context" : this.contexts,
            type : ["VerifiableCredential", this.type],
            issuer : this.issuerDID.GetDID(),
            issuanceDate : this.issuanceData,
            credentialSubject : this.credentialSubjects
        };
        return JSON.stringify(JSONObject);
    };
}