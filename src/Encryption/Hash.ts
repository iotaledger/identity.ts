import * as crypto from 'crypto';

export function Hash(message : string) : string {
    let Hasher : crypto.Hash = crypto.createHash('sha256');
    Hasher.update(message);
    return Hasher.digest('base64');
}