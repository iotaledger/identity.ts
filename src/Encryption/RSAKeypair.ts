import { BaseKeypair } from './BaseKeypair';
import * as crypto from 'crypto';
import { DID } from '../DID/DID';

export const passphrase : string = 'Semantic Market runs on IOTA! @(^_^)@';

export class RSAKeypair extends BaseKeypair {

    constructor(publicKey : string, privateKey ?: string) {
        super();
        this.publicKey = publicKey;
        this.privateKey = (privateKey)?privateKey:undefined;
    }
    
    public async PublicEncrypt(message: string): Promise<Buffer> {
        return crypto.publicEncrypt({key: this.publicKey, padding: crypto.constants.RSA_PKCS1_PADDING}, Buffer.from(message));
    }   

    //These two functions dont seem useful as Sign and Verify should take care of this.

    /*public async PublicDecrypt(input: string): Promise<string> {
        return crypto.publicDecrypt({key : this.publicKey, padding: crypto.constants.RSA_PKCS1_PADDING}, Buffer.from(input)).toString();
    }*/

    /*public async PrivateEncrypt(message: string): Promise<Buffer> {
        if(!this.privateKey) {
            console.log("Warning: Encryption with private key called, without a private key accessible\n");
            return new Buffer("");
        }
            
        return crypto.privateEncrypt({key: this.privateKey, passphrase: passphrase, padding: crypto.constants.RSA_PKCS1_PADDING}, Buffer.from(message));
    }*/

    public async PrivateDecrypt(input : Buffer): Promise<string> {
        if(!this.privateKey) {
            console.log("Warning: Decryption with private key called, without a private key accessible\n");
            return "";
        }
        return crypto.privateDecrypt({key: this.privateKey, passphrase: passphrase, padding: crypto.constants.RSA_PKCS1_PADDING}, input).toString();
    }
    
    public Sign(dataToSign: string): Buffer {
        if(!this.privateKey)
            return undefined;
        const signer : crypto.Signer = crypto.createSign('SHA256');
        signer.update(dataToSign);
        signer.end();
        return signer.sign({key: this.privateKey, passphrase: passphrase, padding: crypto.constants.RSA_PKCS1_PADDING});
    }

    public Verify(dataToCheck: string, signatureToVerify: Buffer): boolean {
        const verifier : crypto.Verify = crypto.createVerify('SHA256');
        verifier.update(dataToCheck);
        verifier.end();
        return verifier.verify(this.publicKey, signatureToVerify);
    }

    public GetKeyType(): string {
        return "RsaVerificationKey2018";
    };
}