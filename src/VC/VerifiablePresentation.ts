import { Presentation, PresentationDataModel } from './Presentation';
import { BaseProof, ProofDataModel } from "./BaseProof";
import { VerifiableObject, VerificationErrorCodes } from './VerifiableObject';

type VerifiablePresentationDataModel = PresentationDataModel & ProofDataModel;

export class VerifiablePresentation extends VerifiableObject {
    private presentation : Presentation;
    
    constructor(presentation : Presentation, proof : BaseProof) {
        super(proof);
        this.presentation = presentation;
    }

    public Verify() : VerificationErrorCodes {
        
        return VerificationErrorCodes.SUCCES;
    }

    public EncodeToJSON(): VerifiablePresentationDataModel {

        return;
    }
}