import { DIDDocument } from "../DID/DIDDocument";
export declare function CreateRandomDID(seed: string): DIDDocument;
export declare function CreateRandomDIDFromPublicKey(keyId: string): Promise<DIDDocument>;
