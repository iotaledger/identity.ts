import { Presentation, PresentationDataModel } from './Presentation';
import { Proof, ProofDataModel } from "./Proof";
import { VerifiableObject, VerificationErrorCodes } from './VerifiableObject';

type VerifiablePresentationDataModel = PresentationDataModel & ProofDataModel;

export class VerifiablePresentation extends VerifiableObject {
    private presentation : Presentation;
    
    constructor(presentation : Presentation, proof : Proof) {
        super(proof);
        this.presentation = presentation;
    }

    public Verify() : VerificationErrorCodes {
        //Verification Steps
        if(this.presentation.GetSchema()) {
            if(!this.presentation.GetSchema().IsDIDTrusted(this.proof.GetIssuer().GetDID())) {
                return VerificationErrorCodes.ISSUER_NOT_TRUSTED;
            }
            if(!this.presentation.GetSchema().DoesObjectFollowSchema(this.presentation.EncodeToJSON())) {
                return VerificationErrorCodes.NO_MATCH_SCHEMA;
            }
        }
        if(!this.proof.VerifySignature(this.presentation.EncodeToJSON())) {
            return VerificationErrorCodes.INCORRECT_SIGNATURE;
        }

        return VerificationErrorCodes.SUCCES;
    }

    public EncodeToJSON(): VerifiablePresentationDataModel {

        return;
    }
}