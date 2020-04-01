import { MamMode, IMamChannelState } from '@iota/mam.js';
export declare enum MAM_MODE {
    PRIVATE = "private",
    PUBLIC = "public",
    RESTRICTED = "restricted"
}
export declare class MAMSettings {
    mode: (MAM_MODE | MamMode);
    sideKey: string;
    securityLevel: number;
    constructor(mode?: (MAM_MODE | MamMode), sideKey?: string, securityLevel?: number);
}
export declare class MAMPublisher {
    private settings;
    private provider;
    private channelState;
    /**
     * @param {string} provider A URL to the node that will be used for Tangle interaction.
     * @param {string} seed The seed for the MAM channel. Should be 81 Trytes (A-Z9 characters only) long.
     * @param {MAMSettings} [settings] The settings of a MAM channel. Defaults to private with securitylevel 2.
     */
    constructor(provider: string, seed: string, settings?: MAMSettings);
    /**
     * Publishes a new message to the MAM stream.
     * @param {string} message An ascii encoded message to Publish.
     * @param {string} [tag] The transaction Tag for the MAM transaction. Allows for filtering.
     * @param {number} [mwm] The difficulty of the Proof-of-Work for the Transaction. Default to 14, 9 is recommended for DevNet.
     * @return {Promise<string>} A promise for the root of the MAM transaction. On failure, returns an Error.
     */
    PublishMessage(message: string, tag?: string, mwm?: number): Promise<string>;
    /**
     * Updates the state of the MAM channel towards the provided input. Useful for synching MAM streams.
     * @param {IMamChannelState} state
     */
    ChannelState: IMamChannelState;
    /**
     * Exports the state of the MAM channel for local storage. Allows later synching back without network overhead.
     * @return {IMamChannelState} The state of the MAM channel. All you need to store for later synching.
     */
    ExportState(): IMamChannelState;
}
/**
 * Reads the MAM stream and outputs all the messages from root till the end.
 *
 * @param {string} provider A URL to the node that will be used for Tangle interaction.
 * @param {string} root The root of the MAM channel that reading will start from.
 * @param {MAMSettings} [settings] The settings of a MAM channel. Defaults to private with securitylevel 2.
 *
 * @return {Promise<string[]>} Returns a Promise for an array of messages in ascii encoding. Every item the array is the message from a MAM bundle. Returns Error on failure.
 */
export declare function ReadMAMStream(provider: string, root: string, settings?: MAMSettings): Promise<string[]>;
