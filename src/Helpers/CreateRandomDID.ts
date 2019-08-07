import { DIDDocument } from "../DID/DIDDocument";
import { RSAKeypair } from "../Encryption/RSAKeypair";
import { DID } from "../DID/DID";
import { GenerateRSAKeypair } from "./GenerateKeypair";
import { Hash } from "../Encryption/Hash";

export function CreateRandomDID() : Promise<DIDDocument> {
    return new Promise<DIDDocument>((resolve, reject) => {
        GenerateRSAKeypair("keys-1")
        .then((keypair : RSAKeypair) => {
            let Document : DIDDocument = DIDDocument.createDIDDocument(new DID(Hash(keypair.GetPublicKey())));
            Document.AddKeypair(keypair, "keys-1");
            resolve(Document);
        })
        .catch((err)=> {
            reject(err);
        });  
    });
}