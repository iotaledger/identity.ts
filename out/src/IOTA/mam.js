"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MAM = require("@iota/mam");
var converter_1 = require("@iota/converter");
//Settings for a MAM stream. 
var MAMSettings = /** @class */ (function () {
    function MAMSettings(mode, sideKey, securityLevel) {
        if (mode === void 0) { mode = MAM_MODE.PRIVATE; }
        if (securityLevel === void 0) { securityLevel = 2; }
        this.mode = mode;
        this.sideKey = (this.mode == MAM_MODE.RESTRICTED) ? sideKey : undefined;
        this.securityLevel = securityLevel;
    }
    return MAMSettings;
}());
exports.MAMSettings = MAMSettings;
//An enumerator for the different MAM Modes. Prevents typos in regards to the different modes.
var MAM_MODE;
(function (MAM_MODE) {
    MAM_MODE["PRIVATE"] = "private";
    MAM_MODE["PUBLIC"] = "public";
    MAM_MODE["RESTRICTED"] = "restricted";
})(MAM_MODE = exports.MAM_MODE || (exports.MAM_MODE = {}));
//An helper class to wrap writing data to the Tangle in a MAM Transaction.
var MAMPublisher = /** @class */ (function () {
    /**
     * @param {string} provider A URL to the node that will be used for Tangle interaction.
     * @param {string} seed The seed for the MAM channel. Should be 81 Trytes (A-Z9 characters only) long.
     * @param {MAMSettings} [settings] The settings of a MAM channel. Defaults to private with securitylevel 2.
     */
    function MAMPublisher(provider, seed, settings) {
        if (settings === void 0) { settings = new MAMSettings(); }
        this.provider = provider;
        this.settings = settings;
        this.seed = seed;
        this.mamState = MAM.init(this.provider, this.seed, this.settings.securityLevel);
        this.mamState = MAM.changeMode(this.mamState, this.settings.mode, this.settings.sideKey);
        this.mamState.channel.next_root = MAM.getRoot(this.mamState);
    }
    /**
     * Publishes a new message to the MAM stream.
     * @param {string} message An ascii encoded message to Publish.
     * @param {string} [tag] The transaction Tag for the MAM transaction. Allows for filtering.
     * @param {number} [mwm] The difficulty of the Proof-of-Work for the Transaction. Default to 14, 9 is recommended for DevNet.
     * @return {Promise<string>} A promise for the root of the MAM transaction. On failure, returns an Error.
     */
    MAMPublisher.prototype.PublishMessage = function (message, tag, mwm) {
        var _this = this;
        if (mwm === void 0) { mwm = 14; }
        return new Promise(function (resolve, reject) {
            var trytesMessage = converter_1.asciiToTrytes(message);
            var mamMessage = MAM.create(_this.mamState, trytesMessage);
            MAM.attach(mamMessage.payload, mamMessage.address, 3, mwm, tag)
                .then(function () {
                _this.mamState = mamMessage.state;
                resolve(mamMessage.root);
            })
                .catch(function (err) { reject(err); });
        });
    };
    /**
     * Updates the state of the MAM channel towards the provided input. Useful for synching MAM streams.
     * @param {string} nextRoot The nextRoot of the Channel.
     * @param {number} channelStart The starting index of the channel.
     */
    MAMPublisher.prototype.UpdateMAMState = function (nextRoot, channelStart) {
        this.mamState.channel.next_root = nextRoot;
        this.mamState.channel.start = channelStart;
    };
    /**
     * Exports the state of the MAM channel for local storage. Allows later synching back without network overhead.
     * @return {MAMState} The state of the MAM channel. All you need to store for later synching.
     */
    MAMPublisher.prototype.ExportState = function () {
        return {
            "seed": this.seed,
            "mode": this.settings.mode,
            "securityLevel": this.settings.securityLevel,
            "sideKey": this.settings.sideKey,
            "nextRoot": this.mamState.channel.next_root,
            "channelStart": this.mamState.channel.start
        };
    };
    return MAMPublisher;
}());
exports.MAMPublisher = MAMPublisher;
/**
 * Reads the MAM stream and outputs all the messages from root till the end.
 * @param {string} provider A URL to the node that will be used for Tangle interaction.
 * @param {string} root The root of the MAM channel that reading will start from.
 * @param {MAMSettings} [settings] The settings of a MAM channel. Defaults to private with securitylevel 2.
 * @return {Promise<string[]>} Returns a Promise for an array of messages in ascii encoding. Every item the array is the message from a MAM bundle. Returns Error on failure.
 */
function ReadMAMStream(provider, root, settings) {
    if (settings === void 0) { settings = new MAMSettings(); }
    return new Promise(function (resolve, reject) {
        //TODO: Check if MAM.Init is needed.
        MAM.init(provider, root, settings.securityLevel);
        MAM.fetch(root, settings.mode, settings.sideKey)
            .then(function (result) {
            var messages = [];
            if (result.messages) {
                for (var i = 0; i < result.messages.length; i++) {
                    messages.push(converter_1.trytesToAscii(result.messages[i]));
                }
            }
            resolve(messages);
        })
            .catch(function (err) { reject(err); });
    });
}
exports.ReadMAMStream = ReadMAMStream;
//# sourceMappingURL=mam.js.map