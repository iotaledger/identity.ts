import { DID } from './DID';
import { DIDKeypair } from './DIDKeypair';
import { BaseKeypair } from '../Encryption/BaseKeypair';

/**
 * @module DID
 */

/**
 * Handles the DID Document standard. Allows CRUD operations on DID Documents and publishing it too the Tangle.
 * Any CRUD operations that are not published will be lost once the program exits. 
 */
export class DIDDocument {
    private contexts : string[];
    private DID : DID;
    private publicKeys ?: DIDKeypair[]; //TODO: Make Type
    private authentications : undefined; //TODO: Make Type
    private services : undefined; //TODO: Make Type

    static async readDIDDocument(did : DID, provider : string) {

    }

    /**
     * Creates a new DID Document from scratch. This is only for new Identities.
     * @param {DID} did - The DID that will point towards this document.
     * @return {DIDDocument} A newly created class instance of DIDDocument.
     */
    static createDIDDocument(did : DID) : DIDDocument {
        return new DIDDocument(["https://www.w3.org/2019/did/v1"], did);
    }

    private constructor(contexts : string[], DID : DID) {
        this.contexts = contexts;
        this.DID = DID;
        this.publicKeys = [];
    }

    /**
     * Adds a keypair to the DID Document. 
     * @param {BaseKeypair} keypair - The keypair instance that will now be added to the DID Document. 
     * @param {string} keyId - The name of the publicKey. Must be unique in the document. 
     * @param {DID} [keyOwner] - The DID of the owner of the publicKey. Defaults to the DID of the DID Document.
     * @param {DID} [keyController] - The DID of the controller of the publicKey. Defaults to the keyOwner. 
     */
    public AddKeypair(keypair : BaseKeypair, keyId : string, keyOwner ?: DID, keyController ?: DID) {
        this.publicKeys.push( new DIDKeypair(keypair, keyId, (keyOwner)?keyOwner:this.DID, keyController ));
    }

    /**
     * Creates the DID Document, which is compatible with the DID standard from W3C.
     * @return {string} The stringified version of the JSON-LD formatted DID Document.
     */
    public GetJSONDIDDocument() : string {
        let JSONObject : { "@context" : string[], id : string,  [key: string]: any} =
        {
            "@context" : this.contexts,
            id : this.DID.GetDID()
        };
        if(this.publicKeys) {
            JSONObject["publicKey"] = [];
            for(let i=0; i<this.publicKeys.length; i++) {
                JSONObject["publicKey"].push(this.publicKeys[i].GetJSON());
            }
        }
        if(this.authentications) {
            JSONObject["authentication"] = this.authentications; //TODO: create return function
        }
        if(this.services) {
            JSONObject["service"] = this.services; //TODO: create return function
        }
        return JSON.stringify(JSONObject, null, 2); //TODO: Remove Pretty print
    }

    /**
     * @return {DID} Returns the DID associated with this DID Documents.
     */
    public GetDID() : DID {
        return this.DID;
    }
}