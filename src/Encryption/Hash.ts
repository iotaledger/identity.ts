import * as crypto from 'crypto';
import * as cryptoJS from 'crypto-js';

export function Hash(message : string) : string {
    let Hasher : crypto.Hash = crypto.createHash('sha256');
    Hasher.update(message);
    return Hasher.digest('base64');
}

export function Uint8ArrayHash(message: string): Uint8Array {
    const hash = cryptoJS.SHA256(message);
    const buffer = Buffer.from(hash.toString(cryptoJS.enc.Hex), 'hex');
    return new Uint8Array(buffer);
}