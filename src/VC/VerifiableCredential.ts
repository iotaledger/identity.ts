import { Credential, CredentialDataModel } from "./Credential";
import { ProofTypeManager } from "./Proof/ProofTypeManager";
import { Proof, ProofDataModel, ProofParameters } from "./Proof/Proof";
import { VerifiableObject, VerificationErrorCodes } from "./VerifiableObject";

export type VerifiableCredentialDataModel = CredentialDataModel & ProofDataModel;


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
        if(credentialData.proof) {
            let proof : Proof = ProofTypeManager.GetInstance().CreateProofWithBuilder(credentialData.proof.type, proofParameter, credentialData.proof);
            if(proof) {
                return new VerifiableCredential( Credential.DecodeFromJSON(<CredentialDataModel>credentialData), proof);
            } 
        }
        return null;
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
        if(this.credential.GetRevocationAddress()) {
            //Check for Revocation

            //Get Revocation transactions from this.credential.GetRevocationAddress()

            //What transaction should look like in Ascii:
            /*  { 
                    keyId : string,
                    originalSignature : string,
                    revocationSignature : string
                }
            */
            //The keyId looks 

            //if()
            //return VerificationErrorCodes.CREDENTIAL_REVOCATED;
        }

        return VerificationErrorCodes.SUCCES;
    }

    public EncodeToJSON() : VerifiableCredentialDataModel {
        return { ...this.credential.EncodeToJSON(), ...{ proof : this.proof.EncodeToJSON()}};
    }

    public GetCredential() : Credential {
        return this.credential;
    }
}