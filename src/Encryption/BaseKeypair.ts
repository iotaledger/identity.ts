import { DID } from "../DID/DID";


export abstract class BaseKeypair {
    protected publicKey : string;
    protected privateKey : string;

    constructor() {}

    abstract PublicEncrypt(message : string) : Promise<Buffer>;
    abstract PublicDecrypt(input: string) : Promise<string>;
    abstract PrivateEncrypt(message: string) : Promise<Buffer>;
    abstract PrivateDecrypt(input: string) : Promise<string>;
    abstract Sign(dataToSign : string) : string;
    abstract Verify(dataToCheck : string, signatureToVerify : string) : boolean;
    abstract GetKeyType() : string;

    public GetPublicKey(): string {
        return this.publicKey;
    }
    public GetPrivateKey(): string {
        return this.privateKey;
    }
}