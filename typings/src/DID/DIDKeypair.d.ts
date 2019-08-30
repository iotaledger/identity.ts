import { BaseKeypair } from './../Encryption/BaseKeypair';
import { DID } from './DID';
/**
 * This class handles keypairs for the DID Document, storing DID Document variables that are not relevant for the keypairs themselves.
 * The class is not ment to be used outside of this package and is not part of the API.
 */
export declare class DIDKeypair {
    private encryptionKeypair;
    private keyId;
    private keyOwner;
    private keyController;
    constructor(encryptionKeypair: BaseKeypair, keyId: string, keyOwner: DID, keyController?: DID);
    /**
     * Converts the class into a valid JSON that is conform with the DID standard.
     */
    GetJSON(): {
        "id": string;
        "type": string;
        "controller": string;
        "publicKeyPem": string;
    };
    GetEncryptionKeypair(): BaseKeypair;
    GetKeyId(): string;
    GetFullId(): string;
}
