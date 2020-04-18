import { DIDDocument } from "../DID/DIDDocument";
import { RSAKeypair } from "../Encryption/RSAKeypair";
import { DID } from "../DID/DID";
import { GenerateRSAKeypair } from "./GenerateKeypair";
import { Hash } from "../Encryption/Hash";
import { DIDPublisher } from "../IOTA/DIDPublisher";

export function CreateRandomDID(seed: string): DIDDocument {
    let publisher: DIDPublisher = new DIDPublisher("", seed);
    let Document: DIDDocument = DIDDocument.createDIDDocument(new DID(publisher.ExportMAMChannelState().nextRoot));
    return Document;
}

export function CreateRandomDIDFromPublicKey(keyId: string): Promise<DIDDocument> {
    return new Promise<DIDDocument>((resolve, reject) => {
        GenerateRSAKeypair()
            .then((keypair: RSAKeypair) => {
                let Document: DIDDocument = DIDDocument.createDIDDocument(new DID(Hash(keypair.GetPublicKey())));
                Document.AddKeypair(keypair, keyId);
                resolve(Document);
            })
            .catch((err) => {
                reject(err);
            });
    });
}