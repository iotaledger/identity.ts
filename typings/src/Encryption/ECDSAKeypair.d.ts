/// <reference types="node" />
import { BaseKeypair } from './BaseKeypair';
export declare class ECDSAKeypair extends BaseKeypair {
    constructor(publicKey: string, privateKey?: string);
    PublicEncrypt(message: string): Buffer;
    PrivateDecrypt(input: Buffer): string;
    Sign(dataToSign: string): Buffer;
    Verify(dataToCheck: string, signatureToVerify: Buffer): boolean;
    GetKeyType(): string;
    GetPublicKeyFormat(): string;
}
