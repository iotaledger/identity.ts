import { DID } from './DID';
import { DIDKeypair } from './DIDKeypair';
import { BaseKeypair } from '../Encryption/BaseKeypair';
import { MAMSettings } from './../IOTA/mam';
import { Service } from './Service';
/**
 * @module DID
 */
/**
 * Handles the DID Document standard. Allows CRUD operations on DID Documents and publishing it too the Tangle.
 * Any CRUD operations that are not published will be lost once the program exits.
 */
export declare class DIDDocument {
    private contexts;
    private DID;
    private publicKeys;
    private authentications;
    private services;
    static readDIDDocument(provider: string, root: string, settings?: MAMSettings): Promise<DIDDocument>;
    /**
     * Creates a new DID Document from scratch. This is only for new Identities.
     * @param {DID} did The DID that will point towards this document.
     * @return {DIDDocument} A newly created class instance of DIDDocument.
     */
    static createDIDDocument(did: DID): DIDDocument;
    private constructor();
    /**
     * Adds a keypair to the DID Document.
     * @param {BaseKeypair} keypair The keypair instance that will now be added to the DID Document.
     * @param {string} keyId The name of the publicKey. Must be unique in the document.
     * @param {DID} [keyOwner] The DID of the owner of the publicKey. Defaults to the DID of the DID Document.
     * @param {DID} [keyController] The DID of the controller of the publicKey. Defaults to the keyOwner.
     */
    AddKeypair(keypair: BaseKeypair, keyId: string, keyOwner?: DID, keyController?: DID): void;
    /**
     * Creates a new ServiceEndpoint, which can be used to add any type of service to the DID.
     * @param {Service} service The service to add to the DID Document.
     */
    AddServiceEndpoint(service: Service): void;
    /**
     * Creates the DID Document, which is compatible with the DID standard from W3C.
     * @return {string} The stringified version of the JSON-LD formatted DID Document.
     */
    GetJSONDIDDocument(): string;
    /**
     * @return {DID} Returns the DID associated with this DID Documents.
     */
    GetDID(): DID;
    GetKeypair(keyId: string): DIDKeypair;
    GetService(name: string): Service;
}
