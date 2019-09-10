/// <reference types="node" />
export declare abstract class BaseKeypair {
    protected publicKey: string;
    protected privateKey: string;
    constructor();
    abstract PublicEncrypt(message: string): Buffer;
    abstract PrivateDecrypt(input: Buffer): string;
    abstract Sign(dataToSign: string): Buffer;
    abstract Verify(dataToCheck: string, signatureToVerify: Buffer): boolean;
    abstract GetKeyType(): string;
    GetPublicKey(): string;
    SetPrivateKey(privateKey: string): void;
    GetPrivateKey(): string;
}
