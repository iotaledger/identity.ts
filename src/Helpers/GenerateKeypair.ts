import { RSAKeypair, passphrase } from "../Encryption/RSAKeypair";
import * as crypto from 'crypto';

export function GenerateRSAKeypair() : Promise<RSAKeypair> {
    return new Promise<RSAKeypair>((resolve, reject) => {
        crypto.generateKeyPair('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: passphrase
            }
        }, (err, publicKey, privateKey) => {
            if(err) {
                reject(err);
            } else {
                resolve(new RSAKeypair(publicKey, privateKey));
            }
        });
    });
}