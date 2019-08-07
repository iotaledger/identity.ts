import { BaseKeypair } from './../Encryption/BaseKeypair';
import { DID } from './DID';

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

    public GetJSON() {
        return {
            "id" : this.keyOwner.GetDID()+"#"+this.keyId,
            "type" : this.encryptionKeypair.GetKeyType(),
            "controller" : this.keyController.GetDID(),
            "publicKeyPem" : this.encryptionKeypair.GetPublicKey()
        }
    }
}