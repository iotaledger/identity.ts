import { Presentation, PresentationDataModel } from './Presentation';
import { Proof, ProofDataModel, ProofParameters } from "./Proof/Proof";
import { VerifiableObject, VerificationErrorCodes } from './VerifiableObject';
import { Schema } from './Schema';
export declare type VerifiablePresentationDataModel = PresentationDataModel & ProofDataModel;
export declare class VerifiablePresentation extends VerifiableObject {
    private presentation;
    static Create(presentation: Presentation, proof: Proof): VerifiablePresentation;
    static DecodeFromJSON(presentationData: VerifiablePresentationDataModel, provider: string, proofParameter: ProofParameters, presentationSchema?: Schema): Promise<VerifiablePresentation>;
    private constructor();
    Verify(): VerificationErrorCodes;
    EncodeToJSON(): VerifiablePresentationDataModel;
    GetVerifiedTypes(): string[];
}
