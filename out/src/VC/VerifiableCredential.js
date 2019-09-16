"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Credential_1 = require("./Credential");
var ProofTypeManager_1 = require("./Proof/ProofTypeManager");
var VerifiableObject_1 = require("./VerifiableObject");
var VerifiableCredential = /** @class */ (function (_super) {
    __extends(VerifiableCredential, _super);
    function VerifiableCredential(credential, proof) {
        var _this = _super.call(this, proof) || this;
        _this.credential = credential;
        return _this;
    }
    VerifiableCredential.Create = function (credential, proof) {
        return new VerifiableCredential(credential, proof);
    };
    /*public static async DecodeFromJSON(credentialData : VerifiableCredentialDataModel, provider : string, issuerRoot : string, issuerKeyId : string, challengeNonce : string | undefined, mamSettings ?: MAMSettings) : Promise<VerifiableCredential>{
        let IssuerDID : DIDDocument = await DIDDocument.readDIDDocument(provider, issuerRoot, mamSettings);
        let proof : Proof = ProofTypeManager.GetInstance().CreateProofWithBuilder(credentialData.proof.type, IssuerDID, issuerKeyId, challengeNonce);
        return new VerifiableCredential( Credential.DecodeFromJSON(<CredentialDataModel>credentialData), proof);
    }*/
    VerifiableCredential.DecodeFromJSON = function (credentialData, proofParameter) {
        if (credentialData.proof) {
            var proof = ProofTypeManager_1.ProofTypeManager.GetInstance().CreateProofWithBuilder(credentialData.proof.type, proofParameter, credentialData.proof);
            if (proof) {
                return new VerifiableCredential(Credential_1.Credential.DecodeFromJSON(credentialData), proof);
            }
        }
        return null;
    };
    VerifiableCredential.prototype.Verify = function () {
        //Verification Steps
        if (!this.credential.GetSchema().IsDIDTrusted(this.proof.GetIssuer().GetDID())) {
            return VerifiableObject_1.VerificationErrorCodes.ISSUER_NOT_TRUSTED;
        }
        if (!this.credential.GetSchema().DoesObjectFollowSchema(this.credential.GetCredential())) {
            return VerifiableObject_1.VerificationErrorCodes.NO_MATCH_SCHEMA;
        }
        if (!this.proof.VerifySignature(this.credential.EncodeToJSON())) {
            return VerifiableObject_1.VerificationErrorCodes.INCORRECT_SIGNATURE;
        }
        return VerifiableObject_1.VerificationErrorCodes.SUCCES;
    };
    VerifiableCredential.prototype.EncodeToJSON = function () {
        return __assign({}, this.credential.EncodeToJSON(), { proof: this.proof.EncodeToJSON() });
    };
    VerifiableCredential.prototype.GetCredential = function () {
        return this.credential;
    };
    return VerifiableCredential;
}(VerifiableObject_1.VerifiableObject));
exports.VerifiableCredential = VerifiableCredential;
//# sourceMappingURL=VerifiableCredential.js.map