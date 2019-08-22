import { VerifiableCredentialDataModel } from "./VerifiableCredential";

export interface VerifiablePresentationDataModel {
    type : string[],
    holder : string,
    verifiableCredential: VerifiableCredentialDataModel[],
    proof ?: {}
}

export class VerifiablePresentation {

    constructor() {

    }

    public Verify() {
        
    }

}