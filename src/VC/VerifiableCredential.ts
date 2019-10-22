import { Credential, CredentialDataModel } from "./Credential";
import { ProofTypeManager } from "./Proof/ProofTypeManager";
import { Proof, ProofDataModel, ProofParameters } from "./Proof/Proof";
import { VerifiableObject } from "./VerifiableObject";
import { ReadAddress } from "../IOTA/iota";
import { DID } from "../DID/DID";

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

    public async Verify(provider : string) : Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            //Verification Steps
            if(!this.credential.GetSchema().IsDIDTrusted(this.proof.GetIssuer().GetDID())) {
                reject( "Verification failed: Issuer not trusted for schema " + this.credential.GetSchema());
            }
            if(!this.credential.GetSchema().DoesObjectFollowSchema(this.credential.GetCredential())) {
                reject("Verification failed: Schema not followed for schema " + this.credential.GetSchema());
            }
            if(!this.proof.VerifySignature(this.credential.EncodeToJSON())) {
                reject("Verification failed: Signature incorrect");
            }
            if(this.credential.GetRevocationAddress()) {
                //Check for Revocation
                let messages : string[] = await ReadAddress(this.credential.GetRevocationAddress(), provider);
                
                for(let i=0; i < messages.length; i++) {
                    //Check if it has valid JSON
                    let jsonObject;
                    try { jsonObject = JSON.parse(messages[i]); } catch(e) {console.log(e); continue;};

                    //Check if it has the right fields
                    if(!jsonObject["keyId"] || !jsonObject["originalSignature"] || !jsonObject["revocationSignature"]) {
                        continue;
                    }

                    //Verify if it is the correct Issuer
                    let issuerDID : DID = new DID(jsonObject["keyId"]);
                    if( issuerDID.GetDID() != this.proof.GetIssuer().GetDID().GetDID() ) {
                        continue;
                    }

                    //Get the keypair
                    let keypair = this.proof.GetIssuer().GetKeypair(issuerDID.GetFragment());
                    if(!keypair) {
                        continue;
                    }

                    if( keypair.GetEncryptionKeypair().Verify(jsonObject["originalSignature"], Buffer.from(jsonObject["revocationSignature"], "base64")) ) {
                        reject("Verification failed: Claim has been revoked");
                    }
                }
            }
            resolve();
        });
    }

    public EncodeToJSON() : VerifiableCredentialDataModel {
        return { ...this.credential.EncodeToJSON(), ...{ proof : this.proof.EncodeToJSON()}};
    }

    public GetCredential() : Credential {
        return this.credential;
    }
}