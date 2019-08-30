import { ProofDocument, ProofBuildingMethod } from "./Proof";
export interface RSAProofDocument extends ProofDocument {
    signatureValue: string;
}
export declare const BuildRSAProof: ProofBuildingMethod;
