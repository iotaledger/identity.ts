import { DID } from "../DID/DID";
import { RecursiveSort } from "../Helpers/RecursiveSort";
import { BaseProof } from "./BaseProof";
import { Schema } from "./Schema";
import { SchemaManager } from "./SchemaManager";

export enum VerificationErrorCodes {
    SUCCES = 1,
    NO_PROOF,
    NO_MATCH_SCHEMA,
    ISSUER_NOT_TRUSTED,
    INCORRECT_SIGNATURE,
    CREDENTIAL_EXPIRED,
    INCORRECT_CHALLENGE_ANSWER,
    CHALLENGE_ANSWER_EXPIRED
}

export interface VCDataModel {
    "@context" : string[],
    "type" : string[],
    "issuer" : string,
    "issuanceDate" : string,
    "credentialSubject" : {},
    "proof" ?: {}
}

export class VerifiableCredential {
    private contexts : string[];
    private schema : Schema;
    private issuerDID : DID;
    private issuanceData : string;
    private credentialSubjects : [{}] | {};
    private proof : BaseProof;

    public static CreateVerifiableCredential(context : string, credentialSchema : Schema, issuerDID : DID, credentialData : [{}] | {}, issuanceData : Date = new Date(), proof ?: BaseProof) : VerifiableCredential {
        return new VerifiableCredential(context, credentialSchema, issuerDID, credentialData, issuanceData, proof);
    }

    public static ImportVerifiableCredential(credentialData : VCDataModel) : VerifiableCredential{
        return new VerifiableCredential(
            credentialData["@context"][1], 
            SchemaManager.GetInstance().GetSchema(credentialData.type[1]), new DID(credentialData.issuer), 
            credentialData.credentialSubject, 
            new Date(credentialData.issuanceDate));
    }

    private constructor(context : string, credentialSchema : Schema, issuerDID : DID, credentialData : [{}] | {}, issuanceData : Date = new Date(), proof ?: BaseProof) {
        this.contexts = ["https://www.w3.org/2018/credentials/v1", context];
        this.schema = credentialSchema;
        this.issuerDID = issuerDID;
        this.issuanceData = issuanceData.toUTCString();
        this.credentialSubjects = RecursiveSort(credentialData);
    }

    public Verify() : VerificationErrorCodes {
        //Verification Steps
        if(!this.proof) {
            return VerificationErrorCodes.NO_PROOF;
        }
        if(!this.schema.IsDIDTrusted(this.issuerDID)) {
            return VerificationErrorCodes.ISSUER_NOT_TRUSTED;
        }
        if(!this.schema.DoesObjectFollowSchema(this.credentialSubjects)) {
            return VerificationErrorCodes.NO_MATCH_SCHEMA;
        }
        if(!this.proof.Verify()) {
            return VerificationErrorCodes.INCORRECT_SIGNATURE;
        }

        return VerificationErrorCodes.SUCCES;
    }

    public GetCredential() : [{}] | {} {
        return this.credentialSubjects;
    }

    public SetProof(proof : BaseProof) {
        this.proof = proof;
    }

    public GetProof() : BaseProof {
        return this.proof;
    }

    public GetJSONDIDDocument(ProtectedDataOnly : boolean = false) : VCDataModel {
        let credentialData : VCDataModel =
        {
            "@context" : this.contexts,
            type : ["VerifiableCredential", this.schema.GetName()],
            issuer : this.issuerDID.GetDID(),
            issuanceDate : this.issuanceData,
            credentialSubject : this.credentialSubjects
        };
        if(this.proof && !ProtectedDataOnly) {
            credentialData.proof = this.proof.GetJSON();
        }
        return credentialData;
    };
}