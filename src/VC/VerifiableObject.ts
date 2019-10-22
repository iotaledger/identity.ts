import { Proof } from "./Proof/Proof";

export abstract class VerifiableObject {
    protected proof : Proof;

    constructor(proof : Proof) { 
        this.proof = proof;
    };

    public async abstract Verify(provider : string) : Promise<void>;
}