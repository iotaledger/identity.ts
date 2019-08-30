"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RSAKeypair_1 = require("../Encryption/RSAKeypair");
var crypto = require("crypto");
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
//# sourceMappingURL=GenerateKeypair.js.map