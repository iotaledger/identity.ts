"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RSAProof_1 = require("./RSAProof");
var ECDSAProof_1 = require("./ECDSAProof");
var ProofTypeManager = /** @class */ (function () {
    function ProofTypeManager() {
        this.proofTypes = new Map();
        this.AddProof("RsaVerificationKey2018", RSAProof_1.BuildRSAProof);
        this.AddProof("EcdsaSecp256k1VerificationKey2019", ECDSAProof_1.BuildECDSAProof);
    }
    ProofTypeManager.prototype.AddProof = function (name, proof) {
        this.proofTypes.set(name, proof);
    };
    ProofTypeManager.prototype.CreateProofWithBuilder = function (name, proofParameter, proofDocument) {
        var proofBuilder = this.proofTypes.get(name);
        if (proofBuilder) {
            return proofBuilder(proofParameter, proofDocument);
        }
    };
    ProofTypeManager.prototype.GetProofBuilder = function (name) {
        return this.proofTypes.get(name);
    };
    ProofTypeManager.GetInstance = function () {
        if (!ProofTypeManager.instance) {
            ProofTypeManager.instance = new ProofTypeManager();
        }
        return ProofTypeManager.instance;
    };
    return ProofTypeManager;
}());
exports.ProofTypeManager = ProofTypeManager;
//# sourceMappingURL=ProofTypeManager.js.map