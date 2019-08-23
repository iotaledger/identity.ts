import { Credential, CredentialDataModel } from "./Credential";
import { Proof, ProofDataModel, ProofBuildingMethod } from "./Proof";
import { VerifiableObject, VerificationErrorCodes } from "./VerifiableObject";
import { DIDDocument } from "../DID/DIDDocument";
import { MAMSettings } from "../IOTA/mam";

export type VerifiableCredentialDataModel = CredentialDataModel & ProofDataModel;

export class VerifiableCredential extends VerifiableObject {
    private credential : Credential;

    public static Create(credential : Credential, proof : Proof) : VerifiableCredential {
        return new VerifiableCredential(credential, proof);
    }

    public static async DecodeFromJSON(credentialData : VerifiableCredentialDataModel, provider : string, issuerRoot : string, issuerKeyId : string, ProofBuilder : ProofBuildingMethod, challengeNonce : string | undefined, mamSettings ?: MAMSettings) : Promise<VerifiableCredential>{
        let IssuerDID : DIDDocument = await DIDDocument.readDIDDocument(provider, issuerRoot, mamSettings);
        return new VerifiableCredential( Credential.DecodeFromJSON(<CredentialDataModel>credentialData), ProofBuilder(IssuerDID, issuerKeyId, challengeNonce));
    }

    public static DecodeFromJSONWithLoadedIssuer(credentialData : VerifiableCredentialDataModel, IssuerDIDDocument : DIDDocument, issuerKeyId : string, ProofBuilder : ProofBuildingMethod, challengeNonce : string | undefined) : VerifiableCredential{
        return new VerifiableCredential( Credential.DecodeFromJSON(<CredentialDataModel>credentialData), ProofBuilder(IssuerDIDDocument, issuerKeyId, challengeNonce));
    }
    
    private constructor(credential : Credential, proof : Proof) {
        super(proof);
        this.credential = credential;
    }

    public Verify() : VerificationErrorCodes {
        //Verification Steps
        if(!this.credential.GetSchema().IsDIDTrusted(this.proof.GetIssuer().GetDID())) {
            return VerificationErrorCodes.ISSUER_NOT_TRUSTED;
        }
        if(!this.credential.GetSchema().DoesObjectFollowSchema(this.credential.GetCredential())) {
            return VerificationErrorCodes.NO_MATCH_SCHEMA;
        }
        if(!this.proof.VerifySignature(this.credential.EncodeToJSON())) {
            return VerificationErrorCodes.INCORRECT_SIGNATURE;
        }

        return VerificationErrorCodes.SUCCES;
    }

    public EncodeToJSON() : VerifiableCredentialDataModel {
        return { ...this.credential.EncodeToJSON(), ...this.proof.EncodeToJSON()};
    }
}