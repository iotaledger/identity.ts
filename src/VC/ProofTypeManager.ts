import { ProofBuildingMethod, Proof, ProofParameters } from './Proof';
import { DIDDocument } from '../DID/DIDDocument';
import { BuildRSAProof } from './RSAProof';

export class ProofTypeManager {
    private static instance : ProofTypeManager;
    private proofTypes : Map<string, ProofBuildingMethod>;

    private constructor() {
        this.proofTypes = new Map<string, ProofBuildingMethod>();

        //Add default Proofs
        this.AddProof("RsaSignature2018", BuildRSAProof);
    }

    public AddProof(name : string, proof : ProofBuildingMethod) {
        this.proofTypes.set(name, proof);
    }

    public CreateProofWithBuilder(name : string, proofParameter : ProofParameters) : Proof {
        let proofBuilder : ProofBuildingMethod = this.proofTypes.get(name);
        if(proofBuilder) {
            return proofBuilder(proofParameter);
        }
    }

    public GetProofBuilder(name : string) : ProofBuildingMethod {
        return this.proofTypes.get(name);
    }

    static GetInstance() : ProofTypeManager {
        if(!ProofTypeManager.instance) {
            ProofTypeManager.instance = new ProofTypeManager();
        }
        return ProofTypeManager.instance;
    }
}