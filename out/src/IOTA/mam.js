"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mam_js_1 = require("@iota/mam.js");
var core_1 = require("@iota/core");
var converter_1 = require("@iota/converter");
//Settings for a MAM stream. 
var MAMSettings = /** @class */ (function () {
    function MAMSettings(mode, sideKey, securityLevel) {
        if (mode === void 0) { mode = 'private'; }
        if (securityLevel === void 0) { securityLevel = 2; }
        this.mode = mode;
        this.sideKey = (this.mode == 'restricted') ? sideKey : undefined;
        this.securityLevel = securityLevel;
    }
    return MAMSettings;
}());
exports.MAMSettings = MAMSettings;
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
        this.channelState = mam_js_1.createChannel(seed, this.settings.securityLevel, this.settings.mode, this.settings.sideKey);
        this.channelState.nextRoot = mam_js_1.channelRoot(this.channelState);
    }
    /**
     * Publishes a new message to the MAM stream.
     * @param {string} message An ascii encoded message to Publish.
     * @param {string} [tag] The transaction Tag for the MAM transaction. Allows for filtering.
     * @param {number} [mwm] The difficulty of the Proof-of-Work for the Transaction. Default to 14, 9 is recommended for DevNet.
     * @return {Promise<string>} A promise for the root of the MAM transaction. On failure, returns an Error.
     */
    MAMPublisher.prototype.PublishMessage = function (message, tag, mwm) {
        if (mwm === void 0) { mwm = 14; }
        var mamMessage = mam_js_1.createMessage(this.channelState, converter_1.asciiToTrytes(message));
        var api = core_1.composeAPI({ provider: this.provider });
        return mam_js_1.mamAttach(api, mamMessage, 3, mwm, tag).then(function () { return mamMessage.root; });
    };
    Object.defineProperty(MAMPublisher.prototype, "ChannelState", {
        /**
         * Updates the state of the MAM channel towards the provided input. Useful for synching MAM streams.
         * @param {IMamChannelState} state
         */
        set: function (state) {
            this.channelState = state;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Exports the state of the MAM channel for local storage. Allows later synching back without network overhead.
     * @return {IMamChannelState} The state of the MAM channel. All you need to store for later synching.
     */
    MAMPublisher.prototype.ExportState = function () {
        return this.channelState;
    };
    return MAMPublisher;
}());
exports.MAMPublisher = MAMPublisher;
/**
 * Reads the MAM stream and outputs all the messages from root till the end.
 *
 * @param {string} provider A URL to the node that will be used for Tangle interaction.
 * @param {string} root The root of the MAM channel that reading will start from.
 * @param {MAMSettings} [settings] The settings of a MAM channel. Defaults to private with securitylevel 2.
 *
 * @return {Promise<string[]>} Returns a Promise for an array of messages in ascii encoding. Every item the array is the message from a MAM bundle. Returns Error on failure.
 */
function ReadMAMStream(provider, root, settings) {
    if (settings === void 0) { settings = new MAMSettings(); }
    var api = core_1.composeAPI({ provider: provider });
    return mam_js_1.mamFetchAll(api, root, settings.mode, settings.sideKey).then(function (messages) {
        return messages.map(function (message) { return converter_1.trytesToAscii(message.message); });
    });
}
exports.ReadMAMStream = ReadMAMStream;
//# sourceMappingURL=mam.js.map