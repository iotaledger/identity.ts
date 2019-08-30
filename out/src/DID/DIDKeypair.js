"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This class handles keypairs for the DID Document, storing DID Document variables that are not relevant for the keypairs themselves.
 * The class is not ment to be used outside of this package and is not part of the API.
 */
var DIDKeypair = /** @class */ (function () {
    function DIDKeypair(encryptionKeypair, keyId, keyOwner, keyController) {
        this.encryptionKeypair = encryptionKeypair;
        this.keyId = keyId;
        this.keyOwner = keyOwner;
        //Key Controller defaults to the owner of the key.
        this.keyController = (keyController) ? keyController : this.keyOwner;
    }
    /**
     * Converts the class into a valid JSON that is conform with the DID standard.
     */
    DIDKeypair.prototype.GetJSON = function () {
        return {
            "id": this.GetFullId(),
            "type": this.encryptionKeypair.GetKeyType(),
            "controller": this.keyController.GetDID(),
            "publicKeyPem": this.encryptionKeypair.GetPublicKey()
        };
    };
    DIDKeypair.prototype.GetEncryptionKeypair = function () {
        return this.encryptionKeypair;
    };
    DIDKeypair.prototype.GetKeyId = function () {
        return this.keyId;
    };
    DIDKeypair.prototype.GetFullId = function () {
        return this.keyOwner.GetDID() + "#" + this.keyId;
    };
    return DIDKeypair;
}());
exports.DIDKeypair = DIDKeypair;
//# sourceMappingURL=DIDKeypair.js.map