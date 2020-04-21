import { BaseKeypair } from './BaseKeypair';
import * as secp256k1 from 'secp256k1';
import { Uint8ArrayHash } from './Hash';
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
            // tslint:disable-next-line:no-console
            console.log("Warning: Decryption with private key called, without a private key accessible\n");
            return "";
        }
        return decrypt(Buffer.from(this.privateKey, 'base64'), input).toString()
    }

    public Sign(dataToSign: string): Buffer {
        if (!this.privateKey)
            return undefined;
        const privateKeyBuffer: Buffer = Buffer.from(this.privateKey, 'base64')
        const signature = secp256k1.ecdsaSign(Uint8ArrayHash(dataToSign), new Uint8Array(privateKeyBuffer));
        return Buffer.from(signature.signature)
    }


    public Verify(dataToCheck: string, signatureToVerify: Buffer): boolean {
        const publicKeyBuffer: Buffer = Buffer.from(this.publicKey, 'base64')
        return secp256k1.ecdsaVerify(signatureToVerify, Uint8ArrayHash(dataToCheck), new Uint8Array(publicKeyBuffer))
    }

    public GetKeyType(): string {
        return "EcdsaSecp256k1VerificationKey2019";
    }

    public GetPublicKeyFormat() : string {
        return "publicKeyBase58";
    }
}