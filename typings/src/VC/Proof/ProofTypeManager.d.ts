import { ProofBuildingMethod, Proof, ProofParameters, ExtendedProofDocument } from './Proof';
export declare class ProofTypeManager {
    private static instance;
    private proofTypes;
    private constructor();
    AddProof(name: string, proof: ProofBuildingMethod): void;
    CreateProofWithBuilder(name: string, proofParameter: ProofParameters, proofDocument?: ExtendedProofDocument): Proof;
    GetProofBuilder(name: string): ProofBuildingMethod;
    static GetInstance(): ProofTypeManager;
}
