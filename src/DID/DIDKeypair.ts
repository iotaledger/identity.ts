import { BaseKeypair } from './../Encryption/BaseKeypair';
import { DID } from './DID';

/**
 * This class handles keypairs for the DID Document, storing DID Document variables that are not relevant for the keypairs themselves.
 * The class is not ment to be used outside of this package and is not part of the API.
 */
export class DIDKeypair {
    private encryptionKeypair : BaseKeypair;
    //DID Document variables
    private keyId : string;
    private keyOwner : DID;
    private keyController : DID;

    constructor(encryptionKeypair : BaseKeypair, keyId : string, keyOwner : DID, keyController ?: DID) {
        this.encryptionKeypair = encryptionKeypair;
        this.keyId = keyId;
        this.keyOwner = keyOwner;
        //Key Controller defaults to the owner of the key.
        this.keyController = (keyController)?keyController:this.keyOwner;
    }

    /**
     * Converts the class into a valid JSON that is conform with the DID standard.
     */
    public GetJSON() {
        return {
            "id" : this.keyOwner.GetDID()+"#"+this.keyId,
            "type" : this.encryptionKeypair.GetKeyType(),
            "controller" : this.keyController.GetDID(),
            "publicKeyPem" : this.encryptionKeypair.GetPublicKey()
        }
    }
}