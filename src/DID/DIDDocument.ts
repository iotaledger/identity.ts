import { DID } from './DID';
import { DIDKeypair } from './DIDKeypair';
import { BaseKeypair } from '../Encryption/BaseKeypair';
import { MAMSettings, ReadMAMStream } from './../IOTA/mam';
import { RSAKeypair } from '../Encryption/RSAKeypair';
import { ECDSAKeypair } from '../Encryption/ECDSAKeypair';
import { Service, ServiceDataModel } from './Service';

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
    private publicKeys : DIDKeypair[];
    private authentications : undefined; //TODO: Make Type
    private services : Service[]; //TODO: Make Type

    static async readDIDDocument(provider : string, root : string, settings ?: MAMSettings) : Promise<DIDDocument> {
        return new Promise<DIDDocument>((resolve, reject) => {
            //Retrieve the DID Document
            ReadMAMStream(provider, root, settings)
            .then((messages : string[]) => {
                let latestDIDDocument : string = messages[messages.length-1];
                let JSONDocument : { "@context" : string[], id : string,  [key: string]: any} = JSON.parse(latestDIDDocument);
                //Verify if it contains a valid JSON
                try { JSONDocument = JSON.parse(latestDIDDocument); } catch(err) { reject("JSON Parse Error: " + err) };

                //Parse the DID Document
                let document : DIDDocument = new DIDDocument(JSONDocument["@context"], new DID(JSONDocument.id));
                //Public keys
                let publicKeys = JSONDocument["publicKey"];
                if(publicKeys) {
                    for(let i=0; i < publicKeys.length; i++) {
                        let keypair : BaseKeypair;
                        if(publicKeys[i].type == "RsaVerificationKey2018") {
                            keypair = new RSAKeypair(publicKeys[i].publicKeyPem);
                        }
                        if(publicKeys[i].type == "EcdsaSecp256k1VerificationKey2019") {
                            keypair = new ECDSAKeypair(publicKeys[i].publicKeyBase58);
                        }

                        document.AddKeypair(keypair, publicKeys[i].id.substr(publicKeys[i].id.lastIndexOf("#")+1), new DID(publicKeys[i].id.substr(0, publicKeys[i].id.lastIndexOf("#"))), new DID(publicKeys[i].controller));
                    }
                }
                //Service Endpoints
                let services = JSONDocument["service"];
                if(services) {
                    for(let i=0; i < services.length; i++) {
                        const service = <ServiceDataModel>services[i];
                        let did : DID = new DID(service.id);
                        document.AddServiceEndpoint(new Service(did, did.GetFragment(), service.type, service.serviceEndpoint));
                    }
                }
                resolve(document);
            })
            .catch((err : Error) => reject(err));
        });
    }

    /**
     * Creates a new DID Document from scratch. This is only for new Identities.
     * @param {DID} did The DID that will point towards this document.
     * @return {DIDDocument} A newly created class instance of DIDDocument.
     */
    static createDIDDocument(did : DID) : DIDDocument {
        return new DIDDocument(["https://www.w3.org/2019/did/v1"], did);
    }

    private constructor(contexts : string[], DID : DID) {
        this.contexts = contexts;
        this.DID = DID;
        this.publicKeys = [];
        this.services = [];
    }

    /**
     * Adds a keypair to the DID Document. 
     * @param {BaseKeypair} keypair The keypair instance that will now be added to the DID Document. 
     * @param {string} keyId The name of the publicKey. Must be unique in the document. 
     * @param {DID} [keyOwner] The DID of the owner of the publicKey. Defaults to the DID of the DID Document.
     * @param {DID} [keyController] The DID of the controller of the publicKey. Defaults to the keyOwner. 
     */
    public AddKeypair(keypair : BaseKeypair, keyId : string, keyOwner ?: DID, keyController ?: DID) {
        this.publicKeys.push( new DIDKeypair(keypair, keyId, (keyOwner)?keyOwner:this.DID, keyController ));
    }

    /**
     * Creates a new ServiceEndpoint, which can be used to add any type of service to the DID.
     * @param {Service} service The service to add to the DID Document.
     */
    public AddServiceEndpoint(service : Service) {
        this.services.push(service);
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
        if(this.publicKeys.length) {
            JSONObject["publicKey"] = [];
            for(let i=0; i<this.publicKeys.length; i++) {
                JSONObject["publicKey"].push(this.publicKeys[i].GetJSON());
            }
        }
        if(this.authentications) {
            JSONObject["authentication"] = this.authentications; //TODO: create return function
        }
        if(this.services.length) {
            JSONObject["service"] = [];
            for(let i=0; i<this.services.length; i++) {
                JSONObject["service"].push(this.services[i].EncodeToJSON());
            }
        }
        return JSON.stringify(JSONObject, null, 2); //TODO: Remove Pretty print
    }

    /**
     * @return {DID} Returns the DID associated with this DID Documents.
     */
    public GetDID() : DID {
        return this.DID;
    }

    public GetKeypair(keyId : string) : DIDKeypair {
        for(let i=0; i < this.publicKeys.length; i++) {
            if(this.publicKeys[i].GetKeyId() == keyId) {
                return this.publicKeys[i];
            }
        }
        return null;
    }

    public GetService(name : string) : Service {
        for(let i=0; i < this.services.length; i++) {
            if(this.services[i].GetName() == name || this.services[i].GetType() == name) {
                return this.services[i];
            }
        }
        return null;
    }
}