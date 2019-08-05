import { DIDDocument } from "../DID/DIDDocument";
import { RSAKeypair } from "../Encryption/RSAKeypair";
import { DID } from "../DID/DID";
import { GenerateRSAKeypair } from "./GenerateKeypair";
import { Hash } from "../Encryption/Hash";

export function CreateRandomDID() : Promise<DIDDocument> {
    return new Promise<DIDDocument>((resolve, reject) => {
        GenerateRSAKeypair()
        .then((keypair : RSAKeypair) => {
            resolve(DIDDocument.createDIDDocument(new DID(Hash(keypair.GetPublicKey())), [keypair]));
        })
        .catch((err)=> {
            reject(err);
        });  
    });
}