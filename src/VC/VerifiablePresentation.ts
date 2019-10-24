import { Presentation, PresentationDataModel } from './Presentation';
import { Proof, ProofDataModel, ProofParameters } from "./Proof/Proof";
import { VerifiableObject } from './VerifiableObject';
import { Schema } from './Schema';
import { ProofTypeManager } from './Proof/ProofTypeManager';

export type VerifiablePresentationDataModel = PresentationDataModel & ProofDataModel;

export class VerifiablePresentation extends VerifiableObject {
    private presentation : Presentation;

    public static Create(presentation : Presentation, proof : Proof) : VerifiablePresentation {
        return new VerifiablePresentation(presentation, proof);
    }

    public static async DecodeFromJSON(presentationData : VerifiablePresentationDataModel, provider : string, proofParameter : ProofParameters, presentationSchema ?: Schema) { 
        let proof : Proof = ProofTypeManager.GetInstance().CreateProofWithBuilder(presentationData.proof.type, proofParameter, presentationData.proof);
        return new VerifiablePresentation( await Presentation.DecodeFromJSON(<PresentationDataModel>presentationData, provider, presentationSchema), proof);
    }
    
    private constructor(presentation : Presentation, proof : Proof) {
        super(proof);
        this.presentation = presentation;
    }

    public async Verify(provider : string) : Promise<void> {
        return new Promise<void>( async (resolve, reject) => {
            //Verification Steps
            if(this.presentation.GetSchema()) {
                if(!this.presentation.GetSchema().IsDIDTrusted(this.proof.GetIssuer().GetDID())) {
                    reject( "Verification failed: Issuer not trusted for schema " + this.presentation.GetSchema());
                }
                if(!this.presentation.GetSchema().DoesObjectFollowSchema(this.presentation.EncodeToJSON())) {
                    reject("Verification failed: Schema not followed for schema " + this.presentation.GetSchema());
                }
            }
            if(!this.proof.VerifySignature(this.presentation.EncodeToJSON())) {
                reject("Verification failed: Signature incorrect");
            }

            //Verify all Verifiable Credentials
            const vcs = this.presentation.GetVerifiableCredentials();
            for(let i=0; i < vcs.length; i++) {
                await vcs[i].Verify(provider).catch((err) => reject(err));
            }

            resolve();
        });
    }

    public EncodeToJSON(): VerifiablePresentationDataModel {
        return { ...this.presentation.EncodeToJSON(), ...{ proof : this.proof.EncodeToJSON()}};
    }

    public GetVerifiedTypes() : string[] {
        const credentials = this.presentation.GetVerifiableCredentials();
        const types : string[]= [];
        for(let i=0; i < credentials.length; i++) {
            types.push(credentials[i].GetCredential().GetType());
        }
        return types;
    }
}