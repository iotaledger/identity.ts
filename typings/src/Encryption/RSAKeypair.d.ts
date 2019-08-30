import { BaseKeypair } from './BaseKeypair';
export declare const passphrase: string;
export declare class RSAKeypair extends BaseKeypair {
    constructor(publicKey: string, privateKey?: string);
    PublicEncrypt(message: string): Promise<Buffer>;
    PrivateDecrypt(input: Buffer): Promise<string>;
    Sign(dataToSign: string): Buffer;
    Verify(dataToCheck: string, signatureToVerify: Buffer): boolean;
    GetKeyType(): string;
}
