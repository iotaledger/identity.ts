import {DID} from './DID';
import { BaseKeypair } from '../Encryption/BaseKeypair';

//Factory design pattern for async call
export class DIDDocument {
    private contexts : string[];
    private did : DID;
    private publicKeys : BaseKeypair[]; //TODO: Make Type
    private authentications : undefined; //TODO: Make Type
    private services : undefined; //TODO: Make Type

    static async readDIDDocument(did : DID, provider : string) {

    }

    static createDIDDocument(did : DID, publicKeys: BaseKeypair[]) : DIDDocument {
        return new DIDDocument(["https://www.w3.org/2019/did/v1"], did, publicKeys);
    }

    private constructor(contexts : string[], did : DID, publicKeys : BaseKeypair[]) {
        this.contexts = contexts;
        this.did = did;
        this.publicKeys = publicKeys;
    }

    //Returns the DID Document in JSON-LD format
    public GetJSONDIDDocument() {
        let JSONObject : { "@context" : string[], id : string,  [key: string]: any} =
        {
            "@context" : this.contexts,
            id : this.did.GetDID()
        };
        if(this.publicKeys) {
            JSONObject["publicKey"] = this.publicKeys; //TODO: create return function
        }
        if(this.authentications) {
            JSONObject["authentication"] = this.authentications; //TODO: create return function
        }
        if(this.services) {
            JSONObject["service"] = this.services; //TODO: create return function
        }
        return JSON.stringify(JSONObject);
    }
}