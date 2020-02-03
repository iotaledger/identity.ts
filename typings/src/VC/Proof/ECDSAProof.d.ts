import { ProofDocument, ProofBuildingMethod } from "./Proof";
export interface ECDSAProofDocument extends ProofDocument {
    signatureValue: string;
}
export declare const BuildECDSAProof: ProofBuildingMethod;
