"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RSAKeypair_1 = require("../Encryption/RSAKeypair");
var ECDSAKeypair_1 = require("../Encryption/ECDSAKeypair");
var crypto = require("crypto");
var secp256k1 = require("secp256k1");
function GenerateRSAKeypair() {
    return new Promise(function (resolve, reject) {
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
                passphrase: RSAKeypair_1.passphrase
            }
        }, function (err, publicKey, privateKey) {
            if (err) {
                reject(err);
            }
            else {
                resolve(new RSAKeypair_1.RSAKeypair(publicKey, privateKey));
            }
        });
    });
}
exports.GenerateRSAKeypair = GenerateRSAKeypair;
function GenerateECDSAKeypair() {
    return new Promise(function (resolve, reject) {
        try {
            var privateKey = void 0;
            do {
                privateKey = crypto.randomBytes(32);
            } while (!secp256k1.privateKeyVerify(privateKey));
            var publicKey = Buffer.from(secp256k1.publicKeyCreate(privateKey));
            resolve(new ECDSAKeypair_1.ECDSAKeypair(publicKey.toString('base64'), privateKey.toString('base64')));
        }
        catch (err) {
            reject(err);
        }
    });
}
exports.GenerateECDSAKeypair = GenerateECDSAKeypair;
//# sourceMappingURL=GenerateKeypair.js.map