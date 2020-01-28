import { BaseKeypair } from './BaseKeypair';
import * as secp256k1 from 'secp256k1';
import { Hash } from './Hash';
import { encrypt, decrypt } from 'eciesjs';



export class ECDSAKeypair extends BaseKeypair {
    constructor(publicKey: string, privateKey?: string) {
        super();
        this.publicKey = publicKey;
        this.privateKey = (privateKey) ? privateKey : undefined;
    }

    public PublicEncrypt(message: string): Buffer {
        return encrypt(Buffer.from(this.publicKey, 'base64'), Buffer.from(message))
    }

    public PrivateDecrypt(input: Buffer): string {
        if(!this.privateKey) {
            console.log("Warning: Decryption with private key called, without a private key accessible\n");
            return "";
        }
        return decrypt(Buffer.from(this.privateKey, 'base64'), input).toString()
    }

    public Sign(dataToSign: string): Buffer {
        if (!this.privateKey)
            return undefined;
        const dataToSignBuffer: Buffer = Buffer.from(Hash(dataToSign), 'base64')
        const privateKeyBuffer: Buffer = Buffer.from(this.privateKey, 'base64')
        const signature = secp256k1.sign(dataToSignBuffer, privateKeyBuffer)
        return signature.signature
    }


    public Verify(dataToCheck: string, signatureToVerify: Buffer): boolean {
        const dataToCheckBuffer: Buffer = Buffer.from(Hash(dataToCheck), 'base64')
        const publicKeyBuffer: Buffer = Buffer.from(this.publicKey, 'base64')
        return secp256k1.verify(dataToCheckBuffer, signatureToVerify, publicKeyBuffer)
    }

    public GetKeyType(): string {
        return "EcdsaSecp256k1VerificationKey2019";
    };
}