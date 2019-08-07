import { DID } from './DID';
import { DIDKeypair } from './DIDKeypair';
import { BaseKeypair } from '../Encryption/BaseKeypair';

//Factory design pattern for async call
export class DIDDocument {
    private contexts : string[];
    private DID : DID;
    private publicKeys ?: DIDKeypair[]; //TODO: Make Type
    private authentications : undefined; //TODO: Make Type
    private services : undefined; //TODO: Make Type

    static async readDIDDocument(did : DID, provider : string) {

    }

    static createDIDDocument(did : DID) : DIDDocument {
        return new DIDDocument(["https://www.w3.org/2019/did/v1"], did);
    }

    private constructor(contexts : string[], DID : DID) {
        this.contexts = contexts;
        this.DID = DID;
        this.publicKeys = [];
    }

    public AddKeypair(keypair : BaseKeypair, keyId : string, keyOwner ?: DID, keyController ?: DID) {
        this.publicKeys.push( new DIDKeypair(keypair, keyId, (keyOwner)?keyOwner:this.DID, keyController ));
    }

    //Returns the DID Document in JSON-LD format
    public GetJSONDIDDocument() {
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

    public GetDID() : DID {
        return this.DID;
    }
}