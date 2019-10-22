import { Proof } from "./Proof/Proof";
export declare abstract class VerifiableObject {
    protected proof: Proof;
    constructor(proof: Proof);
    abstract Verify(provider: string): Promise<void>;
}
