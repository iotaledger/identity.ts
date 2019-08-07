import { BaseKeypair } from './BaseKeypair';
import * as crypto from 'crypto';
import { DID } from '../DID/DID';

export const passphrase : string = 'Semantic Market runs on IOTA! @(^_^)@';

export class RSAKeypair extends BaseKeypair {

    constructor(publicKey : string, privateKey ?: string) {
        super();
        this.publicKey = publicKey;
        this.publicKey = this.publicKey.replace(/\r?\n|\r/g, "");
        this.privateKey = (privateKey)?privateKey:undefined;
        this.privateKey = this.privateKey.replace(/\r?\n|\r/g, "");
    }
    
    public async PublicEncrypt(message: string): Promise<Buffer> {
        return crypto.publicEncrypt({key: this.publicKey, padding: crypto.constants.RSA_PKCS1_PADDING}, new Buffer(message));
    }   

    public async PublicDecrypt(input: string): Promise<string> {
        return crypto.publicDecrypt({key : this.publicKey, padding: crypto.constants.RSA_PKCS1_PADDING}, new Buffer(input)).toString();
    }

    public async PrivateEncrypt(message: string): Promise<Buffer> {
        if(!this.privateKey) {
            console.log("Warning: Encryption with private key called, without a private key accessible\n");
            return new Buffer("");
        }
            
        return crypto.privateEncrypt({key: this.privateKey, passphrase: passphrase, padding: crypto.constants.RSA_PKCS1_PADDING}, new Buffer(message));
    }

    public async PrivateDecrypt(input: string): Promise<string> {
        if(!this.privateKey) {
            console.log("Warning: Decryption with private key called, without a private key accessible\n");
            return "";
        }
        return crypto.privateDecrypt({key: this.privateKey, passphrase: passphrase, padding: crypto.constants.RSA_PKCS1_PADDING}, new Buffer(input)).toString();
    }
    
    public Sign(dataToSign: string): string {
        if(!this.privateKey)
            return "";
        const signer : crypto.Signer = crypto.createSign('SHA256');
        signer.write(dataToSign);
        signer.end();
        return signer.sign(this.privateKey, 'base64');
    }

    public Verify(dataToCheck: string, signatureToVerify: string): boolean {
        const verifier : crypto.Verify = crypto.createVerify('SHA256');
        verifier.write(dataToCheck);
        verifier.end();
        return verifier.verify(this.publicKey, signatureToVerify);
    }

    public GetKeyType(): string {
        return "RsaVerificationKey2018";
    };
}