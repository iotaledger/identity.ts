import { Credential, CredentialDataModel } from "./Credential";
import { ProofTypeManager } from "./Proof/ProofTypeManager";
import { Proof, ProofDataModel, ProofBuildingMethod, ProofParameters } from "./Proof/Proof";
import { VerifiableObject, VerificationErrorCodes } from "./VerifiableObject";
import { DIDDocument } from "../DID/DIDDocument";
import { MAMSettings } from "../IOTA/mam";

export type VerifiableCredentialDataModel = CredentialDataModel & ProofDataModel;

export interface VerifiableCredentialCommunicationPackage {
    dataModel : VerifiableCredentialDataModel,
    issuerRoot : string,
    issuerKeyId : string,
    issuerMamSettings : MAMSettings,
    proofBuilder : ProofBuildingMethod,
    challengeNonce : string | undefined;
}

export class VerifiableCredential extends VerifiableObject {
    private credential : Credential;

    public static Create(credential : Credential, proof : Proof) : VerifiableCredential {
        return new VerifiableCredential(credential, proof);
    }

    /*public static async DecodeFromJSON(credentialData : VerifiableCredentialDataModel, provider : string, issuerRoot : string, issuerKeyId : string, challengeNonce : string | undefined, mamSettings ?: MAMSettings) : Promise<VerifiableCredential>{
        let IssuerDID : DIDDocument = await DIDDocument.readDIDDocument(provider, issuerRoot, mamSettings);
        let proof : Proof = ProofTypeManager.GetInstance().CreateProofWithBuilder(credentialData.proof.type, IssuerDID, issuerKeyId, challengeNonce);
        return new VerifiableCredential( Credential.DecodeFromJSON(<CredentialDataModel>credentialData), proof);
    }*/

    public static DecodeFromJSON(credentialData : VerifiableCredentialDataModel, proofParameter : ProofParameters) : VerifiableCredential {
        let proof : Proof = ProofTypeManager.GetInstance().CreateProofWithBuilder(credentialData.proof.type, proofParameter);
        if(proof) {
            return new VerifiableCredential( Credential.DecodeFromJSON(<CredentialDataModel>credentialData), proof);
        } else {
            return null;
        }
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
        return { ...this.credential.EncodeToJSON(), ...{ proof : this.proof.EncodeToJSON()}};
    }
}