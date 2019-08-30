"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DIDDocument_1 = require("../DID/DIDDocument");
var DID_1 = require("../DID/DID");
var GenerateKeypair_1 = require("./GenerateKeypair");
var Hash_1 = require("../Encryption/Hash");
var DIDPublisher_1 = require("../IOTA/DIDPublisher");
function CreateRandomDID(seed) {
    var publisher = new DIDPublisher_1.DIDPublisher("", seed);
    var Document = DIDDocument_1.DIDDocument.createDIDDocument(new DID_1.DID(publisher.ExportMAMChannelState().nextRoot));
    return Document;
}
exports.CreateRandomDID = CreateRandomDID;
function CreateRandomDIDFromPublicKey(keyId) {
    return new Promise(function (resolve, reject) {
        GenerateKeypair_1.GenerateRSAKeypair()
            .then(function (keypair) {
            var Document = DIDDocument_1.DIDDocument.createDIDDocument(new DID_1.DID(Hash_1.Hash(keypair.GetPublicKey())));
            Document.AddKeypair(keypair, keyId);
            resolve(Document);
        })
            .catch(function (err) {
            reject(err);
        });
    });
}
exports.CreateRandomDIDFromPublicKey = CreateRandomDIDFromPublicKey;
//# sourceMappingURL=CreateRandomDID.js.map