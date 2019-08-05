export abstract class BaseKeypair {
    protected publicKey : string;
    protected privateKey : string;

    constructor() {
        this.publicKey = "";
        this.privateKey = "";
    }

    abstract PublicEncrypt(message : string) : Promise<string>;
    abstract PublicDecrypt(input: string) : Promise<string>;
    abstract PrivateEncrypt(message: string) : Promise<string>;
    abstract PrivateDecrypt(input: string) : Promise<string>;
    abstract Sign(dataToSign : string) : string;
    abstract Verify(dataToCheck : string, signatureToVerify : string) : boolean;

    public GetPublicKey(): string {
        return this.publicKey;
    }
    public GetPrivateKey(): string {
        return this.privateKey;
    }
}