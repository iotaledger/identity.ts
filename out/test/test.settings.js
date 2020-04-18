"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GenerateKeypair_1 = require("../src/Helpers/GenerateKeypair");
exports.provider = "https://nodes.devnet.iota.org:443";
exports.mwm = 9;
exports.depth = 3;
exports.security = 2;
exports.TestProofTypes = [{
        name: "RsaVerificationKey2018",
        keyGenFunc: GenerateKeypair_1.GenerateRSAKeypair
    }, {
        name: "EcdsaSecp256k1VerificationKey2019",
        keyGenFunc: GenerateKeypair_1.GenerateECDSAKeypair
    }];
function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
exports.delay = delay;
//# sourceMappingURL=test.settings.js.map