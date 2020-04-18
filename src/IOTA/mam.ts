import {
    channelRoot,
    createChannel,
    createMessage,
    mamAttach,
    mamFetchAll,
    MamMode,
    IMamMessage,
    IMamFetchedMessage,
    IMamChannelState
} from '@iota/mam.js';
import { composeAPI } from '@iota/core';
import { asciiToTrytes, trytesToAscii } from '@iota/converter';
const { defaultMwm, defaultDepth, defaultSecurity } = require('./config.json');

//An enumerator for the different MAM Modes. Prevents typos in regards to the different modes.
export enum MAM_MODE {
    PRIVATE = 'private',
    PUBLIC = 'public',
    RESTRICTED = 'restricted'
}

//Settings for a MAM stream. 
export class MAMSettings {
    public mode: (MAM_MODE | MamMode);
    public sideKey: string;
    public securityLevel: number;

    constructor(mode: (MAM_MODE | MamMode) = MAM_MODE.PRIVATE, sideKey?: string, securityLevel: number = defaultSecurity) {
        this.mode = mode;
        this.sideKey = (this.mode === MAM_MODE.RESTRICTED) ? sideKey : undefined;
        this.securityLevel = securityLevel;
    }
}

//An helper class to wrap writing data to the Tangle in a MAM Transaction.
export class MAMPublisher {
    private settings: MAMSettings;
    private provider: string;
    private channelState: IMamChannelState;

    /**
     * @param {string} provider A URL to the node that will be used for Tangle interaction.
     * @param {string} seed The seed for the MAM channel. Should be 81 Trytes (A-Z9 characters only) long.
     * @param {MAMSettings} [settings] The settings of a MAM channel. Defaults to private with securitylevel 2.
     */
    constructor(provider: string, seed: string, settings: MAMSettings = new MAMSettings()) {
        this.provider = provider;
        this.settings = settings;

        this.channelState = createChannel(seed, this.settings.securityLevel, this.settings.mode, this.settings.sideKey);
        this.channelState.nextRoot = channelRoot(this.channelState);
    }

    /**
     * Publishes a new message to the MAM stream.
     * @param {string} message An ascii encoded message to Publish. 
     * @param {string} [tag] The transaction Tag for the MAM transaction. Allows for filtering.
     * @param {number} [mwm] The difficulty of the Proof-of-Work for the Transaction. Default to 14, 9 is recommended for DevNet. 
     * @return {Promise<string>} A promise for the root of the MAM transaction. On failure, returns an Error.
     */
    public PublishMessage(message: string, tag?: string, mwm: number = defaultMwm, depth: number = defaultDepth): Promise<string> {
        const mamMessage: IMamMessage = createMessage(this.channelState, asciiToTrytes(message));

        const api = composeAPI({ provider: this.provider });

        return mamAttach(
            api,
            mamMessage,
            depth,
            mwm,
            tag
        ).then(() => mamMessage.root)
    }

    /**
     * Updates the state of the MAM channel towards the provided input. Useful for synching MAM streams.
     * @param {IMamChannelState} state
     */
    set ChannelState(state: IMamChannelState) {
        this.channelState = state;
    }

    /**
     * Exports the state of the MAM channel for local storage. Allows later synching back without network overhead.
     * @return {IMamChannelState} The state of the MAM channel. All you need to store for later synching.
     */
    public ExportState(): IMamChannelState {
        return this.channelState;
    }
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
export function ReadMAMStream(provider: string, root: string, settings: MAMSettings = new MAMSettings()): Promise<string[]> {
    const api = composeAPI({ provider });

    return mamFetchAll(
        api,
        root,
        settings.mode,
        settings.sideKey
    ).then((messages: IMamFetchedMessage[]) => {
        return messages.map((message: IMamFetchedMessage) => trytesToAscii(message.message));
    });
}