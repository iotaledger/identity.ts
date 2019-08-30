"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VerificationErrorCodes;
(function (VerificationErrorCodes) {
    VerificationErrorCodes[VerificationErrorCodes["SUCCES"] = 1] = "SUCCES";
    VerificationErrorCodes[VerificationErrorCodes["NO_MATCH_SCHEMA"] = 2] = "NO_MATCH_SCHEMA";
    VerificationErrorCodes[VerificationErrorCodes["ISSUER_NOT_TRUSTED"] = 3] = "ISSUER_NOT_TRUSTED";
    VerificationErrorCodes[VerificationErrorCodes["INCORRECT_SIGNATURE"] = 4] = "INCORRECT_SIGNATURE";
    VerificationErrorCodes[VerificationErrorCodes["CREDENTIAL_EXPIRED"] = 5] = "CREDENTIAL_EXPIRED";
    VerificationErrorCodes[VerificationErrorCodes["INCORRECT_CHALLENGE_ANSWER"] = 6] = "INCORRECT_CHALLENGE_ANSWER";
    VerificationErrorCodes[VerificationErrorCodes["CHALLENGE_ANSWER_EXPIRED"] = 7] = "CHALLENGE_ANSWER_EXPIRED";
})(VerificationErrorCodes = exports.VerificationErrorCodes || (exports.VerificationErrorCodes = {}));
var VerifiableObject = /** @class */ (function () {
    function VerifiableObject(proof) {
        this.proof = proof;
    }
    ;
    return VerifiableObject;
}());
exports.VerifiableObject = VerifiableObject;
//# sourceMappingURL=VerifiableObject.js.map