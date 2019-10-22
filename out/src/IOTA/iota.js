"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@iota/core");
var converter_1 = require("@iota/converter");
var GenerateSeed_1 = require("../Helpers/GenerateSeed");
function PublishData(address, data, provider, mwm) {
    if (mwm === void 0) { mwm = 9; }
    return new Promise(function (resolve, reject) {
        var iota = core_1.composeAPI({ provider: provider });
        iota.prepareTransfers(GenerateSeed_1.GenerateSeed(), [{ value: 0, address: address, message: converter_1.asciiToTrytes(data) }])
            .then(function (trytes) {
            iota.sendTrytes(trytes, 3, mwm)
                .then(function (result) {
                resolve(result);
            })
                .catch(function (err) { reject("Error Sending Trytes: " + err); });
        })
            .catch(function (err) { reject("Error posting data: " + err); });
    });
}
exports.PublishData = PublishData;
function ReadAddress(address, provider) {
    return new Promise(function (resolve, reject) {
        var iota = core_1.composeAPI({ provider: provider });
        iota.findTransactions({ addresses: [address] })
            .then(function (transactionHashes) {
            iota.getTransactionObjects(transactionHashes)
                .then(function (transactions) {
                //Group the Bundles
                var bundles = new Map();
                for (var i = 0; i < transactions.length; i++) {
                    if (bundles.has(transactions[i].bundle)) {
                        bundles.get(transactions[i].bundle).push(transactions[i]);
                    }
                    else {
                        bundles.set(transactions[i].bundle, [transactions[i]]);
                    }
                }
                //Sort the Bundles
                bundles.forEach(function (value, key) {
                    bundles.set(key, value.sort(function (a, b) { return a.currentIndex - b.currentIndex; }));
                });
                //Translate the Trytes
                var messages = [];
                bundles.forEach(function (value, key) {
                    var message = "";
                    for (var i = 0; i < value.length; i++) {
                        message += value[i].signatureMessageFragment;
                    }
                    if (message.length % 2) {
                        message += "9";
                    }
                    var asciiMsg = converter_1.trytesToAscii(message);
                    asciiMsg = asciiMsg.replace(/\0/g, '');
                    messages.push(asciiMsg);
                });
                resolve(messages);
            })
                .catch(function (err) { reject("Couldn't read transactions: " + err); });
        })
            .catch(function (err) { reject("Couldn't read transactions: " + err); });
    });
}
exports.ReadAddress = ReadAddress;
//# sourceMappingURL=iota.js.map