import { RSAKeypair, passphrase } from "../Encryption/RSAKeypair";
import { ECDSAKeypair } from "../Encryption/ECDSAKeypair";
import * as crypto from 'crypto';
import * as secp256k1 from 'secp256k1';

export function GenerateRSAKeypair(): Promise<RSAKeypair> {
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
            if (err) {
                reject(err);
            } else {
                resolve(new RSAKeypair(publicKey, privateKey));
            }
        });
    });
}

export function GenerateECDSAKeypair(): Promise<ECDSAKeypair> {
    return new Promise<ECDSAKeypair>((resolve, reject) => {
        try {
            const privateKey = crypto.randomBytes(32)
            const publicKey = secp256k1.publicKeyCreate(privateKey)
            resolve(new ECDSAKeypair(publicKey.toString('base64'), privateKey.toString('base64')));
        } catch (err) {
            reject(err);
        }
    });
}
